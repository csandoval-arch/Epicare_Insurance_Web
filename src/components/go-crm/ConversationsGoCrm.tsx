"use client";

/**
 * @file ConversationsGoCrm.tsx
 * @description Sección 5 de GO CRM — "Conversaciones". Titular + consola con el vídeo de la UI.
 * - Desktop (≥md): 3 tarjetas de feature flotan sobre el vídeo (cristal).
 * - Móvil (<md): las 3 tarjetas van encima del vídeo en un slider horizontal nativo: cuadradas,
 *   compactas (icono + título) y sin blur.
 * Ilustraciones animadas con keyframes CSS (compositor), pausadas fuera de pantalla.
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import SmartVideo from "@/components/epicare/SmartVideo";
import ConvCard, { type ConvCopy } from "./conversations/ConvCard";
import PrimaryCta from "./cta/PrimaryCta";
import { useConversationsMotion } from "./conversations/useConversationsMotion";

const VIDEO = "/Files/Go_CRM/Contact_Conversations/conversation_contact.mp4";
/**
 * Proporción real del vídeo (2222×1226). SmartVideo no descarga nada hasta acercarse, así que sin
 * esto el vídeo mide 0 de alto, crece al cargar y descuadra los pines de las secciones siguientes.
 */
const VIDEO_RATIO = "2222 / 1226";

/**
 * Loops de las ilustraciones en keyframes CSS: el navegador los corre en el compositor (solo
 * transform/opacity), sin tick de GSAP. `.conv-svg` respira en opacidad en vez de animar `stroke`,
 * que repintaba el SVG en cada frame. Todo se pausa con `.is-offscreen` (Smart Shutdown).
 */
const CONV_CSS = `
@keyframes conv-pulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.8); opacity: 0; } }
@keyframes conv-breathe { from { opacity: 0.6; } to { opacity: 1; } }
@keyframes conv-node { from { transform: scale(0.5); opacity: 0.5; } to { transform: scale(1.5); opacity: 1; } }
@keyframes conv-scan { from { transform: translate3d(0, -6px, 0); opacity: 0; } to { transform: translate3d(0, 6px, 0); opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  .conv-root .conv-pulse { animation: conv-pulse 2.5s ease-out infinite; }
  .conv-root .conv-pulse + .conv-pulse { animation-delay: 1.25s; }
  .conv-root .conv-svg { animation: conv-breathe 1.5s ease-in-out infinite alternate; }
  .conv-root .conv-node { animation: conv-node 0.8s ease-in-out infinite alternate; }
  .conv-root .conv-scanner { animation: conv-scan 1.5s ease-in-out infinite alternate; }
  .conv-root.is-offscreen * { animation-play-state: paused; }
}
`;

const CARD_KEYS = [1, 2, 3] as const;

export default function ConversationsGoCrm() {
  const t = useTranslations("goCrm.conversations");
  const cards: ConvCopy[] = CARD_KEYS.map((n) => ({ title: t(`card${n}Title`), desc: t(`card${n}Desc`) }));

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  useConversationsMotion(sectionRef);

  // Smart Shutdown: los loops CSS solo corren con la sección en pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tarjeta activa del slider móvil (medido como mucho una vez por frame).
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <section
      ref={sectionRef}
      className="conv-root is-offscreen relative w-full min-h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex flex-col items-center justify-start py-section-md lg:py-section-lg border-y border-[var(--color-border-Strokes-default)]"
    >
      <style href="go-crm-conversations" precedence="default">{CONV_CSS}</style>

      {/* Halo de fondo: solo desktop (un blur de 120px en móvil cuesta GPU sin aportar) */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-4xl max-h-4xl bg-[var(--color-brand-blue)]/5 blur-[120px] rounded-full pointer-events-none"
      />

      {/* ── ENCABEZADO ── */}
      <div className="w-full max-w-6xl mx-auto px-gutter-sm md:px-gutter-md text-left md:text-center relative z-20 flex flex-col items-start md:items-center mb-static-md lg:mb-static-lg">
        <div className="overflow-hidden mb-static-md">
          <p className="conv-text-reveal text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] relative" aria-hidden="true">
              <span className="absolute inset-0 bg-[var(--color-brand-blue)] rounded-full animate-ping opacity-75"></span>
            </span>
            {t("overline")}
          </p>
        </div>
        <div className="overflow-hidden pb-static-md w-full max-w-[1100px] mx-auto">
          <h2 className="conv-text-reveal text-display-sm lg:text-display-lg text-[var(--color-text-primary)]">{t("headline")}</h2>
        </div>
        <PrimaryCta label={t("cta")} className="conv-cta mt-static-md mb-static-md md:mb-0" />
      </div>

      {/* ── MÓVIL: TARJETAS EN SLIDER, ENTRE EL TITULAR Y EL VÍDEO ── */}
      <div className="conv-slider md:hidden w-full mb-static-xl flex flex-col gap-static-md">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, i) => (
            <ConvCard key={card.title} copy={card} index={i} variant="slide" className="w-43 shrink-0 snap-start" />
          ))}
        </div>
        <div className="px-gutter-sm" aria-hidden="true">
          <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${cards.length * 2}rem` }}>
            <span
              className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
              style={{ translate: `${active * 100}% 0` }}
            />
          </div>
        </div>
      </div>
      {/* ── CONSOLA (VÍDEO) + TARJETAS FLOTANTES (≥md) ── */}
      <div className="relative w-full flex justify-center">
        <div className="w-full max-w-[1400px] md:px-gutter-md relative z-10">
          <div className="conv-console w-full md:rounded-xl shadow-elevation-5 overflow-hidden flex flex-col border-y md:border border-[var(--color-border-Strokes-strong)] bg-[var(--color-surface-BG-1)]">
            <SmartVideo src={asset(VIDEO)} loop muted playsInline aria-hidden="true" className="w-full h-auto object-cover block" style={{ aspectRatio: VIDEO_RATIO }} />
          </div>
        </div>

        <div className="hidden md:block absolute inset-0 z-20 pointer-events-none">
          <ConvCard copy={cards[0]} index={0} variant="float" className="card-left absolute top-[10%] left-4 lg:left-8 w-52 md:w-62 pointer-events-auto" />
          <ConvCard copy={cards[1]} index={1} variant="float" dot="left" className="card-right absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 w-52 md:w-62 pointer-events-auto" />
          <div className="absolute -bottom-[35%] left-0 w-full flex justify-center pointer-events-none">
            <ConvCard copy={cards[2]} index={2} variant="float" className="card-bottom relative w-60 md:w-70 pointer-events-auto" />
          </div>
        </div>
      </div>

      {/* Espacio para la tarjeta inferior, que cuelga bajo el vídeo en desktop */}
      <div className="hidden md:block w-full pb-static-2xl mb-24 lg:mb-32" aria-hidden="true" />

    </section>
  );
}
