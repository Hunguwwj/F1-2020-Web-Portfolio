"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";

export default function Topbar() {
  const pathname = usePathname();
  const isTeamPage = pathname?.includes("/teams");

  useEffect(() => {
    const topbarRoot = document.getElementById("f1-topbar-root");
    const topbar = document.getElementById("f1-topbar");

    if (!topbarRoot || !topbar) return;

    /**
     * Set the default dark theme variables for the Home page.
     * We REMOVED the gsap.set(yPercent/autoAlpha) here so that the 
     * Home page's ScrollTrigger has full control over hiding/revealing it!
     */
    if (!isTeamPage) {
      topbarRoot.style.setProperty("--topbar-bg", "#0a0a0a");
      topbarRoot.style.setProperty("--topbar-accent", "rgba(255, 255, 255, 0.1)");
      topbarRoot.style.setProperty("--topbar-hover-text", "#ffffff");
      topbarRoot.style.setProperty("--topbar-button-shadow", "rgba(225, 6, 0, 0.25)");
      topbarRoot.style.setProperty("--topbar-overlay", "#e10600");
    }
  }, [isTeamPage, pathname]);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<HTMLDivElement[]>([]);
  const isAnimatingRef = useRef(false);

  function scrollToTop() {
    if (isAnimatingRef.current) return;

    const overlay = overlayRef.current;
    const columns = columnRefs.current.filter(Boolean);

    if (!overlay || columns.length === 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      defaults: {
        ease: "power4.inOut",
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl
      .set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
      })
      .set(columns, {
        yPercent: -100,
      })
      .to(columns, {
        yPercent: 0,
        duration: 0.7,
        stagger: 0.055,
      })
      .add(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      })
      .to(columns, {
        yPercent: 100,
        duration: 0.75,
        stagger: 0.055,
      })
      .set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      })
      .set(columns, {
        yPercent: -100,
      });
  }

  return (
    <div
      id="f1-topbar-root"
      style={
        {
          "--topbar-bg": "#ffffff",
          "--topbar-accent": "rgba(255, 255, 255, 0.1)",
          "--topbar-hover-text": "#ffffff",
          "--topbar-button-shadow": "rgba(225, 6, 0, 0.25)",
          "--topbar-overlay": "#e10600",
        } as CSSProperties
      }
    >
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[99999] flex opacity-0"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) columnRefs.current[index] = el;
            }}
            className="h-full flex-1"
            style={{ backgroundColor: "var(--topbar-overlay)" }}
          />
        ))}
      </div>

      <header
        id="f1-topbar"
        className={`fixed left-0 top-0 z-[9999] flex h-[50px] w-full items-center justify-center border-b shadow-sm ${
          isTeamPage ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundColor: "var(--topbar-bg)",
          color: "var(--topbar-accent)",
          borderColor: "var(--topbar-accent)",
        }}
      >
        {isTeamPage && (
          <TopbarButton href="/" side="left">
            Hero
          </TopbarButton>
        )}

        <div className="pointer-events-none z-[10000]">
          <Image
            src="/logos/F1.svg"
            alt="F1"
            width={120}
            height={40}
            priority
          />
        </div>

        {isTeamPage && (
          <TopbarButton side="right" onClick={scrollToTop}>
            Top
          </TopbarButton>
        )}
      </header>
    </div>
  );
}

function TopbarButton({
  children,
  side,
  href,
  onClick,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  href?: string;
  onClick?: () => void;
}) {
  const className = `group absolute top-1/2 z-[10000] -translate-y-1/2 overflow-hidden border px-4 py-2 font-akira text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ease-out hover:-translate-y-[calc(50%+4px)] hover:shadow-[0_10px_25px_var(--topbar-button-shadow)] active:-translate-y-1/2 active:scale-95 ${
    side === "left" ? "left-6" : "right-6"
  }`;

  const content = (
    <>
      <span
        className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
        style={{ backgroundColor: "var(--topbar-accent)" }}
      />
      <span className="relative z-10 text-[var(--topbar-accent)] transition-colors duration-300 group-hover:text-[var(--topbar-hover-text)]">
        {children}
      </span>
    </>
  );

  const sharedStyle = {
    color: "var(--topbar-accent)",
    borderColor: "var(--topbar-accent)",
    backgroundColor: "transparent",
  };

  if (href) {
    return (
      <Link href={href} className={className} style={sharedStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      data-topbar-button
      type="button"
      onClick={onClick}
      className={className}
      style={sharedStyle}
    >
      {content}
    </button>
  );
}