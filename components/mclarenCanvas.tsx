"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const MCLAREN_MODEL = {
  modelPath: "../models/mclaren",
  lightColor: 0xffc27a,
  lightIntensity: 4.2,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.9,
};

const MCLAREN_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #FF8700 0%, #E46F00 52%, #4A2500 100%)",
  cinematicBar: "#101010",
  backgroundTitleColor: "rgba(255, 246, 232, 0.32)",
  viewTitleColor: "#FFFFFF",
  mainText: "#FFFFFF",
  line: "#FFFFFF",
  buttonActiveBg: "#101010",
  buttonActiveText: "#FFFFFF",
  buttonActiveBorder: "#101010",
  buttonIdleBg: "rgba(255, 255, 255, 0.12)",
  buttonIdleText: "#FFFFFF",
  buttonIdleBorder: "rgba(255, 255, 255, 0.45)",
};

const MCLAREN_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "MCLAREN",
    subtitle: "McLaren F1 Team",
    titleColor: "rgba(255, 246, 232, 0.32)",
    subtitleUseTitleColor: false,
    labelLeft: "PAPAYA RACING",
    labelRight: "WOKING, UNITED KINGDOM",
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
    title: "MCL35",
    subtitle: "Papaya Surge",
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
    title: '"LIFE IS MEASURED IN ACHIEVEMENT, NOT IN YEARS ALONE."',
    subtitle: "BRUCE MCLAREN",
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

export default function MclarenCanvas() {
  return (
    <BaseTeamCanvas
      model={MCLAREN_MODEL}
      theme={MCLAREN_THEME}
      viewData={MCLAREN_VIEWS}
    />
  );
}
