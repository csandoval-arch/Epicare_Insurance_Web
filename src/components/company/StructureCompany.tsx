"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StructureCompany() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", 
          pin: true,
          scrub: 1,
        }
      });

      // The mask container holds both the image and the solid white text.
      // We animate the single mask container to reveal both perfectly in sync.
      gsap.set(".structure-mask", { clipPath: "inset(50% 0% 0% 0%)" });
      tl.to(".structure-mask", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        duration: 2
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Shared content block to avoid DRY violations in the duplicated layers
  const TextContent = () => (
    <>
      <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
        <div className="col-start-2 col-end-8">
          <div className="flex items-center gap-4 mb-6 opacity-80">
            <div className="w-2 h-2 bg-current rounded-full" />
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">The Epicare standard behind every product.</span>
          </div>
          <h2 className="text-[clamp(1.5rem,2.2vw,3rem)] leading-[1.3] font-semibold tracking-tight max-w-[85%]">
            Epicare Insurance Corp is the parent company. Everything else is a product or platform it operates. Each has its own audience, but they all share the same DNA.
          </h2>
        </div>
        <div className="col-start-11 col-end-13 flex justify-end">
          <div className="border border-current opacity-60 rounded-full px-5 py-2 flex items-center gap-2 h-fit">
            <span className="text-[13px] font-mono tracking-wider uppercase">1 foundation</span>
          </div>
        </div>
      </div>
      <div className="w-full px-[96px] mt-auto flex justify-center opacity-40">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em]">Clarity · Control · Confidence</span>
      </div>
    </>
  );

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#F1EEE5] overflow-hidden z-20 flex flex-col"
      style={{ perspective: "1500px" }}
    >
      
      {/* 1. BASE LAYER: Dark text on the light #F1EEE5 background */}
      <div className="absolute inset-0 w-full h-full z-0 flex flex-col pt-[10vh] pb-[8vh] text-[#111111]">
        <TextContent />
      </div>

      {/* 2. REVEAL MASK: Image + Solid White Text */}
      <div className="absolute inset-0 w-full h-full z-10 structure-mask pointer-events-none" style={{ clipPath: "inset(50% 0% 0% 0%)" }}>
        
        {/* Background Image */}
        <img 
          src="/Files/company_structure_arch.jpg" 
          alt="Epicare Structural Foundation" 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[50%] contrast-125 opacity-90"
        />
        
        {/* Pure White Duplicate Text */}
        <div className="absolute inset-0 w-full h-full z-20 flex flex-col pt-[10vh] pb-[8vh] text-white">
          <TextContent />
        </div>

      </div>

    </section>
  );
}
