"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";

export default function FooterEpicare() {
  const t = useTranslations("landingV2.nav");
  const tc = useTranslations("landingV2.footerCta");
  
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!textRef.current || !containerRef.current) return;
    
    // Animación Editorial: Suave, prístina y controlada
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, 
        { y: 50, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { 
          y: 0, 
          opacity: 1, 
          clipPath: "inset(0% 0 0 0)", 
          duration: 1.5, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current, // Usamos el footer fijo como trigger
            start: "top 90%"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[900px] md:min-h-[700px]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
      
      <footer ref={containerRef} className="fixed bottom-0 left-0 w-full h-screen min-h-[900px] md:min-h-[700px] -z-10 overflow-hidden">
        
        {/* FONDO: MAPA DE GRADIENTE PROFESIONAL ANIMADO */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--color-brand-blue)]">
          <style>{`
            @keyframes blob1 {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(5vw, -10vh) scale(1.1); }
              66% { transform: translate(-10vw, 5vh) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes blob2 {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(-10vw, 15vh) scale(1.2); }
              66% { transform: translate(5vw, -5vh) scale(0.8); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes blob3 {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(15vw, 5vh) scale(0.9); }
              66% { transform: translate(-5vw, 15vh) scale(1.1); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .mesh-blob-1 { animation: blob1 18s infinite cubic-bezier(0.4, 0.2, 0.2, 1); }
            .mesh-blob-2 { animation: blob2 22s infinite cubic-bezier(0.4, 0.2, 0.2, 1); }
            .mesh-blob-3 { animation: blob3 25s infinite cubic-bezier(0.4, 0.2, 0.2, 1); }
          `}</style>
          
          {/* Cyan Glow */}
          <div className="mesh-blob-1 absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,#00F2FE_0%,transparent_70%)] opacity-50 blur-[80px]"></div>
          
          {/* Deep Blue Glow */}
          <div className="mesh-blob-2 absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,#1A9CE0_0%,transparent_70%)] opacity-80 blur-[100px]"></div>
          
          {/* White Accent Glow */}
          <div className="mesh-blob-3 absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)] opacity-70 blur-[90px]"></div>
          
          {/* Sutil viñeta tonal para anclar el texto (solo usa el propio azul multiplicado) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-blue)]/80 to-transparent mix-blend-multiply"></div>
        </div>
        
        <div className="w-full h-full flex flex-col justify-between max-w-[var(--max-w-section-xl)] mx-auto px-gutter-md pt-section-lg pb-section-md relative z-10">
            
          {/* TOP SECTION: Massive Editorial Typography */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full border-b border-white/15 pb-static-xl">
            <div className="flex items-center gap-static-md md:gap-static-lg">
              <img 
                src={asset("/short_logo.svg")}
                alt="Epicare Logo" 
                className="h-[10vw] md:h-[6.5vw] w-auto select-none rounded-2xl md:rounded-[2vw]"
              />
              <h2 ref={textRef} className="text-[12vw] md:text-[8vw] text-white font-black uppercase tracking-tighter leading-[0.8] m-0">
                EPICARE
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-static-sm mt-static-lg md:mt-0">
              <div className="flex items-center gap-static-sm mb-static-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-green-main)]"></span>
                <p className="text-overline tracking-[0.2em] text-white/50 uppercase">System Online</p>
              </div>
              <a href="mailto:contact@epicare.io" className="text-h4 md:text-h3 font-light text-white hover:text-[var(--color-brand-blue)] transition-colors duration-500">
                contact@epicare.io
              </a>
            </div>
          </div>

          {/* MIDDLE SECTION: Strict Editorial Swiss Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15 border-b border-white/15 my-auto">
            
            {/* Column 1: GoHub */}
            <div className="flex flex-col gap-static-lg py-static-xl md:py-static-2xl md:pr-static-2xl">
              <h4 className="text-h5 text-white/90 font-medium border-b border-white/30 pb-static-sm">{t("gohub")}</h4>
              <div className="flex flex-col gap-static-md">
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("gohubCrm")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("gohubAms")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("gohubCalls")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("gohubAcademy")}</Link>
              </div>
            </div>

            {/* Column 2: Solutions */}
            <div className="flex flex-col gap-static-lg py-static-xl md:py-static-2xl md:px-static-2xl">
              <h4 className="text-h5 text-white/90 font-medium border-b border-white/30 pb-static-sm">{t("solutions")}</h4>
              <div className="flex flex-col gap-static-md">
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("solMarketing")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("solTech")}</Link>
              </div>
            </div>

            {/* Column 3: About & Address */}
            <div className="flex flex-col gap-static-lg py-static-xl md:py-static-2xl md:px-static-2xl">
              <h4 className="text-h5 text-white/90 font-medium border-b border-white/30 pb-static-sm">{t("about")}</h4>
              <div className="flex flex-col gap-static-md mb-static-xl">
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("aboutCompany")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("aboutTeam")}</Link>
                <Link href="#" className="text-body-lg font-light text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300">{t("aboutLicensing")}</Link>
              </div>
              
              <div className="flex flex-col gap-static-xs mt-auto">
                <p className="text-meta text-white/80 font-medium">HEADQUARTERS</p>
                <p className="text-body-md font-light text-white/60">One World Trade Center<br/>New York, NY 10007</p>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: Legal */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-static-md pt-static-xl">
            <p className="text-meta text-white/80 font-medium">© {new Date().getFullYear()} EPICARE. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-static-lg">
              <Link href="#" className="text-meta text-white/80 font-medium hover:text-white transition-colors">{tc("privacy")}</Link>
              <Link href="#" className="text-meta text-white/80 font-medium hover:text-white transition-colors">{tc("terms")}</Link>
            </div>
          </div>

        </div>

      </footer>
    </div>
  );
}
