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

  // CACHE: Optimize performance by keeping previously loaded tracks in memory
  private trackCache: Map<
    string,
    {
      group: THREE.Group;
      mainCurve: THREE.CatmullRomCurve3 | null;
      trailGroup: THREE.Group | null;
      trailMeshes: THREE.Mesh[];
      trackCenter: THREE.Vector3;
    }
  > = new Map();
  private loader = new SVGLoader();

  private isVisible: boolean = true;
  private intersectionObserver!: IntersectionObserver;

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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // Smooths out bright gradients
    this.renderer.toneMappingExposure = 1.2; // Controls overall brightness
    container.appendChild(this.renderer.domElement);

    // By default, EffectComposer drops the alpha channel. We force it to use RGBAFormat.
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      samples: 1, // Adds anti-aliasing back to the post-processing pipeline
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

    // Only render when the container is actually on the screen
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    });
    this.intersectionObserver.observe(container);
    this.animate();
  }

  private async parseAndCacheTrack(url: string): Promise<void> {
    if (this.trackCache.has(url)) return;

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (data) => {
          const newTrackContainer = new THREE.Group();
          let mainCurve: THREE.CatmullRomCurve3 | null = null;
          let maxPoints = 0;
          const trackCenter = new THREE.Vector3();
          let trailGroup: THREE.Group | null = null;
          let trailMeshes: THREE.Mesh[] = [];

          // Build the 3D Track Walls
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
                mainCurve = curve;
              }

              const profileShape = new THREE.Shape();
              profileShape.moveTo(-7.5, 0); // width/2
              profileShape.lineTo(7.5, 0);
              profileShape.lineTo(7.5, 5); // height
              profileShape.lineTo(-7.5, 5);
              profileShape.lineTo(-7.5, 0);

              // Using the optimized settings!
              const geometry = new THREE.ExtrudeGeometry(profileShape, {
                steps: 120,
                extrudePath: curve,
                bevelEnabled: false,
              });
              const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.8,
                metalness: 0.2,
                side: THREE.FrontSide,
                transparent: true,
                opacity: 0.25,
              });

              newTrackContainer.add(new THREE.Mesh(geometry, material));
            });
          });

          // Centering & Sizing
          const box = new THREE.Box3().setFromObject(newTrackContainer);
          const size = box.getSize(new THREE.Vector3());
          trackCenter.copy(box.getCenter(new THREE.Vector3()));
          newTrackContainer.children.forEach((child) =>
            child.position.sub(trackCenter),
          );

          const targetScale = 80 / Math.max(size.x, size.y, 1);

          // Build the Trail
          if (mainCurve) {
            trailGroup = new THREE.Group();
            for (let i = 0; i < 25; i++) {
              const scale = Math.max(0.1, 1 - i / 25);
              const mesh = new THREE.Mesh(
                new THREE.SphereGeometry((1.0 / targetScale) * scale, 16, 16),
                new THREE.MeshBasicMaterial({
                  color: 0xff0000,
                  transparent: true,
                  opacity: Math.max(0.01, 1 - i / 25),
                }),
              );
              trailGroup.add(mesh);
              trailMeshes.push(mesh);
            }
            trailGroup.add(new THREE.PointLight(0xffffff, 4, 60 / targetScale));
            newTrackContainer.add(trailGroup);
          }

          newTrackContainer.scale.set(targetScale, targetScale, targetScale);
          newTrackContainer.rotation.x = -Math.PI / 2;

          // Save it to memory!
          this.trackCache.set(url, {
            group: newTrackContainer,
            mainCurve,
            trailGroup,
            trailMeshes,
            trackCenter,
          });
          resolve();
        },
        undefined,
        reject,
      );
    });
  }

  public async loadTrack(url: string) {
    // If the user clicks a track that hasn't finished preloading yet,
    // it will safely wait for it to parse on the spot.
    if (!this.trackCache.has(url)) {
      await this.parseAndCacheTrack(url);
    }

    // Wipe the old track from the scene
    while (this.trackGroup.children.length > 0) {
      this.trackGroup.remove(this.trackGroup.children[0]);
    }

    // Instantly inject the cached track
    const cached = this.trackCache.get(url)!;
    this.trackGroup.add(cached.group);

    this.mainCurve = cached.mainCurve;
    this.trailGroup = cached.trailGroup;
    this.trailMeshes = cached.trailMeshes;
    this.trackCenter.copy(cached.trackCenter);
  }

  // 2. The Ghost Loop: Loads the array of tracks invisibly
  public async preloadAll(urls: string[]) {
    // Wait 2 seconds so the initial site load/animations aren't interrupted
    await new Promise((r) => setTimeout(r, 2000));

    for (const url of urls) {
      if (!this.trackCache.has(url)) {
        await this.parseAndCacheTrack(url);
        // CRITICAL: Force the CPU to breathe for 100ms between tracks.
        // This prevents the browser from dropping frames if the user is scrolling.
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    if (!this.isVisible) return;

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
    this.intersectionObserver.disconnect();
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();

    // Cleanup cached geometries and materials
    this.trackCache.forEach((cached) => {
      cached.group.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m: any) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    this.trackCache.clear();

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement,
      );
    }
  }
}
