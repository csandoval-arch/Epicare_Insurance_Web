"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCompany() {
  const containerRef = useRef<HTMLElement>(null);
  const whiteBlockRef = useRef<HTMLDivElement>(null);
  const blackBlockRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // 1. Intro Animation Sequence
      const tlIntro = gsap.timeline({ paused: true });
      
      // A. Imagen revelándose con un scale sutil (Cinematic reveal)
      tlIntro.fromTo(".hero-image-el",
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power3.out" },
        0
      );

      // B. Título Gigante
      tlIntro.fromTo(".hero-intro-title", 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", stagger: 0.1 },
        0.2
      );

      // C. Bloques de subtexto inferior (Negro y Blanco sincronizados perfectamente)
      // Animamos los contenedores padre para no chocar con la animación de los hijos del scroll
      if (blackBlockRef.current && whiteBlockRef.current) {
        tlIntro.fromTo([blackBlockRef.current, whiteBlockRef.current],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
          0.6 // Entran al final
        );
      }

      const play = () => tlIntro.play();

      if ((window as any).epicareLoaderFinished) {
        play();
      } else {
        window.addEventListener("epicareLoaderFinished", play, { once: true });
      }
      const fallbackId = setTimeout(play, 4000);

      // 2. Scroll Mask Reveal & Text Parallax
      const tlScroll = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", 
          pin: true,
          scrub: 1,
        }
      });

      gsap.set(".hero-mask", { clipPath: "inset(60% 0% 0% 0%)" });
      
      tlScroll.to(".hero-mask", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        duration: 2
      }, 0);

      // 3. ANIMACIÓN PREMIUM AWWWARDS (Deep Parallax Sink al hacer scroll)
      if (whiteBlockRef.current) {
        tlScroll.fromTo(whiteBlockRef.current.children, 
          { y: 0, opacity: 1, filter: "blur(0px)", scale: 1 },
          { 
            y: -80,
            opacity: 0,
            filter: "blur(12px)",
            scale: 0.96,
            stagger: 0.15,
            ease: "power2.inOut",
            duration: 1.5,
            immediateRender: false
          }, 
          0
        );
      }

      return () => {
        window.removeEventListener("epicareLoaderFinished", play);
        clearTimeout(fallbackId);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const headlineClass = "block text-[clamp(3.5rem,6vw,7rem)] leading-[0.95] font-bold tracking-[-0.03em] hero-intro-title";
  const headlineStyle = { fontFamily: 'var(--font-display-stack)' };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#F1EEE5] overflow-hidden z-20 flex flex-col"
    >
      {/* 1. BASE LAYER: Dark text */}
      <div className="absolute inset-0 w-full h-full z-0 flex flex-col pt-[15vh] text-[#111111]">
        
        <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
          <div className="col-start-2 col-end-12">
            <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>The foundation</span></div>
            <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>behind independent</span></div>
            <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>ambition.</span></div>
          </div>
        </div>

        <div className="w-full px-[96px] mt-auto grid grid-cols-12 gap-x-[24px] pb-[8vh]">
          <div ref={blackBlockRef} className="col-start-8 col-end-12 flex flex-col gap-6 will-change-[transform,opacity] transform-gpu">
            <p className="text-[20px] 2xl:text-[22px] leading-[1.45] max-w-[95%] border-l border-current pl-6 opacity-80">
              We build the infrastructure, brand, technology, and operations that help independent agents compete and win.
            </p>
            <button className="border-[1.5px] border-current rounded-full px-8 py-3.5 font-medium text-[17.5px] flex items-center justify-center gap-2 w-max">
              Our story <span className="text-xl">↗</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. REVEAL MASK: Image + Solid White Text */}
      <div className="absolute inset-0 w-full h-full z-10 hero-mask pointer-events-none will-change-[clip-path] transform-gpu" style={{ clipPath: "inset(60% 0% 0% 0%)" }}>
        <img 
          src={asset("/Files/company_hero_arch.jpg")} 
          alt="Contemporary architecture" 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[15%] contrast-[1.1] brightness-[0.85] will-change-transform transform-gpu hero-image-el"
        />
        <div className="absolute inset-0 w-full h-full z-20 flex flex-col pt-[15vh] text-white pointer-events-none">
          
          <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
            <div className="col-start-2 col-end-12">
              <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>The foundation</span></div>
              <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>behind independent</span></div>
              <div className="overflow-hidden pb-2"><span className={headlineClass} style={headlineStyle}>ambition.</span></div>
            </div>
          </div>

          <div className="w-full px-[96px] mt-auto grid grid-cols-12 gap-x-[24px] pb-[8vh]">
            {/* Contenedor padre referenciado */}
            <div ref={whiteBlockRef} className="col-start-8 col-end-12 flex flex-col gap-6 will-change-[transform,opacity] transform-gpu">
              {/* Estos dos hijos serán animados en cascada por GSAP al hacer scroll */}
              <p className="text-[20px] 2xl:text-[22px] leading-[1.45] max-w-[95%] border-l border-white pl-6 opacity-80 will-change-[filter,transform,opacity] transform-gpu">
                We build the infrastructure, brand, technology, and operations that help independent agents compete and win.
              </p>
              <button className="border-[1.5px] border-white rounded-full px-8 py-3.5 font-medium text-[17.5px] flex items-center justify-center gap-2 w-max transition-all hover:bg-white hover:text-[#111111] will-change-[filter,transform,opacity] transform-gpu pointer-events-auto">
                Our story <span className="text-xl">↗</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
