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

      // 1. Coreografía de Entrada (Trigger normal)
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      });

      entranceTl.to(".act4-image-mask", {
        clipPath: "inset(0% 0% 47% 0%)",
        ease: "power4.out",
        duration: 1.6
      }, 0)
      .to(".act4-image", {
        scale: 1,
        ease: "power4.out",
        duration: 1.6
      }, 0)
      .to(".act4-tag", {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
      }, 0.2)
      .to(".act4-title", {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
      }, 0.35);

      // 2. Coreografía de Scrub (Pin y expansión hacia abajo)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%", // Distancia de scroll adicional
          pin: true,
          scrub: 1.5,
        }
      });

      // Baja el cutout de la imagen hasta cubrir todo (0%)
      scrubTl.to(".act4-image-mask", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none"
      }, 0)
      // Ligero parallax de la foto hacia adentro
      .to(".act4-image", {
        scale: 1.05,
        ease: "none"
      }, 0)
      // Los textos suben suavemente para dar sensación de inercia
      .to([".act4-tag", ".act4-title"], {
        y: -100,
        ease: "none"
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
    <section ref={containerRef} className="relative w-full h-screen bg-[#F1EEE5] overflow-hidden z-20 flex flex-col">
      
      {/* 1. BASE LAYER: Dark text */}
      <div className="absolute inset-0 w-full h-full z-0 text-[#111111]">
        <TextContent />
      </div>

      {/* 2. DYNAMIC MASK LAYER */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none act4-image-mask">
        <img 
          src={asset("/Files/company_structure_arch.jpg")} 
          alt="Epicare Structural Foundation" 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 act4-image"
        />
        <div className="absolute inset-0 w-full h-full z-20 text-white pointer-events-none">
          <TextContent />
        </div>
      </div>

    </section>
  );
}
