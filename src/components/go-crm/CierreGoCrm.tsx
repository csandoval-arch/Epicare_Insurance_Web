"use client";

/**
 * @file CierreGoCrm.tsx
 * @description Sección 8 de GO CRM — cierre. Monolito azul de marca con grano (`ui/CtaPanel`): GO CRM ya está
 * disponible + CTA primario final (abre el modal de login, como el resto de CTAs de la página).
 * Centrado en desktop; alineado a la izquierda en móvil.
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import { loginModalStore } from "@/lib/loginModalStore";
import { CtaPanel, CtaPanelButton } from "@/components/ui/CtaPanel";

/** Escala de entrada del monolito (margen creativo declarado). */
const MONOLITH_START_SCALE = 0.96;
const FULL = "(prefers-reduced-motion: no-preference)";

export default function CierreGoCrm() {
  const t = useTranslations("goCrm.cierre");
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      const scrollTrigger = { trigger: el, start: TRIGGER.late, toggleActions: "play none none reverse" };
      const tl = gsap.timeline({ scrollTrigger });
      tl.fromTo(
        ".cierre-monolith",
        { opacity: 0, y: REVEAL.lg, scale: MONOLITH_START_SCALE, willChange: "transform, opacity" },
        { opacity: 1, y: 0, scale: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" }
      )
        .fromTo(
          ".cierre-title",
          { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" },
          { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" },
          0.2
        )
        .fromTo(
          ".cierre-item",
          { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, force3D: true, clearProps: "willChange" },
          0.35
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full min-h-[90dvh] flex items-center justify-center overflow-hidden px-gutter-sm md:px-gutter-md py-section-sm bg-[var(--color-surface-BG-base)]"
    >
      <div className="w-full max-w-4xl mx-auto">
        <CtaPanel className="cierre-monolith rounded-3xl sm:rounded-[2.5rem]">
          {/* Padding vertical = base + 32px arriba y abajo (+64px de alto): 3rem→5rem en móvil, 4rem→6rem en desktop */}
          <div className="relative z-10 px-static-lg py-20 md:px-16 md:py-24 lg:px-24 flex flex-col items-start text-left md:items-center md:text-center">
            <p className="cierre-item text-overline text-[var(--color-text-White-100)]/70 mb-static-md">{t("overline")}</p>

            <div className="overflow-hidden pb-1 mb-static-md">
              <h2 className="cierre-title text-display-sm md:text-display-lg text-[var(--color-text-White-100)]">{t("headline")}</h2>
            </div>

            <p className="cierre-item text-body-lg text-[var(--color-text-White-100)]/90 max-w-lg md:text-balance mb-static-xl">{t("desc")}</p>

            <CtaPanelButton label={t("cta")} className="cierre-item" onClick={() => loginModalStore.open()} />
          </div>
        </CtaPanel>
      </div>
    </section>
  );
}
