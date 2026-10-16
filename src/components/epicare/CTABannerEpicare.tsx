"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { CtaPanel, CtaPanelButton } from "@/components/ui/CtaPanel";
import { loginModalStore } from "@/lib/loginModalStore";
import { joinModalStore } from "@/lib/joinModalStore";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";

/** `cta-btn`: el selector que usa la entrada GSAP de este banner. */
const BUTTON_EXTRA = "cta-btn";

interface CTABannerEpicareProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  /** Qué modal abre el botón cuando no hay `buttonHref`: acceso (por defecto) o alta. */
  intent?: "login" | "join";
  /**
   * Fondo de la sección. "own" (por defecto) pinta el blanco/negro con el que nació el banner
   * en la landing y /licensing; "page" lo deja transparente para que herede el de la página y
   * no meta una franja de otro color en medio del scroll.
   */
  surface?: "own" | "page";
}

/**
 * @description CTA final (landing y /licensing). Textos por defecto en `landingV2.ctaBanner` (es/en).
 * Con `buttonHref` el botón es un enlace (la landing baja a `#unete`); sin él, abre el login como el
 * resto de CTAs del sitio.
 */
export default function CTABannerEpicare({
  eyebrow,
  title,
  description,
  buttonText,
  buttonHref,
  intent = "login",
  surface = "own",
}: CTABannerEpicareProps) {
  const t = useTranslations("landingV2.ctaBanner");
  const sectionRef = useRef<HTMLElement>(null);

  const defaultTitle = t.rich("title", {
    // El fondo ya es el azul de marca: el resalte va en blanco con subrayado tenue (igual en claro y oscuro).
    hl: (chunks) => <span className="underline decoration-white/50 decoration-1 underline-offset-8">{chunks}</span>,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".cta-monolith, .cta-eyebrow, .cta-title-line, .cta-desc, .cta-btn", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: TRIGGER.standard,
          toggleActions: "play none none reverse",
        },
      });

      // 1. Contenedor Monolito (Scale up + Fade cinemático)
      tl.fromTo(
        ".cta-monolith",
        { opacity: 0, y: REVEAL.lg, scale: 0.96, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "willChange",
        }
      );

      // 3. Eyebrow
      tl.fromTo(
        ".cta-eyebrow",
        { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.fast,
          ease: EASE.out,
          clearProps: "willChange",
        },
        "<0.3"
      );

      // 4. Título con GPU transform reveal
      tl.fromTo(
        ".cta-title-line",
        {
          yPercent: 120,
          opacity: 0,
          willChange: "transform, opacity",
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.base,
          stagger: STAGGER.base,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "all",
        },
        "<0.15"
      );

      // 5. Descripción
      tl.fromTo(
        ".cta-desc",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          clearProps: "willChange",
        },
        "<0.15"
      );

      // 6. Botón de Acción
      tl.fromTo(
        ".cta-btn",
        { opacity: 0, scale: 0.9, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.snap,
          force3D: true,
          clearProps: "willChange",
        },
        "<0.2"
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="cta-final-epicare"
      className={`w-full relative pt-0 pb-section-xs md:pb-section-sm overflow-hidden transition-colors duration-500 ${surface === "page" ? "bg-transparent" : "bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)]"}`}
    >
      <div className="w-full max-w-6xl mx-auto pt-6 pb-8 md:pb-12 px-3.5 sm:px-4 md:px-8">
        <CtaPanel className="cta-monolith rounded-lg md:rounded-xl">
          <div className="relative z-10 text-left md:text-center px-4 py-10 sm:px-6 sm:py-12 md:py-16 flex flex-col items-start md:items-center">
            
            <span className="cta-eyebrow text-meta font-mono tracking-widest text-white/60 mb-4 uppercase border-b border-white/20 pb-1">
              {eyebrow ?? t("eyebrow")}
            </span>
            
            {/* Título Line-by-Line */}
            <h2 className="text-display-lg md:text-display-xl font-display font-bold text-white mb-4 drop-shadow-sm max-w-3xl">
              <span className="block overflow-hidden pb-2">
                <span className="cta-title-line block">
                  {title || defaultTitle}
                </span>
              </span>
            </h2>
            
            <p className="cta-desc text-body-md sm:text-body-lg text-white/90 max-w-2xl mb-8 leading-relaxed">
              {description ?? t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-static-md md:gap-fluid-xs w-full justify-start md:justify-center max-w-md">
              {buttonHref ? (
                <CtaPanelButton label={buttonText ?? t("button")} href={buttonHref} className={BUTTON_EXTRA} />
              ) : (
                <CtaPanelButton label={buttonText ?? t("button")} className={BUTTON_EXTRA} onClick={() => (intent === "join" ? joinModalStore : loginModalStore).open()} />
              )}
            </div>

          </div>
        </CtaPanel>
      </div>
    </section>
  );
}
