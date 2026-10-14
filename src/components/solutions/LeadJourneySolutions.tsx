"use client";

/**
 * @file LeadJourneySolutions.tsx
 * @description Sección "Recorrido del lead — De la campaña al cliente" de /solutions.
 *
 * Flujo horizontal limpio y minimalista:
 * - El titular editorial inicia en el lado izquierdo con margen natural alineado a la retícula principal.
 * - Sin barras ruidosas superiores ni listas duplicadas de etapas.
 * - Las 5 tarjetas se desplazan conjuntamente con el scroll horizontal:
 *   - 01 / Generate: Captación multicanal.
 *   - 02 / Capture: Fragmento real de GO CRM (ingreso en vivo).
 *   - 03 / Follow up: Registro real de llamada y próximo paso del agente en GO CRM.
 *   - 04 / Sell: Emisión y verificación de póliza.
 *   - 05 / Retain: Relación duradera y protección de cartera.
 *
 * Arquitectura de interacción:
 * - Desktop (≥1024px): Scroll horizontal pineado sincronizado al scroll vertical (GSAP ScrollTrigger).
 * - Móvil (<1024px): Carrusel horizontal nativo con snap táctil sin pines (Hardware Symphony).
 */

import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCRUB } from "@/lib/motion";
import {
  Megaphone,
  Tray,
  PhoneCall,
  Handshake,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkle,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface StepData {
  step: string;
  name: string;
  tag: string;
  desc: string;
  meta: string;
}

const STEP_ICONS = [
  Megaphone,
  Tray,
  PhoneCall,
  Handshake,
  ShieldCheck,
];

export default function LeadJourneySolutions() {
  const t = useTranslations("solutionsPage.leadJourney");
  const rawSteps = t.raw("steps") as StepData[];

  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  const [activeStep, setActiveStep] = useState<number>(0);

  // ── NAVEGACIÓN ENTRE TARJETAS ──
  const goToStep = useCallback((targetIndex: number) => {
    const index = Math.max(0, Math.min(rawSteps.length - 1, targetIndex));
    setActiveStep(index);

    if (window.innerWidth >= 1024 && scrollTriggerInstance.current && cardsTrackRef.current) {
      const st = scrollTriggerInstance.current;
      const track = cardsTrackRef.current;
      const cardEl = track.children[index + 1] as HTMLElement;

      if (cardEl) {
        const totalDistance = Math.max(1, track.scrollWidth - window.innerWidth);
        const cardOffset = Math.max(0, cardEl.offsetLeft - (window.innerWidth * 0.15));
        const progress = Math.min(1, Math.max(0, cardOffset / totalDistance));
        const targetScroll = st.start + progress * (st.end - st.start);

        const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts?: { duration?: number }) => void } }).lenis;
        if (lenis) {
          lenis.scrollTo(targetScroll, { duration: 0.8 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
    } else if (mobileTrackRef.current) {
      const track = mobileTrackRef.current;
      const cardEl = track.children[index + 1] as HTMLElement;
      if (cardEl) {
        track.scrollTo({
          left: cardEl.offsetLeft - 16,
          behavior: "smooth",
        });
      }
    }
  }, [rawSteps.length]);

  // ── TRACKING DE SCROLL MÓVIL ──
  const onMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const stepWidth = firstCard.offsetWidth + 16;
    const rawIndex = Math.round(track.scrollLeft / stepWidth);
    const newStepIndex = Math.min(rawSteps.length - 1, Math.max(0, rawIndex - 1));
    if (newStepIndex !== activeStep && rawIndex > 0) {
      setActiveStep(newStepIndex);
    }
  };

  useLayoutEffect(() => {
    const el = sectionRef.current;
    const pinSec = pinWrapperRef.current;
    const cardsTrack = cardsTrackRef.current;
    if (!el || !pinSec || !cardsTrack) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia(el);

    // ── DESKTOP SCROLL HORIZONTAL PINEADO (≥1024px) ──
    mm.add("(min-width: 1024px)", () => {
      if (prefersReducedMotion) return;

      const getScrollDistance = () => {
        return Math.max(0, cardsTrack.scrollWidth - window.innerWidth);
      };

      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSec,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          anticipatePin: 1,
          scrub: SCRUB.crisp,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const stepIndex = Math.min(
              rawSteps.length - 1,
              Math.floor(p * rawSteps.length)
            );
            setActiveStep(stepIndex);

            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: Math.max(0.04, p) });
            }
          },
        },
      });

      scrollTriggerInstance.current = horizontalTl.scrollTrigger || null;

      horizontalTl.to(cardsTrack, {
        x: () => -getScrollDistance(),
        ease: "none",
      });
    });

    return () => {
      mm.revert();
      scrollTriggerInstance.current = null;
    };
  }, [rawSteps.length]);

  return (
    <section
      ref={sectionRef}
      id="marketing"
      className="relative w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] border-t border-[var(--color-border-Strokes-default)] overflow-hidden"
    >
      {/* ── CONTENEDOR PINEADO EN DESKTOP ── */}
      <div
        ref={pinWrapperRef}
        className="w-full lg:h-screen lg:min-h-[680px] lg:max-h-[940px] flex flex-col justify-between py-6 xl:py-10 overflow-hidden"
      >
        {/* ── BARRA SUPERIOR DISCRETA Y MINIMALISTA (DESKTOP) ── */}
        <div className="hidden lg:flex w-full max-w-section-xl mx-auto px-gutter-sm lg:px-gutter-md items-center justify-between pb-static-xs">
          {/* Barra de progreso de trazo fino */}
          <div className="h-[2px] w-48 bg-[var(--color-border-Strokes-default)] rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[var(--color-brand-blue)] origin-left scale-x-0 transition-transform duration-100 ease-out"
            />
          </div>

          {/* Flechas y contador de etapa sutil */}
          <div className="flex items-center gap-static-sm">
            <span className="text-meta font-mono text-[var(--color-text-secondary)] text-xs">
              {String(activeStep + 1).padStart(2, "0")} / 05
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToStep(activeStep - 1)}
                disabled={activeStep === 0}
                className="w-8 h-8 rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/80 flex items-center justify-center text-[var(--color-text-primary)] hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label={t("prev")}
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => goToStep(activeStep + 1)}
                disabled={activeStep === rawSteps.length - 1}
                className="w-8 h-8 rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/80 flex items-center justify-center text-[var(--color-text-primary)] hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label={t("next")}
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* ── TRACK COMPLETO EN SCROLL HORIZONTAL (DESKTOP ≥1024px) ── */}
        <div className="hidden lg:block w-full overflow-hidden my-auto py-2">
          <div
            ref={cardsTrackRef}
            style={{
              paddingLeft: "max(var(--space-gutter-md), calc((100vw - var(--max-w-section-xl)) / 2 + var(--space-gutter-md)))",
              paddingRight: "max(var(--space-gutter-md), calc((100vw - var(--max-w-section-xl)) / 2 + var(--space-gutter-md)))",
            }}
            className="flex items-stretch gap-static-lg w-max will-change-transform"
          >
            {/* ── PANEL 0: TITULAR EDITORIAL (ALINEADO A LA RETÍCULA CON BUEN MARGEN LEFT) ── */}
            <article className="w-[460px] xl:w-[520px] shrink-0 rounded-xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/70 backdrop-blur-md p-static-lg xl:p-static-xl flex flex-col justify-between min-h-[440px] xl:min-h-[470px] shadow-elevation-1">
              <div>
                <h2 className="text-display md:text-display-lg xl:text-display-xl text-[var(--color-text-primary)] leading-[1.05] tracking-tight text-balance">
                  {t("headline")}
                </h2>

                <p className="text-body-md xl:text-body-lg text-[var(--color-text-secondary)] leading-relaxed mt-static-md text-balance">
                  {t("intro")}
                </p>
              </div>

              {/* Indicador de recorrido al pie */}
              <div className="mt-static-md pt-static-md border-t border-[var(--color-border-Strokes-default)] flex items-center justify-between text-meta text-[var(--color-text-muted)] font-mono">
                <span className="text-[var(--color-brand-blue)] font-semibold">{t("stages")}</span>
                <span className="flex items-center gap-1.5">
                  {t("scrollHint")} <ArrowRight size={14} />
                </span>
              </div>
            </article>

            {/* ── PANELES 1 A 5: LAS 5 ETAPAS DEL RECORRIDO ── */}
            {rawSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const IconComponent = STEP_ICONS[idx];

              return (
                <article
                  key={step.step}
                  onClick={() => goToStep(idx)}
                  className={`w-[420px] xl:w-[460px] shrink-0 rounded-xl border flex flex-col justify-between p-static-lg xl:p-static-xl min-h-[440px] xl:min-h-[470px] transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? "border-[var(--color-brand-blue)] bg-[var(--color-surface-BG-1)] shadow-elevation-3"
                      : "border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/40 hover:bg-[var(--color-surface-BG-1)]/70 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Pestaña superior azul iluminada en tarjeta activa */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 rounded-t-xl ${
                      isActive ? "bg-[var(--color-brand-blue)] opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* BLOQUE SUPERIOR */}
                  <div className="flex flex-col gap-y-static-sm">
                    {/* Fila índice + tag pill + icono */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-static-xs">
                        <span className="text-meta font-mono font-bold text-[var(--color-text-muted)]">
                          {step.step}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[var(--color-border-Strokes-default)]" />
                        <span
                          className={`text-caption font-mono uppercase px-2 py-0.5 rounded-md border text-[11px] ${
                            isActive
                              ? "border-[var(--color-brand-blue)]/40 bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] font-medium"
                              : "border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {step.tag}
                        </span>
                      </div>

                      {/* Icono de Phosphor */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                          isActive
                            ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]"
                            : "border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] text-[var(--color-text-secondary)]"
                        }`}
                      >
                        <IconComponent size={22} weight={isActive ? "duotone" : "regular"} />
                      </div>
                    </div>

                    {/* Título de la etapa */}
                    <h3 className="text-h3 xl:text-h2 font-semibold text-[var(--color-text-primary)] mt-1">
                      {step.name}
                    </h3>

                    {/* Descripción */}
                    <p className="text-body-sm xl:text-body-md text-[var(--color-text-secondary)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* BLOQUE INFERIOR: MICRO-COMPONENTE TÉCNICO DIALÉCTICO */}
                  <div className="mt-static-md pt-static-sm border-t border-[var(--color-border-Strokes-default)]">
                    {/* ETAPA 01: Campañas Inbound */}
                    {idx === 0 && (
                      <div className="rounded-lg p-3 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                          <span>{t("cards.s1.label")}</span>
                          <span className="flex items-center gap-1 text-[var(--color-brand-blue)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
                            {t("cards.s1.live")}
                          </span>
                        </div>
                        <div className="text-meta font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s1.title")}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1.5">
                          <span>{t("cards.s1.f1")}</span>
                          <ArrowRight size={10} />
                          <span>{t("cards.s1.f2")}</span>
                          <ArrowRight size={10} />
                          <span className="text-[var(--color-text-primary)] font-medium">{t("cards.s1.f3")}</span>
                        </div>
                      </div>
                    )}

                    {/* ETAPA 02: Captura en GO CRM */}
                    {idx === 1 && (
                      <div className="rounded-lg p-3 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                          <span className="text-[var(--color-text-accent-blue)] font-bold">
                            {t("cards.s2.label")}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t("cards.s2.synced")}
                          </span>
                        </div>
                        <div className="text-meta font-semibold text-[var(--color-text-primary)]">
                          {t("crmSnippet.leadName")}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)]">
                          {t("crmSnippet.campaign")}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] text-[var(--color-text-muted)]">
                            {t("crmSnippet.status")}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                            {t("cards.s2.note")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ETAPA 03: Seguimiento del Agente en GO CRM */}
                    {idx === 2 && (
                      <div className="rounded-lg p-3 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1.5 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                          <span>{t("cards.s3.label")}</span>
                          <Clock size={12} className="text-[var(--color-brand-blue)]" />
                        </div>
                        <div className="text-meta font-semibold text-[var(--color-text-primary)]">
                          {t("crmSnippet.callLogged")}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)]">
                          {t("crmSnippet.nextStep")}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--color-text-accent-blue)] font-medium">
                          {t("cards.s3.note")}
                        </div>
                      </div>
                    )}

                    {/* ETAPA 04: Cierre de Póliza */}
                    {idx === 3 && (
                      <div className="rounded-lg p-3 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                          <span>{t("cards.s4.label")}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {t("cards.s4.state")}
                          </span>
                        </div>
                        <div className="text-meta font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s4.title")}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)]">
                          {t("cards.s4.note")}
                        </div>
                      </div>
                    )}

                    {/* ETAPA 05: Fidelización y Retención */}
                    {idx === 4 && (
                      <div className="rounded-lg p-3 border border-[var(--color-brand-blue)]/30 bg-[var(--color-brand-blue)]/5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-brand-blue)]">
                          <span>{t("cards.s5.label")}</span>
                          <Sparkle size={12} weight="fill" />
                        </div>
                        <div className="text-meta font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s5.title")}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)]">
                          {t("cards.s5.note")}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── TRACK MÓVIL (<1024px) ── */}
        <div className="lg:hidden flex flex-col gap-y-static-md w-full my-auto py-static-sm">
          <div
            ref={mobileTrackRef}
            onScroll={onMobileScroll}
            className="flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* TARJETA 0: TITULAR EDITORIAL EN MÓVIL */}
            <article className="w-[85vw] max-w-[360px] shrink-0 snap-start rounded-xl border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/70 p-static-md flex flex-col justify-between min-h-[380px]">
              <div>
                <h2 className="text-display-sm text-[var(--color-text-primary)] leading-[1.1] tracking-tight">
                  {t("headline")}
                </h2>

                <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed mt-static-sm">
                  {t("intro")}
                </p>
              </div>

              <div className="pt-static-sm border-t border-[var(--color-border-Strokes-default)] flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
                <span className="text-[var(--color-brand-blue)] font-semibold">{t("stages")}</span>
                <span className="flex items-center gap-1">
                  {t("swipeHint")} <ArrowRight size={12} />
                </span>
              </div>
            </article>

            {/* TARJETAS 1 A 5 EN MÓVIL */}
            {rawSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const IconComponent = STEP_ICONS[idx];

              return (
                <article
                  key={step.step}
                  className={`w-[85vw] max-w-[360px] shrink-0 snap-start rounded-xl border flex flex-col justify-between p-static-md min-h-[380px] transition-colors ${
                    isActive
                      ? "border-[var(--color-brand-blue)] bg-[var(--color-surface-BG-1)]"
                      : "border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)]/40"
                  }`}
                >
                  <div className="flex flex-col gap-y-static-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center font-mono text-xs font-bold">
                          {step.step}
                        </span>
                        <span className="text-caption font-mono uppercase px-2 py-0.5 rounded-md border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] text-[var(--color-text-secondary)] text-[11px]">
                          {step.tag}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex items-center justify-center text-[var(--color-brand-blue)]">
                        <IconComponent size={18} weight="duotone" />
                      </div>
                    </div>

                    <h3 className="text-h3 font-semibold text-[var(--color-text-primary)]">
                      {step.name}
                    </h3>

                    <p className="text-body-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-static-md pt-static-sm border-t border-[var(--color-border-Strokes-default)]">
                    {idx === 0 && (
                      <div className="rounded-lg p-2.5 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-brand-blue)]">
                          <span>{t("cards.s1.mLabel")}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] animate-pulse" />
                        </div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s1.mTitle")}
                        </div>
                        <div className="text-[var(--color-text-secondary)] text-[11px]">
                          {t("cards.s1.mFlow")}
                        </div>
                      </div>
                    )}

                    {idx === 1 && (
                      <div className="rounded-lg p-2.5 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-text-accent-blue)]">
                          <span className="font-semibold">{t("cards.s2.label")}</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {t("cards.s2.synced")}
                          </span>
                        </div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {t("crmSnippet.leadName")}
                        </div>
                        <div className="text-[var(--color-text-secondary)] text-[11px]">
                          {t("crmSnippet.campaign")}
                        </div>
                      </div>
                    )}

                    {idx === 2 && (
                      <div className="rounded-lg p-2.5 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-text-muted)]">
                          <span>WORKFLOW DEL AGENTE</span>
                          <Clock size={12} className="text-[var(--color-brand-blue)]" />
                        </div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {t("crmSnippet.callLogged")}
                        </div>
                        <div className="text-[var(--color-text-secondary)] text-[11px]">
                          {t("crmSnippet.nextStep")}
                        </div>
                      </div>
                    )}

                    {idx === 3 && (
                      <div className="rounded-lg p-2.5 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-base)] flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <span>{t("cards.s4.mLabel")}</span>
                          <span>{t("cards.s4.mState")}</span>
                        </div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s4.mTitle")}
                        </div>
                        <div className="text-[var(--color-text-secondary)] text-[11px]">
                          {t("cards.s4.mNote")}
                        </div>
                      </div>
                    )}

                    {idx === 4 && (
                      <div className="rounded-lg p-2.5 border border-[var(--color-brand-blue)]/30 bg-[var(--color-brand-blue)]/5 flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--color-brand-blue)]">
                          <span>{t("cards.s5.mLabel")}</span>
                          <Sparkle size={12} weight="fill" />
                        </div>
                        <div className="font-semibold text-[var(--color-text-primary)]">
                          {t("cards.s5.mTitle")}
                        </div>
                        <div className="text-[var(--color-text-secondary)] text-[11px]">
                          {t("cards.s5.mNote")}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Indicador de progreso de puntos en móvil */}
          <div className="flex items-center justify-center gap-2 px-gutter-sm">
            <button
              type="button"
              onClick={() => {
                const track = mobileTrackRef.current;
                if (track) track.scrollTo({ left: 0, behavior: "smooth" });
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeStep === 0
                  ? "w-6 bg-[var(--color-brand-blue)]"
                  : "w-2 bg-[var(--color-border-Strokes-default)]"
              }`}
              aria-label={t("goCover")}
            />
            {rawSteps.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToStep(dotIdx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStep === dotIdx
                    ? "w-6 bg-[var(--color-brand-blue)]"
                    : "w-2 bg-[var(--color-border-Strokes-default)]"
                }`}
                aria-label={t("goStage", { n: dotIdx + 1 })}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
