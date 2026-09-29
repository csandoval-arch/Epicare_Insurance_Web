"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger);

export default function PurposeCompany() {
  const containerRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const dramaticTurnRef = useRef<HTMLDivElement>(null);
  const visionParagraphRef = useRef<HTMLDivElement>(null);

  // Copys actualizados según petición
  const missionText = "We exist to build the infrastructure, brand, technology, and operations, that lets independent agents compete and win across the United States.";
  const words = missionText.split(" ");

  const visionText = "We're headed to be the reference agency in the United States, where the independent agent has everything they need to grow.";
  const visionWords = visionText.split(" ");

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      ScrollTrigger.refresh();

      gsap.set(".panel-purpose", { y: "100vh", opacity: 1 });
      gsap.set(".panel-vision", { y: "100vh", opacity: 1 });
      gsap.set(".v2-word", { opacity: 0, filter: "blur(16px)", y: 20 });
      gsap.set(".vision-word", { opacity: 0, filter: "blur(16px)", y: 20 });
      
      // Subtextos inicializados más abajo para el movimiento vertical
      gsap.set(dramaticTurnRef.current, { opacity: 0, y: 50 });
      gsap.set(visionParagraphRef.current, { opacity: 0, y: 50 });
      
      // NUEVO ESTADO DEL MAPA: Deep Parallax Fade (Elegancia pura)
      gsap.set(".map-video-wrapper", { clipPath: "none" }); // Quitamos los recortes
      gsap.set(".map-video-el", { scale: 1.25, opacity: 0, filter: "blur(10px)" }); // Iniciamos desenfocado, grande e invisible

      // COREOGRAFÍA ELEGANTE Y RÁPIDA (Opacity + Scale + Blur)
      const mapRevealTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", 
        }
      });

      mapRevealTl.to(".map-video-el", {
        scale: 1,
        opacity: 0.8,
        filter: "blur(0px)",
        ease: "power2.out", 
        duration: 1.5, // Rápido pero súper premium
      }, 0);


      // LÍNEA DE TIEMPO PRINCIPAL PINNED (Scrub)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", 
          pin: true,
          scrub: 1,
        }
      });

      // Phase 1
      scrubTl.to({}, { duration: 0.5 }); 

      // Phase 2 (Misión)
      scrubTl.to(".panel-purpose", { y: "0vh", duration: 1.5, ease: "power2.inOut" }, "missionIn");
      scrubTl.to(".v2-word", {
        opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.05, ease: "power2.out", duration: 1
      }, "missionIn+=0.8");
      
      // Subtexto Misión (Aparece después del texto principal con movimiento vertical)
      scrubTl.to(dramaticTurnRef.current, {
        opacity: 1, y: 0, duration: 1.2, ease: "power2.out"
      }, "missionIn+=1.6");

      // Phase 3 (Hold)
      scrubTl.to({}, { duration: 1 });

      // Phase 4 (Transición a Visión)
      scrubTl.to(".panel-purpose", { y: "-100vh", scale: 0.9, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "transition");
      scrubTl.to(".panel-vision", { y: "0vh", duration: 1.5, ease: "power2.inOut" }, "transition");
      scrubTl.to(".vision-word", {
        opacity: 1, filter: "blur(0px)", y: 0, stagger: 0.05, ease: "power2.out", duration: 1
      }, "transition+=0.8");
      
      // Phase 4.5 Subtexto Visión (Aparece después del texto principal con movimiento vertical)
      scrubTl.to(visionParagraphRef.current, { 
        opacity: 1, y: 0, duration: 1.2, ease: "power2.out" 
      }, "transition+=1.6");

      // Phase 5 (Hold)
      scrubTl.to({}, { duration: 1 });

    }, containerRef);

    return () => ctx.revert();
  }, []); 

  return (
    <div className="w-full bg-[#F1EEE5]">
      <section 
        ref={containerRef} 
        className="relative w-full h-screen bg-[#F1EEE5] text-[#111111] overflow-hidden z-10"
      >
        {/* GLOBAL VIDEO MAP */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none map-video-wrapper">
          <video 
            src={asset("/Files/About_Company/Pins_fading_on_US_map_20260929131832.mp4")}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover mix-blend-multiply map-video-el will-change-transform transform-gpu"
          />
        </div>

        {/* ACT 02: THE PURPOSE */}
        <div className="absolute inset-0 panel-purpose z-10 flex flex-col justify-start pt-[15vh]">
          <div className="w-full px-[96px] grid grid-cols-12 gap-[24px]">
            
            <div className="col-start-1 col-end-13 mb-3 flex items-center gap-4 opacity-50">
              <div className="w-2 h-2 bg-[#35BBFD] rounded-full" />
              <span className="text-sm font-semibold tracking-[0.1em] uppercase text-[#35BBFD]">Our Mission</span>
            </div>

            <div className="col-start-1 col-end-12 flex flex-col mb-10" ref={textContainerRef}>
              <h2 className="text-display tracking-tight font-semibold max-w-3xl ml-0">
                <div className="flex flex-wrap">
                  {words.map((word, i) => (
                    <span key={i} className="v2-word mr-[0.25em] will-change-[filter,transform,opacity]">
                      {word}
                    </span>
                  ))}
                </div>
              </h2>
            </div>
            
            {/* MISION SUBTEXT */}
            <div ref={dramaticTurnRef} className="col-start-4 col-end-7 text-left">
               <p className="text-[18px] 2xl:text-[20px] leading-[1.6] text-[#111111]/80 font-medium">
                 The market rewards big agencies. We bet the <strong className="font-bold text-[#35BBFD]">independent agent</strong>, with the right tools, delivers the <strong className="font-bold text-[#35BBFD]">best experience</strong> for the end client.
               </p>
            </div>
          </div>
        </div>

        {/* ACT 03: THE HORIZON */}
        <div className="absolute inset-0 panel-vision z-20 flex flex-col justify-start pt-[15vh]">
          <div className="w-full px-[96px] grid grid-cols-12 gap-[24px]">
            
            <div className="col-start-4 col-end-13 mb-3 flex items-center justify-end gap-4 opacity-50">
              <span className="text-sm font-semibold tracking-[0.1em] uppercase text-[#F26023]">Our Vision</span>
              <div className="w-2 h-2 bg-[#F26023] rounded-full" />
            </div>

            <div className="col-start-4 col-end-13 flex justify-end mb-10">
              <h2 className="text-display tracking-tight font-semibold text-right flex flex-wrap justify-end max-w-3xl mr-0">
                {visionWords.map((word, i) => (
                  <span key={i} className="vision-word ml-[0.25em] will-change-[filter,transform,opacity]">
                    {word}
                  </span>
                ))}
              </h2>
            </div>
            
            {/* VISION SUBTEXT */}
            <div ref={visionParagraphRef} className="col-start-2 col-end-5 text-left mt-16">
               <p className="text-[18px] 2xl:text-[20px] leading-[1.6] text-[#111111]/80 font-medium">
                 We grow when the <strong className="font-bold text-[#35BBFD]">agent grows</strong>. Tools, training, brand, compliance, and commissions, <strong className="font-bold text-[#35BBFD]">all in one place</strong>, so no one has to choose between scaling and doing it right.
               </p>
            </div>

          </div>
        </div>
      </section>
      
      {/* SOLID COLOR GAP TO PREVENT FLASHING */}
      <div className="w-full h-[10vh] bg-[#F1EEE5] pointer-events-none" />
    </div>
  );
}
