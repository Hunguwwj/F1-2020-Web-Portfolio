"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Racing Point
const RacingPointScene = dynamic(() => import("../../../components/racingpointCanvas"), {
  ssr: false,
});

// 2. Define the exact text, colors, and images for Racing Point
const RACINGPOINT_DATA: TeamPageData = {
  teamName: "BWT RACING POINT F1 TEAM",
  carName: "RP20",
  season: "2020",
  logoSrc: "/logos/racingpoint.svg",
  logoAlt: "Racing Point logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#111111",
    surface: "#FFFFFF",
    text: "#FFFFFF",
    mutedText: "#7A4B62",
    accent: "#F596C8",
    accentDark: "#B84C82",
    footerAccent: "#7A2E55",
    storyBefore: "rgba(245, 150, 200, 0.18)",
    storyAfter: "#FFFFFF",
  },
  images: {
    heroCar: "/images/racingpoint/anh-xe.webp",
    primaryDriverBackground: "/images/racingpoint/pdb.webp",
    primaryDriverPortrait: "/images/racingpoint/pdp.webp",
    secondaryDriverPortrait: "/images/racingpoint/sdp.webp",
    highlightThumbnail: "/images/racingpoint/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Racing Point / 2020",
      src: "/images/racingpoint/racingpoint-1.webp",
      alt: "Racing Point archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "RP20 Detail",
      src: "/images/racingpoint/racingpoint-2.webp",
      alt: "Racing Point archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "h-[64vh]",
    },
    {
      label: "Chassis",
      src: "/images/racingpoint/racingpoint-3.webp",
      alt: "Racing Point archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "h-[34vh]",
    },
    {
      label: "Race Frame",
      src: "/images/racingpoint/racingpoint-4.webp",
      alt: "Racing Point archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "h-[44vh]",
    },
    {
      label: "Racing Point Detail",
      src: "/images/racingpoint/racingpoint-5.webp",
      alt: "Racing Point archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/racingpoint/racingpoint-6.webp",
      alt: "Racing Point archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "h-[36vh]",
    },
  ],
  storyText:
    "This was perhaps the most controversial team of the year. The RP20 was nicknamed the \"Pink Mercedes\" because its design closely followed the 2019 Mercedes W10. Despite a points deduction following a protest by Renault regarding their brake ducts, the team was incredibly fast. Sergio Perez delivered a fairytale maiden win at the Sakhir Grand Prix, coming from last place on the first lap.",
  primaryDriver: {
    name: "Sergio Pérez",
    videoUrl: "https://www.youtube.com/results?search_query=Sergio+Perez+Sakhir+2020+highlights",
    videoLabel: "WATCH PÉREZ'S 2020 HIGHLIGHTS",
    description:
      "Produced one of the best seasons of his career, combining tyre management, race intelligence, and calm execution. His victory at the Sakhir Grand Prix became one of the standout moments of 2020.",
  },
  secondaryDriver: {
    name: "Lance Stroll",
    description:
      "Delivered strong performances in a competitive RP20, including podium finishes and a pole position in Turkey. His pace in mixed conditions showed clear progress during the season.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "75"],
      ["Best Finish", "P3"],
      ["Wins", "0"],
      ["Podiums", "2"],
      ["Poles", "1"],
      ["Standings", "11th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl: "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "4th", ""],
      ["Total Points", "195", ""],
      ["Wins", "1", "(Pérez at Sakhir)"],
      ["Key Moment", "Pink Mercedes", "(One of 2020's fastest midfield cars)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function RacingPointPage() {
  return <BaseTeamPage data={RACINGPOINT_DATA} SceneComponent={RacingPointScene} />;
}