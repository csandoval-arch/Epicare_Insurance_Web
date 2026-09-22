"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, STAGGER } from "@/lib/motion";
import { Envelope, Phone, Database } from "@phosphor-icons/react";

//  DATOS 

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
    label: "Health",
    desc: "Cotización, enrolamiento y gestión de pólizas médicas independientes.",
  },
  {
    num: "03",
    label: "Vida",
    desc: "Pipeline configurado para la cobertura a largo plazo.",
  },
];

/**
 * @description ContactVsOpportunity  Acto 2: Premium Glass Gallery.
 * Layout simtrico con esculturas generativas GSAP internas (Escaladas para mayor impacto).
 */
export default function ContactVsOpportunity() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _t = useTranslations("goCrm.contactVsOpp");
  const comp = useRef<HTMLElement>(null);
  const ring1 = useRef<HTMLDivElement>(null);
  const ring2 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      //  REDUCED MOTION 
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".slice-left", ".slice-center", ".slice-right"], { yPercent: 200 });
        gsap.set([".a2-title", ".a2-card"], { opacity: 1, y: 0, scale: 1 });
      });

      //  FULL MOTION 
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        
        gsap.set(".a2-title", { opacity: 0, y: 40 });
        gsap.set(".a2-card", { opacity: 0, y: 30 });

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

        // 2. Revelado simtrico del Acto 2
        tl.to(".a2-title", {
          opacity: 1, y: 0, ease: EASE.out, duration: 0.4,
        }, 0.5);

        tl.to(".a2-card", {
          opacity: 1, 
          y: 0, 
          ease: "power3.out",
          duration: 0.4,
          stagger: 0.08,
        }, 0.5);

        //  VIDA LATENTE (Animaciones abstractas en las cards) 
        
        // Card 1 (Dental) - Diente Hologrfico y Crculo Pulsante
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

        // Card 2 (Health) - Abstract Heart
        gsap.to(".art-pulse-health", {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 }
        });

        // Silueta Principal Hologrfica
        gsap.to(".art-health-silhouette", {
          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))",
          stroke: "rgba(255,255,255,1)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

        // Micro-interacción: Bio-Core palpitante en el centro
        gsap.fromTo(".art-health-core",
          { scale: 0.95, opacity: 0.6, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.3))" },
          { scale: 1.05, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.9))", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, svgOrigin: "12 12" }
        );

        // Card 3 (Vida) - Planta Creciendo
        gsap.to(".art-pulse-life", {
          scale: 1.8,
          opacity: 0,
          duration: 2.5,
          ease: "sine.out",
          stagger: { each: 1.25, repeat: -1 }
        });
        
        // Respiracin/Crecimiento continuo (sin ocultarse)
        gsap.fromTo(".art-plant", 
          { scaleY: 0.9, opacity: 0.7, filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" },
          { scaleY: 1.05, opacity: 1, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))", stroke: "rgba(255,255,255,1)", duration: 2.5, ease: "sine.inOut", svgOrigin: "12 22", repeat: -1, yoyo: true }
        );
        
        // Semilla / Raz palpitante
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
      className="w-full h-dvh relative overflow-hidden mt-32 md:mt-48"
      style={{ background: "var(--color-brand-dark)" }}
    >
      {/* 
          ACTO 2: Fondo Azul + Grid Simétrico
       */}
      <div
        className="absolute inset-0 flex flex-col items-center px-gutter-md lg:px-gutter-xl"
        style={{ background: "var(--color-brand-blue)" }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        />

        {/* Espaciador superior (igual al inferior y al medio) */}
        <div className="flex-1 w-full min-h-[2vh] md:min-h-[4vh]" />

        <div className="a2-title relative z-10 flex flex-col items-center text-center gap-static-sm max-w-3xl shrink-0">
          <p className="text-overline text-white/60 tracking-[0.2em] uppercase">
            GO CRM &mdash; Contactos
          </p>
          <h2 className="text-display-sm md:text-display font-semibold text-white tracking-tight leading-[1.05]">
            Una persona puede significar <span className="italic font-normal opacity-90">m&aacute;s de una</span> oportunidad.
          </h2>
        </div>

        {/* Espaciador medio (simetra garantizada) */}
        <div className="flex-1 w-full min-h-[2vh] md:min-h-[4vh]" />

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-fluid-sm shrink-0">
          
          {OPPS.map((opp, i) => (
            <div
              key={opp.num}
              className="a2-card group relative flex flex-col justify-start overflow-hidden rounded-t-xl rounded-b-[2rem] border border-white/20 shadow-elevation-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-elevation-5 hover:border-white/40"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(24px)",
                aspectRatio: "3/4",
                maxHeight: "480px",
                WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)"
              }}
            >
              <div className="absolute inset-0 rounded-t-xl rounded-b-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] pointer-events-none" />
              <div className="absolute -inset-20 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none" />

              {/* Textos y Etiquetas (Arriba para no perder legibilidad con el difuminado) */}
              <div className="relative z-10 p-static-lg flex flex-col gap-6">
                <div>
                  <h3 className="text-h2 font-semibold text-white tracking-tight mb-static-xs">
                    {opp.label}
                  </h3>
                  <p className="text-body-md text-white/80 leading-relaxed">
                    {opp.desc}
                  </p>
                </div>
              </div>

              {/* Arte Hologrfico (Centrado en el espacio restante, ms arriba del fade) */}
              <div className="relative z-10 flex-1 flex items-center justify-center mb-8 -translate-y-6">
                
                {/* DENTAL ART (i === 0) - Diente Hologrfico Escala Mayor */}
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

                    {/* Crculo animado haciendo pulse glow */}
                    <div className="art-pulse-circle absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-circle absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Punto indicador pegado al stroke top-right */}
                    <div className="art-node absolute w-[10px] h-[10px] bg-white/80 rounded-full z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ top: 'calc(27% + 3px)', right: 'calc(34% + 1px)' }} />
                  </div>
                )}

                {/* HEALTH ART (i === 1) - Escudo Mdico Hologrfico */}
                {i === 1 && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow ambiental */}
                    <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                    
                    {/* Crculos pulsantes de radar (Eco de sistema unificado) */}
                    <div className="art-pulse-health absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-health absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Silueta del Escudo y Cruz SVG */}
                    <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
                      {/* Escudo Exterior (Seguridad/Pliza) */}
                      <path 
                        className="art-health-silhouette" 
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                        stroke="rgba(255,255,255,0.4)" 
                        strokeWidth="0.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      
                      {/* Cruz Médica Interior (Salud/Clínica) */}
                      <path 
                        className="art-health-core" 
                        d="M13 9h-2v2H9v2h2v2h2v-2h2v-2h-2V9z" 
                        fill="rgba(255,255,255,1)" 
                        stroke="none" 
                      />
                    </svg>

                  </div>
                )}

                {/* VIDA ART (i === 2) - Planta Hologrfica */}
                {i === 2 && (
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow ambiental */}
                    <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />
                    
                    {/* Crculos pulsantes de radar (Eco del sistema) */}
                    <div className="art-pulse-life absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    <div className="art-pulse-life absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0" />
                    
                    {/* Silueta de la planta geomtrica SVG (Diseo Original) */}
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

                    {/* Semilla / Raz de energa (1 solo punto) */}
                    <div className="art-spore-root absolute w-[8px] h-[8px] bg-white rounded-full z-20" style={{ top: '81%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Espaciador inferior (cierra la simetra) */}
        <div className="flex-1 w-full min-h-[2vh] md:min-h-[4vh]" />
      </div>

      {/* 
          ACTO 1: Foreground Slices (Sin Cambios)
       */}
      {/* Foreground Layer: ACT 1 The Contact (Sliced via clip-path) */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
        
        {/* Left Slice */}
        <div className="slice-left absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%)' }}>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] z-0">
             <img src="/client_auto.jpg" alt="Auto Client" className="w-full h-full object-cover opacity-[0.65]" />
             <div className="absolute inset-0 bg-[#00a1e0]/15 mix-blend-color" />
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end gap-fluid-lg">
            
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
                <div className="flex flex-col gap-2 pt-static-sm border-t border-slate-900/10">
                  <div className="flex items-center gap-2">
                    <Envelope className="w-4 h-4 text-slate-400" />
                    <span className="text-body-xs text-slate-600 font-mono">e.rojas@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-body-xs text-slate-600 font-mono">+1 (555) 234-9812</span>
                  </div>
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-slate-900/10 rounded-full bg-white/40 backdrop-blur-sm">
                      <Database className="w-3.5 h-3.5 text-[#00a1e0]" />
                      <span className="text-[11px] font-medium text-slate-700 tracking-wide">Salesforce</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Slice */}
        <div className="slice-center absolute inset-0 bg-slate-950" style={{ clipPath: 'polygon(33.33% 0, 66.66% 0, 66.66% 100%, 33.33% 100%)' }}>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] z-0 bg-[var(--color-brand-blue)] overflow-hidden">
             {/* Imagen Generada por IA (Blobs puros cian/claros Variante 2) */}
             <img src="/Files/Go_CRM/blue_blobs_bg_light_v2.jpg" alt="Brand Gradient Light V2" className="w-full h-full object-cover" />
             
             {/* Capa de cristal reducida para no matar el azul */}
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md saturate-125" />
             
             {/* Vi&ntilde;eteado suave solo en los extremos superior e inferior */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
          </div>
          
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] p-static-lg lg:p-static-xl flex flex-col justify-center items-start">
            <div className="relative z-10 w-full text-left">
              <p className="text-h1 md:text-display-sm lg:text-display font-bold text-[var(--color-text-primary-Reverted)] drop-shadow-md">
                No importa c&oacute;mo llegue el prospecto
              </p>
              
              {/* L&iacute;nea decorativa f&iacute;sica solicitada */}
              <div className="w-24 md:w-32 h-1.5 bg-[var(--color-text-primary-Reverted)] opacity-80 my-static-md rounded-full"></div>
              
              <p className="text-h1 md:text-display-sm lg:text-display font-bold text-[var(--color-text-primary-Reverted)] drop-shadow-md">
                Facebook, formulario web, WhatsApp o llamada entrante... todo converge en un mismo pipeline estructurado.
              </p>
            </div>
          </div>
        </div>

        {/* Right Slice */}
        <div className="slice-right absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(66.66% 0, 100% 0, 100% 100%, 66.66% 100%)' }}>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] z-0">
             <img src="/client_family.jpg" alt="Family Client" className="w-full h-full object-cover opacity-[0.65]" />
             <div className="absolute inset-0 bg-[#00a1e0]/15 mix-blend-color" />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end items-center">
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
                <div className="flex flex-col gap-2 pt-static-sm border-t border-slate-900/10">
                  <div className="flex items-center gap-2">
                    <Envelope className="w-4 h-4 text-slate-400" />
                    <span className="text-body-xs text-slate-600 font-mono">m.lopez@family.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-body-xs text-slate-600 font-mono">+1 (555) 987-6543</span>
                  </div>
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-slate-900/10 rounded-full bg-white/40 backdrop-blur-sm">
                      <Database className="w-3.5 h-3.5 text-[#00a1e0]" />
                      <span className="text-[11px] font-medium text-slate-700 tracking-wide">Salesforce</span>
                    </div>
                  </div>
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
             <div className="absolute inset-0 bg-[#00a1e0]/15 mix-blend-color" />
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








