"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const HAAS_MODEL = {
  modelPath: "../models/haas",
  lightColor: 0xffffff,
  lightIntensity: 3.8,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.9,
};

const HAAS_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #F4F4F4 0%, #FFFFFF 48%, #CFCFCF 100%)",
  cinematicBar: "#C8102E",
  backgroundTitleColor: "rgba(200, 16, 46, 0.22)",
  viewTitleColor: "#C8102E",
  mainText: "#C8102E",
  line: "#C8102E",
  buttonActiveBg: "#C8102E",
  buttonActiveText: "#FFFFFF",
  buttonActiveBorder: "#C8102E",
  buttonIdleBg: "rgba(255, 255, 255, 0.72)",
  buttonIdleText: "#111111",
  buttonIdleBorder: "rgba(200, 16, 46, 0.45)",
};

const HAAS_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "HAAS",
    subtitle: "Haas F1 Team",
    titleColor: "rgba(200, 16, 46, 0.22)",
    subtitleUseTitleColor: false,
    labelLeft: "AMERICAN OUTSIDER",
    labelRight: "KANNAPOLIS, USA",
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
    title: "VF-20",
    subtitle: "Silver Grit",
    titleColor: "#C8102E",
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
    title: '"WE KEEP FIGHTING, EVEN WHEN IT GETS MESSY."',
    subtitle: "GUENTHER STEINER",
    titleColor: "#C8102E",
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

export default function HaasCanvas() {
  return (
    <BaseTeamCanvas
      model={HAAS_MODEL}
      theme={HAAS_THEME}
      viewData={HAAS_VIEWS}
    />
  );
}
