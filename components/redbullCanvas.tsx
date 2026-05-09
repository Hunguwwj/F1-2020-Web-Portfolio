"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const REDBULL_MODEL = {
  modelPath: "../models/redbull",
  lightColor: 0xe8ecff,
  lightIntensity: 4.1,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.88,
};

const REDBULL_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #050816 0%, #070B1A 55%, #02040D 100%)",
  cinematicBar: "#FFCC00",
  backgroundTitleColor: "rgba(255, 204, 0, 0.24)",
  viewTitleColor: "#FFCC00",
  mainText: "#FFCC00",
  line: "#FFCC00",
  buttonActiveBg: "#FFCC00",
  buttonActiveText: "#070B1A",
  buttonActiveBorder: "#FFCC00",
  buttonIdleBg: "rgba(255, 204, 0, 0.08)",
  buttonIdleText: "#FFCC00",
  buttonIdleBorder: "rgba(255, 204, 0, 0.45)",
};

const REDBULL_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "REDBULL",
    subtitle: "Aston Martin Red Bull Racing",
    titleColor: "rgba(255, 204, 0, 0.24)",
    subtitleUseTitleColor: false,
    labelLeft: "BUILT TO ATTACK",
    labelRight: "MILTON KEYNES, UK",
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
    title: "RB16",
    subtitle: "Charging Bull",
    titleColor: "#FFCC00",
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
    title: '"PUSH THE LIMIT, THEN PUSH AGAIN."',
    subtitle: "MAX VERSTAPPEN",
    titleColor: "#FFCC00",
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

export default function RedBullCanvas() {
  return (
    <BaseTeamCanvas
      model={REDBULL_MODEL}
      theme={REDBULL_THEME}
      viewData={REDBULL_VIEWS}
    />
  );
}
