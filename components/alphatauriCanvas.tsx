"use client";
import BaseTeamCanvas, { ViewKey, ViewConfig } from "./baseTeamCanvas";

const ALPHATAURI_MODEL = {
  modelPath: "../models/alphatauri",
  lightColor: 0xdde8ff,
  lightIntensity: 3.9,
  ambientLightColor: 0xffffff,
  ambientIntensity: 0.88,
};

const ALPHATAURI_THEME = {
  sectionBackground:
    "linear-gradient(180deg, #07101F 0%, #142235 55%, #020713 100%)",
  cinematicBar: "#F3F7FF",
  backgroundTitleColor: "rgba(243, 247, 255, 0.25)",
  viewTitleColor: "#F3F7FF",
  mainText: "#F3F7FF",
  line: "#F3F7FF",
  buttonActiveBg: "#F3F7FF",
  buttonActiveText: "#07101F",
  buttonActiveBorder: "#F3F7FF",
  buttonIdleBg: "rgba(243, 247, 255, 0.08)",
  buttonIdleText: "#F3F7FF",
  buttonIdleBorder: "rgba(243, 247, 255, 0.42)",
};

const ALPHATAURI_VIEWS: Record<ViewKey, ViewConfig> = {
  side: {
    title: "ALPHATAURI",
    subtitle: "Scuderia AlphaTauri Honda",
    titleColor: "rgba(243, 247, 255, 0.25)",
    subtitleUseTitleColor: false,
    labelLeft: "FASHION MEETS SPEED",
    labelRight: "FAENZA, ITALY",
    showLine: true,
    titleLayer: "behind-car",
    leftLabelClass: "absolute top-[14vh] left-[5vw] overflow-hidden pb-2 pr-4",
    rightLabelClass:
      "absolute top-[14vh] right-[5vw] overflow-hidden pb-2 pr-4",
    titleContainerClass:
      "absolute inset-0 flex flex-col items-center justify-center font-akira",
    titleClass: "font-black uppercase tracking-wide leading-none text-[10vw]",
    textEffect: "blink-slide",
    exitAnim: { y: 220, duration: 0.5, stagger: 0.08, ease: "power2.inOut" },
    canvasShift: "0vw",
  },
  front: {
    title: "AT01",
    subtitle: "Blue Strike",
    titleColor: "#F3F7FF",
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
    title: '"PRECISION TURNS SPEED INTO STYLE."',
    subtitle: "PIERRE GASLY",
    titleColor: "#F3F7FF",
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

export default function AlphaTauriCanvas() {
  return (
    <BaseTeamCanvas
      model={ALPHATAURI_MODEL}
      theme={ALPHATAURI_THEME}
      viewData={ALPHATAURI_VIEWS}
    />
  );
}
