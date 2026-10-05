"use client";

/**
 * @file /team — "Every case has a crew." La página se cuenta como una producción de cine:
 * 00 The cast (hero) · 01 The case · 02 The crew · 03 Your role · 04 Credits.
 * Blueprint: Graph-Design-Framework/project-context/sections/team/context.md
 */

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import HeroTeam from "@/components/team/HeroTeam";
import CaseTeam from "@/components/team/CaseTeam";
import RoleTeam from "@/components/team/RoleTeam";
import CreditsTeam from "@/components/team/CreditsTeam";

/** A partir de aquí el header pasa a píldora. */
const HEADER_PILL_AT = 150;

export default function TeamPage() {
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Las alturas cambian al cargar fuentes e imágenes: los triggers se re-miden al terminar.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    const onScroll = () => setIsHeaderPill(window.scrollY > HEADER_PILL_AT);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-hero-ivory)] overflow-x-clip relative">
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} scrollSafeZone={HEADER_PILL_AT} />

      {/* ── ACTOS ── */}
      <HeroTeam />
      <CaseTeam />
      <RoleTeam />
      <CreditsTeam />

      <FooterEpicare />
    </main>
  );
}
