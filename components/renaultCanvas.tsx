"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const RENAULT_MODEL = {
  modelPath: "../models/renault",
  lightColor: 0xfff6a3,
  lightIntensity: 4.1,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.88,
};

const RENAULT_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #111006 0%, #302D00 52%, #050500 100%)",
  cinematicBar: "#FFF500",
  backgroundTitleColor: "rgba(255, 245, 0, 0.3)",
  viewTitleColor: "#FFF500",
  mainText: "#FFF500",
  line: "#FFF500",
  buttonActiveBg: "#FFF500",
  buttonActiveText: "#161300",
  buttonActiveBorder: "#FFF500",
  buttonIdleBg: "rgba(255, 245, 0, 0.08)",
  buttonIdleText: "#FFF500",
  buttonIdleBorder: "rgba(255, 245, 0, 0.45)",
};

const RENAULT_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "RENAULT",
    subtitle: "Renault DP World F1 Team",
    titleColor: "rgba(255, 245, 0, 0.3)",
    subtitleUseTitleColor: false,
    labelLeft: "ENGINEERED TO RETURN",
    labelRight: "ENSTONE, UNITED KINGDOM",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass: "font-black uppercase tracking-wide leading-none text-[14vw]",
    textEffect: "blink-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "0vw",
  },
  front: {
    title: "R.S.20",
    subtitle: "Yellow Thunder",
    titleColor: "#FFF500",
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
    title: '"POWER IS BUILT THROUGH PATIENCE."',
    subtitle: "FERNANDO ALONSO",
    titleColor: "#FFF500",
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

export default function RenaultCanvas() {
  return (
    <BaseTeamCanvas
      model={RENAULT_MODEL}
      theme={RENAULT_THEME}
      viewData={RENAULT_VIEWS}
    />
  );
}
