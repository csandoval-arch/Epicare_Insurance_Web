"use client";

/**
 * @file FmoHowItWorks.tsx
 * @description Sección 3 de /join-us?role=agency-fmo — «Proceso / Cómo funciona».
 * Timeline Asimétrico Vertical Centrado con 5 fases de activación y escalamiento:
 * 01. Apply & qualify
 * 02. License & co-brand
 * 03. Onboard (4–6 weeks)
 * 04. Activate your stack
 * 05. Launch & recruit
 *
 * - Eje central continuo y haz dinámico animado por ScrollTrigger (left-1/2).
 * - Disposición asimétrica zig-zag con alternancia izquierda/derecha.
 * - Nodos luminosos con indicador activo e hito final (05) en acento naranja.
 * - CTA primario centrado al pie con scroll al formulario del Hero.
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RegisterCta, SectionTitle } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

interface StepItem {
  step: string;
  title: string;
  body: string;
}

export default function FmoHowItWorks() {
  const t = useTranslations("joinUs.roles.agency-fmo.howItWorks");
  const steps = t.raw("steps") as StepItem[];
  const [activeStep, setActiveStep] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const firstNodeRef = useRef<HTMLDivElement>(null);
  const lastNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    const track = trackRef.current;
    const spine = spineRef.current;
    const beam = beamRef.current;
    const firstNode = firstNodeRef.current;
    const lastNode = lastNodeRef.current;

    if (!el || !track || !spine || !beam || !firstNode || !lastNode) return;

    // Medición matemática del eje central exacto entre Nodo 1 y Nodo 5
    const updateSpineBounds = () => {
      const trackRect = track.getBoundingClientRect();
      const firstRect = firstNode.getBoundingClientRect();
      const lastRect = lastNode.getBoundingClientRect();

      const startY = firstRect.top - trackRect.top + firstRect.height / 2;
      const endY = lastRect.top - trackRect.top + lastRect.height / 2;
      const height = Math.max(0, endY - startY);

      spine.style.top = `${startY}px`;
      spine.style.height = `${height}px`;
      beam.style.top = `${startY}px`;
      beam.style.height = `${height}px`;
    };

    updateSpineBounds();
    window.addEventListener("resize", updateSpineBounds);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(beam, { scaleY: 1 });
        setActiveStep(steps.length - 1);
        return;
      }

      // El haz se dibuja de arriba hacia abajo con el scroll
      ScrollTrigger.create({
        trigger: track,
        start: "top 75%",
        end: "bottom 65%",
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(beam, { scaleY: progress });

          if (progress >= 0.82) {
            setActiveStep(4);
          } else if (progress >= 0.6) {
            setActiveStep(3);
          } else if (progress >= 0.4) {
            setActiveStep(2);
          } else if (progress >= 0.2) {
            setActiveStep(1);
          } else {
            setActiveStep(0);
          }
        },
      });
    }, el);

    return () => {
      window.removeEventListener("resize", updateSpineBounds);
      ctx.revert();
    };
  }, [steps.length]);

  return (
    <section
      ref={containerRef}
      data-act="how-it-works"
      className="relative w-full py-section-sm lg:py-section-lg border-t border-[var(--color-border-Strokes-default)]"
    >
      {/* ── ENCABEZADO: LEFT EN MOBILE, CENTRADO EN DESKTOP ── */}
      <div className={`${WRAP} text-left md:text-center flex flex-col items-start md:items-center pb-static-lg md:pb-static-2xl lg:pb-section-sm`}>
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          className="items-start md:items-center text-left md:text-center max-w-2xl md:mx-auto"
        />
        <span className="jb-rise font-mono text-body-sm md:text-body-md text-[var(--color-brand-blue)] mt-2">
          {t("subtitle")}
        </span>
      </div>

      <div className={`${WRAP} relative`}>
        {/* ── CONTENEDOR DEL TIMELINE ASIMÉTRICO CENTRADO (Mobile & Desktop) ── */}
        <div ref={trackRef} className="relative w-full max-w-4xl mx-auto">
          {/* Eje central base */}
          <div
            ref={spineRef}
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 w-px bg-[var(--color-border-Strokes-default)] pointer-events-none"
          />

          {/* Haz vivo animado por ScrollTrigger */}
          <div
            ref={beamRef}
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[var(--color-brand-blue)] via-[var(--color-brand-blue)] to-[var(--color-brand-orange)] origin-top pointer-events-none scale-y-0 rounded-full shadow-[0_0_8px_rgba(53,187,253,0.4)]"
          />

          {/* ── LOS 5 HITOS DEL TIMELINE EN ZIG-ZAG ── */}
          {steps.map((item, index) => {
            const isEven = index % 2 === 0; // 0, 2, 4 -> Izquierda; 1, 3 -> Derecha
            const isFinal = index === steps.length - 1;
            const isActive = activeStep >= index;

            return (
              <div
                key={item.step}
                className="relative flex flex-row items-start pb-static-xl md:pb-section-sm last:pb-0"
              >
                {/* ── NODO EN EL EJE CENTRAL ── */}
                <div
                  ref={index === 0 ? firstNodeRef : isFinal ? lastNodeRef : undefined}
                  className="absolute left-1/2 -translate-x-1/2 top-1 z-10"
                >
                  <span
                    className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? isFinal
                          ? "bg-[var(--color-brand-orange)] ring-4 ring-[var(--color-brand-orange)]/25"
                          : "bg-[var(--color-brand-blue)] ring-4 ring-[var(--color-brand-blue)]/20"
                        : "bg-[var(--color-hero-ivory)] dark:bg-[var(--color-surface-BG-1)] border-2 border-[var(--color-border-Strokes-default)]"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </div>

                {/* ── LADO IZQUIERDO (Hitos 01, 03, 05) ── */}
                {isEven ? (
                  <div className="w-1/2 pr-5 sm:pr-8 lg:pr-14 text-right flex flex-col items-end gap-static-xs">
                    <div className="flex items-center gap-static-xs md:gap-static-sm">
                      {isFinal && (
                        <span className="text-caption font-mono uppercase tracking-wider text-[var(--color-brand-orange)]">
                          Go Live
                        </span>
                      )}
                      <span
                        className={`font-mono text-meta font-semibold transition-colors duration-200 ${
                          isActive
                            ? isFinal
                              ? "text-[var(--color-brand-orange)]"
                              : "text-[var(--color-brand-blue)]"
                            : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-h3 md:text-h2 font-medium text-[var(--color-text-primary)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-body-sm md:text-body-md text-[var(--color-text-secondary)] leading-relaxed max-w-md ml-auto pt-0.5 md:pt-static-xs">
                      {item.body}
                    </p>
                  </div>
                ) : (
                  <div className="w-1/2 pr-5 sm:pr-8 lg:pr-14" />
                )}

                {/* ── LADO DERECHO (Hitos 02, 04) ── */}
                {!isEven ? (
                  <div className="w-1/2 pl-5 sm:pl-8 lg:pl-14 text-left flex flex-col items-start gap-static-xs">
                    <span
                      className={`font-mono text-meta font-semibold transition-colors duration-200 ${
                        isActive
                          ? "text-[var(--color-brand-blue)]"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {item.step}
                    </span>
                    <h3 className="text-h3 md:text-h2 font-medium text-[var(--color-text-primary)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-body-sm md:text-body-md text-[var(--color-text-secondary)] leading-relaxed max-w-md pt-0.5 md:pt-static-xs">
                      {item.body}
                    </p>
                  </div>
                ) : (
                  <div className="w-1/2 pl-5 sm:pl-8 lg:pl-14" />
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA PRIMARIO CENTRADO ── */}
        <div className="pt-static-xl md:pt-section-sm flex justify-center">
          <RegisterCta label={t("cta")} className="jb-rise" />
        </div>
      </div>
    </section>
  );
}
