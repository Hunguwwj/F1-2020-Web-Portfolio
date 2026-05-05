"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "../links/routes";
import Tracks from "../components/tracks";
import Championships from "../components/championship";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const slicesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const backgroundsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [hoverIndex, setHoverIndex] = useState(-1);

  // Smooth GSAP Entrance Animation
  useGSAP(
    () => {
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
    },
    { scope: mainRef },
  );

  // Smooth GSAP Hover Transitions (Fixes the stuttering)
  useGSAP(() => {
    teams.forEach((_, index) => {
      const slice = slicesRef.current[index];
      const bg = backgroundsRef.current[index];
      if (!slice || !bg) return;

      const targetClipPath = getClipPath(index);

      // Animate the polygon slice directly on the GPU
      gsap.to(slice, {
        clipPath: targetClipPath,
        duration: 0.8,
        ease: "power4.out",
      });

      // Animate the background image scale and filter
      const isHovered = hoverIndex === index;
      const isOtherHovered = hoverIndex !== -1 && !isHovered;

      gsap.to(bg, {
        scale: isHovered ? 1.05 : 1,
        filter: isOtherHovered
          ? "brightness(0.4) grayscale(0.5)"
          : "brightness(1) grayscale(0)",
        duration: 0.8,
        ease: "power4.out",
      });
    });
  }, [hoverIndex]);

  const total = teams.length;
  const baseWidth = 100 / total;
  const hoverWidth = 25;

  const getClipPath = (index: number) => {
    if (hoverIndex === -1) {
      return `polygon(${index * baseWidth}% 0%, ${(index + 1) * baseWidth}% 0%, ${(index + 1) * baseWidth}% 100%, ${index * baseWidth}% 100%)`;
    }

    const minRestWidth = 5;
    const idealLeft = hoverIndex * baseWidth + baseWidth / 2 - hoverWidth / 2;
    const minLeft = hoverIndex * minRestWidth;
    const maxLeft = 100 - hoverWidth - (total - 1 - hoverIndex) * minRestWidth;
    const leftEdge = Math.max(minLeft, Math.min(idealLeft, maxLeft));
    const rightEdge = leftEdge + hoverWidth;

    if (index === hoverIndex) {
      return `polygon(${leftEdge}% 0%, ${rightEdge}% 0%, ${rightEdge}% 100%, ${leftEdge}% 100%)`;
    }
    if (index < hoverIndex) {
      const wL = leftEdge / hoverIndex;
      return `polygon(${index * wL}% 0%, ${(index + 1) * wL}% 0%, ${(index + 1) * wL}% 100%, ${index * wL}% 100%)`;
    }
    const wR = (100 - rightEdge) / (total - 1 - hoverIndex);
    const offset = rightEdge + (index - hoverIndex - 1) * wR;
    return `polygon(${offset}% 0%, ${offset + wR}% 0%, ${offset + wR}% 100%, ${offset}% 100%)`;
  };

  const getLogoCenter = (index: number) => {
    if (hoverIndex === -1) {
      return index * baseWidth + baseWidth / 2;
    }

    const minRestWidth = 5;
    const idealLeft = hoverIndex * baseWidth + baseWidth / 2 - hoverWidth / 2;
    const minLeft = hoverIndex * minRestWidth;
    const maxLeft = 100 - hoverWidth - (total - 1 - hoverIndex) * minRestWidth;
    const leftEdge = Math.max(minLeft, Math.min(idealLeft, maxLeft));
    const rightEdge = leftEdge + hoverWidth;

    if (index === hoverIndex) {
      return leftEdge + hoverWidth / 2;
    }
    if (index < hoverIndex) {
      const wL = leftEdge / hoverIndex;
      return index * wL + wL / 2;
    }
    const wR = (100 - rightEdge) / (total - 1 - hoverIndex);
    return rightEdge + (index - hoverIndex - 1) * wR + wR / 2;
  };

  return (
    <main ref={mainRef} className="w-full relative bg-[#0a0a0a]">
      <div
        id="hero"
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden bg-black z-10"
      >
        {teams.map((team, index) => {
          const isHovered = hoverIndex === index;
          const isOtherHovered = hoverIndex !== -1 && !isHovered;

          return (
            <Link
              href={team.route}
              key={index}
              ref={(el) => {
                slicesRef.current[index] = el;
              }}
              className="slice absolute top-0 left-0 w-full h-full cursor-pointer z-1 block"
              style={{ clipPath: getClipPath(index) }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
            >
              <div
                ref={(el) => {
                  backgroundsRef.current[index] = el;
                }}
                className="slice-bg absolute top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${team.bg})` }}
              />
              <div className="slice-tint absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div
                className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-20 transition-all duration-500 ease-out"
                style={{
                  background: `linear-gradient(to bottom, ${team.glowColor}, transparent)`,
                  opacity: isOtherHovered ? 0.3 : isHovered ? 0.8 : 0.5,
                }}
              />
              <div
                className="team-logo-container absolute top-[15%] flex items-center justify-center z-30 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  height: "110px",
                  left: `${getLogoCenter(index)}%`,
                  transform: "translateX(-50%)",
                  opacity: isHovered ? 1 : 0,
                  filter: isOtherHovered ? "grayscale(0.6)" : "grayscale(0)",
                }}
              >
                <div
                  className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] flex items-center justify-center relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `scale(${isHovered ? 1.15 : 0.95})` }}
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
    </main>
  );
}
