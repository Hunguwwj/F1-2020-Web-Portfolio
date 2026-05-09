"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for McLaren
const MclarenScene = dynamic(
  () => import("../../../components/mclarenCanvas"),
  {
    ssr: false,
  },
);

// 2. Define the exact text, colors, and images for McLaren
const MCLAREN_DATA: TeamPageData = {
  teamName: "MCLAREN F1 TEAM",
  carName: "MCL35",
  season: "2020",
  logoSrc: "/logos/mclaren.svg",
  logoAlt: "McLaren logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#120D08",
    surface: "#FFF6E8",
    text: "#FFF6E8",
    mutedText: "#D8B38C",
    accent: "#FF8700",
    accentDark: "#B85F00",
    footerAccent: "#3A2207",
    storyBefore: "rgba(255, 135, 0, 0.18)",
    storyAfter: "#FFF6E8",
  },
  images: {
    heroCar: "/images/mclaren/anh-xe.webp",
    primaryDriverBackground: "/images/mclaren/pdb.webp",
    primaryDriverPortrait: "/images/mclaren/pdp.webp",
    secondaryDriverPortrait: "/images/mclaren/sdp.webp",
    highlightThumbnail: "/images/mclaren/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "McLaren / 2020",
      src: "/images/mclaren/mclaren-1.webp",
      alt: "McLaren archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "MCL35 Detail",
      src: "/images/mclaren/mclaren-2.webp",
      alt: "McLaren archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "h-[64vh]",
    },
    {
      label: "Chassis",
      src: "/images/mclaren/mclaren-3.webp",
      alt: "McLaren archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "h-[34vh]",
    },
    {
      label: "Race Frame",
      src: "/images/mclaren/mclaren-4.webp",
      alt: "McLaren archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "h-[44vh]",
    },
    {
      label: "McLaren Detail",
      src: "/images/mclaren/mclaren-5.webp",
      alt: "McLaren archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[70vh]",
    },
    {
      label: "Engine Era",
      src: "/images/mclaren/mclaren-6.webp",
      alt: "McLaren archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "h-[36vh]",
    },
  ],
  storyText:
    '2020 marked a "Renaissance" for the Woking-based team. After years of struggling, McLaren moved up to 3rd in the Constructors\' Championship—their best result since 2012. The team was famous for the "bromance" between Sainz and Norris, which brought a positive atmosphere. Technically, the MCL35 was very efficient on high-speed circuits, consistently leading the intense midfield battle.',
  primaryDriver: {
    name: "Carlos Sainz Jr.",
    videoUrl:
      "https://www.youtube.com/results?search_query=carlos+sainz+first+win",
    videoLabel: "WATCH SAINZ'S 2020 HIGHLIGHTS",
    description:
      "Led McLaren with composed racecraft and strong late-season form. His podium at Monza and consistent scoring helped McLaren finish third in the Constructors' Championship.",
  },
  secondaryDriver: {
    name: "Lando Norris",
    description:
      "Showed major growth in 2020 with stronger race pace, sharper consistency, and his first Formula 1 podium. His energy and performance became a key part of McLaren's resurgence.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "97"],
      ["Best Finish", "P3"],
      ["Wins", "0"],
      ["Podiums", "1"],
      ["Poles", "0"],
      ["Standings", "9th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl:
      "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "3rd", ""],
      ["Total Points", "202", ""],
      ["Best Finish", "P2", "(Sainz at Monza)"],
      ["Key Moment", "Midfield P3", "(McLaren's big comeback year)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function MclarenPage() {
  return <BaseTeamPage data={MCLAREN_DATA} SceneComponent={MclarenScene} />;
}
