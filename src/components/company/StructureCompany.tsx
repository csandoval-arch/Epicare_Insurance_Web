"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StructureCompany() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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

      // The image is full-screen, but we mask it initially to the flex gap visually.
      gsap.set(".structure-image-wrapper", { clipPath: "inset(50% 0% 0% 0%)" });
      tl.to(".structure-image-wrapper", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        duration: 2
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#F1EEE5] overflow-hidden z-20 flex flex-col pt-[10vh] pb-[8vh]"
      style={{ perspective: "1500px" }}
    >
      
      {/* Massive Expanding Image Background (Revealed via Clip Path) */}
      <div className="absolute inset-0 w-full h-full z-0 structure-image-wrapper" style={{ clipPath: "inset(50% 0% 0% 0%)" }}>
        <img 
          src="/Files/company_structure_arch.jpg" 
          alt="Epicare Structural Foundation" 
          className="w-full h-full object-cover object-center grayscale-[50%] contrast-125 opacity-90 structure-img"
        />
      </div>

      {/* Top: Title & Tag */}
      <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px] relative z-10 mix-blend-difference text-white" ref={titleRef}>
        <div className="col-start-1 col-end-7">
          <div className="flex items-center gap-4 mb-6 opacity-80">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">The Epicare standard behind every product.</span>
          </div>
          <h2 className="text-[clamp(1.5rem,2.2vw,3rem)] leading-[1.3] font-semibold tracking-tight max-w-[85%]">
            Epicare Insurance Corp is the parent company. Everything else is a product or platform it operates. Each has its own audience, but they all share the same DNA.
          </h2>
        </div>
        
        <div className="col-start-11 col-end-13 flex justify-end">
          <div className="border border-white/30 rounded-full px-5 py-2 flex items-center gap-2 h-fit">
            <span className="text-[13px] font-mono tracking-wider uppercase opacity-90">1 foundation</span>
          </div>
        </div>
      </div>

      {/* Footer Principles */}
      <div className="w-full px-[96px] mt-auto flex justify-center opacity-40 mix-blend-difference text-white relative z-10">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em]">Clarity · Control · Confidence</span>
      </div>

    </section>
  );
}
