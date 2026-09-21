"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function ConversationsGoCrm() {
  const t = useTranslations("goCrm.conversations");
  const container = useRef<HTMLElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Text Reveal
      gsap.fromTo(
        ".conv-text-reveal",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
          }
        }
      );

      // Central Console Animation
      gsap.fromTo(
        consoleRef.current,
        { scale: 0.95, opacity: 0, filter: "blur(10px)", y: 40 },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: consoleRef.current,
            start: "top 80%",
          }
        }
      );

      // Minimalist Floating Cards (Overlapping the video)
      gsap.fromTo(
        ".card-left",
        { x: "-100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-container",
            start: "top 60%",
          }
        }
      );

      gsap.fromTo(
        ".card-right",
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-container",
            start: "top 50%",
          }
        }
      );

      gsap.fromTo(
        ".card-bottom",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-container",
            start: "top 50%",
          }
        }
      );

      // --- Holographic Visuals GSAP ---
      gsap.to(".art-pulse", { 
        scale: 1.8, opacity: 0, duration: 2.5, 
        ease: "sine.out", stagger: { each: 1.25, repeat: -1 } 
      });

      gsap.to([".art-svg-1", ".art-svg-2", ".art-svg-3"], { 
        filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))", 
        stroke: "rgba(255,255,255,1)", 
        duration: 1.5, ease: "sine.inOut", stagger: 0.2, yoyo: true, repeat: -1 
      });

      gsap.fromTo(".art-node-1", 
        { scale: 0.5, opacity: 0.5, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.5))" },
        { scale: 1.5, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))", duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );

      gsap.fromTo(".art-scanner-2",
        { y: -6, opacity: 0 },
        { y: 6, opacity: 1, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );

      gsap.fromTo(".art-core-3", 
        { scale: 0.8, opacity: 0.4 },
        { scale: 1.6, opacity: 1, filter: "drop-shadow(0 0 12px rgba(255,255,255,1))", duration: 1, ease: "power2.inOut", yoyo: true, repeat: -1 }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full min-h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex flex-col items-center justify-start py-section-md lg:py-section-lg border-y border-[var(--color-border-Strokes-default)]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-4xl max-h-4xl bg-[var(--color-brand-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER CENTRAL */}
      <div className="w-full max-w-6xl mx-auto px-gutter-md text-center relative z-20 flex flex-col items-center mb-4 lg:mb-6">
        <div className="overflow-hidden mb-4">
          <p className="conv-text-reveal text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] relative">
              <span className="absolute inset-0 bg-[var(--color-brand-blue)] rounded-full animate-ping opacity-75"></span>
            </span>
            {t("overline", { defaultMessage: "08 — CONVERSACIONES & CONTACTO TOTAL" })}
          </p>
        </div>
        
        <div className="overflow-hidden pb-4 w-full max-w-[1100px] mx-auto">
          <h2 className="conv-text-reveal text-display-sm lg:text-display-lg font-bold tracking-tighter leading-[1.0] text-[var(--color-text-primary)]">
            {t("headline", { defaultMessage: "Cada conversación, tarea y documento, conectados a la venta." })}
          </h2>
        </div>
      </div>

      {/* MAIN COMPOSITION (Video + Awwwards Micro-Nodes) */}
      <div className="features-container relative w-full flex justify-center">
        
        {/* EL VIDEO */}
        <div className="w-full max-w-[1400px] px-gutter-md relative z-10 perspective-[1200px]">
          <div 
            ref={consoleRef} 
            className="w-full rounded-[12px] shadow-elevation-5 overflow-hidden flex flex-col border border-[var(--color-border-Strokes-strong)] bg-[var(--color-surface-BG-1)]"
          >
            <video
              src="/Files/Go_CRM/Contact_Conversations/conversation_contact.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>

        {/* MICRO-NODOS AWWWARDS (Pegados a los bordes del navegador) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* Card 1 - Izquierda Arriba */}
          <div className="card-left absolute top-[10%] left-4 lg:left-8 w-[208px] md:w-[248px] bg-[var(--color-brand-blue)]/50 backdrop-blur-[32px] saturate-150 border border-white/20 rounded-[4px] p-6 shadow-elevation-4 pointer-events-auto">
            
            {/* Círculo chiquito en la punta */}
            <div className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-[#35BBFD] shadow-[0_0_8px_#35BBFD]" />

            <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4">
               <div className="relative w-12 h-12 flex items-center justify-center">
                 <div className="absolute w-8 h-8 bg-white/10 blur-[10px] rounded-full" />
                 <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                 <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                 <svg viewBox="0 0 24 24" className="art-svg-1 w-7 h-7 relative z-10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                 </svg>
                 <div className="art-node-1 absolute w-2 h-2 bg-white rounded-full z-20 top-1 right-1 shadow-[0_0_8px_rgba(255,255,255,1)]" />
               </div>
            </div>
            <h3 className="text-body-md font-bold text-white leading-snug mb-3">
              {t("card1Title", { defaultMessage: "Llamadas Directas" })}
            </h3>
            <p className="text-body-sm text-white leading-relaxed font-light">
              {t("card1Desc", { defaultMessage: "Registro sonoro y cronológico dentro de la oportunidad." })}
            </p>
          </div>

          {/* Card 2 - Derecha Medio */}
          <div className="card-right absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 w-[208px] md:w-[248px] bg-[var(--color-brand-blue)]/50 backdrop-blur-[32px] saturate-150 border border-white/20 rounded-[4px] p-6 shadow-elevation-4 pointer-events-auto">
            
            {/* Círculo chiquito en la punta */}
            <div className="absolute -top-[3px] -left-[3px] w-2 h-2 rounded-full bg-[#35BBFD] shadow-[0_0_8px_#35BBFD]" />

            <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4">
               <div className="relative w-12 h-12 flex items-center justify-center">
                 <div className="absolute w-8 h-8 bg-white/10 blur-[10px] rounded-full" />
                 <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                 <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                 <svg viewBox="0 0 24 24" className="art-svg-2 w-7 h-7 relative z-10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                   <circle cx="12" cy="10" r="2" />
                   <line x1="8" y1="15" x2="16" y2="15" />
                   <line x1="10" y1="17" x2="14" y2="17" />
                 </svg>
                 <div className="art-scanner-2 absolute w-6 h-[1px] bg-white z-20 shadow-[0_0_8px_rgba(255,255,255,1)]" />
               </div>
            </div>
            <h3 className="text-body-md font-bold text-white leading-snug mb-3 text-left">
              {t("card2Title", { defaultMessage: "Documentos Seguros" })}
            </h3>
            <p className="text-body-sm text-white leading-relaxed font-light text-left">
              {t("card2Desc", { defaultMessage: "Pide identificaciones y pólizas en el mismo hilo. Notificación al instante." })}
            </p>
          </div>

          {/* Card 3 - Centro Abajo */}
          <div className="absolute -bottom-[35%] left-0 w-full flex justify-center z-20 pointer-events-none">
            <div className="card-bottom relative w-[240px] md:w-[280px] bg-[var(--color-brand-blue)]/50 backdrop-blur-[32px] saturate-150 border border-white/20 rounded-[4px] p-6 shadow-elevation-4 pointer-events-auto">
              
              {/* Círculo chiquito en la punta */}
              <div className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-[#35BBFD] shadow-[0_0_8px_#35BBFD]" />

              <div className="flex items-start justify-between border-b border-white/20 pb-4 mb-4">
                 <div className="relative w-12 h-12 flex items-center justify-center">
                   <div className="absolute w-8 h-8 bg-white/10 blur-[10px] rounded-full" />
                   <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                   <div className="art-pulse absolute w-12 h-12 rounded-full border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)] z-0" />
                   <svg viewBox="0 0 24 24" className="art-svg-3 w-7 h-7 relative z-10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                     <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                   </svg>
                   <div className="art-core-3 absolute w-2.5 h-2.5 bg-white rounded-full z-20 top-1 right-1.5 shadow-[0_0_12px_rgba(255,255,255,1)]" />
                 </div>
              </div>
              <h3 className="text-body-md font-bold text-white leading-snug mb-3">
                {t("card3Title", { defaultMessage: "Mensajes Automáticos" })}
              </h3>
              <p className="text-body-sm text-white leading-relaxed font-light">
                {t("card3Desc", { defaultMessage: "El pipeline activa tareas automáticamente ante cada cambio de etapa." })}
              </p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Spacer to replace padding and margins previously attached to features-container */}
      <div className="w-full pb-12 mb-24 lg:mb-32" />
    </section>
  );
}
