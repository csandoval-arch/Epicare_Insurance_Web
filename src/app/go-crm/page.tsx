"use client";

import { useEffect, useState } from "react";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import HeroGoCrm from "@/components/go-crm/HeroGoCrm";
import ProblemGoCrm from "@/components/go-crm/ProblemGoCrm";
import OpportunitySources from "@/components/go-crm/OpportunitySources";
import ContactVsOpportunity from "@/components/go-crm/ContactVsOpportunity";
import ThePipeline from "@/components/go-crm/ThePipeline";
import TheWorkBehindASale from "@/components/go-crm/TheWorkBehindASale";
import DayVsListContainer from "@/components/go-crm/day-vs-list";
import ConversationsGoCrm from "@/components/go-crm/ConversationsGoCrm";
import AutomationGoCrm from "@/components/go-crm/AutomationGoCrm";
import HorizontalMetricsGoCrm from "@/components/go-crm/metrics-dashboard/HorizontalMetricsGoCrm";
import OpportunityJourneyGoCrm from "@/components/go-crm/OpportunityJourneyGoCrm";
import CierreGoCrm from "@/components/go-crm/CierreGoCrm";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GoCrmPage() {
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
      {/* ── GLOBAL HEADER & LOADER ── */}
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} scrollSafeZone={150} />

      {/* ── GO CRM SECTIONS ── */}
      <HeroGoCrm />
      <ProblemGoCrm />
      {/* <OpportunitySources /> -> Su contenido se movió a ContactVsOpportunity para ahorrar espacio */}
      <div className="w-full pt-section-sm md:pt-section-md" /><ContactVsOpportunity />
      {/* <DayVsListContainer /> */}
      <TheWorkBehindASale />
      {/* <ThePipeline /> -> Fusionado en TheWorkBehindASale */}
      <ConversationsGoCrm />
      <HorizontalMetricsGoCrm />
      {/* <AutomationGoCrm /> */}
      <OpportunityJourneyGoCrm />
      <CierreGoCrm />

      {/* ── GLOBAL FOOTER ── */}
      <FooterEpicare />
    </main>
  );
}
