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
import CalendarGoCrm from "@/components/go-crm/CalendarGoCrm";
import OpportunityJourneyGoCrm from "@/components/go-crm/OpportunityJourneyGoCrm";
import CierreGoCrm from "@/components/go-crm/CierreGoCrm";

export default function GoCrmPage() {
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
      {/* ── GLOBAL HEADER & LOADER ── */}
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} scrollSafeZone={150} />

      {/* ── GO CRM SECTIONS ── */}
      <HeroGoCrm />
      <ProblemGoCrm />
      <OpportunitySources />
      <ContactVsOpportunity />
      {/* <DayVsListContainer /> */}
      <TheWorkBehindASale />
      <ThePipeline />
      <ConversationsGoCrm />
      <CalendarGoCrm />
      <AutomationGoCrm />
      <OpportunityJourneyGoCrm />
      <CierreGoCrm />

      {/* ── GLOBAL FOOTER ── */}
      <FooterEpicare />
    </main>
  );
}
