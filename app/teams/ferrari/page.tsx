"use client";
import Image from "next/image";
import { useRef } from "react";
import Navbar from "../../../components/navbar";
import { DecodeText, FloatinByText } from "../../../hook/text-anim";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
import dynamic from "next/dynamic";

const FerrariScene = dynamic(
  () => import("../../../components/ferrariCanvas"),
  {
    ssr: false,
  },
);

export default function Ferrari() {
  const textRef = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      // We only need to handle the text animations here now.
      // Delay slightly to let the transition swipe clear the screen.
      gsap.delayedCall(1, () => {
        FloatinByText(".floatin");
        DecodeText(".decode");
        ScrollTrigger.refresh();
      });
    },
    { scope: textRef },
  );

  return (
    <>
      <FerrariScene />

      <section className="h-screen z-3 flex justify-center items-center relative">
        <Image
          src="../../../logos/ferrari.svg"
          alt=""
          width={200}
          height={100}
        />
      </section>

      <section
        ref={textRef}
        className=" font-akira h-screen z-5 flex flex-col items-center justify-center bg-white text-black"
      >
        <div className="text-5xl floatin flex items-center justify-center flex-col">
          <Navbar />
        </div>
        <h1 className="text-5xl decode p-1">Hello World</h1>
      </section>
    </>
  );
}
