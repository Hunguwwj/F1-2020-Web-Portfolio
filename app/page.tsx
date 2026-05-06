"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "../links/routes";
import Tracks from "../components/tracks";
import Championships from "../components/championship";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const teams = [
  {
    name: "Mercedes",
    bg: "/img/1.png",
    route: "/teams/mercedes",
    logo: "/logos/mercedes.svg",
    glowColor: "rgba(0, 210, 190, 0.6)",
  },
  {
    name: "Red Bull",
    bg: "/img/2.png",
    route: "/teams/redbull",
    logo: "/logos/redbull.svg",
    glowColor: "rgba(6, 0, 239, 0.5)",
  },
  {
    name: "Ferrari",
    bg: "/img/3.png",
    route: ROUTES.FERRARI,
    logo: "/logos/ferrari.svg",
    glowColor: "rgba(220, 0, 0, 0.6)",
  },
  {
    name: "McLaren",
    bg: "/img/4.png",
    route: "/teams/mclaren",
    logo: "/logos/mclaren.svg",
    glowColor: "rgba(255, 135, 0, 0.6)",
  },
  {
    name: "Racing Point",
    bg: "/img/5.png",
    route: "/teams/racingpoint",
    logo: "/logos/racingpoint.svg",
    glowColor: "rgba(245, 150, 200, 0.6)",
  },
  {
    name: "Renault",
    bg: "/img/6.png",
    route: "/teams/renault",
    logo: "/logos/renault.svg",
    glowColor: "rgba(255, 212, 0, 0.6)",
  },
  {
    name: "AlphaTauri",
    bg: "/img/7.png",
    route: "/teams/alphatauri",
    logo: "/logos/alphatauri.svg",
    glowColor: "rgba(255, 255, 255, 0.6)",
  },
  {
    name: "Alfa Romeo",
    bg: "/img/8.png",
    route: "/teams/alfaromeo",
    logo: "/logos/alfaromeo.svg",
    glowColor: "rgba(255, 255, 255, 0.5)",
  },
  {
    name: "Haas F1",
    bg: "/img/9.png",
    route: "/teams/haas",
    logo: "/logos/haas.svg",
    glowColor: "rgba(255, 255, 255, 0.5)",
  },
  {
    name: "Williams",
    bg: "/img/10.png",
    route: "/teams/williams",
    logo: "/logos/williams.svg",
    glowColor: "rgba(0, 160, 222, 0.6)",
  },
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const total = teams.length;
  const baseWidth = 100 / total;
  const hoverWidth = 25;

  const getClipPath = (index: number, hIndex: number) => {
    if (hIndex === -1) {
      return `polygon(${index * baseWidth}% 0%, ${(index + 1) * baseWidth}% 0%, ${(index + 1) * baseWidth}% 100%, ${index * baseWidth}% 100%)`;
    }
    const minRestWidth = 5;
    const idealLeft = hIndex * baseWidth + baseWidth / 2 - hoverWidth / 2;
    const minLeft = hIndex * minRestWidth;
    const maxLeft = 100 - hoverWidth - (total - 1 - hIndex) * minRestWidth;
    const leftEdge = Math.max(minLeft, Math.min(idealLeft, maxLeft));
    const rightEdge = leftEdge + hoverWidth;

    if (index === hIndex) {
      return `polygon(${leftEdge}% 0%, ${rightEdge}% 0%, ${rightEdge}% 100%, ${leftEdge}% 100%)`;
    }
    if (index < hIndex) {
      const wL = leftEdge / hIndex;
      return `polygon(${index * wL}% 0%, ${(index + 1) * wL}% 0%, ${(index + 1) * wL}% 100%, ${index * wL}% 100%)`;
    }
    const wR = (100 - rightEdge) / (total - 1 - hIndex);
    const offset = rightEdge + (index - hIndex - 1) * wR;
    return `polygon(${offset}% 0%, ${offset + wR}% 0%, ${offset + wR}% 100%, ${offset}% 100%)`;
  };

  const getLogoCenter = (index: number, hIndex: number) => {
    if (hIndex === -1) {
      return index * baseWidth + baseWidth / 2;
    }
    const minRestWidth = 5;
    const idealLeft = hIndex * baseWidth + baseWidth / 2 - hoverWidth / 2;
    const minLeft = hIndex * minRestWidth;
    const maxLeft = 100 - hoverWidth - (total - 1 - hIndex) * minRestWidth;
    const leftEdge = Math.max(minLeft, Math.min(idealLeft, maxLeft));
    const rightEdge = leftEdge + hoverWidth;

    if (index === hIndex) {
      return leftEdge + hoverWidth / 2;
    }
    if (index < hIndex) {
      const wL = leftEdge / hIndex;
      return index * wL + wL / 2;
    }
    const wR = (100 - rightEdge) / (total - 1 - hIndex);
    return rightEdge + (index - hIndex - 1) * wR + wR / 2;
  };

  const { contextSafe } = useGSAP(
    () => {
      // 1. Smooth GSAP Entrance Animation
      gsap.fromTo(
        ".slice",
        { y: "5vh", opacity: 0 },
        {
          y: "0vh",
          opacity: 1,
          duration: 1.2,
          stagger: 0.05,
          ease: "power3.out",
          overwrite: "auto",
        },
      );

      // 2. Topbar Hide & Reveal Logic
      const topbar = document.getElementById("f1-topbar");
      let trigger: ScrollTrigger | null = null; // Store a reference to the trigger

      if (topbar) {
        gsap.set(topbar, {
          yPercent: -100,
          autoAlpha: 0,
        });

        trigger = ScrollTrigger.create({
          trigger: heroRef.current,
          start: "75% top",
          onEnter: () => {
            gsap.to(topbar, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          },
          onLeaveBack: () => {
            gsap.to(topbar, {
              yPercent: -100,
              autoAlpha: 0,
              duration: 0.35,
              ease: "power3.in",
              overwrite: "auto",
            });
          },
        });
      }

      // 3. CLEANUP FUNCTION
      // This runs automatically when the component unmounts (navigating away)
      return () => {
        if (trigger) {
          trigger.kill(); // Destroys the ScrollTrigger, preventing memory leaks
        }
      };
    },
    { scope: mainRef },
  );

  // OPTIMIZED HOVER: Uses GSAP class selectors instead of React Refs to prevent memory leaks during page transitions.
  const handleHover = contextSafe((targetIndex: number) => {
    teams.forEach((_, i) => {
      const isHovered = targetIndex === i;
      const isOtherHovered = targetIndex !== -1 && !isHovered;

      gsap.to(`.slice-${i}`, {
        clipPath: getClipPath(i, targetIndex),
        duration: 0.8,
        ease: "power4.out",
        overwrite: "auto",
      });

      // 1. Only animate the scale on the heavy background image (Cheap)
      gsap.to(`.bg-${i}`, {
        scale: isHovered ? 1.05 : 1,
        duration: 0.8,
        ease: "power4.out",
        overwrite: "auto",
      });

      // 2. Animate the opacity of our new black overlay instead of using CSS filters (Extremely Cheap)
      gsap.to(`.dimmer-${i}`, {
        opacity: isOtherHovered ? 0.7 : 0,
        duration: 0.8,
        ease: "power4.out",
        overwrite: "auto",
      });

      gsap.to(`.glow-${i}`, {
        opacity: isOtherHovered ? 0.3 : isHovered ? 0.8 : 0.5,
        duration: 0.5,
        ease: "power4.out",
        overwrite: "auto",
      });

      gsap.to(`.logo-container-${i}`, {
        left: `${getLogoCenter(i, targetIndex)}%`,
        opacity: isHovered ? 1 : 0,
        filter: isOtherHovered ? "grayscale(0.6)" : "grayscale(0)",
        duration: 0.5,
        ease: "power4.out",
        overwrite: "auto",
      });

      gsap.to(`.logo-${i}`, {
        scale: isHovered ? 1.15 : 0.95,
        duration: 0.5,
        ease: "power4.out",
        overwrite: "auto",
      });
    });
  });

  return (
    <main ref={mainRef} className="w-full relative bg-[#0a0a0a]">
      <div
        id="hero"
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden bg-black z-10"
      >
        {teams.map((team, index) => {
          return (
            <Link
              href={team.route}
              key={index}
              className={`slice slice-${index} absolute top-0 left-0 w-full h-full cursor-pointer z-1 block`}
              style={{
                clipPath: getClipPath(index, -1),
                willChange: "clip-path",
                transform: "translateZ(0)",
              }}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleHover(-1)}
            >
              {/* OPTIMIZED: Removed 'filter' from willChange to save massive VRAM */}
              <div
                className={`slice-bg bg-${index} absolute top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat`}
                style={{
                  backgroundImage: `url(${team.bg})`,
                  transform: "scale(1) translateZ(0)",
                  willChange: "transform",
                }}
              />

              {/* THE NEW FIX: This black box handles the darkening effect instead of CSS filters */}
              <div
                className={`dimmer-${index} absolute inset-0 bg-[#050505] pointer-events-none z-[5]`}
                style={{
                  opacity: 0,
                  willChange: "opacity",
                }}
              />

              <div className="slice-tint absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none z-[6]" />
              <div className="absolute inset-0 pointer-events-none z-[10] bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

              <div
                className={`glow-${index} absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-20`}
                style={{
                  background: `linear-gradient(to bottom, ${team.glowColor}, transparent)`,
                  opacity: 0.5,
                  willChange: "opacity",
                }}
              />
              <div
                className={`team-logo-container logo-container-${index} absolute top-[15%] flex items-center justify-center z-30 pointer-events-none`}
                style={{
                  height: "110px",
                  left: `${getLogoCenter(index, -1)}%`,
                  transform: "translateX(-50%) translateZ(0)",
                  opacity: 0,
                  filter: "grayscale(0)",
                  willChange: "left, opacity, filter",
                }}
              >
                <div
                  className={`logo-${index} w-[90px] h-[90px] md:w-[130px] md:h-[130px] flex items-center justify-center relative`}
                  style={{
                    transform: `scale(0.95) translateZ(0)`,
                    willChange: "transform",
                  }}
                >
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 80px, 130px"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] z-10"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="relative z-10 bg-transparent">
        <Tracks />
        <Championships />
      </div>

      {/* NEW: FOOTER AS A MASSIVE BUTTON WITH PERFECT LAYOUT PACING */}
      <footer
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group w-full h-[160px] bg-[#000000] border-t border-white/10 py-8 px-6 md:px-[50px] flex justify-center relative z-20 overflow-hidden cursor-pointer"
      >
        {/* THE STEEP CONTINUOUS CHEVRON PATTERN (Comfortable 15s speed) */}
        <style>{`
            @keyframes scrollContinuousChevron {
              from { background-position: center 0px; }
              to { background-position: center -1600px; } 
            }
            .animate-continuous-chevron {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L50,-50 L100,0 L100,6.25 L50,-43.75 L0,6.25 Z M0,12.5 L50,-37.5 L100,12.5 L100,18.75 L50,-31.25 L0,18.75 Z M0,25 L50,-25 L100,25 L100,31.25 L50,-18.75 L0,31.25 Z M0,37.5 L50,-12.5 L100,37.5 L100,43.75 L50,-6.25 L0,43.75 Z M0,50 L50,0 L100,50 L100,56.25 L50,6.25 L0,56.25 Z M0,62.5 L50,12.5 L100,62.5 L100,68.75 L50,18.75 L0,68.75 Z M0,75 L50,25 L100,75 L100,81.25 L50,31.25 L0,81.25 Z M0,87.5 L50,37.5 L100,87.5 L100,93.75 L50,43.75 L0,93.75 Z M0,100 L50,50 L100,100 L100,106.25 L50,56.25 L0,106.25 Z M0,112.5 L50,62.5 L100,112.5 L100,118.75 L50,68.75 L0,118.75 Z M0,125 L50,75 L100,125 L100,131.25 L50,81.25 L0,131.25 Z M0,137.5 L50,87.5 L100,137.5 L100,143.75 L50,93.75 L0,143.75 Z' fill='%23ffffff'/%3E%3C/svg%3E");
              background-size: 200vw 1600px; 
              background-repeat: repeat-y; 
              animation: scrollContinuousChevron 15s linear infinite; 
              transform: translateZ(0);
            }
          `}</style>

        {/* THE PATTERN LAYER */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0 pointer-events-none animate-continuous-chevron" />

        {/* CONTENT WRAPPER: 3-Column Layout with items-end to lock baselines */}
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-12 md:gap-4 relative z-10 mix-blend-difference pointer-events-none">
          {/* Left Column: Branding */}
          <div className="flex flex-col items-center md:items-start gap-3 flex-1 basis-0 w-full">
            <Image
              src="/logos/F1.svg"
              alt="Foxil F1 Archive"
              width={70}
              height={24}
              className="brightness-0 invert mb-2"
            />
            <h2 className="font-akira text-2xl md:text-3xl text-[#ffffff] tracking-[0.15em]">
              ARCHIVE 2020
            </h2>
            <p className="font-orbitron text-[#ffffff] text-[10px] tracking-[0.2em] uppercase text-center md:text-left opacity-80">
              Curated & Designed by Foxil
            </p>
          </div>

          {/* Center Column: Return to Top */}
          <div className="flex justify-center items-end flex-1 basis-0 w-full pb-1">
            <span className="font-akira text-[#ffffff] text-sm md:text-base tracking-[0.2em] uppercase group-hover:-translate-y-2 transition-transform duration-500 ease-out">
              return to top
            </span>
          </div>

          {/* Right Column: Disclaimer */}
          <div className="flex justify-center md:justify-end flex-1 basis-0 w-full pb-4">
            <p className="w-full md:max-w-[440px] font-inter text-[#ffffff] text-[10px] md:text-[10.5px] leading-[1.8] uppercase tracking-wider text-center md:text-right">
              This website is an unofficial portfolio piece and is not
              associated in any way with the Formula 1 companies. F1, FORMULA
              ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and
              related marks are trade marks of Formula One Licensing B.V.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
