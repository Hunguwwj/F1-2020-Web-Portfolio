// alfaromeoCanvas.tsx
"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas"; // <-- Imported types here

const ALFA_MODEL = {
  modelPath: "../models/alfaromeo",
  lightColor: 0xffc2c2,
  lightIntensity: 4.0,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.9,
};

const ALFA_THEME = {
  // New Light Gradient (Based on the old #FFF4F4 bar color)
  sectionBackground:
    "linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 55%, #E5D5D5 100%)",

  // New Dark Cinematic Bar (Based on the old dark red background)
  cinematicBar: "#130508",

  // Inverted Text Colors for Light Background
  backgroundTitleColor: "rgba(90, 0, 0, 0.28)", // Faint dark red for background shadow
  viewTitleColor: "#130508", // Very dark color for primary titles
  mainText: "#130508",
  line: "#900000", // Sharp red line

  // Inverted Button States
  buttonActiveBg: "#130508",
  buttonActiveText: "#FFF4F4",
  buttonActiveBorder: "#130508",
  buttonIdleBg: "rgba(19, 5, 8, 0.08)",
  buttonIdleText: "#130508",
  buttonIdleBorder: "rgba(19, 5, 8, 0.42)",
};

const ALFA_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "ALFA ROMEO",
    subtitle: "Alfa Romeo Racing ORLEN",
    titleColor: "rgba(90, 0, 0, 0.28)", // Use the faint red behind car
    subtitleUseTitleColor: false,
    labelLeft: "SWISS PRECISION",
    labelRight: "HINWIL, SWITZERLAND",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass:
      "font-black uppercase tracking-wide leading-none text-[10.18vw]",

    // 🚨 THE FIX: This pushes the line and subtitle down by 25vh!
    extraContainerClass: "mt-[2vh] flex w-full flex-col items-center",

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
    title: "C39",
    subtitle: "Burgundy Line",
    titleColor: "rgba(90, 0, 0, 0.28)",
    subtitleUseTitleColor: true,
    labelLeft: "CHASSIS",
    labelRight: "2020",
    showLine: false,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[8vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass: "absolute top-[8vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute top-[6vh] right-[7vw] text-right flex flex-col items-end",
    titleClass:
      "font-akira text-[13vw] font-black uppercase leading-none tracking-[0.04em]",
    textEffect: "decode-slide",
    exitAnim: {
      y: 220,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.inOut",
    },
    canvasShift: "-15vw",
  },
  cockpit: {
    title: '"LEAVE ME ALONE, I KNOW WHAT TO DO."',
    subtitle: "KIMI RAIKKONEN",
    titleColor: "rgba(120, 20, 0, 1)",
    subtitleUseTitleColor: true,
    labelLeft: "",
    labelRight: "",
    showLine: false,
    titleLayer: "front-car",
    leftLabelClass: "absolute top-[12vh] left-[9vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[12vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute top-[35vh] w-full flex flex-col items-center justify-center",
    titleClass:
      "max-w-4xl text-center font-mono text-3xl leading-tight md:text-6xl",
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

export default function AlfaRomeoCanvas() {
  return (
    <BaseTeamCanvas
      model={ALFA_MODEL}
      theme={ALFA_THEME}
      viewData={ALFA_VIEWS}
    />
  );
}
