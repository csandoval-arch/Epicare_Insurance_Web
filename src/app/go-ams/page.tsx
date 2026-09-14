"use client";

import { useEffect, useState } from "react";
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
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsHeaderPill(true);
      } else {
        setIsHeaderPill(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-surface-BG-base)] transition-colors duration-500 overflow-x-clip relative">
      
      {/* ======================= */}
      {/*   GLOBAL COMPONENTS     */}
      {/* ======================= */}
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} />
      
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
