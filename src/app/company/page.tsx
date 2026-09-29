"use client";

import { useEffect, useState } from "react";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import HeroCompany from "@/components/company/HeroCompany";
import PurposeCompany from "@/components/company/PurposeCompany";
import StructureCompany from "@/components/company/StructureCompany";
import PromiseCompany from "@/components/company/PromiseCompany";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CompanyPage() {
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  useEffect(() => {
    // ----------------------------------------------------
    // STABILITY PATCH: Fix "jumping" and layout shifts
    // ----------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh progressively to catch all async image/font loads
    const refreshST = () => ScrollTrigger.refresh();
    const timeouts = [100, 500, 1000, 2000].map(ms => setTimeout(refreshST, ms));
    
    window.addEventListener("load", refreshST);
    
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsHeaderPill(true);
      } else {
        setIsHeaderPill(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", refreshST);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-surface-BG-base)] transition-colors duration-500 overflow-x-clip relative">
      {/* "?"? GLOBAL HEADER & LOADER "?"? */}
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} scrollSafeZone={150} />

      {/* "?"? COMPANY SECTIONS "?"? */}
      <HeroCompany />
      <PurposeCompany />
      <StructureCompany />
      <PromiseCompany />

      {/* "?"? GLOBAL FOOTER "?"? */}
      <FooterEpicare />
    </main>
  );
}
