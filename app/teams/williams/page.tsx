"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Williams
const WilliamsScene = dynamic(() => import("../../../components/williamsCanvas"), {
  ssr: false,
});

// 2. Define the exact text, colors, and images for Williams
const WILLIAMS_DATA: TeamPageData = {
  teamName: "WILLIAMS RACING",
  carName: "FW43",
  season: "2020",
  logoSrc: "/logos/williams.svg",
  logoAlt: "Williams logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#061524",
    surface: "#F3FAFF",
    text: "#F3FAFF",
    mutedText: "#98B7C8",
    accent: "#00A3E0",
    accentDark: "#005A7A",
    footerAccent: "#003049",
    storyBefore: "rgba(0, 163, 224, 0.20)",
    storyAfter: "#F3FAFF",
  },
  images: {
    heroCar: "/images/williams/anh-xe.webp",
    primaryDriverBackground: "/images/williams/pdb.webp",
    primaryDriverPortrait: "/images/williams/pdp.webp",
    secondaryDriverPortrait: "/images/williams/sdp.webp",
    highlightThumbnail: "/images/williams/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Williams / 2020",
      src: "/images/williams/williams-1.webp",
      alt: "Williams archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "FW43 Detail",
      src: "/images/williams/williams-2.webp",
      alt: "Williams archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Chassis",
      src: "/images/williams/williams-3.webp",
      alt: "Williams archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "h-[34vh]",
    },
    {
      label: "Race Frame",
      src: "/images/williams/williams-4.webp",
      alt: "Williams archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Williams Detail",
      src: "/images/williams/williams-5.webp",
      alt: "Williams archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/williams/williams-6.webp",
      alt: "Williams archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
  ],
  storyText:
    "A year of monumental change. After decades of family ownership, the team was sold to Dorilton Capital in August 2020. While they remained at the bottom of the table, the FW43 was a clear step up from its predecessor. George Russell frequently dragged the car into Q2 in qualifying, earning the nickname \"Mr. Saturday.\"",
  primaryDriver: {
    name: "George Russell",
    videoUrl: "https://www.youtube.com/results?search_query=George+Russell+Williams+2020+highlights",
    videoLabel: "WATCH RUSSELL'S 2020 HIGHLIGHTS",
    description:
      "Consistently delivered outstanding qualifying laps and pushed the FW43 beyond expectations. His one-off Mercedes drive in Sakhir further highlighted his potential as a future front-runner.",
  },
  secondaryDriver: {
    name: "Nicholas Latifi",
    description:
      "Completed his rookie Formula 1 season with steady development and important mileage for Williams. His focus was consistency and learning in a car still fighting at the back.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "0"],
      ["Best Finish", "P11"],
      ["Wins", "0"],
      ["Podiums", "0"],
      ["Poles", "0"],
      ["Standings", "21st"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl: "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "10th", ""],
      ["Total Points", "0", ""],
      ["Best Finish", "P11", ""],
      ["Key Moment", "Russell's Pace", "(Qualifying performances stood out)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function WilliamsPage() {
  return <BaseTeamPage data={WILLIAMS_DATA} SceneComponent={WilliamsScene} />;
}