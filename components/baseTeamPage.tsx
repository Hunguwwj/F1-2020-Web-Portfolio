"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================================
   1. EXPORTED TYPES FOR WRAPPERS
========================================================= */
export type GalleryItem = {
  label: string;
  src: string;
  alt: string;
  cardClassName: string;
  imageBoxClassName: string;
};

export type DriverStats = [label: string, value: string];
export type HighlightItem = [label: string, value: string, note: string];

export type TeamTheme = {
  pageBackground: string;
  surface: string;
  text: string;
  mutedText: string;
  accent: string;
  accentDark: string;
  footerAccent: string;
  storyBefore: string;
  storyAfter: string;
};

export type TeamPageData = {
  carName: string;
  teamName: string;
  season: string;
  logoSrc: string;
  logoAlt: string;
  storyLabelLeft: string;
  theme: TeamTheme;
  images: {
    heroCar: string;
    primaryDriverBackground: string;
    primaryDriverPortrait: string;
    secondaryDriverPortrait: string;
    highlightThumbnail: string;
  };
  galleryItems: GalleryItem[];
  storyText: string;
  primaryDriver: {
    name: string;
    videoUrl: string;
    videoLabel: string;
    description: string;
  };
  secondaryDriver: {
    name: string;
    description: string;
    statsTitle: string;
    statsSubTitle: string;
    stats: DriverStats[];
  };
  highlight: {
    title: string;
    subTitle: string;
    videoUrl: string;
    videoLabel: string;
    items: HighlightItem[];
  };
};

/* =========================================================
   2. BASE PAGE PROPS
========================================================= */
interface BaseTeamPageProps {
  data: TeamPageData;
  SceneComponent: React.ComponentType;
}

/* =========================================================
   3. ANIMATION CONFIG & SELECTORS
========================================================= */
const ANIMATION = {
  loading: { modelDelay: 300, fallbackDelay: 500 },
  topbar: { start: "75% top", showDuration: 0.45, hideDuration: 0.35 },
  gallery: { startXRatio: 0.82, scrollLengthMultiplier: 2, scrub: 1.5 },
  storyReveal: { scrollLength: 2800, wordStagger: 0.025 },
  carDetails: { fadeUpY: 60, slideX: 100, fadeDuration: 1, scaleDuration: 1.2 },
} as const;

const SELECTORS = {
  topbarRoot: "#f1-topbar-root",
  topbar: "#f1-topbar",
  heroSection: ".team-hero",
  horizontalSection: ".team-horizontal-section",
  horizontalTrack: ".team-horizontal-track",
  textRevealSection: ".team-text-reveal-section",
  revealWord: ".team-reveal-word",
  carDetailRoot: ".team-car-detail-root",
} as const;

/* =========================================================
   4. HELPERS
========================================================= */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getAccentShadow(color: string) {
  return `0 20px 50px ${color}4D`;
}

function applyTopbarTheme(theme: TeamTheme) {
  const topbarRoot = document.querySelector(SELECTORS.topbarRoot) as HTMLElement | null;
  const topbar = document.querySelector(SELECTORS.topbar) as HTMLElement | null;

  if (!topbarRoot || !topbar) return;

  topbarRoot.style.setProperty("--topbar-bg", theme.pageBackground);
  topbarRoot.style.setProperty("--topbar-accent", theme.accent);
  topbarRoot.style.setProperty("--topbar-hover-text", theme.pageBackground);
  topbarRoot.style.setProperty("--topbar-button-shadow", `${theme.accent}66`);
  topbarRoot.style.setProperty("--topbar-overlay", theme.accent);

  gsap.set(topbar, {
    backgroundColor: theme.pageBackground,
    color: theme.accent,
    borderColor: theme.accent,
  });
}

/* =========================================================
   5. MASTER PAGE COMPONENT
========================================================= */
export default function BaseTeamPage({ data, SceneComponent }: BaseTeamPageProps) {
  const pageRef = useRef<HTMLElement | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const [canRenderScene, setCanRenderScene] = useState(false);

  const storyWords = useMemo(() => data.storyText.split(" "), [data.storyText]);

  useEffect(() => {
    let hasStarted = false;
    let modelTimer: number | undefined;
    let fallbackTimer: number | undefined;

    const startPage = () => {
      if (hasStarted) return;
      hasStarted = true;
      setIsPageReady(true);
      modelTimer = window.setTimeout(() => setCanRenderScene(true), ANIMATION.loading.modelDelay);
    };

    const handleLoadingComplete = () => {
      sessionStorage.setItem("app-loading-complete", "true");
      startPage();
    };

    if (sessionStorage.getItem("app-loading-complete") === "true") {
      startPage();
      return () => { if (modelTimer) window.clearTimeout(modelTimer); };
    }

    window.addEventListener("app-loading-complete", handleLoadingComplete);
    fallbackTimer = window.setTimeout(() => startPage(), ANIMATION.loading.fallbackDelay);

    return () => {
      window.removeEventListener("app-loading-complete", handleLoadingComplete);
      if (modelTimer) window.clearTimeout(modelTimer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, []);

  useGSAP(
    () => {
      if (!pageRef.current) return;

      setupTopbarAnimation(data.theme);
      setupStoryRevealAnimation(data.theme);
      setupHorizontalGallery(pageRef.current);
      setupCarDetailAnimations(pageRef.current);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    },
    { scope: pageRef, dependencies: [data.theme] }
  );

  return (
    <main
      ref={pageRef}
      className="relative overflow-x-hidden"
      style={{ backgroundColor: data.theme.pageBackground, color: data.theme.text }}
    >
      <div className="team-car-scroll pointer-events-none fixed left-0 top-0 z-0 h-screen w-screen overflow-hidden will-change-transform">
        {canRenderScene && <SceneComponent />}
      </div>
      <section className="team-hero pointer-events-none relative z-10 flex h-screen items-center justify-center overflow-hidden" />
      <StoryRevealSection data={data} storyWords={storyWords} />
      <HorizontalGallery data={data} />
      <CarDetailSections data={data} />
    </main>
  );
}

/* =========================================================
   6. SUB-COMPONENTS (Layout exactly as it was)
========================================================= */
function HorizontalGallery({ data }: { data: TeamPageData }) {
  return (
    <section className="team-horizontal-section relative z-30 h-screen overflow-hidden" style={{ backgroundColor: data.theme.pageBackground }}>
      <div className="team-horizontal-track flex h-full w-max items-center gap-[7vw] px-[8vw]">
        {data.galleryItems.map((item, index) => (
          <article key={`${item.label}-${index}`} className={cn("team-horizontal-card shrink-0", item.cardClassName)}>
            <p className="mb-3 font-akira text-[10px] uppercase tracking-[0.18em]" style={{ color: data.theme.accent }}>{item.label}</p>
            <div className={cn("relative overflow-hidden bg-black", item.imageBoxClassName)}>
              <Image src={item.src} alt={item.alt} fill className="object-cover" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StoryRevealSection({ data, storyWords }: { data: TeamPageData; storyWords: string[] }) {
  return (
    <section className="team-text-reveal-section relative z-20 flex h-screen items-center justify-center" style={{ backgroundColor: data.theme.pageBackground }}>
      <div className="w-full px-[6vw]">
        <SectionLabel position="left" text={data.storyLabelLeft} color={data.theme.accent} />
        <SectionLabel position="right" text={data.season} color={data.theme.accent} />
        <p className="mx-auto max-w-6xl text-center font-sans text-[30px] font-light leading-[1.25] tracking-[-0.05em] md:text-[50px]">
          {storyWords.map((word, index) => (
            <span key={`${word}-${index}`} className="team-reveal-word mr-[0.22em] inline-block" style={{ color: data.theme.storyBefore }}>
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function CarDetailSections({ data }: { data: TeamPageData }) {
  return (
    <section className="team-car-detail-root relative z-40 w-full overflow-hidden shadow-2xl" style={{ backgroundColor: data.theme.surface, color: data.theme.text }}>
      <CarHeaderSection data={data} />
      <div className="ml-[8%] mb-10 mt-32 h-[2px] w-[30%]" style={{ backgroundColor: `${data.theme.accent}4D` }} />
      <PrimaryDriverSection data={data} />
      <SecondaryDriverSection data={data} />
      <HighlightSection data={data} />
      <FooterSection data={data} />
    </section>
  );
}

function CarHeaderSection({ data }: { data: TeamPageData }) {
  return (
    <section className="relative h-[200vh] w-full overflow-hidden" style={{ backgroundColor: data.theme.surface, color: data.theme.text }}>
      <div className="relative flex h-full w-full overflow-hidden">
        <aside className="relative z-20 h-full w-[120px] shrink-0 overflow-hidden border-r shadow-[8px_0_20px_rgba(0,0,0,0.06)]" style={{ backgroundColor: data.theme.surface, borderColor: `${data.theme.accent}33` }}>
          <VerticalTeamTicker text={data.teamName} color={data.theme.accent} />
        </aside>
        <div className="relative h-full flex-1 overflow-hidden" style={{ backgroundColor: data.theme.surface }}>
          <Image src={data.images.heroCar} alt={`${data.carName} car`} fill className="object-cover opacity-80" />
          <div className="absolute right-0 top-0 z-20 flex h-24 w-24 items-center justify-center shadow-lg" style={{ backgroundColor: data.theme.accent }}>
            <div className="relative h-12 w-12"><Image src={data.logoSrc} alt={data.logoAlt} fill className="object-contain" /></div>
          </div>
          <div className="gsap-fade-up absolute bottom-[12vh] right-[8%] z-30 w-[480px] p-10 transition-transform duration-500 hover:-translate-y-2" style={{ backgroundColor: data.theme.accent, boxShadow: getAccentShadow(data.theme.accent) }}>
            <h2 className="text-[4rem] font-akira uppercase leading-[1.05] tracking-wider" style={{ color: data.theme.surface }}>{data.season}<br />Season</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

function VerticalTeamTicker({ text, color }: { text: string; color: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopItems = Array.from({ length: 5 }, () => text);

  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return;
    gsap.to(trackRef.current, {
      yPercent: -50, ease: "none", duration: 20, repeat: -1,
      scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={trackRef} className="absolute left-1/2 top-0 flex flex-col will-change-transform -translate-x-1/2">
        {[...loopItems, ...loopItems].map((item, index) => (
          <div key={`${item}-${index}`} className="mb-16 whitespace-nowrap font-akira text-[5.2rem] uppercase leading-none tracking-[0.02em] [writing-mode:vertical-rl] rotate-180" style={{ color }}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function PrimaryDriverSection({ data }: { data: TeamPageData }) {
  const driver = data.primaryDriver;
  return (
    <section className="relative w-full px-[5%] py-20">
      <div className="absolute inset-0 z-0 ml-[8%] flex justify-end">
        <div className="relative h-full w-full bg-gray-200/50"><Image src={data.images.primaryDriverBackground} alt="bg" fill className="object-cover opacity-50" /></div>
      </div>
      <div className="relative z-10 flex w-full items-center">
        <div className="gsap-slide-left relative z-20 mt-5 flex w-[45%] flex-col justify-center bg-[#111] p-16 text-white shadow-2xl xl:p-24">
          <div className="absolute -top-10 left-16"><PlayLink href={driver.videoUrl} accent={data.theme.accent} /></div>
          <h3 className="mt-10 mb-6 inline-block w-max border-b-4 pb-4 text-4xl font-black uppercase tracking-wide" style={{ borderColor: data.theme.accent }}>{driver.name}</h3>
          <p className="mb-8 text-lg font-light leading-relaxed text-gray-300">{driver.description}</p>
          <Link href={driver.videoUrl} target="_blank" className="text-sm underline transition-colors hover:text-white" style={{ color: data.theme.accent }}>{driver.videoLabel}</Link>
        </div>
        <div className="gsap-slide-right relative z-30 -ml-16 flex w-[55%] items-center">
          <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden border-8 border-white bg-gray-300 shadow-2xl md:h-[600px]">
            <Image src={data.images.primaryDriverPortrait} alt={driver.name} fill className="object-cover object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SecondaryDriverSection({ data }: { data: TeamPageData }) {
  const driver = data.secondaryDriver;
  return (
    <section className="relative z-10 flex w-full items-center overflow-hidden px-[5%] py-32" style={{ backgroundColor: data.theme.surface, color: data.theme.accent }}>
      <div className="gsap-slide-left flex w-[30%] flex-col justify-center pl-[5%] text-sm font-bold md:text-base" style={{ color: data.theme.accent }}>
        <h4 className="mb-6 border-l-4 pl-4 text-xl uppercase tracking-widest" style={{ borderColor: data.theme.accent }}>
          {driver.statsTitle}<br /><span className="text-sm text-gray-500">{driver.statsSubTitle}</span>:
        </h4>
        <ul className="space-y-3 text-gray-800">
          {driver.stats.map(([label, value]) => {
            const isImportant = label === "Total Races" || label === "Total Points";
            return (
              <li key={label} className="flex justify-between border-b border-gray-100 pb-2">
                <span>{label}:</span>
                <span className={isImportant ? "text-xl font-black" : "font-normal text-gray-600"} style={isImportant ? { color: data.theme.accent } : undefined}>{value}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="gsap-scale-up relative z-20 flex w-[40%] items-end justify-center px-10">
        <div className="relative flex h-[600px] w-full items-center justify-center overflow-hidden drop-shadow-2xl md:h-[700px]">
          <Image src={data.images.secondaryDriverPortrait} alt={driver.name} fill className="object-contain" />
        </div>
      </div>
      <div className="gsap-slide-right flex w-[30%] flex-col justify-center pr-[5%]">
        <h2 className="mb-6 text-4xl font-black uppercase tracking-wide xl:text-5xl" style={{ color: data.theme.accent }}>
          {driver.name.split(" ").map((part) => (<span key={part} className="block">{part}</span>))}
        </h2>
        <div className="mb-6 h-2 w-16" style={{ backgroundColor: data.theme.accent }} />
        <p className="text-base font-medium leading-relaxed xl:text-lg" style={{ color: data.theme.mutedText }}>{driver.description}</p>
      </div>
    </section>
  );
}

function HighlightSection({ data }: { data: TeamPageData }) {
  const highlight = data.highlight;
  return (
    <section className="relative flex w-full items-stretch pb-32">
      <div className="gsap-fade-up relative z-30 ml-[8%] mt-32 w-[35%] p-16 text-white shadow-[20px_20px_60px_rgba(0,0,0,0.3)]" style={{ backgroundColor: data.theme.accentDark }}>
        <h3 className="mb-8 inline-block border-b-2 border-white pb-4 text-4xl font-black uppercase tracking-wider">{highlight.title}</h3>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-300">{highlight.subTitle}</h4>
        <ul className="space-y-2 text-base font-medium">
          {highlight.items.map(([label, value, note]) => (
            <li key={label}>{label}: <span className="text-xl font-bold">{value}</span> {note}</li>
          ))}
        </ul>
      </div>
      <div className="gsap-slide-right group relative z-20 -ml-10 flex min-h-[600px] w-[55%] cursor-pointer flex-col items-center justify-center overflow-hidden bg-black p-12 shadow-2xl">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-900 opacity-50 transition-opacity group-hover:opacity-40" style={{ color: data.theme.text }}>
          <Image src={data.images.highlightThumbnail} alt="Thumbnail" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <PlayLink href={highlight.videoUrl} accent={data.theme.accent} size="large" />
        <Link href={highlight.videoUrl} target="_blank" className="absolute bottom-10 right-10 z-10 text-sm uppercase tracking-widest text-gray-400 underline transition-colors hover:text-white">{highlight.videoLabel}</Link>
      </div>
    </section>
  );
}

function FooterSection({ data }: { data: TeamPageData }) {
  const footerText = `${data.season} ${data.teamName}`;
  const FooterLine = ({ align }: { align: "left" | "right" }) => (
    <div className={cn("flex flex-1 items-center gap-6 opacity-60 transition-opacity hover:opacity-100", align === "right" ? "justify-end" : "justify-start")}>
      {align === "left" && <div className="h-[2px] w-24" style={{ backgroundColor: data.theme.accent }} />}
      <span className="text-sm font-bold tracking-[0.3em]" style={{ color: data.theme.accent }}>{footerText}</span>
      {align === "right" && <div className="h-[2px] w-24" style={{ backgroundColor: data.theme.accent }} />}
    </div>
  );

  return (
    <footer className="flex w-full flex-col items-center pb-0" style={{ backgroundColor: data.theme.surface, color: data.theme.text }}>
      <div className="flex w-full items-center justify-center gap-8 px-[10%] py-16">
        <FooterLine align="right" />
        <div className="relative h-24 w-32 px-8 transition-transform duration-300 hover:-translate-y-2">
          <Image src={data.logoSrc} alt={data.logoAlt} fill className="object-contain" />
        </div>
        <FooterLine align="left" />
      </div>
      <div className="w-full cursor-default py-6 text-center transition-colors duration-500" style={{ backgroundColor: data.theme.footerAccent }}>
        <span className="text-lg font-black tracking-[10px] text-white">{data.teamName}</span>
      </div>
    </footer>
  );
}

function SectionLabel({ position, text, color }: { position: "left" | "right"; text: string; color: string }) {
  return (
    <div className={cn("pointer-events-none absolute top-[10vh] z-30 font-akira text-[11px] uppercase leading-none tracking-[0.24em]", position === "left" ? "left-[4vw]" : "right-[4vw]")} style={{ color }}>
      {text}
    </div>
  );
}

function PlayLink({ href, accent, size = "normal" }: { href: string; accent: string; size?: "normal" | "large" }) {
  const isLarge = size === "large";
  return (
    <Link href={href} target="_blank" className="group relative z-10 flex">
      <div className={isLarge ? "flex h-24 w-24 items-center justify-center rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-110" : "flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-[#111] shadow-xl transition-all duration-300 group-hover:scale-110"}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.borderColor = accent; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isLarge ? "transparent" : "#111111"; e.currentTarget.style.borderColor = "#ffffff"; }}>
        <svg className={isLarge ? "ml-2 h-10 w-10 text-white" : "ml-2 h-8 w-8 text-white"} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      </div>
    </Link>
  );
}

/* =========================================================
   7. GSAP HELPER FUNCTIONS
========================================================= */
function setupTopbarAnimation(theme: TeamTheme) {
  const topbar = document.querySelector(SELECTORS.topbar) as HTMLElement | null;
  if (!topbar) return;
  applyTopbarTheme(theme);
  gsap.set(topbar.querySelectorAll("a, button"), { borderColor: theme.accent });
  gsap.set(topbar.querySelectorAll("svg, path"), { stroke: theme.accent });
  gsap.set(topbar, { yPercent: -100, autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: SELECTORS.heroSection, start: ANIMATION.topbar.start,
    onEnter: () => gsap.to(topbar, { yPercent: 0, autoAlpha: 1, duration: ANIMATION.topbar.showDuration, ease: "power3.out" }),
    onLeaveBack: () => gsap.to(topbar, { yPercent: -100, autoAlpha: 0, duration: ANIMATION.topbar.hideDuration, ease: "power3.in" }),
  });
}

function setupHorizontalGallery(pageElement: HTMLElement) {
  const track = pageElement.querySelector(SELECTORS.horizontalTrack) as HTMLElement | null;
  if (!track) return;
  gsap.fromTo(track, { x: () => window.innerWidth * ANIMATION.gallery.startXRatio },
    { x: () => -(track.scrollWidth - window.innerWidth), ease: "none",
      scrollTrigger: { trigger: SELECTORS.horizontalSection, start: "top top", end: () => `+=${track.scrollWidth * ANIMATION.gallery.scrollLengthMultiplier}`, scrub: ANIMATION.gallery.scrub, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true }
    }
  );
}

function setupStoryRevealAnimation(theme: TeamTheme) {
  gsap.fromTo(SELECTORS.revealWord, { color: theme.storyBefore },
    { color: theme.storyAfter, stagger: ANIMATION.storyReveal.wordStagger, ease: "none",
      scrollTrigger: { trigger: SELECTORS.textRevealSection, start: "top top", end: `+=${ANIMATION.storyReveal.scrollLength}`, scrub: true, pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true }
    }
  );
}

function setupCarDetailAnimations(pageElement: HTMLElement) {
  const root = pageElement.querySelector(SELECTORS.carDetailRoot) as HTMLElement | null;
  if (!root) return;
  const anims = [ { selector: ".gsap-fade-up", vars: { y: ANIMATION.carDetails.fadeUpY } }, { selector: ".gsap-slide-left", vars: { x: -ANIMATION.carDetails.slideX } }, { selector: ".gsap-slide-right", vars: { x: ANIMATION.carDetails.slideX } }, { selector: ".gsap-scale-up", vars: { y: 80 } } ];
  anims.forEach(({ selector, vars }) => {
    Array.from(root.querySelectorAll<HTMLElement>(selector)).forEach(el => {
      gsap.from(el, { ...vars, duration: ANIMATION.carDetails.fadeDuration, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true, toggleActions: "play none none none" } });
    });
  });
}