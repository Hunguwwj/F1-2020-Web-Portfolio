"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Mercedes
const MercedesScene = dynamic(
  () => import("../../../components/mercedesCanvas"),
  {
    ssr: false,
  },
);

// 2. Define the exact text, colors, and images for Mercedes
const MERCEDES_DATA: TeamPageData = {
  teamName: "F1 W11 EQ PERFORMANCE",
  carName: "W11",
  season: "2020",
  logoSrc: "/logos/mercedes.svg",
  logoAlt: "Mercedes logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#071C1C",
    surface: "#F3FFFD",
    text: "#F3FFFD",
    mutedText: "#A7C8C4",
    accent: "#00D2BE",
    accentDark: "#00897F",
    footerAccent: "#003B37",
    storyBefore: "rgba(0, 210, 190, 0.18)",
    storyAfter: "#F3FFFD",
  },
  images: {
    heroCar: "/images/mercedes/anh-xe.webp",
    primaryDriverBackground: "/images/mercedes/pdb.webp",
    primaryDriverPortrait: "/images/mercedes/pdp.webp",
    secondaryDriverPortrait: "/images/mercedes/sdp.webp",
    highlightThumbnail: "/images/mercedes/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Mercedes / 2020",
      src: "/images/mercedes/mercedes-1.webp",
      alt: "Mercedes archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/10]",
    },
    {
      label: "W11 Detail",
      src: "/images/mercedes/mercedes-2.webp",
      alt: "W11 detail",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Chassis",
      src: "/images/mercedes/mercedes-3.webp",
      alt: "Chassis detail",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Race Frame",
      src: "/images/mercedes/mercedes-4.webp",
      alt: "Race frame",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    {
      label: "Mercedes Detail",
      src: "/images/mercedes/mercedes-5.webp",
      alt: "Aero detail",
      cardClassName: "mt-[-5vh] w-[23vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    {
      label: "Engine Era",
      src: "/images/mercedes/mercedes-6.webp",
      alt: "Engine cover",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "aspect-square",
    },
  ],
  storyText:
    "The W11 is widely regarded as one of the greatest racing cars ever built. Mercedes introduced the DAS (Dual-Axis Steering) system during winter testing, a revolutionary innovation that allowed drivers to adjust the toe-in of the front wheels. Throughout the season, the \"Black Arrows\" (re-liveried from Silver to support the fight against racism) were nearly untouchable, securing Mercedes' 7th consecutive Constructors' Championship.",
  primaryDriver: {
    name: "Lewis Hamilton",
    videoUrl:
      "https://www.youtube.com/results?search_query=Lewis+Hamilton+2020+F1+highlights",
    videoLabel: "WATCH HAMILTON'S 2020 HIGHLIGHTS",
    description:
      "Dominated the 2020 season with exceptional consistency, race pace, and tyre management. He secured his seventh World Championship and became the benchmark driver of the turbo-hybrid era.",
  },
  secondaryDriver: {
    name: "Valtteri Bottas",
    description:
      "Delivered strong qualifying performances and helped Mercedes control the Constructors' Championship. His speed over one lap and reliable points finishes made him a key part of the W11's dominance.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "223"],
      ["Best Finish", "P1"],
      ["Wins", "2"],
      ["Podiums", "11"],
      ["Poles", "5"],
      ["Standings", "2nd"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl:
      "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "1st", ""],
      ["Total Points", "573", ""],
      ["Wins", "13", ""],
      ["Key Moment", "7th Title", "(Hamilton + Mercedes dominance)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function MercedesPage() {
  return <BaseTeamPage data={MERCEDES_DATA} SceneComponent={MercedesScene} />;
}
