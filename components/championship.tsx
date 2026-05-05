"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Driver {
  pos: number;
  name: string;
  team: string;
  points: number;
  wins: number;
}
interface Constructor {
  pos: number;
  team: string;
  points: number;
}
interface Stats {
  worldChampion: string;
  constructorChampion: string;
  totalRaces: number;
  mostWinsDriver: { name: string; wins: number };
}
interface Race {
  round: number;
  name: string;
  winner: string;
}
interface SeasonData {
  season: number;
  drivers: Driver[];
  constructors: Constructor[];
  stats: Stats;
  races: Race[];
}

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="stat-card opacity-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:scale-[1.02]">
    <div className="absolute top-0 left-0 w-1 h-full bg-[#e10600] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300"></div>
    <p className="text-white/50 font-orbitron text-xs md:text-sm uppercase tracking-widest mb-2 relative z-10 group-hover:text-white/80 transition-colors">
      {title}
    </p>
    <p className="text-white font-bold text-xl md:text-2xl font-inter relative z-10 group-hover:text-white transition-colors">
      {value}
    </p>
  </div>
);

export default function Championships() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [loading, setLoading] = useState(true);

  // CRITICAL: Hydration check for React Portals
  const [isClient, setIsClient] = useState(false);

  const [hoveredTeam, setHoveredTeam] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredDriver, setHoveredDriver] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const getTeamLogo = (teamName: string) => {
    const map: Record<string, string> = {
      Mercedes: "mercedes.svg",
      "Red Bull Racing": "redbull.svg",
      McLaren: "mclaren.svg",
      "Racing Point": "racingpoint.svg",
      Renault: "renault.svg",
      Ferrari: "ferrari.svg",
      AlphaTauri: "alphatauri.svg",
      "Alfa Romeo": "alfaromeo.svg",
      Haas: "haas.svg",
      Williams: "williams.svg",
    };
    const key = Object.keys(map).find(
      (k) => k.toLowerCase() === teamName.toLowerCase().trim(),
    );
    return key ? `/logos/${map[key]}` : `/logos/F1.svg`;
  };

  const getDriverImage = (driverName: string) => {
    const map: Record<string, string> = {
      "Alexander Albon": "alexander albon.jpg",
      "Carlos Sainz": "carlos sains.jpg",
      "Charles Leclerc": "charles leclerc.jpg",
      "Daniel Ricciardo": "daniel ricciardo.png",
      "Lando Norris": "lando norris.jpg",
      "Lewis Hamilton": "lewis hamilton.jpg",
      "Max Verstappen": "max verstapen.jpg",
      "Pierre Gasly": "pierre gasly.jpg",
      "Sergio Perez": "sergio perez.jpg",
      "Valtteri Bottas": "valtteri bottas.jpg",
    };
    const key = Object.keys(map).find(
      (k) => k.toLowerCase() === driverName.toLowerCase().trim(),
    );
    return key ? encodeURI(`/driver/${map[key]}`) : `/driver/default.jpg`;
  };

  const handleMouseMove = (e: React.MouseEvent, team: string) => {
    setHoveredTeam({ name: team, x: e.clientX, y: e.clientY });
  };
  const handleMouseLeave = () => {
    setHoveredTeam(null);
  };

  const handleDriverMouseMove = (e: React.MouseEvent, driverName: string) => {
    setHoveredDriver({ name: driverName, x: e.clientX, y: e.clientY });
  };
  const handleDriverMouseLeave = () => {
    setHoveredDriver(null);
  };

  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const driversRef = useRef<HTMLDivElement>(null);
  const constructorsRef = useRef<HTMLDivElement>(null);
  const racesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true); // Mount check for portals
    fetch("/championships2020.json")
      .then((res) => res.json())
      .then((data) => {
        setSeasonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch championship data:", err);
        setLoading(false);
      });
  }, []);

  useGSAP(
    () => {
      if (!seasonData) return;

      const applyBlockReveal = (
        block: any,
        content: any,
        tlObj: any,
        position?: string,
      ) => {
        tlObj
          .set(block, { transformOrigin: "left" }, position)
          .to(
            block,
            { scaleX: 1, duration: 0.4, ease: "power4.inOut" },
            position,
          )
          .set(content, { opacity: 1 })
          .set(block, { transformOrigin: "right" })
          .to(block, { scaleX: 0, duration: 0.4, ease: "power4.inOut" });
      };

      const tlHeader = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          once: true,
        },
      });
      applyBlockReveal(titleBlockRef.current, titleRef.current, tlHeader);
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

      gsap.fromTo(
        ".stat-card",
        { scale: 0.9, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // DRIVERS ENTRANCE
      gsap.fromTo(
        driversRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: driversRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      if (driversRef.current) {
        const rows = gsap.utils.toArray(
          driversRef.current.querySelectorAll(".row-reveal-container"),
        ) as HTMLElement[];
        rows.forEach((row) => {
          const block = row.querySelector(".row-block");
          const content = row.querySelector(".row-content");
          if (block && content) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: row, start: "top 95%", once: true },
            });
            tl.set(block, { transformOrigin: "left" })
              .to(block, { scaleX: 1, duration: 0.3, ease: "power3.inOut" })
              .set(content, { opacity: 1 })
              .set(block, { transformOrigin: "right" })
              .to(block, { scaleX: 0, duration: 0.3, ease: "power3.inOut" });
          }
        });
      }

      // CONSTRUCTORS ENTRANCE
      gsap.fromTo(
        constructorsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: constructorsRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      if (constructorsRef.current) {
        const rows = gsap.utils.toArray(
          constructorsRef.current.querySelectorAll(".row-reveal-container"),
        ) as HTMLElement[];
        rows.forEach((row) => {
          const block = row.querySelector(".row-block");
          const content = row.querySelector(".row-content");
          if (block && content) {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: row, start: "top 95%", once: true },
            });
            tl.set(block, { transformOrigin: "left" })
              .to(block, { scaleX: 1, duration: 0.3, ease: "power3.inOut" })
              .set(content, { opacity: 1 })
              .set(block, { transformOrigin: "right" })
              .to(block, { scaleX: 0, duration: 0.3, ease: "power3.inOut" });
          }
        });
      }

      // RACES ENTRANCE
      gsap.fromTo(
        racesRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: racesRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".race-card",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: racesRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: mainContainerRef, dependencies: [seasonData] },
  );

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaX) === 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [seasonData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#e10600]/20 border-t-[#e10600] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!seasonData)
    return (
      <div className="min-h-screen bg-transparent text-white pt-32 text-center">
        Data not found.
      </div>
    );

  return (
    <div
      id="championships"
      ref={mainContainerRef}
      className="page-content pt-[120px] px-6 md:px-[50px] pb-[80px] min-h-screen bg-transparent text-white overflow-x-hidden font-inter"
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="max-w-[1400px] mx-auto">
        {/* HEADER SECTION */}
        <div ref={headerRef} className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
            <div className="relative inline-block w-fit overflow-hidden">
              <div ref={titleRef} className="relative opacity-0">
                <h1 className="absolute top-[3px] left-[4px] md:top-[5px] md:left-[6px] page-title font-akira text-[2.5rem] md:text-[4rem] text-white/5 uppercase tracking-[2px] leading-tight z-0 select-none">
                  CHAMPIONSHIPS
                </h1>
                <h1 className="relative page-title font-akira text-[2.5rem] md:text-[4rem] text-white uppercase tracking-[2px] leading-tight z-10">
                  CHAMPIONSHIPS
                </h1>
              </div>
              <div
                ref={titleBlockRef}
                className="absolute top-0 left-0 w-full h-full bg-[#e10600] origin-left scale-x-0 z-20"
              ></div>
            </div>
          </div>

          <div className="relative w-full h-[24px]">
            <div className="absolute bottom-0 left-0 w-[calc(100%-15px)] h-[18px] skew-x-[-30deg] origin-bottom-right">
              <div
                ref={line1Ref}
                className="absolute bottom-0 left-0 w-[calc(100%-10px)] h-[8px] bg-[#e10600] origin-left rounded-l-[1px] scale-x-0 z-0"
              ></div>
              <div
                ref={line2Ref}
                className="absolute top-0 left-0 w-[calc(100%-10px)] h-[8px] bg-[#e10600] origin-left rounded-l-[1px] scale-x-0 z-0"
              ></div>
              <div
                ref={boxRef}
                className="absolute bottom-0 right-0 w-[8px] h-[18px] bg-[#e10600] origin-bottom-right rounded-r-[1px] opacity-0 scale-0"
              ></div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <StatCard
            title="World Champion"
            value={seasonData.stats.worldChampion}
          />
          <StatCard
            title="Constructor Champion"
            value={seasonData.stats.constructorChampion}
          />
          <StatCard
            title="Most Wins"
            value={`${seasonData.stats.mostWinsDriver.name} (${seasonData.stats.mostWinsDriver.wins})`}
          />
          <StatCard
            title="Total Races"
            value={seasonData.stats.totalRaces.toString()}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* DRIVER STANDINGS */}
          <div ref={driversRef} className="opacity-0 relative z-10">
            <h2 className="font-orbitron text-2xl md:text-3xl text-white mb-6 uppercase border-l-4 border-[#e10600] pl-4 flex items-center">
              Driver Standings
            </h2>
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <div className="flex bg-white/5 text-white/50 font-orbitron text-xs md:text-sm uppercase tracking-widest p-4 border-b border-white/10">
                <div className="w-12 md:w-16 text-center">Pos</div>
                <div className="flex-1">Driver</div>
                <div className="flex-1 hidden sm:block">Team</div>
                <div className="w-16 md:w-20 text-center">Wins</div>
                <div className="w-20 md:w-24 text-right">Pts</div>
              </div>
              <div className="flex flex-col">
                {seasonData.drivers.map((driver) => (
                  <div
                    key={driver.name}
                    className="row-reveal-container relative"
                  >
                    <div className="row-block absolute inset-0 bg-[#e10600] origin-left scale-x-0 z-10 pointer-events-none"></div>

                    <div
                      className="row-content opacity-0 flex items-center p-4 border-b border-white/5 hover:bg-white/10 transition-colors group relative z-20 cursor-default bg-transparent pointer-events-auto"
                      onMouseEnter={(e) =>
                        handleDriverMouseMove(e, driver.name)
                      }
                      onMouseMove={(e) => handleDriverMouseMove(e, driver.name)}
                      onMouseLeave={handleDriverMouseLeave}
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-[#e10600] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300"></div>
                      <div
                        className={`w-12 md:w-16 text-center font-orbitron font-bold text-lg md:text-xl transition-colors ${driver.pos === 1 ? "text-[#D4AF37]" : driver.pos === 2 ? "text-[#C0C0C0]" : driver.pos === 3 ? "text-[#CD7F32]" : "text-white/40 group-hover:text-white/80"}`}
                      >
                        {driver.pos}
                      </div>
                      <div className="flex-1 font-bold text-white uppercase tracking-wide group-hover:text-[#e10600] transition-colors text-sm md:text-base">
                        {driver.name}
                      </div>
                      <div className="flex-1 hidden sm:block text-white/50 text-xs md:text-sm uppercase tracking-wider group-hover:text-white/80 transition-colors">
                        {driver.team}
                      </div>
                      <div className="w-16 md:w-20 text-center text-white/50 font-medium group-hover:text-white/90 transition-colors">
                        {driver.wins}
                      </div>
                      <div className="w-20 md:w-24 text-right font-orbitron font-bold text-lg md:text-xl text-[#e10600] transition-all">
                        {driver.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONSTRUCTOR STANDINGS */}
          <div ref={constructorsRef} className="opacity-0 relative z-10">
            <h2 className="font-orbitron text-2xl md:text-3xl text-white mb-6 uppercase border-l-4 border-[#e10600] pl-4 flex items-center">
              Constructor Standings
            </h2>
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <div className="flex bg-white/5 text-white/50 font-orbitron text-xs md:text-sm uppercase tracking-widest p-4 border-b border-white/10">
                <div className="w-12 md:w-16 text-center">Pos</div>
                <div className="flex-1">Team</div>
                <div className="w-20 md:w-24 text-right">Pts</div>
              </div>
              <div className="flex flex-col">
                {seasonData.constructors.map((team) => (
                  <div
                    key={team.team}
                    className="row-reveal-container relative"
                  >
                    <div className="row-block absolute inset-0 bg-[#e10600] origin-left scale-x-0 z-10 pointer-events-none"></div>

                    <div
                      className="row-content opacity-0 flex items-center p-4 border-b border-white/5 hover:bg-white/10 transition-colors group relative z-20 cursor-default bg-transparent pointer-events-auto"
                      onMouseEnter={(e) => handleMouseMove(e, team.team)}
                      onMouseMove={(e) => handleMouseMove(e, team.team)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-[#e10600] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300"></div>
                      <div
                        className={`w-12 md:w-16 text-center font-orbitron font-bold text-lg md:text-xl transition-colors ${team.pos === 1 ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white/80"}`}
                      >
                        {team.pos}
                      </div>
                      <div
                        className={`flex-1 font-bold uppercase tracking-wide transition-colors text-sm md:text-base ${team.pos === 1 ? "text-[#D4AF37]" : "text-white group-hover:text-[#e10600]"}`}
                      >
                        {team.team}
                      </div>
                      <div className="w-20 md:w-24 text-right font-orbitron font-bold text-lg md:text-xl text-[#e10600] transition-all">
                        {team.points}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RACE TIMELINE */}
        <div ref={racesRef} className="opacity-0 mb-10">
          <h2 className="font-orbitron text-2xl md:text-3xl text-white mb-6 uppercase border-l-4 border-[#e10600] pl-4">
            Race Calendar Results
          </h2>
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 pt-2 px-2 -mx-2 gap-5 hide-scrollbar"
          >
            {seasonData.races.map((race) => (
              <div
                key={race.round}
                className="race-card opacity-0 min-w-[260px] md:min-w-[300px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-6 hover:border-[#e10600]/60 hover:bg-white/10 transition-all duration-300 group relative shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-6 w-[2px] h-4 bg-[#e10600]"></div>
                <div className="text-[#e10600] font-orbitron text-xs uppercase tracking-widest mb-2 font-bold">
                  Round {race.round}
                </div>
                <div className="text-white font-bold text-lg md:text-xl leading-snug mb-5 h-[56px] group-hover:text-[#e10600] transition-colors">
                  {race.name}
                </div>
                <div className="pt-4 border-t border-white/10 relative">
                  <div className="absolute top-[-1px] left-0 w-10 h-[1px] bg-[#e10600] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-1 group-hover:text-white/70 transition-colors">
                    Winner
                  </div>
                  <div className="text-white font-orbitron text-sm md:text-base transition-all">
                    {race.winner}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PORTAL MAGIC: Completely breaks the popup out of the component hierarchy so it never gets clipped */}
      {isClient &&
        hoveredTeam &&
        createPortal(
          <div
            className="fixed pointer-events-none z-[99999] bg-gradient-to-br from-[#ffffff] to-[#e0e0e0] backdrop-blur-3xl rounded-xl p-3 border border-[#e10600]/50 shadow-[0_15px_40px_rgba(225,6,0,0.2)] flex flex-col items-center justify-center transform -translate-y-1/2 transition-opacity duration-200"
            style={{
              left:
                hoveredTeam.x + 20 > window.innerWidth - 220
                  ? hoveredTeam.x - 240
                  : hoveredTeam.x + 20,
              top: hoveredTeam.y,
            }}
          >
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#e10600] rounded-tr-xl opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#e10600] rounded-bl-xl opacity-80"></div>
            <div className="w-36 h-24 md:w-44 md:h-28 flex items-center justify-center px-4">
              <img
                src={getTeamLogo(hoveredTeam.name)}
                alt={hoveredTeam.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>,
          document.body,
        )}

      {isClient &&
        hoveredDriver &&
        createPortal(
          <div
            className="fixed pointer-events-none z-[99999] bg-gradient-to-br from-[#111] to-[#222] backdrop-blur-3xl rounded-xl p-3 border border-[#e10600]/40 shadow-[0_15px_40px_rgba(225,6,0,0.3)] flex flex-col items-center justify-center transform -translate-y-1/2 transition-opacity duration-200"
            style={{
              left:
                hoveredDriver.x + 20 > window.innerWidth - 250
                  ? hoveredDriver.x - 270
                  : hoveredDriver.x + 20,
              top: hoveredDriver.y,
            }}
          >
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#e10600] rounded-tr-xl opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#e10600] rounded-bl-xl opacity-70"></div>
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-inner flex items-center justify-center">
              {/* Added fallback layout so broken images show a cool F1 placeholder instead of an empty box */}
              <img
                src={getDriverImage(hoveredDriver.name)}
                alt={hoveredDriver.name}
                className="w-full h-full object-cover object-top filter contrast-125 saturate-110"
                onError={(e) => {
                  e.currentTarget.src = "/logos/F1.svg";
                  e.currentTarget.className =
                    "w-1/2 h-1/2 object-contain opacity-40";
                }}
              />
            </div>
            <div className="mt-3 text-white font-orbitron text-sm font-bold uppercase tracking-wider text-center">
              {hoveredDriver.name}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
