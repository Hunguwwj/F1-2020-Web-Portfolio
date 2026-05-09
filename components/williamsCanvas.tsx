"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const WILLIAMS_MODEL = {
  modelPath: "../models/williams",
  lightColor: 0xc7efff,
  lightIntensity: 4.0,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.9,
};

const WILLIAMS_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #061524 0%, #003049 55%, #00111D 100%)",
  cinematicBar: "#00A3E0",
  backgroundTitleColor: "rgba(0, 163, 224, 0.3)",
  viewTitleColor: "#F3FAFF",
  mainText: "#F3FAFF",
  line: "#00A3E0",
  buttonActiveBg: "#00A3E0",
  buttonActiveText: "#061524",
  buttonActiveBorder: "#00A3E0",
  buttonIdleBg: "rgba(243, 250, 255, 0.08)",
  buttonIdleText: "#F3FAFF",
  buttonIdleBorder: "rgba(0, 163, 224, 0.45)",
};

const WILLIAMS_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "WILLIAMS",
    subtitle: "Williams Racing",
    titleColor: "rgba(0, 163, 224, 0.3)",
    subtitleUseTitleColor: false,
    labelLeft: "RACING HERITAGE",
    labelRight: "GROVE, UNITED KINGDOM",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass: "font-black uppercase tracking-wide leading-none text-[13vw]",
    textEffect: "blink-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "0vw",
  },
  front: {
    title: "FW43",
    subtitle: "Blue Revival",
    titleColor: "#F3FAFF",
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
    title: '"RACING IS ABOUT NEVER GIVING UP."',
    subtitle: "FRANK WILLIAMS",
    titleColor: "#F3FAFF",
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

export default function WilliamsCanvas() {
  return (
    <BaseTeamCanvas
      model={WILLIAMS_MODEL}
      theme={WILLIAMS_THEME}
      viewData={WILLIAMS_VIEWS}
    />
  );
}
