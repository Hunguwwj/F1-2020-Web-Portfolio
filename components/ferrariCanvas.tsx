import { SceneManager } from "../renders/render";
import { startMainShow, triggerCameraView } from "../hook/hero-anim";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { SplitText } from "gsap/all";
import { ScrambleTextPlugin } from "gsap/all";
gsap.registerPlugin(SplitText, ScrambleTextPlugin);

// === DATA HUB ===
const viewData = {
  side: {
    title: "FERRARI",
    subtitle: "SCUDERIA · THE PRANCING HORSE",
    labelLeft: "EST. 1929",
    labelRight: "MARANELLO, ITALY",
    hasLine: true,
    titleBehindCar: true, // <--- THE FIX: This text goes BEHIND the car
    labelRightClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    labelLeftClass: "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    // Moved the heavy uppercase styling here so it doesn't break the cockpit quote!
    titleClass:
      "font-black uppercase tracking-wide leading-none text-[15vw] text-white/90",
    textEffect: "blink-slide",
    exitAnim: {
      y: 220,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.inOut",
    },
    canvasShift: "0vw",
  },
  front: {
    title: "SF1000",
    subtitle: "The car that marked Ferrari's 1000th Grand Prix.",
    labelLeft: "Chassis",
    labelRight: "2020",
    hasLine: false,
    titleBehindCar: true,
    labelRightClass: "absolute top-[8vh] left-[5vw] overflow-hidden pb-2 pr-4",
    labelLeftClass: "absolute top-[8vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute top-[6vh] right-[7vw] text-right flex flex-col items-end",
    titleClass:
      "font-black uppercase tracking-tighter leading-none text-[14vw] font-akira",
    textEffect: "decode-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "-15vw",
  },
  cockpit: {
    title: '"AERODYNAMICS ARE FOR PEOPLE WHO CAN\'T BUILD ENGINES."',
    subtitle: "ENZO FERRARI",
    labelLeft: "",
    labelRight: "",
    hasLine: false,
    titleBehindCar: false,
    labelRightClass: "absolute top-[12vh] left-[9vw] overflow-hidden pb-2 pr-4",
    labelLeftClass: "absolute top-[12vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute top-[35vh] w-full flex justify-center flex-col items-center",
    titleClass:
      "text-3xl md:text-5xl text-white text-center max-w-5xl leading-tight font-mono",
    textEffect: "blur",
    exitAnim: {
      scale: 1.05,
      filter: "blur(10px)",
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    },
    canvasShift: "0vw",
  },
};

let cachedEngine: SceneManager | null = null;

export default function FerrariCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const barsContainerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const engineRef = useRef<SceneManager | null>(null);
  const [activeView, setActiveView] = useState<"side" | "front" | "cockpit">(
    "side",
  );
  const [isEngineReady, setIsEngineReady] = useState(false);

  // === HOOK 1: ENGINE SETUP ===
  useGSAP(() => {
    let isCancelled = false;

    const setup = async () => {
      if (!containerRef.current) return;

      if (!cachedEngine) {
        cachedEngine = new SceneManager(containerRef.current, {
          modelPath: "../models/ferrari", // Point to the Ferrari model
          lightColor: 0xffffff, // Slightly warm light
          lightIntensity: 3, // Bright main light
          ambientLightColor: 0xffdddd,
          ambientIntensity: 0.4, // Keep shadows dark
        });
        engineRef.current = cachedEngine;

        await cachedEngine.init();
        cachedEngine.precompileShaders();
        cachedEngine.warmUpGPU();
      } else {
        engineRef.current = cachedEngine;
        containerRef.current.appendChild(cachedEngine.renderer.domElement);
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!isCancelled && cachedEngine) {
            startMainShow(
              cachedEngine,
              topBarRef.current,
              bottomBarRef.current,
              () => setIsEngineReady(true),
            );
          }
        });
      });
    };
    setup();

    return () => {
      isCancelled = true;
      if (cachedEngine && containerRef.current) {
        if (containerRef.current.contains(cachedEngine.renderer.domElement)) {
          containerRef.current.removeChild(cachedEngine.renderer.domElement);
        }
      }
    };
  });

  // === HOOK 2: TEXT ENTER ANIMATIONS ===
  useGSAP(
    () => {
      if (!isEngineReady || !titleRef.current || !triggerRef.current) return;

      const currentData = viewData[activeView];
      const titleEl = titleRef.current;
      const uiContainer = triggerRef.current;

      const extras = uiContainer.querySelectorAll(".text-extra");
      const lineEl = uiContainer.querySelector(".decorative-line");
      let splitInstances: SplitText[] = [];

      // === THE FIX: Reset all leftover animations from the previous view ===
      const allElements = [titleEl, ...Array.from(extras), lineEl].filter(
        Boolean,
      );
      gsap.set(allElements, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)", // <--- This forces the blur to disappear!
      });

      if (lineEl) {
        gsap.fromTo(
          lineEl,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.3,
          },
        );
      }
      if (currentData.textEffect !== "decode-slide" && extras.length > 0) {
        gsap.fromTo(
          extras,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4,
          },
        );
      }

      if (currentData.textEffect === "blink-slide") {
        gsap.fromTo(
          titleEl,
          { x: -150, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        );

        const split = new SplitText(titleEl, { type: "chars" });
        splitInstances.push(split);

        gsap.set(split.chars, { opacity: 0 });
        gsap.to(split.chars, {
          keyframes: [
            { opacity: 1, duration: 0.05 },
            { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0.2, duration: 0.05 },
            { opacity: 1, duration: 0.2 },
          ],
          stagger: 0.08,
          ease: "none",
        });
      } else if (currentData.textEffect === "decode-slide") {
        const allTextElements = [titleEl, ...Array.from(extras)];

        allTextElements.forEach((el, index) => {
          const textNode = el as HTMLElement;

          gsap.fromTo(
            textNode,
            { y: -220, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: index * 0.15,
            },
          );

          const split = new SplitText(textNode, { type: "chars" });
          splitInstances.push(split);

          gsap.to(split.chars, {
            duration: 1.2,
            scrambleText: {
              text: "{original}",
              chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
              speed: 1,
            },
            delay: index * 0.15,
          });
        });
      } else if (currentData.textEffect === "float") {
        gsap.set(titleEl, { opacity: 1 });
        const split = new SplitText(titleEl, { type: "chars" });
        splitInstances.push(split);
        gsap.from(split.chars, {
          yPercent: 150,
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power2.out",
        });
      } else if (currentData.textEffect === "blur") {
        gsap.fromTo(
          titleEl,
          { scale: 0.95, filter: "blur(10px)", opacity: 0 },
          {
            scale: 1,
            filter: "blur(0px)",
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
        );
      }

      return () => {
        splitInstances.forEach((split) => split.revert());
      };
    },
    { dependencies: [activeView, isEngineReady] },
  );

  const handleViewChange = (view: "side" | "front" | "cockpit") => {
    if (
      activeView === view ||
      !engineRef.current ||
      !isEngineReady ||
      !triggerRef.current
    )
      return;

    triggerCameraView(
      engineRef.current,
      view,
      topBarRef.current,
      bottomBarRef.current,
      barsContainerRef.current,
    );
    gsap.to(containerRef.current, {
      x: viewData[view].canvasShift,
      duration: 1.8,
      ease: "power3.inOut",
    });

    const exitTargets = [
      titleRef.current,
      ...Array.from(triggerRef.current.querySelectorAll(".text-extra")),
      ...Array.from(triggerRef.current.querySelectorAll(".decorative-line")),
    ].filter(Boolean);

    gsap.to(exitTargets, {
      ...viewData[activeView].exitAnim,
      onComplete: () => {
        setActiveView(view);
      },
    });
  };

  return (
    <div
      ref={triggerRef}
      className="w-full bg-[#c70e0e] relative h-screen overflow-hidden"
    >
      {/* 1. CINEMATIC BARS (Z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div
          ref={barsContainerRef}
          className="absolute top-1/2 left-1/2 w-0 h-0"
        >
          <div
            ref={topBarRef}
            className="absolute bottom-0 left-[-150vmax] w-[300vmax] h-[300vmax] bg-white shadow-2xl"
            style={{ transform: "translateY(-50vh)" }}
          />
          <div
            ref={bottomBarRef}
            className="absolute top-0 left-[-150vmax] w-[300vmax] h-[300vmax] bg-white shadow-2xl"
            style={{ transform: "translateY(50vh)" }}
          />
        </div>
      </div>

      {/* 2. BACKGROUND TEXT LAYER (Z-15) -> Sits BEHIND the Car */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        <div className={viewData[activeView].titleContainerClass}>
          <div className="overflow-hidden pb-2 pr-10 pl-10">
            {/* GSAP attaches to this <h1> ONLY if titleBehindCar is TRUE */}
            <h1
              ref={viewData[activeView].titleBehindCar ? titleRef : null}
              key={`bg-${activeView}`}
              className={`${viewData[activeView].titleClass} ${!viewData[activeView].titleBehindCar ? "opacity-0 pointer-events-none select-none" : "opacity-0"}`}
              // THE FIX: Explicitly cast to string
            >
              {viewData[activeView].title}
            </h1>
          </div>

          {viewData[activeView].hasLine && (
            <div className="overflow-hidden w-full max-w-[45vw] flex justify-center mt-2 mb-4 opacity-0 pointer-events-none">
              <div className="h-0.5 w-full" />
            </div>
          )}
          {viewData[activeView].subtitle && (
            <div className="overflow-hidden mt-0 pr-10 pl-10 text-center opacity-0 pointer-events-none select-none">
              <p className="font-akira text-[12px] leading-[1.2] tracking-[0.24em]">
                {viewData[activeView].subtitle}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. 3D CANVAS LAYER (Z-20) -> Sits IN THE MIDDLE */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center will-change-transform"
      />

      {/* 4. FOREGROUND TEXT LAYER (Z-25) -> Sits IN FRONT of the Car */}
      <div className="absolute inset-0 z-25 pointer-events-none">
        {viewData[activeView].labelLeft && (
          <div className={viewData[activeView].labelRightClass}>
            <div className="text-extra opacity-0 font-akira text-[11px] uppercase leading-none tracking-[0.24em] text-white">
              {viewData[activeView].labelLeft}
            </div>
          </div>
        )}

        {viewData[activeView].labelRight && (
          <div className={viewData[activeView].labelLeftClass}>
            <div className="text-extra opacity-0 font-akira text-[11px] uppercase leading-none tracking-[0.24em] text-white">
              {viewData[activeView].labelRight}
            </div>
          </div>
        )}

        <div className={viewData[activeView].titleContainerClass}>
          <div className="overflow-hidden pb-2 pr-10 pl-10">
            {/* GSAP attaches to this <h1> ONLY if titleBehindCar is FALSE */}
            <h1
              ref={!viewData[activeView].titleBehindCar ? titleRef : null}
              key={`fg-${activeView}`}
              className={`${viewData[activeView].titleClass} ${viewData[activeView].titleBehindCar ? "opacity-0 pointer-events-none select-none" : "opacity-0"}`}
              // THE FIX: Explicitly cast to string
            >
              {viewData[activeView].title}
            </h1>
          </div>

          {viewData[activeView].hasLine && (
            <div className="overflow-hidden w-full max-w-[45vw] flex justify-center mt-2 mb-4">
              <div className="decorative-line opacity-0 h-0.5 w-full bg-white origin-center will-change-transform" />
            </div>
          )}

          {viewData[activeView].subtitle && (
            <div className="overflow-hidden mt-0 pr-10 pl-10 text-center">
              <p className="text-extra opacity-0 font-akira text-[12px] leading-[1.2] tracking-[0.24em] text-white">
                {viewData[activeView].subtitle}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. BUTTONS (Z-30) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex justify-center">
        <div className="absolute bottom-[14vh] flex gap-6 pointer-events-auto">
          {(["side", "front", "cockpit"] as const).map((view, index) => {
            const label = `0${index + 1}`;
            return (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`w-12 h-12 flex items-center justify-center border font-mono text-sm font-bold transition-all duration-500 cursor-pointer backdrop-blur-sm hover:scale-110 ${
                  activeView === view
                    ? "bg-white text-black border-white scale-110"
                    : "bg-black/20 text-white border-white/30 hover:border-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
