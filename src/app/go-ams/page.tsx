"use client";

import HeroSection from "@/components/go-ams/HeroSection";
import { GoAmsProblemSection } from "@/components/go-ams/GoAmsProblemSection";
import PlatformRevealSection from "@/components/go-ams/PlatformRevealSection";
import BackOfficeTour from "@/components/go-ams/BackOfficeTour";
import QuoteEnroll from "@/components/go-ams/QuoteEnroll";
import AgentAgencySection from "@/components/go-ams/AgentAgencySection";
import DownlineSection from "@/components/go-ams/DownlineSection";
import DelegateUsersSection from "@/components/go-ams/DelegateUsersSection";
import HowToJoinSection from "@/components/go-ams/HowToJoinSection";
import FaqSection from "@/components/go-ams/FaqSection";
import CtaFinalSection from "@/components/go-ams/CtaFinalSection";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";

export default function GoAmsPage() {
  // La píldora del header la resuelve el propio HeaderEpicare con `pillAfter` (mismo umbral de
  // 150px): mantener aquí un segundo listener de scroll solo duplicaba el estado.
  return (
    <main className="min-h-screen bg-[var(--color-surface-BG-base)] transition-colors duration-500 overflow-x-clip relative">
      
      {/* ======================= */}
      {/*   GLOBAL COMPONENTS     */}
      {/* ======================= */}
      <LoaderEpicare />
      <HeaderEpicare pillAfter={150} scrollSafeZone={150} />
      
      {/* ======================= */}
      {/*   LANDING SECTIONS      */}
      {/* ======================= */}
      
      <HeroSection />
      <GoAmsProblemSection />
      <PlatformRevealSection />
      <AgentAgencySection />
      <QuoteEnroll />
      <DownlineSection />
      <DelegateUsersSection />
      <BackOfficeTour />
      <HowToJoinSection />
      <FaqSection />
      <CtaFinalSection />

      {/* ======================= */}
      {/*   GLOBAL FOOTER         */}
      {/* ======================= */}
      <FooterEpicare />

    </main>
  );
}
