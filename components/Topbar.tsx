"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";

export default function Topbar() {
  const pathname = usePathname();
  const isTeamPage = pathname?.includes("/teams");

  /**
   * Overlay transition:
   * - overlayRef: lớp phủ toàn màn hình.
   * - columnRefs: các cột đỏ.
   * - isAnimatingRef: chặn việc bấm nút Top nhiều lần liên tục.
   */
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
      /**
       * Bật overlay lên trước.
       * autoAlpha = opacity + visibility.
       */
      .set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
      })

      /**
       * Trạng thái ban đầu:
       * - Cột nằm phía trên màn hình.
       */
      .set(columns, {
        yPercent: -100,
      })

      /**
       * Bước 1:
       * Các cột đi từ trên xuống và dừng ở giữa để che kín màn hình.
       *
       * Lỗi trước đó là bạn cho cột chạy thẳng từ -100 xuống 100,
       * nên nó chỉ lướt qua rất nhanh và không có trạng thái che màn hình.
       */
      .to(columns, {
        yPercent: 0,
        duration: 0.7,
        stagger: 0.055,
      })

      /**
       * Khi màn hình đang bị che, nhảy về đầu trang.
       * Dùng behavior: "auto" để không bị smooth scroll lộ phía sau transition.
       */
      .add(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      })

      /**
       * Bước 2:
       * Cột tiếp tục đi xuống để biến mất.
       */
      .to(columns, {
        yPercent: 100,
        duration: 0.75,
        stagger: 0.055,
      })

      /**
       * Reset lại mọi thứ sau khi animation xong.
       * Lần sau bấm Top, cột lại bắt đầu từ trên xuống.
       */
      .set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      })
      .set(columns, {
        yPercent: -100,
      });
  }

  return (
    <>
      {/* Overlay transition cho nút Top */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-9999 flex opacity-0"
      >
        {/* Các cột đỏ phủ toàn màn hình */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) columnRefs.current[index] = el;
            }}
            className="h-full flex-1 bg-[#e10600]"
          />
        ))}
      </div>

      <header
        id="f1-topbar"
        className={`fixed left-0 top-0 z-9999 flex h-12.5 w-full items-center justify-center bg-white shadow-sm ${
          isTeamPage ? "opacity-0" : "opacity-100"
        }`}
      >
        {isTeamPage && (
          <Link
            href="/"
            className="group absolute left-6 top-1/2 z-10000 -translate-y-1/2 overflow-hidden border border-red-600 px-4 py-2 font-akira text-[11px] uppercase tracking-[0.18em] text-red-600"
          >
            <span className="absolute inset-0 translate-y-full bg-red-600 transition-transform duration-300 ease-out group-hover:translate-y-0" />

            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Hero
            </span>
          </Link>
        )}

        {/* Logo F1 ở giữa topbar, không bấm được */}
        <div className="pointer-events-none z-10000">
          <Image
            src="/logos/F1.svg"
            alt="F1"
            width={120}
            height={40}
            priority
          />
        </div>

        {isTeamPage && (
          <button
            type="button"
            onClick={scrollToTop}
            className="group absolute right-6 top-1/2 z-10000 -translate-y-1/2 overflow-hidden border border-red-600 px-4 py-2 font-akira text-[11px] uppercase tracking-[0.18em] text-red-600"
          >
            <span className="absolute inset-0 translate-y-full bg-red-600 transition-transform duration-300 ease-out group-hover:translate-y-0" />

            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Top
            </span>
          </button>
        )}
      </header>
    </>
  );
}
