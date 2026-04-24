"use client";

import { useRef, startTransition } from "react";
import { gsap } from "gsap";
import { TransitionRouter } from "next-transition-router";

export default function TransitionFunc({
  children,
}: {
  children: React.ReactNode;
}) {
  const leftCanvasRef = useRef<HTMLDivElement | null>(null);
  const rightCanvasRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        const tl = gsap
          .timeline({ onComplete: next })
          // THE FIX: Reset the positional transforms left behind by the previous 'enter' animation
          .set(lineRef.current, { y: 0 })
          .set(leftCanvasRef.current, { x: "0%" })
          .set(rightCanvasRef.current, { x: "0%" })

          // 1. THE SPLIT: Drop the center line
          .fromTo(
            lineRef.current,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.35, ease: "expo.inOut" },
          )
          // 2. THE EXPANSION: Expand white canvases from the center
          .fromTo(
            [leftCanvasRef.current, rightCanvasRef.current],
            { scaleX: 0 },
            { scaleX: 1, duration: 0.45, ease: "power2.inOut" },
            "-=0.15",
          );

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        const tl = gsap
          .timeline()
          .call(() => {
            requestAnimationFrame(() => {
              startTransition(next);
            });
          })
          // THE PIT STOP: Hold the white screen still for 0.6s
          .to({}, { duration: 0.3 })
          // 3. THE EXIT: Shoot the line off the bottom of the screen
          .fromTo(
            lineRef.current,
            { scaleY: 1, y: 0 }, // explicitly define the start state
            { y: "100vh", duration: 0.3, ease: "power2.in" },
          )
          // 4. THE REVEAL: Pull the white canvases to the outer edges
          .fromTo(
            leftCanvasRef.current,
            { scaleX: 1, x: "0%" },
            { x: "-100%", duration: 0.6, ease: "expo.out" },
            "-=0.1",
          )
          .fromTo(
            rightCanvasRef.current,
            { scaleX: 1, x: "0%" },
            { x: "100%", duration: 0.6, ease: "expo.out" },
            "<",
          );

        return () => {
          tl.kill();
        };
      }}
    >
      {children}

      <div className="fixed inset-0 z-9999 pointer-events-none flex overflow-hidden">
        <div
          ref={leftCanvasRef}
          className="w-1/2 h-full bg-white origin-right scale-x-0"
        />
        <div
          ref={rightCanvasRef}
          className="w-1/2 h-full bg-white origin-left scale-x-0"
        />
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 w-1.25 h-full bg-[#000000] origin-top scale-y-0 -translate-x-1/2"
        />
      </div>
    </TransitionRouter>
  );
}
