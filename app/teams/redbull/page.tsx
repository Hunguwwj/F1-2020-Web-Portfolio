"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Red Bull
const RedBullScene = dynamic(() => import("../../../components/redbullCanvas"), {
  ssr: false,
});

// 2. Define the exact text, colors, and images for Red Bull
const REDBULL_DATA: TeamPageData = {
  teamName: "ASTON MARTIN RED BULL RACING",
  carName: "RB16",
  season: "2020",
  logoSrc: "/logos/redbull.svg",
  logoAlt: "Red Bull logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#070B1A",
    surface: "#F4F6FF",
    text: "#F4F6FF",
    mutedText: "#AAB4D6",
    accent: "#1E41FF",
    accentDark: "#0B1E78",
    footerAccent: "#050A2A",
    storyBefore: "rgba(30, 65, 255, 0.18)",
    storyAfter: "#F4F6FF",
  },
  images: {
    heroCar: "/images/redbull/anh-xe.webp",
    primaryDriverBackground: "/images/redbull/pdb.webp",
    primaryDriverPortrait: "/images/redbull/pdp.webp",
    secondaryDriverPortrait: "/images/redbull/sdp.webp",
    highlightThumbnail: "/images/redbull/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Red Bull / 2020",
      src: "/images/redbull/redbull-1.webp",
      alt: "Red Bull archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/10]",
    },
    {
      label: "RB16 Detail",
      src: "/images/redbull/redbull-2.webp",
      alt: "Red Bull archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Chassis",
      src: "/images/redbull/redbull-3.webp",
      alt: "Red Bull archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Race Frame",
      src: "/images/redbull/redbull-4.webp",
      alt: "Red Bull archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    {
      label: "Red Bull Detail",
      src: "/images/redbull/redbull-5.webp",
      alt: "Red Bull archive 5",
      cardClassName: "mt-[-5vh] w-[23vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Engine Era",
      src: "/images/redbull/redbull-6.webp",
      alt: "Red Bull archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "aspect-square",
    },
  ],
  storyText:
    "Red Bull remained the primary threat to Mercedes' dominance. The RB16 was notoriously difficult to drive due to its sensitive aerodynamics, but Max Verstappen managed to extract incredible performance from it, securing multiple wins. This was a crucial year for their partnership with Honda, showing significant engine reliability and power improvements before the Japanese manufacturer's announced departure.",
  primaryDriver: {
    name: "Max Verstappen",
    videoUrl: "https://www.youtube.com/results?search_query=Max+Verstappen+2020+F1+highlights",
    videoLabel: "WATCH VERSTAPPEN'S 2020 HIGHLIGHTS",
    description:
      "Extracted maximum performance from the RB16 and consistently challenged Mercedes whenever possible. His aggressive racecraft, tyre control, and Abu Dhabi victory made him Red Bull's standout performer in 2020.",
  },
  secondaryDriver: {
    name: "Alexander Albon",
    description:
      "Faced a difficult season adapting to the RB16 but still delivered important points and podium finishes. His role helped Red Bull secure second place in the Constructors' Championship.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "105"],
      ["Best Finish", "P3"],
      ["Wins", "0"],
      ["Podiums", "2"],
      ["Poles", "0"],
      ["Standings", "7th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl: "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "2nd", ""],
      ["Total Points", "319", ""],
      ["Wins", "2", ""],
      ["Key Moment", "Abu Dhabi Win", "(Verstappen controlled the finale)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function RedBullPage() {
  return <BaseTeamPage data={REDBULL_DATA} SceneComponent={RedBullScene} />;
}