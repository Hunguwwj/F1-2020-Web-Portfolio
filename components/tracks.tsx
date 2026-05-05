"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { TrackRenderer } from "../renders/trackRender";

// 1. THE COMPONENT (No changes needed if it looks exactly like this)
const AnimatedTrack = ({ track }: { track: any }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<TrackRenderer | null>(null);

  useEffect(() => {
    // Mount once
    if (mountRef.current && !rendererRef.current) {
      rendererRef.current = new TrackRenderer(mountRef.current);
    }

    // Cleanup on page unmount
    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Hot-swap the track geometry when selection changes
    if (rendererRef.current && track?.image) {
      rendererRef.current.loadTrack(track.image);
    }
  }, [track?.image]);

 return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

const tracksData = [
  {
    id: "australia",
    name: "AUSTRALIA GP",
    flag: "au",
    subtitle: "F1 2020",
    circuit: "Melbourne Grand Prix Circuit",
    location: "Melbourne",
    image: "/TracksList/Australia/melbourne-2.svg",
  },
  {
    id: "bahrain",
    name: "BAHRAIN GP",
    flag: "bh",
    subtitle: "F1 2020",
    circuit: "Bahrain International Circuit",
    location: "Sakhir",
    image: "/TracksList/Bahrain/bahrain-1.svg",
  },
  {
    id: "vietnam",
    name: "VIETNAM GP",
    flag: "vn",
    subtitle: "F1 2020",
    circuit: "Hanoi Circuit",
    location: "Hanoi",
    image: "/TracksList/Vietnam/VietnamBlack.svg",
  },
  {
    id: "china",
    name: "CHINA GP",
    flag: "cn",
    subtitle: "F1 2020",
    circuit: "Shanghai International Circuit",
    location: "Shanghai",
    image: "/TracksList/China/shanghai-1.svg",
  },
  {
    id: "netherlands",
    name: "NETHERLANDS GP",
    flag: "nl",
    subtitle: "F1 2020",
    circuit: "Circuit Zandvoort",
    location: "Zandvoort",
    image: "/TracksList/The Netherlands/zandvoort-5.svg",
  },
  {
    id: "spain",
    name: "SPAIN GP",
    flag: "es",
    subtitle: "F1 2020",
    circuit: "Circuit de Barcelona-Catalunya",
    location: "Montmeló",
    image: "/TracksList/Spain/catalunya-6.svg",
  },
  {
    id: "monaco",
    name: "MONACO GP",
    flag: "mc",
    subtitle: "F1 2020",
    circuit: "Circuit de Monaco",
    location: "Monte Carlo",
    image: "/TracksList/Monaco/monaco-6.svg",
  },
  {
    id: "azerbaijan",
    name: "AZERBAIJAN GP",
    flag: "az",
    subtitle: "F1 2020",
    circuit: "Baku City Circuit",
    location: "Baku",
    image: "/TracksList/Azerbaijan/baku-1.svg",
  },
  {
    id: "canada",
    name: "CANADA GP",
    flag: "ca",
    subtitle: "F1 2020",
    circuit: "Circuit Gilles-Villeneuve",
    location: "Montreal",
    image: "/TracksList/Canada/montreal-6.svg",
  },
  {
    id: "france",
    name: "FRANCE GP",
    flag: "fr",
    subtitle: "F1 2020",
    circuit: "Circuit Paul Ricard",
    location: "Le Castellet",
    image: "/TracksList/France/FrenchBlack.svg",
  },
  {
    id: "austria",
    name: "AUSTRIA GP",
    flag: "at",
    subtitle: "F1 2020",
    circuit: "Red Bull Ring",
    location: "Spielberg",
    image: "/TracksList/Austria/spielberg-3.svg",
  },
  {
    id: "britain",
    name: "BRITAIN GP",
    flag: "gb",
    subtitle: "F1 2020",
    circuit: "Silverstone Circuit",
    location: "Silverstone",
    image: "/TracksList/Britain/silverstone-8.svg",
  },
  {
    id: "hungary",
    name: "HUNGARY GP",
    flag: "hu",
    subtitle: "F1 2020",
    circuit: "Hungaroring",
    location: "Mogyoród",
    image: "/TracksList/Hungary/hungaroring-3.svg",
  },
  {
    id: "belgium",
    name: "BELGIUM GP",
    flag: "be",
    subtitle: "F1 2020",
    circuit: "Circuit de Spa-Francorchamps",
    location: "Stavelot",
    image: "/TracksList/Belgium/spa-francorchamps-4.svg",
  },
  {
    id: "italy",
    name: "ITALY GP",
    flag: "it",
    subtitle: "F1 2020",
    circuit: "Autodromo Nazionale Monza",
    location: "Monza",
    image: "/TracksList/Italy/monza-7.svg",
  },
  {
    id: "singapore",
    name: "SINGAPORE GP",
    flag: "sg",
    subtitle: "F1 2020",
    circuit: "Marina Bay Street Circuit",
    location: "Marina Bay",
    image: "/TracksList/Singapore/marina-bay-4.svg",
  },
  {
    id: "russia",
    name: "RUSSIA GP",
    flag: "ru",
    subtitle: "F1 2020",
    circuit: "Sochi Autodrom",
    location: "Sochi",
    image: "/TracksList/Russia/RussianBlack.svg",
  },
  {
    id: "japan",
    name: "JAPAN GP",
    flag: "jp",
    subtitle: "F1 2020",
    circuit: "Suzuka International Racing Course",
    location: "Suzuka",
    image: "/TracksList/Japan/suzuka-2.svg",
  },
  {
    id: "usa",
    name: "USA GP",
    flag: "us",
    subtitle: "F1 2020",
    circuit: "Circuit of the Americas",
    location: "Austin",
    image: "/TracksList/USA/austin-1.svg",
  },
  {
    id: "mexico",
    name: "MEXICO GP",
    flag: "mx",
    subtitle: "F1 2020",
    circuit: "Autódromo Hermanos Rodríguez",
    location: "Mexico City",
    image: "/TracksList/México/mexico-city-3.svg",
  },
  {
    id: "brazil",
    name: "BRAZIL GP",
    flag: "br",
    subtitle: "F1 2020",
    circuit: "Autódromo José Carlos Pace",
    location: "São Paulo",
    image: "/TracksList/Brazil/interlagos-2.svg",
  },
  {
    id: "abudhabi",
    name: "ABUDABHI GP",
    flag: "ae",
    subtitle: "F1 2020",
    circuit: "Yas Marina Circuit",
    location: "Abu Dhabi",
    image: "/TracksList/Abu Dhabi/yas-marina-2.svg",
  },
];

export default function Tracks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTrack, setSelectedTrack] = useState(tracksData[0]);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const trackImgRef = useRef<HTMLDivElement>(null);
  const trackImgBlockRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const infoBlockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hàm tái sử dụng cho hiệu ứng Block Reveal
      const applyBlockReveal = (
        block: any,
        content: any,
        position?: string,
        tl?: any,
      ) => {
        tl.set(block, { transformOrigin: "left" }, position)
          .to(
            block,
            { scaleX: 1, duration: 0.4, ease: "power4.inOut" },
            position,
          )
          .set(content, { opacity: 1 })
          .set(block, { transformOrigin: "right" })
          .to(block, { scaleX: 0, duration: 0.4, ease: "power4.inOut" });
      };

      // --- HEADER REVEAL ---
      const tlHeader = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          once: true,
        },
      });
      applyBlockReveal(blockRef.current, titleRef.current, undefined, tlHeader);
      tlHeader
        .to(
          [line1Ref.current, line2Ref.current],
          { scaleX: 1, duration: 0.5, ease: "power3.out", stagger: 0.1 },
          "-=0.2",
        )
        .to(
          boxRef.current,
          { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
          "-=0.3",
        );

      // --- TRACK IMAGE REVEAL ---
      const tlImg = gsap.timeline({
        scrollTrigger: {
          trigger: trackImgBlockRef.current,
          start: "top 80%",
          once: true,
        },
      });
      applyBlockReveal(
        trackImgBlockRef.current,
        trackImgRef.current,
        undefined,
        tlImg,
      );

      // --- TRACK INFO REVEAL ---
      const tlInfo = gsap.timeline({
        scrollTrigger: {
          trigger: infoBlockRef.current,
          start: "top 85%",
          once: true,
        },
      });
      applyBlockReveal(
        infoBlockRef.current,
        infoRef.current,
        undefined,
        tlInfo,
      );

      // --- ROWS REVEAL ---
      const rowElements = gsap.utils.toArray(
        ".track-row-reveal",
      ) as HTMLElement[];
      rowElements.forEach((el, index) => {
        const block = el.querySelector(".row-block") as HTMLElement;
        const content = el.querySelector(".row-content") as HTMLElement;

        if (!block || !content) return;

        const tlRow = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            // The header uses the window, but the tracks use our new invisible scroll box!
            scroller: index === 0 ? window : "#tracks-scroller",
            start: "top 95%",
            once: true,
          },
        });
        tlRow
          .set(block, { transformOrigin: "left" })
          .to(block, { scaleX: 1, duration: 0.3, ease: "power3.inOut" })
          .set(content, { opacity: 1 })
          .set(block, { transformOrigin: "right" })
          .to(block, { scaleX: 0, duration: 0.3, ease: "power3.inOut" });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      id="tracks"
      ref={containerRef}
      className="page-content pt-[120px] px-6 md:px-[50px] pb-[50px] min-h-screen bg-transparent text-white"
    >
      <style>
        {`

        /* Hide Scrollbar for the track list */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}
      </style>
      <div className="max-w-[1400px] mx-auto">
        <div ref={headerRef} className="mb-10 relative flex flex-col">
          {/* Vùng chứa Title và Block Reveal */}
          <div className="relative w-fit mx-auto mb-4 overflow-hidden">
            <h1
              ref={titleRef}
              className="page-title font-akira text-[3rem] md:text-[5rem] text-center uppercase tracking-[2px] opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-title-flicker"
            >
              F1 2020 Tracks
            </h1>
            {/* Khối trượt (Block Reveal) */}
            <div
              ref={blockRef}
              className="absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-10"
            ></div>
          </div>

          <div className="relative w-full h-[24px]">
            {/* F1 Style Decorative Lines (Connected) */}
            <div className="absolute bottom-0 left-0 w-[calc(100%-15px)] h-[18px] skew-x-[-30deg] origin-bottom-right">
              <div
                ref={line1Ref}
                className="absolute bottom-0 left-0 w-[calc(100%-10px)] h-[8px] bg-[#e10600] origin-left rounded-l-[1px] shadow-[0_0_12px_rgba(225,6,0,0.5)] scale-x-0 z-0"
              ></div>
              <div
                ref={line2Ref}
                className="absolute top-0 left-0 w-[calc(100%-10px)] h-[8px] bg-[#e10600] origin-left rounded-l-[1px] shadow-[0_0_12px_rgba(225,6,0,0.5)] scale-x-0 z-0"
              ></div>
              <div
                ref={boxRef}
                className="absolute bottom-0 right-0 w-[8px] h-[18px] bg-[#e10600] origin-bottom-right shadow-[0_0_15px_rgba(225,6,0,0.6)] rounded-r-[1px] opacity-0 scale-0"
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Selected Track Details (Sticky) */}
          <div className="w-full lg:w-[50%] relative">
            <div className="sticky top-[120px] bg-white/5 backdrop-blur-2xl rounded-3xl p-0 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden">
              {/* Track Image Reveal Wrapper */}
              <div className="relative w-full overflow-hidden mb-0">
                <div
                  ref={trackImgBlockRef}
                  className="absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-20 rounded-xl"
                ></div>
                <div
                  ref={trackImgRef}
                  className="w-full h-91 relative flex items-center justify-center opacity-0"
                >
                  {selectedTrack.image ? (
                    <AnimatedTrack track={selectedTrack} />
                  ) : (
                    <div className="w-full h-full border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                      <span className="text-white/40 font-inter text-sm uppercase tracking-wider">
                        No Track Data
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Minimal Track Info Reveal Wrapper */}
              <div className="relative w-full overflow-hidden p-4">
                <div
                  ref={infoBlockRef}
                  className="absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-20"
                ></div>
                <div
                  ref={infoRef}
                  className="flex items-center justify-between relative z-10 border-t border-white/10 pt-6 opacity-0"
                >
                  <div className="flex flex-col">
                    <h2 className="font-orbitron font-black text-2xl md:text-3xl uppercase leading-tight text-white">
                      {selectedTrack.name.replace(" GP", "")}
                    </h2>
                    <span className="font-inter text-[#e10600] text-sm font-bold uppercase tracking-[2px] mt-1">
                      {selectedTrack.location}
                    </span>
                  </div>
                  <img
                    src={`https://flagcdn.com/w80/${selectedTrack.flag}.png`}
                    width="48"
                    alt={`${selectedTrack.flag} flag`}
                    className="rounded-sm shadow-lg border border-white/10 flex-shrink-0 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: List of Tracks */}
          <div className="w-full lg:w-[55%] relative mt-8 lg:mt-0 h-fit">
            <div className="w-full flex flex-col border-t border-white/10">
              {/* Table Header Reveal */}
              <div className="track-row-reveal relative overflow-hidden">
                <div className="row-block absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-20 pointer-events-none"></div>
                <div className="row-content opacity-0 flex items-center py-4 px-5 text-[10px] uppercase font-orbitron tracking-widest text-white/50 border-b border-white/5">
                  <div className="w-12 md:w-16">Round</div>
                  <div className="flex-1">Location</div>
                  <div className="hidden md:block flex-1">Circuit</div>
                  <div className="w-20 md:w-24 text-right">City</div>
                </div>
              </div>

              {/* Scrollable Container with no visible scrollbar */}
              <div
                id="tracks-scroller"
                className="flex flex-col max-h-[65vh] overflow-y-auto hide-scrollbar pb-10"
              >
                {tracksData.map((track, index) => {
                  const isActive = selectedTrack.id === track.id;
                  const idx = (index + 1).toString().padStart(2, "0");

                  return (
                    <div
                      key={track.id}
                      className="track-row-reveal relative overflow-hidden shrink-0"
                    >
                      <div className="row-block absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-20 pointer-events-none"></div>
                      <div
                        onClick={() => setSelectedTrack(track)}
                        className={`row-content opacity-0 group cursor-pointer flex items-center py-5 px-5 transition-all duration-300 border-b border-white/5
                        ${
                          isActive
                            ? "bg-[#e10600] text-white"
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        {/* Round Number */}
                        <div className="w-12 md:w-16 relative font-orbitron text-2xl font-black italic">
                          <span
                            className={
                              isActive
                                ? "text-white"
                                : "text-white/30 group-hover:text-white/80 transition-colors"
                            }
                          >
                            {idx}
                          </span>
                        </div>

                        {/* Track Name & Flag */}
                        <div className="flex-1 flex items-center gap-4">
                          <span className="font-orbitron font-bold uppercase text-base md:text-xl tracking-widest">
                            {track.name.replace(" GP", "")}
                          </span>
                          <img
                            src={`https://flagcdn.com/w40/${track.flag}.png`}
                            alt={`${track.flag} flag`}
                            className="w-5 h-3 md:w-6 md:h-4 object-cover rounded-sm shadow-sm"
                          />
                        </div>

                        {/* Circuit Name */}
                        <div
                          className={`hidden md:block flex-1 font-inter text-xs md:text-sm font-medium tracking-wide transition-colors
                        ${isActive ? "text-white/90" : "text-white/50 group-hover:text-white/80"}`}
                        >
                          {track.circuit}
                        </div>

                        {/* Location */}
                        <div
                          className={`w-20 md:w-24 text-right font-inter text-xs md:text-sm font-bold uppercase tracking-wider transition-colors
                        ${isActive ? "text-white" : "text-white/50 group-hover:text-white/90"}`}
                        >
                          {track.location}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
