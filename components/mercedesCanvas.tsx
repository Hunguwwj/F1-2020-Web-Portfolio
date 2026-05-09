"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const MERCEDES_MODEL = {
  modelPath: "../models/mercedes",
  lightColor: 0xbff7ef,
  lightIntensity: 4.0,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.9,
};

const MERCEDES_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #071C1C 0%, #003B37 52%, #000F0E 100%)",
  cinematicBar: "#00D2BE",
  backgroundTitleColor: "rgba(0, 210, 190, 0.32)",
  viewTitleColor: "#F3FFFD",
  mainText: "#F3FFFD",
  line: "#00D2BE",
  buttonActiveBg: "#00D2BE",
  buttonActiveText: "#061B1B",
  buttonActiveBorder: "#00D2BE",
  buttonIdleBg: "rgba(243, 255, 253, 0.08)",
  buttonIdleText: "#F3FFFD",
  buttonIdleBorder: "rgba(0, 210, 190, 0.45)",
};

const MERCEDES_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "MERCEDES",
    subtitle: "Mercedes-AMG Petronas Formula One Team",
    titleColor: "rgba(0, 210, 190, 0.32)",
    subtitleUseTitleColor: false,
    labelLeft: "HYBRID ERA DOMINANCE",
    labelRight: "BRACKLEY, UNITED KINGDOM",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass: "font-black uppercase tracking-wide leading-none text-[12vw]",
    textEffect: "blink-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "0vw",
  },
  front: {
    title: "W11",
    subtitle: "Black Arrow",
    titleColor: "#F3FFFD",
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
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "-15vw",
  },
  cockpit: {
    title: '"EXCELLENCE IS NEVER AN ACCIDENT."',
    subtitle: "TOTO WOLFF",
    titleColor: "#F3FFFD",
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

export default function MercedesCanvas() {
  return (
    <BaseTeamCanvas
      model={MERCEDES_MODEL}
      theme={MERCEDES_THEME}
      viewData={MERCEDES_VIEWS}
    />
  );
}
