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
  texture,
  saturation,
  pow,
  float,
  uniform,
  vec3,
  vec4,
  color,
  workingToColorSpace,
  toneMapping,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { bilateralBlur } from "three/addons/tsl/display/BilateralBlurNode.js";
import { gaussianBlur } from "three/examples/jsm/tsl/display/GaussianBlurNode.js";

export interface SceneConfig {
  modelPath: string;
  lightColor?: number;
  lightIntensity?: number;
  ambientLightColor?: number;
  ambientIntensity?: number;
}

// 1. GLOBAL LOADERS & CACHE (Prevents Web Worker duplication)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../models/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Store the Promise so rapid hovers don't trigger multiple downloads
const gltfCache = new Map<string, Promise<any>>();

export const preloadTeamModel = (modelPath: string): Promise<any> => {
  if (gltfCache.has(modelPath)) return gltfCache.get(modelPath)!;

  const promise = new Promise((resolve, reject) => {
    gltfLoader.load(modelPath, resolve, undefined, reject);
  });

  gltfCache.set(modelPath, promise);
  return promise;
};

export class SceneManager {
  public isDestroyed: boolean = false;

  public renderer: THREE.WebGPURenderer;
  private renderPipeline: THREE.RenderPipeline;
  private container: HTMLElement;
  private Mouse: THREE.Vector2;
  private previousMouse: THREE.Vector2;
  private targetVelocity: THREE.Vector2;
  private crVelocity: THREE.Vector2;
  private crMousePos: THREE.Vector2;
  private shadowCamera!: THREE.OrthographicCamera;
  private contactShadowTarget!: THREE.RenderTarget;
  private depthMaterial!: THREE.NodeMaterial;

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public mesh: THREE.Object3D | undefined = undefined;
  public light: THREE.DirectionalLight;

  private config: SceneConfig;

  // React Strict Mode Fix: Accept both the canvas and the container
  constructor(canvas: HTMLCanvasElement, container: HTMLElement, config: SceneConfig) {
    this.config = config;
    this.container = container;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );

    // FIX: Lock camera and light to the cinematic start position immediately to prevent "flash"
    this.camera.position.set(-5, 0.7, 8);
    this.camera.rotation.set(0, -Math.PI / 2, 0);

    this.renderer = new THREE.WebGPURenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearAlpha(0);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambColor = this.config.ambientLightColor ?? 0xffffff;
    const ambIntensity = this.config.ambientIntensity ?? 0.05;
    this.scene.add(new THREE.AmbientLight(ambColor, ambIntensity));

    const dirColor = this.config.lightColor ?? 0xffffff;
    this.light = new THREE.DirectionalLight(dirColor);
    this.light.intensity = this.config.lightIntensity ?? 3.0;
    this.light.position.set(0, 3, 0); 
    this.scene.add(this.light);

    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 2048;
    this.light.shadow.mapSize.height = 2048;
    this.light.shadow.bias = -0.001;

    this.light.shadow.radius = 1;
    this.light.shadow.camera.top = 4;
    this.light.shadow.camera.bottom = -4;
    this.light.shadow.camera.left = -4;
    this.light.shadow.camera.right = 4;
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = 50;

    this.scene.add(this.light.target);

    const geometry = new THREE.PlaneGeometry(20, 20);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShadowMaterial();
    material.opacity = 0.4;
    const plane = new THREE.Mesh(geometry, material);
    plane.position.y = 0.03;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.shadowCamera = new THREE.OrthographicCamera(-2, 2, 3, -3, 0, 10);
    this.shadowCamera.position.set(0, 0.01, 0);
    this.shadowCamera.rotation.x = Math.PI / 2;
    this.shadowCamera.updateProjectionMatrix();

    this.contactShadowTarget = new THREE.RenderTarget(1024, 1024, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.contactShadowTarget.texture.generateMipmaps = false;

    this.depthMaterial = new THREE.NodeMaterial();
    this.depthMaterial.colorNode = vec3(0);
    this.depthMaterial.depthTest = false;
    this.depthMaterial.depthWrite = false;

    const shadowPlaneMaterial = new THREE.NodeMaterial();
    shadowPlaneMaterial.transparent = true;
    shadowPlaneMaterial.depthWrite = false;
    shadowPlaneMaterial.colorNode = vec3(0);

    const blurredShadow = gaussianBlur(
      texture(this.contactShadowTarget.texture),
      4,
    );
    shadowPlaneMaterial.opacityNode = blurredShadow.r.oneMinus().mul(0.95);

    const shadowPlaneGeometry = new THREE.PlaneGeometry(4, 6);
    shadowPlaneGeometry.rotateX(-Math.PI / 2);
    const contactShadowPlane = new THREE.Mesh(
      shadowPlaneGeometry,
      shadowPlaneMaterial,
    );

    contactShadowPlane.position.y = 0.031;
    this.scene.add(contactShadowPlane);

    this.Mouse = new THREE.Vector2(0, 0);
    this.previousMouse = new THREE.Vector2(0, 0);
    this.targetVelocity = new THREE.Vector2(0, 0);
    this.crVelocity = new THREE.Vector2(0, 0);
    this.crMousePos = new THREE.Vector2(0, 0);

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("mousemove", this.handleMouseMove);

    this.renderPipeline = new THREE.RenderPipeline(this.renderer);
    this.renderPipeline.outputColorTransform = false;

    const prePass = pass(this.scene, this.camera);
    prePass.name = "Pre-Pass";
    prePass.transparent = true;

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

    const normalTexture = prePass.getTexture("output");
    normalTexture.type = THREE.UnsignedByteType;

    const scenePass = pass(this.scene, this.camera);
    scenePass.transparent = true;

    let bloomPass = bloom(scenePass, 0.1, 0.2, 0.3);
    let aoPass = ao(prePassDepth, prePassNormal, this.camera);
    aoPass.radius = uniform(0.15);
    aoPass.thickness = uniform(4);
    aoPass.distanceExponent = uniform(0.8);
    aoPass.distanceFallOff = uniform(0.5);
    aoPass.resolutionScale = 0.5;
    aoPass.useTemporalFiltering = true;
    const blurAOPass = bilateralBlur(aoPass.getTextureNode());
    blurAOPass.sigma = 2;
    const aoPassOutput = blurAOPass.getTextureNode();

    scenePass.contextNode = builtinAOContext(aoPassOutput.sample(screenUV).r);

    let adjustPass: any = scenePass.getTextureNode();
    let outputPass: any = adjustPass;
    outputPass = outputPass.add(bloomPass);
    outputPass = toneMapping(6, float(1.5), outputPass);
    outputPass = workingToColorSpace(outputPass, THREE.SRGBColorSpace);
    outputPass = saturation(outputPass, 1.35);

    this.renderPipeline.outputNode = vec4(outputPass, adjustPass.a);
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.Mouse.x = e.clientX / this.container.clientWidth;
    this.Mouse.y = e.clientY / this.container.clientHeight;
  };

  private handleResize = () => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  public async loadModel(): Promise<void> {
    try {
      // Wait for the Promise from the global cache
      const gltf = await preloadTeamModel(this.config.modelPath);
      if (this.isDestroyed) return;

      // Clone so multiple visits don't share identical mesh references
      const clonedScene = gltf.scene.clone();

      clonedScene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.mesh = clonedScene;
      this.scene.add(clonedScene);
      this.light.shadow.needsUpdate = true;

      // FIX: Generate the heavy contact shadow EXACTLY ONCE here
      this.generateContactShadow();

    } catch (error) {
      console.error("Failed to load model", error);
    }
  }

  private generateContactShadow() {
    const initialBackground = this.scene.background;
    const initialOverride = this.scene.overrideMaterial;

    this.scene.backgroundNode = color(0xffffff);
    this.scene.background = null;
    this.scene.overrideMaterial = this.depthMaterial;

    this.renderer.setRenderTarget(this.contactShadowTarget);
    this.renderer.render(this.scene, this.shadowCamera);

    this.renderer.setRenderTarget(null);
    this.scene.backgroundNode = null;
    this.scene.background = initialBackground;
    this.scene.overrideMaterial = initialOverride;
  }

  async init() {
    try {
      await this.renderer.init();

      if (this.isDestroyed) {
        this.renderer.dispose();
        return;
      }

      await this.loadModel();
      await this.renderer.compileAsync(this.scene, this.camera);
      if (this.isDestroyed) return;

      // 3. THE MOBILE FIX: Force the absolute heaviest frame right now.
      this.renderer.render(this.scene, this.camera);

      // 4. THE CPU BREATHER: Yield the main thread so GSAP doesn't choke.
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (this.isDestroyed) return;

      this.animate();
    } catch (error) {
      console.warn("WebGPU initialization or loading aborted:", error);
    }
  }

  private time = new THREE.Timer();
  private animationId: number | null = null;

  private animate = () => {
    if (this.isDestroyed) return;

    this.animationId = requestAnimationFrame(this.animate);
    this.time.update();

    // Removed the heavy static lighting matrix updates from here!

    this.targetVelocity.x = this.Mouse.x - this.previousMouse.x;
    this.targetVelocity.y = this.Mouse.y - this.previousMouse.y;
    this.previousMouse.copy(this.Mouse);
    this.crVelocity.lerp(this.targetVelocity, 0.1);
    this.crMousePos.lerp(this.Mouse, 0.05);

    // Removed the double-rendering Contact shadow from here!

    this.renderPipeline.render();
  };

  public precompileShaders() {
    if (this.renderer && this.scene && this.camera && !this.isDestroyed) {
      // @ts-ignore
      this.renderer.compile(this.scene, this.camera);
    }
  }

  public warmUpGPU() {
    // Left empty or removed, because we now handle forced warm-up inside init() safely.
  }

  public destroy() {
    this.isDestroyed = true; // Trip the breaker

    if (this.animationId) cancelAnimationFrame(this.animationId);

    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.handleMouseMove);

    if (this.contactShadowTarget) {
      this.contactShadowTarget.dispose();
      if (this.contactShadowTarget.texture) {
        this.contactShadowTarget.texture.dispose();
      }
      if (this.contactShadowTarget.depthTexture) {
        this.contactShadowTarget.depthTexture.dispose();
      }
    }
    
    if (this.light && this.light.shadow && this.light.shadow.map) {
      this.light.shadow.map.dispose();
    }

    if (this.scene.environment) {
      this.scene.environment.dispose();
      delete (this.scene.environment as any)._webgpuTexture;
      delete (this.scene.environment as any).isWebGPUTexture;
      this.scene.environment = null;
    }

    // Notice we DO NOT dispose of the geometries here anymore, 
    // because they are held in the gltfCache for the next page visit!
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }

    if (this.renderer && typeof this.renderer.dispose === "function") {
      this.renderer.dispose();
    }
  }
}