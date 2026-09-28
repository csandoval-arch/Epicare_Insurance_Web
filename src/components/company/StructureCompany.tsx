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

      // V1: STUDIO HORIZONTAL GLIDE
      // Image starts masked down, expands horizontally
      gsap.set(".v1-image-container", { width: "0%" });
      gsap.set(".v1-image", { scale: 1.2, xPercent: -20 });
      
      tl.to(".v1-image-container", {
        width: "100%",
        ease: "power2.inOut",
        duration: 1.5
      }, 0)
      .to(".v1-image", {
        scale: 1,
        xPercent: 0,
        ease: "power2.out",
        duration: 1.5
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen z-20 bg-[#F1EEE5]">
      <div className="absolute inset-0 w-full h-full flex items-center bg-[#F1EEE5] overflow-hidden px-[96px]">
        
        <div className="w-full grid grid-cols-12 gap-x-[24px] items-center">
          
          {/* Left Typography (Moved to the right: col-start-2) */}
          <div className="col-start-2 col-end-7 flex flex-col gap-12 z-10">
             <div className="flex items-center gap-4 opacity-50">
               <div className="w-1.5 h-1.5 bg-[#111111] rounded-full" />
               <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">The Parent Company</span>
             </div>
             <h2 className="text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.05] font-bold tracking-tight text-[#111111]">
               Epicare Insurance Corp.
             </h2>
             <p className="text-[18px] leading-[1.6] text-[#111111]/70 font-medium max-w-[95%]">
               Everything else is a product or platform it operates. Each has its own audience, but they all share the same DNA. 1 Foundation.
             </p>
          </div>
          
          {/* Right Image Reveal */}
          <div className="col-start-8 col-end-13 h-[70vh] flex justify-end">
             <div className="w-full h-full v1-image-container overflow-hidden origin-right">
                <img 
                  src={asset("/Files/company_structure_arch.jpg")} 
                  className="w-full h-full object-cover object-center grayscale-[30%] v1-image" 
                  alt="Epicare Foundation Structure" 
                />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
