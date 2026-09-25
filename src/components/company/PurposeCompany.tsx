"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeCompany() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const dramaticTurnRef = useRef<HTMLDivElement>(null);

  const missionText = "To build the infrastructure, brand, technology, and operations, that lets independent agents compete and win across the United States.";
  const words = missionText.split(" ");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Hold the pin for 1 screen height so the user focuses on the text
          pin: true,
        }
      });

      // 1. BLUR-REVEAL (Automatic Play on Enter)
      gsap.set(".v2-word", { opacity: 0, filter: "blur(16px)", y: 20 });
      tl.to(".v2-word", {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        duration: 0.8
      });

      // 2. Dramatic Turn (Appears right after mission completes)
      gsap.set(dramaticTurnRef.current, { opacity: 0, y: 30 });
      tl.to(dramaticTurnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4"); // Starts slightly before the last word finishes

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#111111] text-[#F3EFE9] flex flex-col justify-center overflow-hidden z-10"
    >
      <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px] relative z-10">
        
        {/* Minimalist Grid Title */}
        <div className="col-start-1 col-end-13 mb-[8vh] flex items-center gap-4 opacity-50">
          <div className="w-2 h-2 bg-[#F3EFE9] rounded-full" />
          <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">Why we exist</span>
        </div>

        {/* Mission (Cols 1-11) */}
        <div className="col-start-1 col-end-12 flex flex-col" ref={textContainerRef}>
          <h2 className="text-[clamp(2.5rem,4.5vw,5.5rem)] leading-[1.1] font-bold tracking-tight">
            <div className="flex flex-wrap">
              {words.map((word, i) => (
                <span key={i} className="v2-word mr-[0.25em] will-change-[filter,transform,opacity]">
                  {word}
                </span>
              ))}
            </div>
          </h2>
        </div>

        {/* Dramatic Turn (Cols 8-10, editorial 3-column width) */}
        <div className="col-start-8 col-end-11 mt-[12vh]" ref={dramaticTurnRef}>
          <p className="text-[20px] 2xl:text-[24px] leading-[1.5] text-[#F3EFE9]/70 font-medium">
            The market rewards big agencies. We bet the independent agent, with the right tools, delivers the best experience for the end client.
          </p>
        </div>

      </div>
    </section>
  );
}
