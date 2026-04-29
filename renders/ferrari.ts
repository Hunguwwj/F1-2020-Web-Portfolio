import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import {
  sample,
  pass,
  mrt,
  screenUV,
  normalView,
  velocity,
  directionToColor,
  colorToDirection,
  builtinAOContext,
  saturation,
  renderOutput,
  mul,
  pow,
  float,
  uniform,
  reflector,
  vec2,
  texture,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { traa } from "three/addons/tsl/display/TRAANode.js";
import { smaa } from "three/examples/jsm/tsl/display/SMAANode.js";
import { CustomTear } from "./custom_shader/glicth_custom.js";
import { PixelMorph } from "./custom_shader/pixel_morph.js";

export class SceneManager {
  private renderer: THREE.WebGPURenderer;
  private renderPipeline: THREE.RenderPipeline;
  private Mouse: THREE.Vector2;
  private previousMouse: THREE.Vector2;
  private targetVelocity: THREE.Vector2;
  private crVelocity: THREE.Vector2;
  private crMousePos: THREE.Vector2;

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public mesh: THREE.Object3D | undefined = undefined;
  public light: THREE.SpotLight;
  public fls: ReturnType<typeof uniform>; // This type is already correct from previous fixes

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    // Basic setup: camera, renderer, light, and a simple mesh
    this.camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    //Renderer setup with WebGPU
    this.renderer = new THREE.WebGPURenderer({
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer, better-looking shadows

    container.appendChild(this.renderer.domElement);

    //Light setup
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(0, 3, 0);

    this.light.intensity = 1.0;
    this.light.angle = Math.PI * 0.4;
    this.light.penumbra = 1;
    this.scene.add(this.light);
    // Enable shadows for the light

    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = 50;
    this.light.shadow.autoUpdate = false;

    this.scene.add(new THREE.AmbientLight(0xdddddd, 0.2));

    const pl1 = new THREE.PointLight(0xffffff, 0.4, 100, 0.01);
    const pl2 = new THREE.PointLight(0xffffff, 0.4, 100, 0.01);
    pl1.position.set(4, 2.5, -5);
    pl2.position.set(-4, 2.5, -5);
    this.scene.add(pl1);
    this.scene.add(pl2);

    // Load a GLTF model (replace with your model path)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("../models/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load("../models/ferrari-draco", (car) => {
      car.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh = car.scene;
      this.scene.add(car.scene);

      this.light.shadow.needsUpdate = true;
    });
    loader.load("../models/scene-draco", (gara) => {
      gara.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.scene.add(gara.scene);
      gara.scene.position.set(0, -0.05, 0);

      // Force another update for the garage
      this.light.shadow.needsUpdate = true;
    });
    dracoLoader.dispose();

    // Create the reflector
    const textureLoader = new THREE.TextureLoader();
    const concreteNormal = textureLoader.load(
      "/textures/white-cliff-rock-normal.jpg",
    );
    concreteNormal.wrapS = THREE.RepeatWrapping;
    concreteNormal.wrapT = THREE.RepeatWrapping;
    concreteNormal.repeat.set(4, 4);

    const normalMapNode = texture(concreteNormal);
    const offsetXY = normalMapNode.rg.mul(2.0).sub(1.0);
    const jitterOffset = offsetXY.mul(0.04);
    const modUV = vec2(float(1).sub(screenUV.x), screenUV.y);
    const distortedUV = modUV.add(jitterOffset);

    const floorReflection = reflector({ generateMipmaps: true });
    const realisticRoughReflector = (floorReflection as any).sample(
      distortedUV,
    );

    const planeMat = new THREE.MeshBasicMaterial();
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    planeMat.colorNode = realisticRoughReflector;
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.add(realisticRoughReflector.target);
    plane.position.set(0, 0.01, 0);
    plane.rotation.x = Math.PI * -0.5;
    this.scene.add(plane);

    //mouse event
    this.Mouse = new THREE.Vector2(0, 0);
    this.previousMouse = new THREE.Vector2(0, 0);
    this.targetVelocity = new THREE.Vector2(0, 0);
    this.crVelocity = new THREE.Vector2(0, 0); // Initialize crVelocity
    this.crMousePos = new THREE.Vector2(0, 0); // Initialize crMousePos

    document.addEventListener("mousemove", (e) => {
      this.Mouse.x = e.clientX / container.clientWidth;
      this.Mouse.y = e.clientY / container.clientHeight; // Flip Y for UV space
    });

    // Create a render pipeline
    this.renderPipeline = new THREE.RenderPipeline(this.renderer);
    this.renderPipeline.outputColorTransform = false; // disable default output color transform

    // pre-pass
    const prePass = pass(this.scene, this.camera);
    prePass.name = "Pre-Pass";
    prePass.transparent = false;

    prePass.setMRT(
      mrt({
        output: directionToColor(normalView),
        velocity: velocity,
      }),
    );

    const prePassNormal = sample((uv) => {
      return colorToDirection(prePass.getTextureNode().sample(uv));
    });
    const prePassDepth = prePass
      .getTextureNode("depth")
      .toInspector("Depth", () => prePass.getLinearDepthNode());
    const prePassVelocity = prePass
      .getTextureNode("velocity")
      .toInspector("Velocity");

    // pre-pass - bandwidth optimization: store normals in 8-bit format instead of 16 or 32 bit float
    const normalTexture = prePass.getTexture("output");
    normalTexture.type = THREE.UnsignedByteType;

    //scenePass
    const scenePass = pass(this.scene, this.camera);
    //bloomPass
    let bloomPass = bloom(scenePass, 0.1, 0.2, 0.3); // strength, radius, threshold
    //aoPass
    let aoPass = ao(prePassDepth, prePassNormal, this.camera); // depth, normal, and camera inputs
    aoPass.radius = uniform(0.15);
    aoPass.thickness = uniform(4);
    aoPass.distanceExponent = uniform(0.8);
    aoPass.distanceFallOff = uniform(0.5);
    aoPass.resolutionScale = 0.25;
    aoPass.useTemporalFiltering = true;
    const aoPassOutput = aoPass.getTextureNode();

    //Adjust Render
    let currentTexture: any;
    // Apply the customTear effect to the scenePass output
    currentTexture = scenePass.getTextureNode();

    // scene context
    scenePass.contextNode = builtinAOContext(
      pow(aoPassOutput.sample(screenUV).r, 4.0),
    );
    //post-processing pipeline

    // final output + traa// do not use with MSAA
    let traaPass = traa(
      scenePass.add(bloomPass),
      prePassDepth,
      prePassVelocity,
      this.camera,
    );

    traaPass.useSubpixelCorrection = true;
    let outputPass: any;
    outputPass = renderOutput(
      scenePass.add(bloomPass),
      THREE.AgXToneMapping,
      THREE.SRGBColorSpace,
    );
    outputPass = mul(outputPass.sub(0.01), 1.6);
    outputPass = saturation(outputPass, 1.2);

    this.fls = uniform(float(0));
    let tear: any;
    tear = CustomTear(
      // Let TypeScript infer the type of 'trans' as CustomTearNode
      outputPass,
      22,
      1,
      this.fls,
    );

    // The final output of the rendering pipeline should be the result of the custom tear effect.
    this.renderPipeline.outputNode = tear; // Temporarily use 'any' to bypass type checking
  }

  async init() {
    await this.renderer.init();
    await this.renderer.compileAsync(this.scene, this.camera);
    this.animate();
  }

  private time = new THREE.Timer();
  private animationId: number | null = null;
  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time.update();

    this.light.shadow.camera.up.set(0, 0, 1);

    // 2. Force the Light and Target to calculate their absolute World Matrices
    this.light.updateMatrixWorld();
    this.light.target.updateMatrixWorld();

    // 3. Extract absolute world positions (ignores local group scaling/nesting)
    this.light.shadow.camera.position.setFromMatrixPosition(
      this.light.matrixWorld,
    );

    const targetPosition = new THREE.Vector3();
    targetPosition.setFromMatrixPosition(this.light.target.matrixWorld);

    // 4. Orient the camera and lock its matrix
    this.light.shadow.camera.lookAt(targetPosition);
    this.light.shadow.camera.updateMatrixWorld();

    // 5. Sync the FOV
    this.light.shadow.camera.fov = ((this.light.angle * 180) / Math.PI) * 1.5;
    this.light.shadow.camera.updateProjectionMatrix();

    //-------//
    this.targetVelocity.x = this.Mouse.x - this.previousMouse.x;
    this.targetVelocity.y = this.Mouse.y - this.previousMouse.y;
    this.previousMouse.copy(this.Mouse);
    this.crVelocity.lerp(this.targetVelocity, 0.1);
    this.crMousePos.lerp(this.Mouse, 0.05);

    this.renderPipeline.render();
  };

  public cleanup(container: HTMLElement) {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    if (container && this.renderer.domElement) {
      if (container.contains(this.renderer.domElement)) {
        container.removeChild(this.renderer.domElement);
      }
    }
    console.log("F1 Engine Shutdown Successfully");
  }
}
