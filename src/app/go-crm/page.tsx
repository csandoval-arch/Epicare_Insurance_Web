"use client";

import { useEffect } from "react";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import HeroGoCrm from "@/components/go-crm/HeroGoCrm";
import ProblemGoCrm from "@/components/go-crm/ProblemGoCrm";
import ContactVsOpportunity from "@/components/go-crm/ContactVsOpportunity";
import TheWorkBehindASale from "@/components/go-crm/TheWorkBehindASale";
import ConversationsGoCrm from "@/components/go-crm/ConversationsGoCrm";
import HorizontalMetricsGoCrm from "@/components/go-crm/metrics-dashboard/HorizontalMetricsGoCrm";
import OpportunityJourneyGoCrm from "@/components/go-crm/OpportunityJourneyGoCrm";
import CierreGoCrm from "@/components/go-crm/CierreGoCrm";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GoCrmPage() {
  useEffect(() => {
    // Fuentes e imágenes terminan de cargar después del primer render y mueven la altura del
    // documento: sin estos refresh los pins arrancan desfasados (codebase-architecture §4.1).
    gsap.registerPlugin(ScrollTrigger);
    const refreshST = () => ScrollTrigger.refresh();
    const timeouts = [100, 500, 1000, 2000].map((ms) => setTimeout(refreshST, ms));
    window.addEventListener("load", refreshST);
    return () => {
      window.removeEventListener("load", refreshST);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-surface-BG-base)] transition-colors duration-500 overflow-x-clip relative">
      {/* ── GLOBAL HEADER & LOADER ── */}
      <LoaderEpicare />
      <HeaderEpicare pillAfter={150} scrollSafeZone={150} />

      {/* ── GO CRM SECTIONS ── */}
      <HeroGoCrm />
      <ProblemGoCrm />
      {/* OpportunitySources: su contenido se fusionó en ContactVsOpportunity. */}
      {/* Este espaciador es el único dueño del aire entre El problema y Contacto vs Oportunidad. */}
      <div className="hidden md:block w-full md:pt-section-sm bg-[var(--color-surface-BG-base)]" />
      <ContactVsOpportunity />
      {/* ThePipeline: fusionado en TheWorkBehindASale. */}
      <TheWorkBehindASale />
      <ConversationsGoCrm />
      <HorizontalMetricsGoCrm />
      <OpportunityJourneyGoCrm />
      <CierreGoCrm />

      {/* ── GLOBAL FOOTER ── */}
      <FooterEpicare />
    </main>
  );
}
