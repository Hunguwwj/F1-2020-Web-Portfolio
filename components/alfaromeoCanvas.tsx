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
  sectionBackground: "linear-gradient(180deg, #900000 0%, #5A0000 55%, #130508 100%)",
  cinematicBar: "#FFF4F4",
  backgroundTitleColor: "rgba(255, 244, 244, 0.28)",
  viewTitleColor: "#FFF4F4",
  mainText: "#FFF4F4",
  line: "#FFF4F4",
  buttonActiveBg: "#FFF4F4",
  buttonActiveText: "#130508",
  buttonActiveBorder: "#FFF4F4",
  buttonIdleBg: "rgba(255, 244, 244, 0.08)",
  buttonIdleText: "#FFF4F4",
  buttonIdleBorder: "rgba(255, 244, 244, 0.42)",
};

// 🚨 Added explicit typing here to lock in the string literals!
const ALFA_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "ALFA ROMEO",
    subtitle: "Alfa Romeo Racing ORLEN",
    titleColor: "rgba(255, 244, 244, 0.28)",
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
    titleColor: "#FFF4F4",
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
    titleColor: "#FFF4F4",
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
      "max-w-5xl text-center font-mono text-3xl leading-tight md:text-5xl",
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