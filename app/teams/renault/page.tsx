"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for Renault
const RenaultScene = dynamic(() => import("../../../components/renaultCanvas"), {
  ssr: false,
});

// 2. Define the exact text, colors, and images for Renault
const RENAULT_DATA: TeamPageData = {
  teamName: "RENAULT DP WORLD F1 TEAM",
  carName: "R.S.20",
  season: "2020",
  logoSrc: "/logos/renault.svg",
  logoAlt: "Renault logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#111006",
    surface: "#FFFFFF",
    text: "#FFFBE0",
    mutedText: "#C8BF6A",
    accent: "#FFF500",
    accentDark: "#B8B000",
    footerAccent: "#4A4700",
    storyBefore: "rgba(255, 245, 0, 0.18)",
    storyAfter: "#FFF7D1",
  },
  images: {
    heroCar: "/images/renault/anh-xe.webp",
    primaryDriverBackground: "/images/renault/pdb.webp",
    primaryDriverPortrait: "/images/renault/pdp.webp",
    secondaryDriverPortrait: "/images/renault/sdp.webp",
    highlightThumbnail: "/images/renault/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "Renault / 2020",
      src: "/images/renault/renault-1.webp",
      alt: "Renault archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "R.S.20 Detail",
      src: "/images/renault/renault-2.webp",
      alt: "Renault archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "h-[64vh]",
    },
    {
      label: "Chassis",
      src: "/images/renault/renault-3.webp",
      alt: "Renault archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "h-[34vh]",
    },
    {
      label: "Race Frame",
      src: "/images/renault/renault-4.webp",
      alt: "Renault archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "h-[44vh]",
    },
    {
      label: "Renault Detail",
      src: "/images/renault/renault-5.webp",
      alt: "Renault archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/renault/renault-6.webp",
      alt: "Renault archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "h-[36vh]",
    },
  ],
  storyText:
    "Renault made significant strides in 2020, with Daniel Ricciardo securing the team's first podiums since their return as a full works team. The R.S.20 was particularly strong on low-downforce tracks like Spa and Monza. This season served as a \"final hurrah\" for the Renault name before rebranding to Alpine for 2021.",
  primaryDriver: {
    name: "Daniel Ricciardo",
    videoUrl: "https://www.youtube.com/results?search_query=Daniel+Ricciardo+Renault+2020+highlights",
    videoLabel: "WATCH RICCIARDO'S 2020 HIGHLIGHTS",
    description:
      "Led Renault's strongest performances of the season with sharp racecraft and consistent points finishes. His podiums marked Renault's return to the front of the midfield battle.",
  },
  secondaryDriver: {
    name: "Esteban Ocon",
    description:
      "Returned to Formula 1 after a year away and steadily rebuilt his rhythm. His late-season podium in Bahrain showed his improving confidence and value to Renault.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "62"],
      ["Best Finish", "P2"],
      ["Wins", "0"],
      ["Podiums", "1"],
      ["Poles", "0"],
      ["Standings", "12th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl: "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "5th", ""],
      ["Total Points", "181", ""],
      ["Best Finish", "P2", "(Ocon at Sakhir)"],
      ["Key Moment", "Return to Podiums", "(Ricciardo and Ocon delivered)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function RenaultPage() {
  return <BaseTeamPage data={RENAULT_DATA} SceneComponent={RenaultScene} />;
}