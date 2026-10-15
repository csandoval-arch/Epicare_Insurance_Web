"use client";

/**
 * @file /solutions — Marketing y Tecnología de Epicare.
 * Cinco actos: hero → la agencia in-house → el embudo → hecho alrededor del agente →
 * Business Intelligence (el equipo detrás de la plataforma) → el cierre. La sección de privacidad
 * y compliance se retiró el 14-10-2026 por decisión del usuario: `_quarantine/solutions/trust-compliance-2026-10-14/`.
 * Resuelve los anclajes del header: `#marketing` (la agencia) y `#solutions` / `#technology`
 * (la tecnología).
 *
 * Las versiones anteriores de las dos últimas secciones, retiradas el 13-10-2026, esperan en
 * `_quarantine/solutions/`.
 */

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import HeroSolutions from "@/components/solutions/HeroSolutions";
import AgencySolutions from "@/components/solutions/AgencySolutions";
import LeadJourneySolutions from "@/components/solutions/LeadJourneySolutions";
import TailoredSolutions from "@/components/solutions/TailoredSolutions";
import TechnologySolutions from "@/components/solutions/TechnologySolutions";
import CTABannerEpicare from "@/components/epicare/CTABannerEpicare";

/** A partir de aquí el header pasa a píldora flotante */
const HEADER_PILL_AT = 150;

/** Compensación del header fijo al saltar a un anclaje. */
const ANCHOR_OFFSET = -90;

export default function SolutionsPage() {
  const tTrust = useTranslations("solutionsPage.trust");
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  // ── DESPLAZAMIENTO SUAVE A ANCLAJES (#marketing, #solutions, #technology) ──
  const scrollToHash = useCallback(() => {
    const rawHash = window.location.hash;
    if (!rawHash) return;

    const target = document.getElementById(rawHash.replace(/^#/, ""));
    if (!target) return;

    // Siempre por Lenis: `scrollIntoView` pelea con el smooth scroll global y da saltos.
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: ANCHOR_OFFSET });
    } else {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Re-medición progresiva: el loader, las fuentes y la foto del hero mueven la altura del documento.
    const refreshST = () => ScrollTrigger.refresh();
    const timeouts = [100, 300, 700, 1500].map((ms) => setTimeout(refreshST, ms));
    window.addEventListener("load", refreshST);

    const handleScroll = () => setIsHeaderPill(window.scrollY > HEADER_PILL_AT);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    window.addEventListener("hashchange", scrollToHash);
    const initialHashTimer = setTimeout(scrollToHash, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", refreshST);
      window.removeEventListener("hashchange", scrollToHash);
      clearTimeout(initialHashTimer);
      timeouts.forEach(clearTimeout);
    };
  }, [scrollToHash]);

  return (
    <main className="min-h-screen bg-[var(--color-surface-BG-base)] transition-colors duration-500 overflow-x-clip relative">
      {/* ── HEADER GLOBAL Y PRELOADER ── */}
      <LoaderEpicare />
      <HeaderEpicare isHeaderPill={isHeaderPill} scrollSafeZone={HEADER_PILL_AT} />

      {/* ── 01 · HERO ── */}
      <HeroSolutions />

      {/* ── 02 · LA AGENCIA IN-HOUSE (ancla #marketing) ── */}
      <div id="marketing" className="scroll-mt-24">
        <AgencySolutions />
      </div>

      {/* ── 03 · EL EMBUDO · recorrido del lead en scroll horizontal ── */}
      <LeadJourneySolutions />

      {/* ── 04 · HECHO ALREDEDOR DEL AGENTE ── */}
      <TailoredSolutions />

      {/* ── 05 · TECNOLOGÍA PROPIA + BI (anclas #solutions y #technology) ── */}
      <div id="solutions" className="scroll-mt-24">
        <span id="technology" className="sr-only" />
        <TechnologySolutions />
      </div>

      {/* ── CIERRE · el mismo banner de CTA que la landing y /licensing, con el modal de alta ──
          El aire de arriba se pone AQUÍ, no dentro del banner: el componente lo comparten la
          landing y /licensing, y tocarlo movería esas dos páginas. Iguala al `pb` con el que
          termina el bloque oscuro de BI, para que el corte de color se lea simétrico (15-10-2026). */}
      <div className="pt-section-sm lg:pt-section-md">
        <CTABannerEpicare
          title={tTrust("ctaTitle")}
          description={tTrust("ctaDesc")}
          buttonText={tTrust("cta")}
          intent="join"
          surface="page"
        />
      </div>

      {/* ── FOOTER GLOBAL ── */}
      <FooterEpicare />
    </main>
  );
}
