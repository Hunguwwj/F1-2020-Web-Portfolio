"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Haas
const HaasScene = dynamic(() => import("../../../components/haasCanvas"), {
  ssr: false,
});

// 2. Define the exact text, colors, and images for Haas
const HAAS_DATA: TeamPageData = {
  teamName: "HAAS F1 TEAM",
  carName: "VF-20",
  season: "2020",
  logoSrc: "/logos/haas.svg",
  logoAlt: "Haas logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#F4F4F4",
    surface: "#FFFFFF",
    text: "#111111",
    mutedText: "#555555",
    accent: "#C8102E",
    accentDark: "#8F0B22",
    footerAccent: "#2A2A2A",
    storyBefore: "rgba(200, 16, 46, 0.16)",
    storyAfter: "#111111",
  },
  images: {
    heroCar: "/images/haas/anh-xe.webp",
    primaryDriverBackground: "/images/haas/pdb.webp",
    primaryDriverPortrait: "/images/haas/pdp.webp",
    secondaryDriverPortrait: "/images/haas/sdp.webp",
    highlightThumbnail: "/images/haas/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Haas / 2020",
      src: "/images/haas/haas-1.webp",
      alt: "Haas archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/10]",
    },
    {
      label: "VF-20 Detail",
      src: "/images/haas/haas-2.webp",
      alt: "Haas archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Chassis",
      src: "/images/haas/haas-3.webp",
      alt: "Haas archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Race Frame",
      src: "/images/haas/haas-4.webp",
      alt: "Haas archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    {
      label: "Haas Detail",
      src: "/images/haas/haas-5.webp",
      alt: "Haas archive 5",
      cardClassName: "mt-[-5vh] w-[23vw]",
      imageBoxClassName: "aspect-[2/2]",
    },
    {
      label: "Engine Era",
      src: "/images/haas/haas-6.webp",
      alt: "Haas archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "aspect-square",
    },
  ],
  storyText:
    "It was a survival year for Haas. The team opted not to develop the car significantly due to financial constraints and the pandemic. The season was overshadowed by Romain Grosjean’s horrific crash in Bahrain, where he miraculously survived a fiery impact. This event led to the team fielding reserve driver Pietro Fittipaldi for the final two rounds.",
  primaryDriver: {
    name: "Kevin Magnussen",
    videoUrl:
      "https://www.youtube.com/results?search_query=Kevin+Magnussen+Haas+2020+highlights",
    videoLabel: "WATCH MAGNUSSEN'S 2020 HIGHLIGHTS",
    description:
      "Fought hard in an uncompetitive VF-20 and maximized limited chances when chaos opened opportunities. His aggressive style remained one of Haas's strongest weapons.",
  },
  secondaryDriver: {
    name: "Romain Grosjean",
    description:
      "Faced a difficult final season with Haas but remained experienced and committed. His dramatic Bahrain accident became one of the most unforgettable moments of the 2020 season.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "2"],
      ["Best Finish", "P9"],
      ["Wins", "0"],
      ["Podiums", "0"],
      ["Poles", "0"],
      ["Standings", "19th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl:
      "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "9th", ""],
      ["Total Points", "3", ""],
      ["Best Finish", "P9", "(Grosjean at Eifel)"],
      [
        "Key Moment",
        "Bahrain Escape",
        "(Grosjean's survival became unforgettable)",
      ],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function HaasPage() {
  return <BaseTeamPage data={HAAS_DATA} SceneComponent={HaasScene} />;
}
