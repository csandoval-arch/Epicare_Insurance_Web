"use client";

/**
 * @file UnlicensedRoadmap.tsx
 * @description Sección 3 de /join-us?role=agent-unlicensed — «Licensing Process / Timeline Asimétrico Centrado».
 * - Desktop: Eje central continuo animado con haz por ScrollTrigger, disposición asimétrica zig-zag con títulos y subtextos.
 * - Mobile: Exactamente la misma composición de desktop pero compacta («chiquito»):
 *   · Eje central y nodos en `left-1/2` con alternancia izquierda/derecha.
 *   · Subtextos ocultos en móvil (`hidden lg:block`) para máxima síntesis visual.
 *   · Fotografía editorial panorámica centrada al pie con badge de acreditación.
 *   · CTA primario centrado.
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { RegisterCta, SectionTitle } from "./shared/parts";

const WRAP = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";

interface StepItem {
  step: string;
  title: string;
  body: string;
}

export default function UnlicensedRoadmap() {
  const t = useTranslations("joinUs.roles.agent-unlicensed.roadmap");
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

    // Medición matemática del eje central exacto entre Nodo 1 y Nodo 4
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

          if (progress >= 0.88) {
            setActiveStep(3);
          } else if (progress >= 0.58) {
            setActiveStep(2);
          } else if (progress >= 0.28) {
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
      data-act="roadmap"
      className="relative w-full py-section-sm lg:py-section-lg border-t border-[var(--color-border-Strokes-default)]"
    >
      {/* ── ENCABEZADO: LEFT EN MOBILE, CENTRADO EN DESKTOP ── */}
      <div className={`${WRAP} text-left md:text-center flex flex-col items-start md:items-center pb-static-lg md:pb-static-2xl lg:pb-section-sm`}>
        <SectionTitle
          eyebrow={t("eyebrow")}
          title={t("title")}
          className="items-start md:items-center text-left md:text-center max-w-2xl md:mx-auto"
        />
      </div>

      <div className={`${WRAP} relative`}>

        {/* ── CONTENEDOR DEL TIMELINE ASIMÉTRICO CENTRADO (Mobile & Desktop) ── */}
        <div ref={trackRef} className="relative w-full max-w-4xl mx-auto">

          {/* Eje central base (centrado en left-1/2 tanto en mobile como en desktop) */}
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

          {/* ── LOS 4 HITOS DEL TIMELINE EN ZIG-ZAG ── */}
          {steps.map((item, index) => {
            const isEven = index % 2 === 0; // 0, 2 -> Izquierda; 1, 3 -> Derecha
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

                {/* ── LADO IZQUIERDO (Hitos 01 y 03) ── */}
                {isEven ? (
                  <div className="w-1/2 pr-5 sm:pr-8 lg:pr-14 text-right flex flex-col items-end gap-static-xs">
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
                    <p className="text-body-sm md:text-body-md text-[var(--color-text-secondary)] leading-relaxed max-w-md ml-auto pt-0.5 md:pt-static-xs">
                      {item.body}
                    </p>
                  </div>
                ) : (
                  <div className="w-1/2 pr-5 sm:pr-8 lg:pr-14" />
                )}

                {/* ── LADO DERECHO (Hitos 02 y 04) ── */}
                {!isEven ? (
                  <div className="w-1/2 pl-5 sm:pl-8 lg:pl-14 text-left flex flex-col items-start gap-static-xs">
                    <div className="flex items-center gap-static-xs md:gap-static-sm">
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
                      {isFinal && (
                        <span className="text-caption font-mono uppercase tracking-wider text-[var(--color-brand-orange)]">
                          NIPR
                        </span>
                      )}
                    </div>
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

        {/* ── FOTOGRAFÍA EDITORIAL CENTRADA AL PIE DEL TIMELINE ── */}
        <div className="w-full max-w-4xl mx-auto pt-static-lg md:pt-static-xl lg:pt-section-sm">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-[var(--color-border-Strokes-default)] shadow-elevation-2 group">
            <img
              src={asset("/Files/join-us/licensing-roadmap.jpg")}
              alt="Pre-licensing study and coursework"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Viñeta sutil para profundidad visual */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
            />
            {/* Badge de acreditación contextual en esquina */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 flex items-center gap-static-xs px-static-sm sm:px-static-md py-static-xs rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 text-caption font-medium text-[var(--color-text-primary)]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
              <span>{t("badge")}</span>
            </div>
          </div>
        </div>

        {/* ── CTA PRIMARIO CENTRADO ── */}
        <div className="pt-static-lg md:pt-static-xl flex justify-center">
          <RegisterCta label={t("cta")} className="jb-rise" />
        </div>

      </div>
    </section>
  );
}
