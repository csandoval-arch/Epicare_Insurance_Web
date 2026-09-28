"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

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
          end: "+=150%",
          pin: true,
          scrub: 1.2,
        }
      });

      // V2: ARCHITECTURAL PARALLAX (Minimalist Gallery Style)
      gsap.set(".v2-image", { yPercent: 30, opacity: 0, scale: 1.05 });
      gsap.set(".v2-text", { y: 20, opacity: 0 });
      
      tl.to(".v2-image", {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        duration: 2
      }, 0)
      .to(".v2-text", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        duration: 1.5
      }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#111111] overflow-hidden flex flex-col justify-between pt-[12vh] pb-[8vh] px-[96px] z-20">
      
      {/* Centered Gallery Image */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 pointer-events-none">
         <div className="w-[35vw] h-[65vh] overflow-hidden">
           <img 
             src={asset("/Files/company_structure_arch.jpg")} 
             className="w-full h-full object-cover grayscale-[80%] opacity-70 v2-image" 
             alt="Epicare Foundation" 
           />
         </div>
      </div>
      
      {/* Top Text Layer */}
      <div className="flex justify-between items-start w-full z-10">
         <div className="flex flex-col gap-3 v2-text">
           <span className="text-[11px] text-[#F1EEE5] font-semibold tracking-[0.2em] uppercase opacity-50 flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-[#F1EEE5] rounded-full" />
             The Parent Company
           </span>
           <h2 className="text-[2.2rem] text-[#F1EEE5] font-semibold tracking-tight">Epicare Insurance Corp.</h2>
         </div>
         
         <div className="v2-text">
           <span className="text-[11px] text-[#F1EEE5] font-mono tracking-[0.2em] uppercase opacity-50">1 Foundation</span>
         </div>
      </div>

      {/* Bottom Text Layer */}
      <div className="flex justify-between items-end w-full z-10">
         <div className="w-[30%] v2-text">
           <p className="text-[16px] leading-[1.6] text-[#F1EEE5]/70 font-medium">
             Everything else is a product or platform it operates. Each has its own audience, but they all share the exact same structural DNA.
           </p>
         </div>
         
         <div className="v2-text">
           <span className="text-[11px] text-[#F1EEE5] font-mono tracking-[0.2em] uppercase opacity-30">Clarity · Control · Confidence</span>
         </div>
      </div>

    </section>
  );
}
