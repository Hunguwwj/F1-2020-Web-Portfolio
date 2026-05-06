import * as THREE from "three";
import { OutputPass, SVGLoader } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export class TrackRenderer {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private animationId: number | null = null;
  private trackGroup: THREE.Group;
  private resizeObserver: ResizeObserver;
  private composer!: EffectComposer;

  // Features for the glowing animated trail
  private mainCurve: THREE.CatmullRomCurve3 | null = null;
  private trailGroup: THREE.Group | null = null;
  private trackCenter: THREE.Vector3 = new THREE.Vector3();

  // NEW: Store the array of trail segments
  private trailMeshes: THREE.Mesh[] = [];

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 300;

    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );
    this.camera.zoom = 10;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparent canvas
    });
    // Force the background clear color to be 100% transparent
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Smooths out bright gradients
    this.renderer.toneMappingExposure = 1.2; // Controls overall brightness
    container.appendChild(this.renderer.domElement);

    // By default, EffectComposer drops the alpha channel. We force it to use RGBAFormat.
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType, 
      samples: 4 // Adds anti-aliasing back to the post-processing pipeline
    });

    // 3. COMPOSER SETUP
    this.composer = new EffectComposer(this.renderer, renderTarget);
    const renderScene = new RenderPass(this.scene, this.camera);
    // Explicitly tell the RenderPass to keep the background transparent
    renderScene.clearAlpha = 0;

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.1,
      0.1,
      0.2,
    );

    const outputPass = new OutputPass();

    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
    this.composer.addPass(outputPass);

    container.appendChild(this.renderer.domElement);
    this.trackGroup = new THREE.Group();
    this.scene.add(this.trackGroup);

    // Light for the translucent track
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 10);
    dirLight.position.set(1, 2, 5);
    this.scene.add(dirLight);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
          this.composer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(container);

    this.animate();
  }

  public loadTrack(url: string) {
    const loader = new SVGLoader();

    loader.load(url, (data) => {
      // 1. HARD RESET
      while (this.trackGroup.children.length > 0) {
        const child = this.trackGroup.children[0] as THREE.Mesh | THREE.Group;
        if ((child as THREE.Mesh).geometry)
          (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material)
          ((child as THREE.Mesh).material as THREE.Material).dispose();
        this.trackGroup.remove(child);
      }

      this.trackGroup.scale.set(1, 1, 1);
      this.trackGroup.position.set(0, 0, 0);
      this.trackGroup.rotation.set(0, 0, 0);

      this.mainCurve = null;
      let maxPoints = 0;

      // 2. BUILD THE 3D TRACK WALLS
      data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const points = shape.getPoints();
          if (points.length === 0) return;

          const curve = new THREE.CatmullRomCurve3(
            points.map((p) => new THREE.Vector3(p.x, p.y, 0)),
          );
          curve.closed = true;

          if (points.length > maxPoints) {
            maxPoints = points.length;
            this.mainCurve = curve;
          }

          const trackWidth = 15;
          const trackHeight = 5;

          const profileShape = new THREE.Shape();
          profileShape.moveTo(-trackWidth / 2, 0);
          profileShape.lineTo(trackWidth / 2, 0);
          profileShape.lineTo(trackWidth / 2, trackHeight);
          profileShape.lineTo(-trackWidth / 2, trackHeight);
          profileShape.lineTo(-trackWidth / 2, 0);

          const extrudeSettings = {
            steps: 600,
            extrudePath: curve,
            bevelEnabled: false,
          };

          const geometry = new THREE.ExtrudeGeometry(
            profileShape,
            extrudeSettings,
          );

          // UPDATED: Translucent White Material
          const material = new THREE.MeshStandardMaterial({
            color: 0xffffff, // Changed to White
            roughness: 0.8, // Smoother for a glass-like look
            metalness: 0.2, // Higher metalness catches light better
            side: THREE.DoubleSide,
            transparent: true, // Enabled Alpha
            opacity: 0.25, // Reduced Alpha (15% visible)
          });

          const mesh = new THREE.Mesh(geometry, material);
          
          this.trackGroup.add(mesh);
        });
      });

      // 3. CENTERING & SIZING
      const box = new THREE.Box3().setFromObject(this.trackGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      this.trackCenter.copy(center);

      this.trackGroup.children.forEach((child) => {
        child.position.sub(center);
      });

      const maxDim = Math.max(size.x, size.y, 1);
      const targetScale = 80 / maxDim;

      // 4. CREATE THE FADING TRAIL
      if (this.mainCurve) {
        this.trailGroup = new THREE.Group();
        this.trailMeshes = []; // Reset array

        const orbRadius = 1.0 / targetScale;
        const trailLength = 25; // How many particles form the trail

        // Generate the trail particles
        for (let i = 0; i < trailLength; i++) {
          // Shrink the spheres as they go further back in the trail
          const scale = Math.max(0.1, 1 - i / trailLength);
          const geo = new THREE.SphereGeometry(orbRadius * scale, 16, 16);

          // Fade out the opacity as they go back
          const mat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: Math.max(0.01, 1 - i / trailLength),
          });

          const mesh = new THREE.Mesh(geo, mat);
          this.trailGroup.add(mesh);
          this.trailMeshes.push(mesh);
        }

        // Add the point light to illuminate the translucent track below the leader
        const light = new THREE.PointLight(0xffffff, 4, 60 / targetScale);
        this.trailGroup.add(light);

        this.trackGroup.add(this.trailGroup);
      }

      this.trackGroup.scale.set(targetScale, targetScale, targetScale);
      this.trackGroup.rotation.x = -Math.PI / 2;
    });
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // --- ANIMATE THE TRAIL MULTI-SEGMENTS ---
    if (this.mainCurve && this.trailGroup && this.trailMeshes.length > 0) {
      const time = Date.now();
      const speed = 0.00015; // Overall lap speed
      const gap = 0.002; // Distance between trail particles

      this.trailMeshes.forEach((mesh, index) => {
        // Calculate position for this specific particle in the trail
        let progress = (time * speed - index * gap) % 1.0;
        if (progress < 0) progress += 1.0; // Loop seamlessly

        const point = this.mainCurve!.getPointAt(progress);

        mesh.position.x = point.x - this.trackCenter.x;
        mesh.position.y = point.y - this.trackCenter.y;
        mesh.position.z = 8.5;
      });

      // Snap the PointLight to the head of the trail (index 0)
      const light = this.trailGroup.children.find(
        (c) => c instanceof THREE.PointLight,
      );
      if (light) {
        light.position.copy(this.trailMeshes[0].position);
      }
    }

    // --- CAMERA ORBIT ---
    const time = Date.now() * 0.0005;
    const radius = 100;
    this.camera.position.x = Math.sin(time) * radius;
    this.camera.position.z = Math.cos(time) * radius;
    this.camera.position.y = 60;

    this.camera.lookAt(0, 0, 0);

    this.composer.render();
  };

  public destroy() {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement,
      );
    }
  }
}
