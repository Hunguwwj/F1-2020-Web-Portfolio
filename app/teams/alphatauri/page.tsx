"use client";

import dynamic from "next/dynamic";
import BaseTeamPage, { TeamPageData } from "../../../components/baseTeamPage";

// 1. Dynamically import the specific WebGPU Canvas for AlphaTauri
const AlphaTauriScene = dynamic(
  () => import("../../../components/alphatauriCanvas"),
  {
    ssr: false,
  },
);

// 2. Define the exact text, colors, and images for AlphaTauri
const ALPHATAURI_DATA: TeamPageData = {
  teamName: "SCUDERIA ALPHATAURI HONDA",
  carName: "AT01",
  season: "2020",
  logoSrc: "/logos/alphatauri.svg",
  logoAlt: "AlphaTauri logo",
  storyLabelLeft: "The Story",
  theme: {
    pageBackground: "#07101F",
    surface: "#F3F7FF",
    text: "#F3F7FF",
    mutedText: "#A8B7C9",
    accent: "#3a5e87",
    accentDark: "#0f1a2a",
    footerAccent: "#101827",
    storyBefore: "rgba(43, 69, 98, 0.18)",
    storyAfter: "#F3F7FF",
  },
  images: {
    heroCar: "/images/alphatauri/anh-xe.webp",
    primaryDriverBackground: "/images/alphatauri/pdb.webp",
    primaryDriverPortrait: "/images/alphatauri/pdp.webp",
    secondaryDriverPortrait: "/images/alphatauri/sdp.webp",
    highlightThumbnail: "/images/alphatauri/thumbnail.webp",
  },
  galleryItems: [
    {
      label: "AlphaTauri / 2020",
      src: "/images/alphatauri/alphatauri-1.webp",
      alt: "AlphaTauri archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "AT01 Detail",
      src: "/images/alphatauri/alphatauri-2.webp",
      alt: "AlphaTauri archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Chassis",
      src: "/images/alphatauri/alphatauri-3.webp",
      alt: "AlphaTauri archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "aspect-[16/9]",
    },
    {
      label: "Race Frame",
      src: "/images/alphatauri/alphatauri-4.webp",
      alt: "AlphaTauri archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "h-[44vh]",
    },
    {
      label: "AlphaTauri Detail",
      src: "/images/alphatauri/alphatauri-5.webp",
      alt: "AlphaTauri archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/alphatauri/alphatauri-6.webp",
      alt: "AlphaTauri archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "h-[36vh]",
    },
  ],
  storyText:
    "Formerly known as Toro Rosso, the team rebranded to promote Red Bull's fashion label. The white-and-navy AT01 was not just a fashion statement; it was a serious contender. The highlight of their season (and one of the season's best moments) was Pierre Gasly’s emotional victory at the Italian Grand Prix in Monza.",
  primaryDriver: {
    name: "Pierre Gasly",
    videoUrl:
      "https://www.youtube.com/results?search_query=Pierre+Gasly+Monza+2020+win",
    videoLabel: "WATCH GASLY'S 2020 HIGHLIGHTS",
    description:
      "Delivered a breakthrough season with mature racecraft, strong consistency, and a sensational victory at Monza. His performances made 2020 the defining year of his Formula 1 comeback.",
  },
  secondaryDriver: {
    name: "Daniil Kvyat",
    description:
      "Provided experience and solid race pace for AlphaTauri throughout the season. His strongest drives showed he could still deliver competitive results in the midfield.",
    statsTitle: "Driver Information",
    statsSubTitle: "(2020 SEASON)",
    stats: [
      ["2020 Points", "32"],
      ["Best Finish", "P4"],
      ["Wins", "0"],
      ["Podiums", "0"],
      ["Poles", "0"],
      ["Standings", "14th"],
    ],
  },
  highlight: {
    title: "Highlight",
    subTitle: "Team Highlights (2020):",
    videoUrl:
      "https://www.youtube.com/playlist?list=PLfoNZDHitwjXRANMnqmL0BzNGianZ2eX_",
    videoLabel: "WATCH 2020 HIGHLIGHTS",
    items: [
      ["Constructors", "7th", ""],
      ["Total Points", "107", ""],
      ["Wins", "1", "(Gasly at Monza)"],
      ["Key Moment", "Monza Miracle", "(AlphaTauri's first win as AlphaTauri)"],
    ],
  },
};

// 3. Render the Base Template, injecting the Data and the 3D Canvas
export default function AlphaTauriPage() {
  return (
    <BaseTeamPage data={ALPHATAURI_DATA} SceneComponent={AlphaTauriScene} />
  );
}
