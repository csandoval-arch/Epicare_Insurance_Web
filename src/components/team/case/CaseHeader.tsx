"use client";

/**
 * @description Encabezado de acto (01, 03 y los actos A–F): eyebrow, titular y subtítulo (solo si el
 * namespace trae `subtitle`) con Text-Birth one-shot al llegar. `ns` elige el namespace de i18n;
 * `center` lo centra. Con reduced-motion queda estático.
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

export const FULL = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1024px)";
export const MOBILE = "(max-width: 1023px)";
export const oneShot = (trigger: Element | null, start = "top 82%") => ({
  scrollTrigger: { trigger, start, toggleActions: "play none none reverse" },
});

export default function CaseHeader({
  className = "",
  center = false,
  large = false,
  inverse = false,
  ns = "team.case",
}: {
  className?: string;
  center?: boolean;
  /** Titular un paso más grande en la escala (`text-display-lg`). */
  large?: boolean;
  /** Sobre fondo de color (azul de marca): eyebrow y subtítulo en blanco. */
  inverse?: boolean;
  ns?: `team.${string}`;
}) {
  const t = useTranslations(ns);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add(FULL, () => {
      gsap.fromTo(".ch-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base, ...oneShot(el) });
      // El subtítulo es opcional: sin él no hay nada que animar.
      if (el.querySelector(".ch-sub")) gsap.fromTo(".ch-sub",{ y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, delay: STAGGER.wave * 2, ...oneShot(el) });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={`flex flex-col gap-static-md ${center ? "items-center text-center" : ""} ${className}`}>
      <span className="block overflow-hidden">
        <span className={`ch-birth block text-overline ${inverse ? "text-[var(--color-text-White-100)]/80" : "text-[var(--color-text-accent-blue)]"}`}>{t("eyebrow")}</span>
      </span>
      <h2 className={large ? "text-display-lg" : "text-display"}>
        <span className="block overflow-hidden pb-static-xs">
          <span className="ch-birth block">{t("title")}</span>
        </span>
      </h2>
      {t.has("subtitle") && <p className={`ch-sub text-body-xl ${inverse ? "text-[var(--color-text-White-100)]/70" : "text-[var(--color-text-secondary)]"}`}>{t("subtitle")}</p>}
    </div>
  );
}
