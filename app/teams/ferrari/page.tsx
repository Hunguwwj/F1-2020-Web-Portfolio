"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

/**
 * Đăng ký plugin GSAP.
 * - ScrollTrigger: dùng để chạy animation theo vị trí scroll.
 * - useGSAP: hook chính thức của GSAP cho React/Next.js.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Component canvas/model 3D.
 *
 * Hiện tại file model của bạn vẫn là Ferrari:
 * ../../../components/ferrariCanvas
 *
 * Sau này nếu làm Mercedes/Red Bull/McLaren, bạn chỉ cần:
 * 1. tạo component canvas mới, ví dụ components/mercedesCanvas.tsx
 * 2. đổi đường import ở đây
 *
 * Ví dụ:
 * const TeamScene = dynamic(() => import("../../../components/mercedesCanvas"), {
 *   ssr: false,
 * });
 *
 * dynamic(..., { ssr: false }) rất quan trọng vì canvas/three.js chỉ chạy ở browser,
 * không chạy được khi server render.
 */
const TeamScene = dynamic(() => import("../../../components/ferrariCanvas"), {
  ssr: false,
});

/**
 * Type cho từng ảnh trong horizontal gallery.
 * Dùng type riêng để sau này thêm/bớt ảnh dễ hơn.
 */
type GalleryItem = {
  label: string;
  src: string;
  alt: string;

  /**
   * Các class Tailwind quyết định kích thước/vị trí từng ảnh.
   * Vì gallery của bạn muốn "lộn xộn", mỗi card nên có width/height/offset riêng.
   */
  cardClassName: string;
  imageBoxClassName: string;
};

/**
 * Type chứa toàn bộ data của 1 team/car page.
 *
 * Mục tiêu:
 * - Không hard-code Ferrari/SF1000 khắp JSX.
 * - Muốn đổi sang xe khác thì đổi data ở đây là chính.
 */
type TeamPageData = {
  teamName: string;
  carName: string;
  season: string;
  teamColor: string;

  titleLabelLeft: string;
  titleLabelRight: string;
  titleText: string;
  titleSubtitle: string;

  galleryItems: GalleryItem[];

  storyLabelLeft: string;
  storyLabelRight: string;
  storyText: string;
};

/**
 * Data hiện tại cho Ferrari SF1000.
 *
 * Sau này muốn dùng lại layout cho team khác, bạn copy object này và đổi:
 * - teamName
 * - carName
 * - logoSrc
 * - titleText
 * - storyText
 * - galleryItems
 * - teamColor
 */
const teamPageData: TeamPageData = {
  teamName: "Ferrari",
  carName: "SF1000",
  season: "2020",
  teamColor: "#e10600",

  titleLabelLeft: "Chassis",
  titleLabelRight: "2020",
  titleText: "SF1000",
  titleSubtitle: "The car that marked Ferrari's 1000th Grand Prix.",

  galleryItems: [
    {
      label: "Ferrari / 2020",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 1",
      cardClassName: "mt-[-18vh] w-[26vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "SF1000 Detail",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 2",
      cardClassName: "mt-[12vh] w-[42vw]",
      imageBoxClassName: "h-[64vh]",
    },
    {
      label: "Chassis",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 3",
      cardClassName: "mt-[-22vh] w-[22vw]",
      imageBoxClassName: "h-[34vh]",
    },
    {
      label: "Race Frame",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 4",
      cardClassName: "mt-[20vh] w-[30vw]",
      imageBoxClassName: "h-[44vh]",
    },
    {
      label: "Prancing Horse",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 5",
      cardClassName: "mt-[-10vh] w-[46vw]",
      imageBoxClassName: "h-[58vh]",
    },
    {
      label: "Engine Era",
      src: "/images/ferrari.jpg",
      alt: "Ferrari archive 6",
      cardClassName: "mt-[16vh] w-[24vw]",
      imageBoxClassName: "h-[36vh]",
    },
  ],

  storyLabelLeft: "The Story",
  storyLabelRight: "2020",
  storyText:
    "A historically difficult year for the Prancing Horse. The SF1000, named to celebrate Ferrari's 1000th Grand Prix, suffered from a lack of straight-line speed following a private settlement with the FIA regarding their 2019 engine. Ferrari slumped to 6th in the standings, their worst finish in 40 years, though Charles Leclerc’s over-driving of the car provided a few rare highlights.",
};

/**
 * Tập trung toàn bộ selector GSAP vào một chỗ.
 *
 * Vì trước đó bạn dùng rất nhiều class ferrari-...
 * Nếu sau này đổi Ferrari sang team khác, đổi selector rải rác rất dễ lỗi.
 *
 * Ở bản này dùng prefix "team-" để layout có thể tái sử dụng cho nhiều đội.
 */
const SELECTORS = {
  topbar: "#f1-topbar",

  heroSection: ".team-hero",
  modelWrapper: ".team-car-scroll",

  titleSection: ".team-title-section",
  titleBlock: ".team-title-block",
  titleText: ".team-title-text",

  titleSubtitleBlock: ".team-title-subtitle-block",
  titleSubtitleText: ".team-title-subtitle-text",

  horizontalSection: ".team-horizontal-section",
  horizontalTrack: ".team-horizontal-track",
  horizontalCard: ".team-horizontal-card",

  textRevealSection: ".team-text-reveal-section",
  revealWord: ".team-reveal-word",
};

/**
 * Hàm nhỏ để ghép className cho gọn.
 * Dùng thay vì viết nối chuỗi thủ công.
 */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function TeamPage() {
  /**
   * Ref của toàn bộ page.
   * useGSAP dùng scope này để animation chỉ ảnh hưởng trong page hiện tại.
   */
  const pageRef = useRef<HTMLElement | null>(null);

  /**
   * Tách storyText thành từng từ để làm hiệu ứng:
   * chữ ban đầu mờ, scroll tới thì từng từ đậm dần.
   *
   * useMemo giúp không split lại text mỗi lần component render.
   */
  const storyWords = useMemo(() => teamPageData.storyText.split(" "), []);

  useGSAP(
    () => {
      /**
       * 1. TOPBAR
       * -----------------------------------------------------
       * Ẩn topbar ở hero, sau đó hiện topbar khi scroll xuống một đoạn.
       *
       * Điều kiện:
       * - Topbar trong components/Topbar.tsx phải có id="f1-topbar".
       * - Hero section phải có class "team-hero".
       */
      const topbar = document.querySelector(SELECTORS.topbar);

      if (topbar) {
        gsap.set(topbar, {
          yPercent: -100,
          autoAlpha: 0,
        });

        ScrollTrigger.create({
          trigger: SELECTORS.heroSection,

          /**
           * Topbar sẽ hiện khi vị trí 75% chiều cao hero chạm top viewport.
           * Muốn hiện sớm hơn: "top 90%" hoặc "top 85%"
           * Muốn hiện muộn hơn: "bottom top"
           */
          start: "75% top",

          onEnter: () => {
            gsap.to(topbar, {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.45,
              ease: "power3.out",
            });
          },

          onLeaveBack: () => {
            gsap.to(topbar, {
              yPercent: -100,
              autoAlpha: 0,
              duration: 0.35,
              ease: "power3.in",
            });
          },
        });
      }

      /**
       * 4. HORIZONTAL GALLERY
       * -----------------------------------------------------
       * Scroll dọc nhưng ảnh chạy ngang.
       * Track bị pin lại, sau đó toàn bộ track dịch sang trái.
       */
      const horizontalTrack = pageRef.current?.querySelector(
        SELECTORS.horizontalTrack,
      ) as HTMLElement | null;

      if (horizontalTrack) {
        gsap.fromTo(
          horizontalTrack,
          {
            // Ban đầu đẩy gallery sang phải,
            // chỉ lộ một phần ảnh ở mép phải màn hình
            x: () => window.innerWidth * 0.82,
          },
          {
            // Khi scroll, gallery chạy từ phải sang trái
            x: () => -(horizontalTrack.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: SELECTORS.horizontalSection,
              start: "top top",
              end: () => `+=${horizontalTrack.scrollWidth * 2}`,
              scrub: 1.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /**
       * 5. TEXT REVEAL
       * -----------------------------------------------------
       * Đoạn văn được tách thành từng từ.
       * Khi scroll tới section này, section bị pin lại.
       * Người dùng scroll để từng từ từ mờ chuyển sang đậm.
       */
      gsap.fromTo(
        SELECTORS.revealWord,
        {
          color: "rgba(0, 0, 0, 0.10)",
        },
        {
          color: "rgba(0, 0, 0, 1)",
          stagger: 0.025,
          ease: "none",
          scrollTrigger: {
            trigger: SELECTORS.textRevealSection,
            start: "top top",
            end: "+=1800",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        },
      );

      /**
       * Refresh lại ScrollTrigger sau khi browser tính layout.
       * Hữu ích khi có canvas/model/ảnh load chậm làm thay đổi chiều cao trang.
       */
      gsap.delayedCall(0.5, () => {
        ScrollTrigger.refresh();
      });
    },
    { scope: pageRef },
  );

  return (
    <main ref={pageRef} className="relative overflow-x-hidden">
      {/* =====================================================
          MODEL 3D FIXED BACKGROUND
          -----------------------------------------------------
          Model nằm fixed phía sau hero.
          Vì chỉ có PAGE 1 cần model, các section sau dùng z-20 để che lên.
      ===================================================== */}
      <div className="team-car-scroll absolute left-0 top-0 z-0 h-screen w-screen scale-[1.08] pointer-events-none overflow-hidden will-change-transform">
        <TeamScene />
      </div>

      {/* =====================================================
          PAGE 1 - HERO
          -----------------------------------------------------
          Logo team đặt giữa màn hình, model 3D nằm phía sau.
      ===================================================== */}
      <section className="team-hero relative z-10 flex h-screen items-center  pointer-events-none  justify-center overflow-hidden"></section>

      {/* =====================================================
          PAGE 2 - TITLE + GALLERY
      ===================================================== */}
      

      {/* PAGE 2B - HORIZONTAL GALLERY */}
      <section className="team-horizontal-section relative z-30 h-screen overflow-hidden bg-white">
        <div className="team-horizontal-track flex h-full w-max items-center gap-[7vw] px-[8vw]">
          {teamPageData.galleryItems.map((item, index) => (
            <article
              key={`${item.label}-${index}`}
              className={cn(
                "team-horizontal-card shrink-0",
                item.cardClassName,
              )}
            >
              <p
                className="mb-3 font-akira text-[10px] uppercase tracking-[0.18em]"
                style={{ color: `${teamPageData.teamColor}b3` }}
              >
                {item.label}
              </p>

              <div className={cn("overflow-hidden", item.imageBoxClassName)}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          PAGE 3 - TEXT REVEAL
          -----------------------------------------------------
          Section kể chuyện. Text được tách từng từ để reveal theo scroll.
      ===================================================== */}
      <section className="team-text-reveal-section relative z-20 flex h-screen items-center justify-center bg-white text-black">
        <div className="w-full px-[6vw]">
          <div
            className="pointer-events-none absolute left-[4vw] top-[10vh] z-30 font-akira text-[11px] uppercase leading-none tracking-[0.24em]"
            style={{ color: teamPageData.teamColor }}
          >
            {teamPageData.storyLabelLeft}
          </div>

          <div
            className="pointer-events-none absolute right-[4vw] top-[10vh] z-30 font-akira text-[11px] uppercase leading-none tracking-[0.24em]"
            style={{ color: teamPageData.teamColor }}
          >
            {teamPageData.storyLabelRight}
          </div>

          <p className="mx-auto max-w-6xl text-center font-sans text-[30px] font-light leading-tight tracking-tighter md:text-[50px]">
            {storyWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="team-reveal-word mr-[0.22em] inline-block text-black/10"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>
    </main>
  );
}
