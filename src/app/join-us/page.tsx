"use client";

/**
 * @file /join-us — la página de solicitud a la que lleva el modal "Join Epicare" (4 versiones por
 * `?role=`). Contenido en `components/join-us/JoinUsView`.
 * Contexto: Graph-Design-Framework/project-context/sections/join-us/context.md
 */

import { useEffect, useState, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeaderEpicare from "@/components/epicare/HeaderEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import JoinUsView from "@/components/join-us/JoinUsView";

/** A partir de aquí el header pasa a píldora. */
const HEADER_PILL_AT = 150;

export default function JoinUsPage() {
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Las alturas cambian al cargar fuentes, imágenes y el formulario: los triggers se re-miden al terminar.
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
      <Suspense fallback={null}>
        <JoinUsView />
      </Suspense>
      <FooterEpicare />
    </main>
  );
}
