"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for this team
const AlfaRomeoScene = dynamic(
  () => import("../../../components/alfaromeoCanvas"),
  {
    ssr: false,
  },
);

// 2. Define the exact text, colors, and images for this team
const ALFA_DATA: TeamPageData = {
  teamName: "ALFA ROMEO RACING ORLEN",
  carName: "C39",
  season: "2020",
  logoSrc: "/logos/alfaromeo.svg",
  logoAlt: "Alfa Romeo logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#130508",
    surface: "#FFF4F4",
    text: "#FFF4F4",
    mutedText: "#C19AA1",
    accent: "#900000",
    accentDark: "#5A0000",
    footerAccent: "#2A0205",
    storyBefore: "rgba(144, 0, 0, 0.18)",
    storyAfter: "#FFF4F4",
  },
  images: {
    heroCar: "/images/alfaromeo/anh-xe.webp",
    primaryDriverBackground: "/images/alfaromeo/pdb.webp",
    primaryDriverPortrait: "/images/alfaromeo/pdp.webp",
    secondaryDriverPortrait: "/images/alfaromeo/sdp.webp",
    highlightThumbnail: "/images/alfaromeo/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Alfa Romeo / 2020",
      src: "/images/alfaromeo/alfaromeo-1.webp",
      alt: "C39",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "C39 Detail",
      src: "/images/alfaromeo/alfaromeo-2.webp",
      alt: "Detail",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[4/3]",
    },
    // ... add the rest of your gallery images
  ],
  storyText:
    "Alfa Romeo spent most of 2020 fighting at the back of the grid. Like Haas, their performance was severely hindered by the underpowered Ferrari engine. However, the team relied on the immense experience of Kimi Räikkönen—who broke the record for the most race starts in F1 history during the Eifel Grand Prix—to salvage points in chaotic races.",
  primaryDriver: {
    name: "Kimi Räikkönen",
    videoUrl:
      "https://www.youtube.com/results?search_query=Kimi+Raikkonen+2020+Alfa+Romeo+highlights",
    videoLabel: "WATCH RÄIKKÖNEN'S 2020 HIGHLIGHTS",
    description:
      "Brought immense experience to Alfa Romeo during a difficult season with limited performance. His racecraft, starts, and consistency helped the team fight for rare points opportunities.",
  },
  secondaryDriver: {
    name: "Antonio Giovinazzi",
    description:
      "Showed improved confidence and race starts in his second full season with Alfa Romeo. He supported the team with steady performances in a challenging C39.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "4"],
      ["Best Finish", "P9"],
      ["Standings", "17th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl: "https://youtu.be/2femix89pTE?si=gjKmeIRc-Qh_JVA1",
    videoLabel: "WATCH RÄIKKÖNEN'S RECORD MOMENT",
    items: [
      ["Constructors", "8th", ""],
      ["Total Points", "8", ""],
      ["Key Moment", "Kimi Record", "(323rd F1 start)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function AlfaRomeoPage() {
  return <BaseTeamPage data={ALFA_DATA} SceneComponent={AlfaRomeoScene} />;
}
