"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeCompany() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const dramaticTurnRef = useRef<HTMLDivElement>(null);
  const visionParagraphRef = useRef<HTMLDivElement>(null);

  const missionText = "To build the infrastructure, brand, technology, and operations, that lets independent agents compete and win across the United States.";
  const words = missionText.split(" ");

  const visionText = "To be the reference agency in the United States, where the independent agent has everything they need to grow.";
  const visionWords = visionText.split(" ");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // ==========================================
      // ACT 02: AUTOMATIC ENTRANCE (Triggered once)
      // ==========================================
      const tlIntro = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          once: true,
        }
      });

      // 1. BLUR-REVEAL (Automatic Play on Enter)
      gsap.set(".v2-word", { opacity: 0, filter: "blur(16px)", y: 20 });
      tlIntro.to(".v2-word", {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        duration: 0.8
      });

      // 2. Dramatic Turn (Fades in)
      gsap.set(dramaticTurnRef.current, { opacity: 0 });
      tlIntro.to(dramaticTurnRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

      // ==========================================
      // ACT 02 -> ACT 03: SCRUB TRANSITION (Pinned)
      // ==========================================
      
      // Dramatic Turn Vertical Parallax (Applies to Act 2 paragraph during initial scroll)
      gsap.fromTo(dramaticTurnRef.current,
        { y: 100 },
        {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=100%", // First third of the pin
            scrub: 1,
          }
        }
      );

      // The Master Scrub Timeline (Controls the scene transition)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // Massive 3-screen pin duration
          pin: true,
          scrub: 1,
        }
      });

      // Phase 1: Hold Act 2 steady so the user can read it (0 to 33% of scroll)
      scrubTl.to({}, { duration: 1 });

      // Phase 2: KINETIC SLIDE & SCALE (Locomotive Classic Transition)
      scrubTl.to(".panel-purpose", { y: "-100vh", scale: 0.9, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "transition");
      gsap.set(".panel-vision", { y: "100vh", scale: 0.9, opacity: 1 });
      scrubTl.to(".panel-vision", { y: "0vh", scale: 1, duration: 1.5, ease: "power2.inOut" }, "transition");

      // Phase 2.5: Blur Reveal Vision Text (Scrubbed along with the transition finish)
      gsap.set(".vision-word", { opacity: 0, filter: "blur(16px)", y: 20 });
      scrubTl.to(".vision-word", {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.05,
        ease: "power2.out",
        duration: 0.5
      }, "transition+=1.0"); // Starts slightly before the slide finishes

      // Phase 3: Hold Act 3 steady so the user can read it (66% to 100% of scroll)
      // Act 3 Paragraph Vertical Parallax
      scrubTl.fromTo(visionParagraphRef.current,
        { y: 100 },
        { y: -100, ease: "none", duration: 1 },
        "transition+=1.5" // Starts immediately after the slide transition finishes
      );

    }, containerRef);

    return () => ctx.revert();
  }, []); // Run once on mount

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#111111] text-[#F3EFE9] overflow-hidden z-10"
    >
      {/* =========================================
          ACT 02: THE PURPOSE (Panel 1)
          ========================================= */}
      <div className="absolute inset-0 panel-purpose z-10 flex flex-col justify-center">
        <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
          
          <div className="col-start-1 col-end-13 mb-[8vh] flex items-center gap-4 opacity-50">
            <div className="w-2 h-2 bg-[#F3EFE9] rounded-full" />
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">Why we exist</span>
          </div>

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

          <div className="col-start-8 col-end-11 mt-[12vh]" ref={dramaticTurnRef}>
            <p className="text-[20px] 2xl:text-[24px] leading-[1.5] text-[#F3EFE9]/70 font-medium">
              The market rewards big agencies. We bet the independent agent, with the right tools, delivers the best experience for the end client.
            </p>
          </div>
        </div>
      </div>


      {/* =========================================
          ACT 03: THE HORIZON (Panel 2)
          ========================================= */}
      <div className="absolute inset-0 panel-vision z-20 opacity-0 flex flex-col justify-center bg-[#111111]">
        <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
          
          <div className="col-start-4 col-end-13 mb-[6vh] flex items-center justify-end gap-4 opacity-50">
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#F26023]">Where we're headed</span>
            <div className="w-2 h-2 bg-[#F26023] rounded-full" />
          </div>

          {/* Grid Rupture: Massive Right-Aligned Typography */}
          <div className="col-start-4 col-end-13 mt-4">
            <h2 className="text-[clamp(2rem,3.8vw,4.8rem)] leading-[1.05] font-bold tracking-tight text-right text-[#F3EFE9] flex flex-wrap justify-end">
              {visionWords.map((word, i) => (
                <span key={i} className="vision-word ml-[0.25em] will-change-[filter,transform,opacity]">
                  {word}
                </span>
              ))}
            </h2>
          </div>

          {/* Text Paragraph: Heavy Left Anchor (3 columns wide) */}
          <div className="col-start-2 col-end-5 mt-[12vh]" ref={visionParagraphRef}>
            <div className="border-l border-[#35BBFD]/50 pl-6">
              <p className="text-[18px] 2xl:text-[20px] leading-[1.6] text-[#F3EFE9]/70 font-medium">
                We grow when the agent grows. Tools, training, brand, compliance, and commissions, all in one place, so no one has to choose between scaling and doing it right.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
