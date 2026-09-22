"use client";

import { asset } from "@/lib/asset";
import BleedRight from "@/components/BleedRight";
import { HeroScrollButtonDesktop } from "./HeroScrollButtons";

const HERO_VIDEO = "/Files/Go_CRM/Hero/crm_UI_Hero_video.mp4";

/**
 * @description Panel inferior del Hero: ventana tipo macOS con el video de la UI de GO CRM,
 * sangrando hasta el borde derecho del viewport. El video es el LCP en desktop, por eso
 * mantiene `autoPlay` en vez de `SmartVideo`.
 */
export default function HeroShowcase({ scrollLabel }: { scrollLabel: string }) {
  return (
    <div className="col-span-12 lg:col-start-2 lg:col-span-11 w-full mt-static-md lg:mt-static-lg">
      <BleedRight className="relative w-full h-auto" mobileBleedClassName="min-w-[150%] w-[150%] -mr-[50%]">
        <HeroScrollButtonDesktop label={scrollLabel} />

        <div className="crm-hero-showcase relative w-full rounded-l-2xl lg:rounded-l-[24px] rounded-r-none border border-[var(--color-border-Strokes-default)] border-r-0 bg-[#0A0A0A] shadow-elevation-3 overflow-hidden p-0 flex flex-col">
          {/* ── BARRA DE VENTANA ── */}
          <div className="w-full h-[26px] lg:h-[34px] bg-[var(--color-surface-BG-1)] border-b border-[var(--color-border-Strokes-default)] flex items-center px-3 lg:px-static-md shrink-0 z-10">
            <div className="flex gap-1.5" aria-hidden="true">
              <div className="w-1.5 h-1.5 lg:w-static-sm lg:h-static-sm rounded-full bg-[#FF5F56]" />
              <div className="w-1.5 h-1.5 lg:w-static-sm lg:h-static-sm rounded-full bg-[#FFBD2E]" />
              <div className="w-1.5 h-1.5 lg:w-static-sm lg:h-static-sm rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 flex justify-center ml-[-60px]" aria-hidden="true">
              <div className="h-3 lg:h-static-md w-1/3 max-w-[240px] bg-white/5 rounded-md border border-white/5" />
            </div>
          </div>

          {/* ── VIDEO (ASPECT RATIO NATURAL) ── */}
          <div className="relative w-full overflow-hidden bg-[#0A0A0A] flex justify-center items-center">
            <video
              src={asset(HERO_VIDEO)}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="w-full h-auto block origin-center"
            />
          </div>
        </div>
      </BleedRight>
    </div>
  );
}
