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
      // Estado Inicial
      gsap.set(".act4-image-mask", { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(".act4-image", { scale: 1.1 });
      gsap.set([".act4-tag", ".act4-title"], { y: 30, opacity: 0 });

      // 1. Coreografía de Entrada de Texto (Trigger normal)
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });

      textTl.to(".act4-tag", {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
      }, 0)
      .to(".act4-title", {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
      }, 0.15);

      // 2. Coreografía de Imagen (Scrub)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 48%", 
          end: "top 0%",
          scrub: 1, 
        }
      });

      scrubTl.to(".act4-image-mask", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
      }, 0)
      .to(".act4-image", {
        scale: 1,
        ease: "none",
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const TextContent = () => (
    <div className="w-full h-full flex flex-col pt-[40vh] pb-[8vh]">
      <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
        <div className="col-start-4 col-end-10 flex flex-col w-full text-left">
          
          <div className="flex items-center gap-4 mb-6 opacity-80 act4-tag">
            <div className="w-2 h-2 bg-current rounded-full" />
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">
              The Epicare standard behind every product.
            </span>
          </div>
          
          <h2 className="text-display text-left tracking-tight font-semibold act4-title">
            Epicare Insurance Corp is the parent company. Everything else is a product or platform it operates. Each has its own audience, but they all share the same DNA.
          </h2>

        </div>
      </div>
    </div>
  );

  return (
    <section ref={containerRef} className="relative w-full h-[120vh] bg-[#F1EEE5] overflow-hidden z-20 flex flex-col">
      
      {/* 1. BASE LAYER: Dark text */}
      <div className="absolute inset-0 w-full h-full z-0 text-[#111111]">
        <TextContent />
      </div>

      {/* 2. DYNAMIC MASK LAYER (Optimizada para GPU) */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none act4-image-mask will-change-[clip-path] transform-gpu">
        <img 
          src={asset("/Files/company_structure_arch.jpg")} 
          alt="Epicare Structural Foundation" 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 act4-image will-change-transform transform-gpu"
        />
        <div className="absolute inset-0 w-full h-full z-20 text-white pointer-events-none">
          <TextContent />
        </div>
      </div>

    </section>
  );
}
