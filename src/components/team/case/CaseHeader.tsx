"use client";

/**
 * @description Encabezado de acto (01 The case, 03 Your role): eyebrow, titular y subtítulo con
 * Text-Birth one-shot al llegar. `ns` elige el namespace de i18n; `center` lo centra. Con
 * reduced-motion queda estático.
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
  ns = "team.case",
}: {
  className?: string;
  center?: boolean;
  ns?: "team.case" | "team.role";
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
      gsap.fromTo(".ch-sub", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, delay: STAGGER.wave * 2, ...oneShot(el) });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={`flex flex-col gap-static-md ${center ? "items-center text-center" : ""} ${className}`}>
      <span className="block overflow-hidden">
        <span className="ch-birth block text-overline text-[var(--color-text-accent-blue)]">{t("eyebrow")}</span>
      </span>
      <h2 className="text-display">
        <span className="block overflow-hidden pb-static-xs">
          <span className="ch-birth block">{t("title")}</span>
        </span>
      </h2>
      <p className="ch-sub text-body-xl text-[var(--color-text-secondary)]">{t("subtitle")}</p>
    </div>
  );
}
