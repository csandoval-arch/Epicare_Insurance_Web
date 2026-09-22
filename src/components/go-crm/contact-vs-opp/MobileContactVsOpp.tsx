"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { asset } from "@/lib/asset";
import OppCard, { type OppCopy } from "./OppCard";
import ProfileCard from "./ProfileCard";
import SecondaryCta from "./SecondaryCta";
import { CONTACT_IMAGES, CONTACTS_LEFT } from "./data";

interface MobileContactVsOppProps {
  overline: string;
  headline: ReactNode;
  convergeTitle: string;
  convergeBody: string;
  cta: string;
  opps: OppCopy[];
}

/**
 * Transición 100% en el compositor (Hardware Symphony):
 * - La hoja del Acto 2 sube sobre el Acto 1 con el SCROLL NATIVO (el Acto 1 es `sticky`). Cero JS.
 * - El Acto 1 se hunde y se oscurece con CSS scroll-driven animations (`animation-timeline`),
 *   que el navegador corre en el hilo del compositor. Solo `transform` y `opacity`.
 *   Sin soporte (`@supports`) o con reduced-motion, la hoja sube igual y ese detalle se omite.
 * - Las entradas de texto NO van aquí: son GSAP one-shot (Motion Tokenizer, arquetipo Sección
 *   Híbrida) en `useContactVsOppMotion`, para que funcionen en todos los navegadores.
 * - Ilustraciones: pulsos, brillo (`.art-glow`, opacidad de una capa con el resplandor horneado) y
 *   respiración en keyframes CSS. Se pausan fuera de pantalla (`.is-offscreen`, Smart Shutdown).
 */
const MOBILE_CSS = `
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .m-stage { timeline-scope: --m-sheet; }
    .m-sheet { view-timeline: --m-sheet block; }
    .m-scene-inner { animation: m-sink linear both; animation-timeline: --m-sheet; animation-range: entry 0% entry 100%; }
    .m-scene-dim { animation: m-dim linear both; animation-timeline: --m-sheet; animation-range: entry 0% entry 100%; }
  }
}
@keyframes m-sink  { to { transform: translate3d(0, -4%, 0) scale(0.92); } }
@keyframes m-dim   { from { opacity: 0; } to { opacity: 0.55; } }

@keyframes m-pulse   { from { transform: scale(1); opacity: 1; } to { transform: scale(1.8); opacity: 0; } }
@keyframes m-glow    { from { opacity: 0; } to { opacity: 0.9; } }
@keyframes m-node    { from { scale: 1; opacity: 1; } to { scale: 1.6; opacity: 0.3; } }
@keyframes m-core    { from { scale: 0.95; opacity: 0.6; } to { scale: 1.05; opacity: 1; } }
@keyframes m-plant   { from { scale: 1 0.9; opacity: 0.7; } to { scale: 1 1.05; opacity: 1; } }
@keyframes m-spore   { from { scale: 0.8; opacity: 0.6; } to { scale: 1.3; opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  .m2-card .art-pulse-circle, .m2-card .art-pulse-health, .m2-card .art-pulse-life { animation: m-pulse 2.5s ease-out infinite; }
  .m2-card .art-pulse-circle + .art-pulse-circle,
  .m2-card .art-pulse-health + .art-pulse-health,
  .m2-card .art-pulse-life + .art-pulse-life { animation-delay: 1.25s; }
  .m2-card .art-glow { animation: m-glow 1.5s ease-in-out infinite alternate; }
  .m2-card .art-node { animation: m-node 1.5s ease-in-out infinite alternate; }
  .m2-card .art-health-core { transform-box: fill-box; transform-origin: center; animation: m-core 3.5s ease-in-out infinite alternate; }
  .m2-card .art-plant { transform-box: fill-box; transform-origin: 50% 100%; animation: m-plant 2.5s ease-in-out infinite alternate; }
  .m2-card .art-spore-root { animation: m-spore 2s ease-in-out infinite alternate; }
  .m-stage.is-offscreen .m2-card * { animation-play-state: paused; }
}
`;

/** Escena del Acto 1: el contacto a pantalla completa. Sin blend, sombras de filtro ni blur. */
function ContactScene({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="m-scene-inner absolute inset-0 bg-[var(--color-brand-dark)]">
      <img
        src={asset(CONTACT_IMAGES.auto)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.65]"
      />
      <div className="absolute inset-0 bg-[var(--color-brand-blue)]/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

      <div className="absolute inset-x-0 top-0 px-gutter-sm pt-section-sm flex flex-col">
        <p className="overflow-hidden pb-1">
          <span className="m-title-line block text-display-sm font-bold text-[var(--color-text-White-100)]">{title}</span>
        </p>
        <div className="m-rule w-24 h-1.5 bg-[var(--color-text-White-100)] opacity-80 my-static-md rounded-full origin-left" />
        <p className="m-body text-body-lg text-white/85">{body}</p>
        <SecondaryCta label={cta} lite className="m-cta mt-static-lg" />
      </div>

      <div className="m-profile absolute inset-x-0 bottom-0 px-gutter-sm pb-static-2xl">
        <ProfileCard contacts={CONTACTS_LEFT} rim lite />
      </div>
    </div>
  );
}

/**
 * @description Versión móvil (<md) de ContactVsOpportunity, sin pin de GSAP.
 * Acto 1 (`sticky`) → la foto del contacto con su ficha y el mensaje de convergencia.
 * Acto 2 → una hoja azul que el scroll nativo sube por encima del Acto 1, con el titular y un
 * slider horizontal nativo (swipe + scroll-snap) de las 3 oportunidades.
 */
export default function MobileContactVsOpp({ overline, headline, convergeTitle, convergeBody, cta, opps }: MobileContactVsOppProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // Smart Shutdown: las ilustraciones solo animan con la sección en pantalla.
  // El observer dispara al entrar y al salir, nunca por frame.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => {
      stage.classList.toggle("is-offscreen", !entry.isIntersecting);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Tarjeta activa del slider (medido como mucho una vez por frame).
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      const index = Math.min(opps.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };

  return (
    <div ref={stageRef} className="m-stage is-offscreen md:hidden relative">
      <style>{MOBILE_CSS}</style>

      {/* ── ACTO 1: LA ESCENA DEL CONTACTO (se queda fija mientras la hoja sube) ── */}
      <div className="sticky top-0 h-dvh overflow-hidden">
        <ContactScene title={convergeTitle} body={convergeBody} cta={cta} />
        <div className="m-scene-dim absolute inset-0 bg-[var(--color-surface-BG-black)] opacity-0" aria-hidden="true" />
      </div>

      {/* ── ACTO 2: LA HOJA AZUL (scroll nativo) ── */}
      <div className="m-sheet relative z-10 min-h-dvh rounded-t-[2rem] bg-[var(--color-brand-blue)] flex flex-col justify-center gap-static-xl py-section-sm overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        />

        <div className="relative px-gutter-sm flex flex-col gap-static-sm">
          <p className="m2-overline text-overline text-white/60 tracking-[0.2em] uppercase">{overline}</p>
          <h2 className="text-display-sm font-semibold text-[var(--color-text-White-100)] tracking-tight leading-[1.05]">
            <span className="block overflow-hidden pb-1">
              <span className="m2-title-line block">{headline}</span>
            </span>
          </h2>
        </div>

        {/* El slider entra como bloque: nunca se animan sus tarjetas (Pilar 1 del protocolo móvil) */}
        <div className="m2-slider relative flex flex-col gap-static-md">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-gutter-sm scroll-px-[var(--space-gutter-sm)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {opps.map((opp, i) => (
              <OppCard key={opp.label} opp={opp} index={i} motionClass="m2-card" className="w-[78vw] shrink-0 snap-start" lite />
            ))}
          </div>

          {/* Indicador: el tramo blanco se desliza (solo transform) a la tarjeta activa */}
          <div className="px-gutter-sm" aria-hidden="true">
            <div className="relative h-1.5 rounded-full bg-white/30 overflow-hidden" style={{ width: `${opps.length * 2}rem` }}>
              <span
                className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-text-White-100)] transition-[translate] duration-300 ease-out"
                style={{ translate: `${active * 100}% 0` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
