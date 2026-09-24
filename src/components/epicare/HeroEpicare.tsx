"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import HeaderEpicare from './HeaderEpicare';

// =========================================================================
// WINDOWED VIDEO (Continuous Background Projection)
// =========================================================================

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

        <div className="col-start-6 col-span-2 row-start-2 row-span-1 z-[30]">
          <h2 className="text-display-sm text-[#151617] font-medium tracking-tight flex flex-col" style={{ marginLeft: `32px` }}>
            <span>el puente que nadie</span>
            <span>quiso construir,</span>
            <span>y seguimos</span>
            <span>construyendo.</span>
          </h2>
        </div>

        <div className="col-start-9 col-span-2 row-start-2 row-span-1 mt-[6vh] z-[30] flex flex-col justify-start gap-5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[4] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[3] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-cover bg-center relative z-[2] grayscale mix-blend-multiply" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop)' }}></div>
              <div className="w-[48px] h-[48px] rounded-full border-[3px] border-[#F1EEE5] bg-[#151617] relative z-[1] flex items-center justify-center">
                <span className="text-[#F1EEE5] text-[13px] font-semibold tracking-tighter">+130</span>
              </div>
            </div>
            <div className="text-[#151617] font-medium text-[12px] leading-[1.2] opacity-80">
              Carrier<br/>Appointments
            </div>
          </div>
          
          <p className="text-h3 text-[#151617] font-medium opacity-80 pr-6 md:pr-12">
            Todo el respaldo operativo en un solo contrato. Y tu book of business, 100% tuyo.
          </p>
        </div>

        <div className="col-start-7 col-span-3 row-start-4 row-span-1 h-[80px] self-end mb-12 z-[30]">
          <Link href="/contrato" className="flex items-center w-full h-full bg-[#111418] hover:bg-black transition-colors px-6 group">
            <span className="text-[#F1EEE5] text-[16px] md:text-[20px] font-medium transition-transform group-hover:translate-x-2">Solicita tu contrato</span>
          </Link>
        </div>

        <div className="col-start-10 col-span-3 row-start-4 row-span-1 h-[80px] self-end mb-12 z-[30]">
          <Link href="/go-ams" className="flex items-center justify-between w-full h-full bg-[#F1EEE5] hover:bg-[#E5E2D8] border border-[#151617]/10 transition-colors px-6 group">
            <span className="text-[#151617] text-[16px] md:text-[20px] font-medium">Ver GO AMS</span>
            <span className="text-[#151617] text-[20px] transition-transform group-hover:translate-x-2">&rarr;</span>
          </Link>
        </div>

        <div className="col-start-1 col-span-2 row-start-5 row-span-1 self-end pb-8 pl-6 md:pl-12 z-[30]">
          <div className="text-[#151617] text-[18px] md:text-[22px] font-bold tracking-[0.2em] uppercase">Epicare</div>
        </div>

      </div>
    </section>
  );
}
