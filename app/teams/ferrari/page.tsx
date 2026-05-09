"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Ferrari
const FerrariScene = dynamic(
  () => import("../../../components/ferrariCanvas"),
  {
    ssr: false,
  },
);

// 2. Define the exact text, colors, and images for Ferrari
const FERRARI_DATA: TeamPageData = {
  teamName: "SCUDERIA FERRARI",
  carName: "SF1000",
  season: "2020",
  logoSrc: "/logos/ferrari.svg",
  logoAlt: "Ferrari logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#F8F3EF",
    surface: "#FFFFFF",
    text: "#111111",
    mutedText: "#4B5563",
    accent: "#E10600",
    accentDark: "#8B0000",
    footerAccent: "#A30000",
    storyBefore: "rgba(225, 6, 0, 0.16)",
    storyAfter: "#E10600",
  },
  images: {
    heroCar: "/images/ferrari/anh-xe.webp",
    primaryDriverBackground: "/images/ferrari/pdb.webp",
    primaryDriverPortrait: "/images/ferrari/pdp.webp",
    secondaryDriverPortrait: "/images/ferrari/sdp.webp",
    highlightThumbnail: "/images/ferrari/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Ferrari / 2020",
      src: "/images/ferrari/ferrari-1.webp",
      alt: "Ferrari archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-square",
    },
    {
      label: "SF1000 Detail",
      src: "/images/ferrari/ferrari-2.webp",
      alt: "Ferrari archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    {
      label: "Chassis",
      src: "/images/ferrari/ferrari-3.webp",
      alt: "Ferrari archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Race Frame",
      src: "/images/ferrari/ferrari-4.webp",
      alt: "Ferrari archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "aspect-[2/2]",
    },
    {
      label: "Ferrari Detail",
      src: "/images/ferrari/ferrari-5.webp",
      alt: "Ferrari archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/ferrari/ferrari-6.webp",
      alt: "Ferrari archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
  ],
  storyText:
    'A historically difficult year for the Prancing Horse. The SF1000 (named to celebrate Ferrari\'s 1000th Grand Prix) suffered from a lack of straight-line speed following a private settlement with the FIA regarding their 2019 engine. Ferrari slumped to 6th in the standings, their worst finish in 40 years, though Charles Leclerc’s "over-driving" of the car provided a few rare highlights.',
  primaryDriver: {
    name: "Charles Leclerc",
    videoUrl: "https://www.youtube.com/watch?v=BWddke3GJKQ",
    videoLabel: "WATCH LECLERC'S 2020 HIGHLIGHTS",
    description:
      "Consistently overperformed in a difficult SF1000, extracting results beyond the car's expected pace. His podiums and aggressive but controlled driving made him Ferrari's clear benchmark in 2020.",
  },
  secondaryDriver: {
    name: "Sebastian Vettel",
    description:
      "Endured a challenging final season with Ferrari but still delivered a memorable podium in Turkey. His experience and race knowledge remained valuable during a difficult campaign for the team.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "33"],
      ["Best Finish", "P3"],
      ["Wins", "0"],
      ["Podiums", "1"],
      ["Poles", "0"],
      ["Standings", "13th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl:
      "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "6th", ""],
      ["Total Points", "131", ""],
      ["Best Finish", "P2", "(Leclerc at Austria)"],
      ["Key Moment", "1000th GP", "(Ferrari's milestone season)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function FerrariPage() {
  return <BaseTeamPage data={FERRARI_DATA} SceneComponent={FerrariScene} />;
}
