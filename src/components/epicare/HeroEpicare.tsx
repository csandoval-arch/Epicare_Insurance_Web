"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import HeaderEpicare from './HeaderEpicare';

// =========================================================================
// MAGICAL COMPONENTS: CONTINUOUS VIDEO & EXACT TEXT SYNCHRONIZATION
// =========================================================================

const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const WindowedVideo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: '100vw', h: '100vh' });

  useEffect(() => {
    let frame: number;
    const update = () => {
      if (ref.current) {
        const section = ref.current.closest('section');
        if (section) {
          const secRect = section.getBoundingClientRect();
          const cellRect = ref.current.getBoundingClientRect();
          setOffset({ 
            x: -(cellRect.left - secRect.left), 
            y: -(cellRect.top - secRect.top) 
          });
          setSize({ 
            w: `${secRect.width}px`, 
            h: `${secRect.height}px` 
          });
        }
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="w-full h-full overflow-hidden relative">
      <video 
        autoPlay loop muted playsInline preload="metadata"
        className="absolute max-w-none object-cover grayscale opacity-90 mix-blend-multiply"
        style={{ 
          width: size.w, 
          height: size.h,
          transform: `translate(${offset.x}px, ${offset.y}px)`
        }}
      >
        <source src={asset('Files/Epicare_Landing/Hero/Hero_02.mp4')} type="video/mp4" />
      </video>
    </div>
  );
};

// =========================================================================
// MAIN HERO COMPONENT (Purged & Production Ready)
// =========================================================================

export default function HeroEpicare() {
  const t = useTranslations("landingV2.hero");

  return (
    <section className="relative w-full min-h-screen bg-[#F1EEE5] text-[#151617] overflow-hidden">
      <HeaderEpicare isHeaderPill={false} isHeaderForcedDark={false} scrollSafeZone={150} />

      {/* GRID EDITORIAL */}
      <div className="grid-layout w-full min-h-screen max-w-none px-0 relative z-10 gap-x-0">
        
        {/* ==================================
            LAYER 20: VIDEOS
            ================================== */}
        <div className="col-start-10 col-span-3 row-start-1 row-span-2 w-full z-[20]">
          <div style={{ height: `240px` }} className="w-full">
             <WindowedVideo />
          </div>
        </div>

        <div className="col-start-1 col-span-5 row-start-2 row-span-2 w-full self-end z-[20]">
          <div style={{ height: `480px` }} className="w-full">
             <WindowedVideo />
          </div>
        </div>

        {/* ==================================
            LAYER 30: TEXTS & CTAs
            ================================== */}
        <div className="col-start-1 col-span-12 row-start-1 row-span-1 w-full pl-6 md:pl-12 pt-[12vh] z-[30]">
          <h1 className="text-[clamp(60px,11.5vw,175px)] leading-[0.9] font-medium tracking-tight text-[#151617] whitespace-nowrap">
            Construimos
          </h1>
        </div>

        {/* Columna combinada para Subtítulo Grande y CTAs (Centrado Perfecto) */}
        <div className="col-start-6 col-span-2 row-start-2 row-span-2 z-[30] flex flex-col h-full" style={{ marginLeft: `32px` }}>
          <h2 className="text-display-sm text-[#151617] font-medium tracking-tight flex flex-col mt-[14px]">
            <span>El puente</span>
            <span>que nadie</span>
            <span>quiso construir,</span>
            <span>y seguimos</span>
            <span>construyendo.</span>
          </h2>
          
          {/* Este div empuja los CTAs al centro exacto del espacio restante */}
          <div className="flex-1 flex flex-col justify-center pb-8">
            <div className="flex flex-wrap items-center gap-4">

              <Link href="/contrato" className="group flex h-[48px] pl-6 pr-1.5 w-fit rounded-full justify-between items-center gap-3 bg-[var(--color-brand-blue)] text-white text-[14px] font-semibold normal-case transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-elevation-2 hover:brightness-105 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-95 cursor-pointer">
                <span className="whitespace-nowrap">Solicita tu contrato</span>
                <span className="relative w-8 h-8 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
                  <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </Link>

              <Link href="/go-ams" className="group flex h-[48px] pl-6 pr-1.5 w-fit rounded-full justify-between items-center gap-3 border border-[var(--color-brand-blue)]/40 bg-white/50 text-[#151617] text-[14px] font-semibold normal-case shadow-elevation-1 backdrop-blur-md transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 hover:bg-white active:scale-95 cursor-pointer">
                <span className="whitespace-nowrap">Ver GO AMS</span>
                <span className="relative w-8 h-8 rounded-full bg-[#151617] text-white flex items-center justify-center overflow-hidden shrink-0">
                  <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
                  <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-start-9 col-span-2 row-start-2 row-span-1 z-[30] flex flex-col justify-start gap-6 mt-[26px]">
          {/* Avatar Block */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[4] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[3] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[2] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-[#151617] relative z-[1] flex items-center justify-center">
                <span className="text-[#F1EEE5] text-[13px] font-semibold tracking-tighter">100+</span>
              </div>
            </div>
            <div className="text-[#151617] font-medium text-[12px] leading-[1.2] opacity-80">
              Agentes<br/>activos
            </div>
          </div>
          
          <p className="text-h3 text-[#151617] font-medium opacity-80 pr-6 md:pr-12">
            <span className="text-[#347EAC]">130+ aseguradoras</span>, tecnología y equipo de soporte bajo <span className="text-[#347EAC]">un solo contrato</span>. Tu book of business, <span className="text-[#347EAC]">100% tuyo</span>.
          </p>
        </div>

      </div>
    </section>
  );
}
