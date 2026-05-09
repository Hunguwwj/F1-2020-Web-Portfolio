"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const FERRARI_MODEL = {
  modelPath: "../models/ferrari",
  lightColor: 0xffb3ad,
  lightIntensity: 4.3,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.92,
};

const FERRARI_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #E10600 0%, #C90000 52%, #7A0000 100%)",
  cinematicBar: "#FFFFFF",
  backgroundTitleColor: "rgba(255, 235, 235, 0.36)",
  viewTitleColor: "#FFFFFF",
  mainText: "#FFFFFF",
  line: "#FFFFFF",
  buttonActiveBg: "#FFFFFF",
  buttonActiveText: "#111111",
  buttonActiveBorder: "#FFFFFF",
  buttonIdleBg: "rgba(255, 255, 255, 0.08)",
  buttonIdleText: "#FFFFFF",
  buttonIdleBorder: "rgba(255, 255, 255, 0.42)",
};

const FERRARI_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "FERRARI",
    subtitle: "SCUDERIA FERRARI",
    titleColor: "rgba(255, 235, 235, 0.36)",
    subtitleUseTitleColor: false,
    labelLeft: "LEGACY SINCE 1929",
    labelRight: "MARANELLO, ITALY",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass: "font-black uppercase tracking-wide leading-none text-[15vw]",
    textEffect: "blink-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "0vw",
  },
  front: {
    title: "SF1000",
    subtitle: "Scarlet Legacy",
    titleColor: "#FFFFFF",
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
    title: '"RACING IS IN OUR BLOOD."',
    subtitle: "ENZO FERRARI",
    titleColor: "#FFFFFF",
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

export default function FerrariCanvas() {
  return (
    <BaseTeamCanvas
      model={FERRARI_MODEL}
      theme={FERRARI_THEME}
      viewData={FERRARI_VIEWS}
    />
  );
}
