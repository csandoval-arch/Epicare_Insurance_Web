"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { asset } from "@/lib/asset";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

export default function HeroCompany() {
  const photoRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const whiteLine2Ref = useRef<HTMLSpanElement>(null);
  const whiteLine3Ref = useRef<HTMLSpanElement>(null);

  // INTRO ANIMATION & DYNAMIC CLIP-PATH SYNC
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const ctx = gsap.context(() => {
      
      // Dynamic mask recalculation (tracks the rightmost edge of Photo or Blue Block dynamically)
      const syncClip = () => {
        if (!blueRef.current || !photoRef.current || !whiteLine2Ref.current || !whiteLine3Ref.current) return;
        
        const blueRect = blueRef.current.getBoundingClientRect();
        const photoRect = photoRef.current.getBoundingClientRect();
        const visualRight = Math.max(blueRect.right, photoRect.right);
        
        // Line 2
        const line2Rect = whiteLine2Ref.current.getBoundingClientRect();
        const line2Visible = Math.max(0, visualRight - line2Rect.left);
        whiteLine2Ref.current.style.clipPath = `polygon(0px 0px, ${line2Visible}px 0px, ${line2Visible}px 100%, 0px 100%)`;

        // Line 3
        const line3Rect = whiteLine3Ref.current.getBoundingClientRect();
        const line3Visible = Math.max(0, visualRight - line3Rect.left);
        whiteLine3Ref.current.style.clipPath = `polygon(0px 0px, ${line3Visible}px 0px, ${line3Visible}px 100%, 0px 100%)`;
      };

      // Bind sync to ticker and standard events
      gsap.ticker.add(syncClip);
      window.addEventListener('resize', syncClip);
      window.addEventListener('scroll', syncClip, { passive: true });

      if (prefersReducedMotion) {
        syncClip();
        return;
      }

      const tl = gsap.timeline({ paused: true });

      const textBirthFrom = { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" };
      const textBirthTo = { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" };

      // 1. "The foundation" leads the entire composition
      tl.fromTo(".title-line-1", textBirthFrom, textBirthTo, 0)

      // 2. Photo & Blue Box slide in (Glued perfectly together, following the first title)
        .fromTo(
          ".hero-visual-left",
          { x: -100, opacity: 0, willChange: "transform, opacity" },
          { x: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" },
          0.2
        )
        .fromTo(
          ".hero-visual-right",
          { x: -100, opacity: 0, willChange: "transform, opacity" },
          { x: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" },
          0.2
        )
      
      // 3. Remaining text-birth lines (Animate simultaneously with visuals)
        .fromTo(".line-wrapper-2", textBirthFrom, textBirthTo, 0.3)
        .fromTo(".line-wrapper-3", textBirthFrom, textBirthTo, 0.3 + STAGGER.base)
      
      // 4. Paragraph (Subtle reveal)
        .fromTo(
          ".hero-paragraph",
          { y: REVEAL.sm, opacity: 0, willChange: "transform, opacity" },
          { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, clearProps: "willChange" },
          0.6
        )
      
      // 5. CTAs (Snap pop)
        .fromTo(
          ".hero-cta",
          { opacity: 0, scale: 0.9, willChange: "transform, opacity" },
          { opacity: 1, scale: 1, duration: DUR.base, ease: EASE.snap, stagger: STAGGER.wave, clearProps: "willChange" },
          0.7
        );

      // Play animation when the global loader finishes
      const play = () => tl.play();
      if ((window as any).epicareLoaderFinished) {
        play();
      } else {
        window.addEventListener("epicareLoaderFinished", play, { once: true });
      }
      const fallbackId = setTimeout(play, 4000);

      return () => {
        window.removeEventListener("epicareLoaderFinished", play);
        clearTimeout(fallbackId);
        gsap.ticker.remove(syncClip);
        window.removeEventListener('resize', syncClip);
        window.removeEventListener('scroll', syncClip);
      };
    });

    return () => ctx.revert();
  }, []);

  const headlineClass = "block text-[clamp(4rem,7vw,8.5rem)] leading-[0.95] font-bold tracking-[-0.03em]";
  const headlineStyle = { fontFamily: 'var(--font-display-stack)' };

  return (
    <section className="relative w-full min-h-screen bg-[#F3EFE9] text-[#111111] overflow-hidden pt-[110px] lg:pt-[130px] pb-[80px] flex flex-col">
      <h1 className="sr-only">The foundation behind independent ambition.</h1>

      {/* DESKTOP AWWWARDS LAYOUT (lg+) */}
      <div className="hidden lg:flex w-full flex-1 flex-col">
        
        {/* UPPER SECTION: Headline Line 1 */}
        <div className="grid grid-cols-12 gap-x-[24px] px-[96px] w-full">
          <div className="col-start-4 col-end-12">
             <div className="overflow-hidden leading-[1.05] pb-2">
               <span className={`${headlineClass} text-[#111111] block title-line-1`} style={headlineStyle}>
                 The foundation
               </span>
             </div>
          </div>
        </div>

        {/* LOWER SECTION: Photo, Blue Box, Lines 2-3, Paragraph, CTAs */}
        <div className="relative flex-1 w-full mt-2 min-h-[500px]">
          
          {/* 1. VISUAL GRID (Background elements and interface) */}
          <div className="absolute inset-0 grid grid-cols-12 gap-x-[24px] px-[96px]">
            
            {/* Architectural Photo (Cols 1-6, z-20 so it's above the blue box) */}
            <div ref={photoRef} className="col-start-1 col-end-7 relative h-full w-[calc(100%+24px)] z-20 hero-visual-left">
               <div className="absolute top-0 right-0 w-[55vw] h-full overflow-hidden">
                 <img 
                   src={asset("/Files/company_hero_arch.jpg")} 
                   alt="Contemporary architecture" 
                   className="w-full h-full object-cover object-center grayscale-[15%] contrast-[1.1] brightness-[0.85]" 
                 />
               </div>
            </div>

            {/* Blue Structural Field (Col 7, z-10 so it can hide behind photo) */}
            <div 
              ref={blueRef} 
              className="col-start-7 col-end-8 h-full bg-[#4385B5] z-10 w-[26%] hero-visual-right" 
            />

            {/* CTAs (Cols 8-10) */}
            <div className="col-start-8 col-end-10 flex flex-col pt-[13vw] 2xl:pt-[12vw] pb-[2vw] z-20">
              <div className="flex flex-col items-start gap-5 mt-auto">
                <button className="hero-cta border-[1.5px] border-[#4385B5] rounded-full px-8 py-3.5 text-[#4385B5] font-medium text-[17.5px] flex items-center gap-2 transition-colors hover:bg-[#4385B5]/5 group">
                  Our story 
                  <span className="text-xl leading-none font-light transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Paragraph (Cols 10-13) */}
            <div className="col-start-10 col-end-13 relative flex flex-col pt-[13vw] 2xl:pt-[12vw] pb-[2vw] z-20">
              <p className="hero-paragraph mt-auto text-[20px] 2xl:text-[22px] leading-[1.45] text-[#111111] max-w-[95%] border-l border-[#111111]/15 pl-6">
                We <span className="font-semibold">build</span> the infrastructure, brand, technology, and operations that <span className="font-semibold">help</span> independent agents compete and win.
              </p>
            </div>
          </div>

          {/* 2. TYPOGRAPHY LAYER (z-30) */}
          {/* We animate the wrappers (line-wrapper-2) so both black and white layers move in absolute sub-pixel sync */}
          <div className="absolute top-0 left-0 w-full grid grid-cols-12 gap-x-[24px] px-[96px] pointer-events-none z-30">
            <div className="col-start-4 col-end-12 flex flex-col">
               
               {/* Line 2 */}
               <div className="overflow-hidden leading-[1.05] pb-2">
                 <div className="relative w-full line-wrapper-2">
                   <span className={`${headlineClass} text-[#111111] block`} style={headlineStyle} aria-hidden="true">
                     behind independent
                   </span>
                   <span ref={whiteLine2Ref} className={`${headlineClass} text-[#F3EFE9] block absolute top-0 left-0 w-full`} style={headlineStyle} aria-hidden="true">
                     behind independent
                   </span>
                 </div>
               </div>

               {/* Line 3 */}
               <div className="overflow-hidden leading-[1.05] pb-2">
                 <div className="relative w-full line-wrapper-3">
                   <span className={`${headlineClass} text-[#111111] block ml-[14%]`} style={headlineStyle} aria-hidden="true">
                     ambition.
                   </span>
                   <span ref={whiteLine3Ref} className={`${headlineClass} text-[#F3EFE9] block absolute top-0 left-0 w-full ml-[14%]`} style={headlineStyle} aria-hidden="true">
                     ambition.
                   </span>
                 </div>
               </div>

            </div>
          </div>

        </div>
      </div>

      {/* MOBILE / TABLET LAYOUT (< lg) */}
      <div className="lg:hidden flex flex-col px-6 w-full relative z-10">
        
        <div className="flex flex-col mb-12">
          <div className="overflow-hidden leading-[1.05] pb-2">
            <span className="text-[clamp(3.5rem,10vw,4.5rem)] leading-[1] font-bold tracking-tight text-[#111111] title-line-1 block" style={headlineStyle}>
              The foundation
            </span>
          </div>
          <div className="overflow-hidden leading-[1.05] pb-2">
            <span className="text-[clamp(3.5rem,10vw,4.5rem)] leading-[1] font-bold tracking-tight text-[#111111] line-wrapper-2 block" style={headlineStyle}>
              behind independent
            </span>
          </div>
          <div className="overflow-hidden leading-[1.05] pb-2">
            <span className="text-[clamp(3.5rem,10vw,4.5rem)] leading-[1] font-bold tracking-tight text-[#111111] ml-[10%] line-wrapper-3 block" style={headlineStyle}>
              ambition.
            </span>
          </div>
        </div>

        <div className="w-[calc(100%+48px)] -ml-6 h-[40vh] relative mb-6 shadow-elevation-1 hero-visual-left">
          <img 
            src={asset("/Files/company_hero_arch.jpg")} 
            alt="Contemporary architecture"
            className="w-full h-full object-cover grayscale-[15%] contrast-[1.1] brightness-[0.85]" 
          />
        </div>

        <div className="w-[26%] h-24 bg-[#4385B5] -mt-16 relative z-10 mb-10 shadow-md hero-visual-right" />

        <p className="hero-paragraph text-[18px] leading-[1.5] text-[#111111] mb-10 border-l border-[#111111]/15 pl-4">
          We <span className="font-bold">build</span> the infrastructure, brand, technology, and operations that <span className="font-bold">help</span> independent agents compete and win.
        </p>

        <div className="flex flex-col gap-6 hero-cta">
          <button className="border-[1.5px] border-[#4385B5] rounded-full px-8 py-3.5 text-[#4385B5] font-medium text-[17px] flex items-center justify-center gap-2 w-max transition-colors hover:bg-[#4385B5]/5 group">
            Our story <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
