"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, STAGGER } from "@/lib/motion";

// ── DATOS ─────────────────────────────────────────────────────────────────────

interface OppDef {
  num: string;
  label: string;
  desc: string;
}

const OPPS: OppDef[] = [
  {
    num: "01",
    label: "Dental",
    desc: "Flujo de trabajo y seguimiento completamente independiente.",
  },
  {
    num: "02",
    label: "Auto",
    desc: "Motor de cotización y rastreo totalmente separados.",
  },
  {
    num: "03",
    label: "Vida",
    desc: "Pipeline configurado para la cobertura a largo plazo.",
  },
];

/**
 * @description ContactVsOpportunity — Acto 2: Premium Glass Gallery.
 * Layout simétrico con esculturas generativas GSAP internas (Escaladas para mayor impacto).
 */
export default function ContactVsOpportunity() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _t = useTranslations("goCrm.contactVsOpp");
  const comp = useRef<HTMLElement>(null);
  const ring1 = useRef<HTMLDivElement>(null);
  const ring2 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── REDUCED MOTION ────────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".slice-left", ".slice-center", ".slice-right"], { yPercent: 200 });
        gsap.set([".a2-title", ".a2-card"], { opacity: 1, y: 0, scale: 1 });
      });

      // ── FULL MOTION ───────────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        
        gsap.set(".a2-title", { opacity: 0, y: 40 });
        gsap.set(".a2-card", { opacity: 0, y: 80, scale: 0.95 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: comp.current,
            pin: true,
            start: "top top",
            end: "+=200%",
            scrub: 1,
          },
        });

        // 1. Franjas del Acto 1 salen
        tl.to(".slice-left",   { yPercent: 105, ease: EASE.inOut, duration: 0.9 }, 0);
        tl.to(".slice-center", { yPercent: -105, ease: EASE.inOut, duration: 0.9 }, 0.1);
        tl.to(".slice-right",  { yPercent: 105, ease: EASE.inOut, duration: 0.9 }, 0.2);

        // 2. Revelado simétrico del Acto 2
        tl.to(".a2-title", {
          opacity: 1, y: 0, ease: EASE.out, duration: 0.4,
        }, 0.5);

        tl.to(".a2-card", {
          opacity: 1, y: 0, scale: 1,
          ease: "back.out(1.2)",
          duration: 0.6,
          stagger: STAGGER.wave,
        }, 0.6);

        // ── VIDA LATENTE (Animaciones abstractas en las cards) ───────────
        
        // Card 1 (Dental) - Diente Holográfico y Círculo Pulsante
        gsap.to(".art-pulse-circle", {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 }
        });
        gsap.to(".art-tooth", {
          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))",
          stroke: "rgba(255,255,255,1)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
        gsap.to(".art-node", {
          scale: 1.6,
          opacity: 0.3,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

        // Card 2 (Auto) - Coche Frontal Tech
        gsap.to(".art-pulse-car", {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 }
        });
        // Escáner principal
        gsap.fromTo(".art-car-scanner", 
          { x: -18 },
          { x: 18, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );
        
        // Faro Izquierdo (Brilla cuando el escáner está a la izquierda)
        gsap.fromTo(".art-car-hl-left",
          { fill: "rgba(255,255,255,1)", stroke: "rgba(255,255,255,1)", filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" },
          { fill: "rgba(255,255,255,0)", stroke: "rgba(255,255,255,0.4)", filter: "drop-shadow(0 0 0px rgba(255,255,255,0))", duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );

        // Faro Derecho (Brilla cuando el escáner está a la derecha)
        gsap.fromTo(".art-car-hl-right",
          { fill: "rgba(255,255,255,0)", stroke: "rgba(255,255,255,0.4)", filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" },
          { fill: "rgba(255,255,255,1)", stroke: "rgba(255,255,255,1)", filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))", duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );
        gsap.to(".art-car", {
          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))",
          stroke: "rgba(255,255,255,1)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

        // Card 3 (Vida) - Planta Creciendo
        gsap.to(".art-pulse-life", {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 }
        });
        
        // Respiración/Crecimiento continuo (sin ocultarse)
        gsap.fromTo(".art-plant", 
          { scaleY: 0.9, opacity: 0.7, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" },
          { scaleY: 1.05, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))", stroke: "rgba(255,255,255,1)", duration: 2.5, ease: "sine.inOut", svgOrigin: "12 22", repeat: -1, yoyo: true }
        );
        
        // Semilla / Raíz palpitante
        gsap.fromTo(".art-spore-root",
          { scale: 0.8, opacity: 0.6, filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))" },
          { scale: 1.3, opacity: 1, filter: "drop-shadow(0 0 12px rgba(255,255,255,1))", duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 }
        );
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={comp}
      className="w-full h-dvh relative overflow-hidden"
      style={{ background: "var(--color-brand-dark)" }}
    >
      {/* ════════════════════════════════════════════════════════════════════════
          ACTO 2: Fondo Azul + Grid Simétrico
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-gutter-md lg:px-gutter-xl gap-fluid-lg"
        style={{ background: "var(--color-brand-blue)" }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        />

        <div className="a2-title relative z-10 flex flex-col items-center text-center gap-static-sm max-w-3xl">
          <p className="text-overline text-white/60 tracking-[0.2em] uppercase">
            GO CRM · Contactos
          </p>
          <h2 className="text-display-sm md:text-display font-semibold text-white tracking-tight leading-[1.05]">
            Una persona puede significar <span className="italic font-normal opacity-90">más de una</span> oportunidad.
          </h2>
        </div>

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-fluid-sm">
          
          {OPPS.map((opp, i) => (
            <div
              key={opp.num}
              className="a2-card group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/20 shadow-elevation-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-elevation-5 hover:border-white/40"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px)",
                aspectRatio: "3/4",
                maxHeight: "480px"
              }}
            >
              <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] pointer-events-none" />
              <div className="absolute -inset-20 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none" />

              <div className="relative z-10 p-static-lg flex justify-between items-start">
                <span className="px-static-sm py-static-xs rounded-full border border-white/30 bg-white/10 text-meta font-semibold text-white tracking-widest tabular-nums">
                  {opp.num}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <path d="M1 11L11 1M11 1H3.5M11 1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="relative z-10 flex-1 flex items-center justify-center">
                
                {/* DENTAL ART (i === 0) - Diente Holográfico Escala Mayor */}
                {i === 0 && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow ambiental del diente */}
                    <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                    
                    {/* Silueta limpia del diente SVG (Original ampliado) */}
                    <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
                      <path 
                        className="art-tooth"
                        d="M12 5.5c-2.5-3.5-7-1.5-7 2.5 0 2.5 1 4.5 1.5 6.5l.5 5.5c.5 1.5 2.5 1.5 3 .5l1-3c.5-1.5 1.5-1.5 2 0l1 3c.5 1 2.5 1 3-.5l.5-5.5c.5-2 1.5-4 1.5-6.5 0-4-4.5-5.5-7-2.5z" 
                        stroke="rgba(255,255,255,0.4)" 
                        strokeWidth="0.8" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Círculo animado haciendo pulse glow */}
                    <div className="art-pulse-circle absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-circle absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Punto indicador pegado al stroke top-right */}
                    <div className="art-node absolute w-[10px] h-[10px] bg-white/80 rounded-full z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ top: 'calc(27% + 3px)', right: 'calc(34% + 1px)' }} />
                  </div>
                )}

                {/* AUTO ART (i === 1) - Coche Frontal Tech */}
                {i === 1 && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow ambiental */}
                    <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                    
                    {/* Círculos pulsantes de radar (Eco de la Card 1) */}
                    <div className="art-pulse-car absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-car absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Silueta Frontal del auto SVG (Estándar de UI) */}
                    <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
                      {/* Techo y Espejos */}
                      <path className="art-car" d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Chasis principal */}
                      <rect className="art-car" width="18" height="8" x="3" y="10" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Llantas (Más gruesas) */}
                      <path className="art-car" d="M5 18v2 M19 18v2" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      {/* Faros interactivos */}
                      <circle className="art-car-hl-left" cx="7.5" cy="14" r="1.5" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                      <circle className="art-car-hl-right" cx="16.5" cy="14" r="1.5" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                    </svg>

                    {/* Escáner dinámico en la parrilla frontal */}
                    <div className="art-car-scanner absolute w-[16px] h-[2.5px] bg-white z-20 shadow-[0_0_8px_2px_rgba(255,255,255,1)] rounded-full" style={{ top: '56.5%' }} />
                  </div>
                )}

                {/* VIDA ART (i === 2) - Planta Holográfica */}
                {i === 2 && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow ambiental */}
                    <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                    
                    {/* Círculos pulsantes de radar (Eco del sistema) */}
                    <div className="art-pulse-life absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-life absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Silueta de la planta geométrica SVG (Diseño Original) */}
                    <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
                      <g className="art-plant">
                        {/* Tallo */}
                        <path d="M12 22 v-10" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Hoja Izquierda */}
                        <path d="M12 14 C8 14 6 10 6 7 C8 7 12 9 12 14 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Hoja Derecha */}
                        <path d="M12 18 C16 18 19 14 19 11 C17 11 12 13 12 18 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Hoja Superior */}
                        <path d="M12 12 C9 10 10 5 12 3 C14 5 15 10 12 12 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                        
                      </g>
                    </svg>

                    {/* Semilla / Raíz de energía (1 solo punto) */}
                    <div className="art-spore-root absolute w-[8px] h-[8px] bg-white rounded-full z-20" style={{ top: '81%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  </div>
                )}
              </div>

              <div className="relative z-10 p-static-lg pt-0">
                <div className="w-6 h-px bg-white/30 mb-static-sm transition-all duration-300 group-hover:w-12 group-hover:bg-white" />
                <h3 className="text-h3 font-semibold text-white tracking-tight mb-static-xs">
                  {opp.label}
                </h3>
                <p className="text-body-sm text-white/60 leading-relaxed">
                  {opp.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ACTO 1: Foreground Slices (Sin Cambios)
      ════════════════════════════════════════════════════════════════════════ */}
      {/* Foreground Layer: ACT 1 The Contact (Sliced via clip-path) */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
        
        {/* Left Slice */}
        <div className="slice-left absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%)' }}>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] z-0">
             <img src="/client_auto.jpg" alt="Auto Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] p-static-xl md:p-static-2xl pt-static-xl md:pt-[3.25rem] flex flex-col gap-fluid-lg border-r border-slate-800">
            
            {/* The Realistic Profile Card (Ultra-Glassmorphic Minimalist) */}
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ER</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Elena Rojas</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">c.martinez@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Slice */}
        <div className="slice-center absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(33.33% 0, 66.66% 0, 66.66% 100%, 33.33% 100%)' }}>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] z-0">
             <img src="/client_business.jpg" alt="Business Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end items-center border-r border-slate-800">
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">DS</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">David Smith</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">david.smith@business.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Slice */}
        <div className="slice-right absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(66.66% 0, 100% 0, 100% 100%, 66.66% 100%)' }}>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] z-0">
             <img src="/client_family.jpg" alt="Family Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] p-static-xl md:p-static-2xl pt-static-xl md:pt-[3.25rem] flex flex-col items-center border-l border-slate-800">
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ML</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Maria Lopez</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">m.lopez@family.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Foreground Layer: Fallback */}
      <div className="slice-left absolute inset-0 pointer-events-none z-30 md:hidden bg-slate-900 flex flex-col items-center justify-center px-static-xl">
          <div className="absolute inset-0 z-0">
             <img src="/client_auto.jpg" alt="Auto Client" className="w-full h-full object-cover opacity-[0.45]" />
          </div>
          <div className="z-10 flex flex-col w-full p-static-xl pt-static-2xl max-w-sm mx-auto">
            <div className="relative z-10 w-full max-w-[320px] mx-auto rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ER</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Elena Rojas</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">c.martinez@email.com</span>
                </div>
              </div>
            </div>
          </div>
      </div>

    </section>
  );
}
