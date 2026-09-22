"use client";

import { useEffect, useRef, useState } from "react";
import { Database, Envelope, Phone } from "@phosphor-icons/react";
import type { DemoContact } from "./data";

/** Cuánto se muestra cada contacto antes de pasar al siguiente. */
const ROTATE_MS = 4000;
/** Duración del fundido del contenido al cambiar de contacto. */
const SWAP_MS = 450;

/**
 * Keyframes de la ficha. Solo `transform` y `opacity` (compositor). React 19 sube este `<style>`
 * al `<head>` y lo deduplica por `href`, aunque haya varias fichas en la página.
 */
const PROFILE_CSS = `
@keyframes profile-timer { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes profile-swap { from { opacity: 0; transform: translate3d(0, 0.375rem, 0); } to { opacity: 1; transform: none; } }
`;

interface ProfileCardProps {
  /** Contactos entre los que rota la ficha. Con uno solo, no hay puntos ni temporizador. */
  contacts: DemoContact[];
  /** Filo de luz interior en el borde superior del cristal. */
  rim?: boolean;
  /** Sin `backdrop-filter` (Hardware Symphony): cristal opaco para capas que se animan en móvil. */
  lite?: boolean;
  /** Arranca el primer ciclo a mitad de camino, para que dos fichas vecinas no cambien a la vez. */
  offset?: boolean;
  className?: string;
}

/**
 * @description Ficha de contacto de cristal (mock de UI) del Acto 1 de ContactVsOpportunity.
 * Rota entre varios contactos para transmitir que el CRM tiene muchos: arriba a la derecha, puntos
 * minimalistas; el activo es una píldora cuyo relleno es el temporizador (animación CSS de
 * `transform`, sin `setInterval`). Al completarse, pasa al siguiente contacto con un fundido.
 * Se pausa fuera de pantalla y al pasar el cursor; con reduced-motion no rota sola.
 */
export default function ProfileCard({ contacts, rim = false, lite = false, offset = false, className = "" }: ProfileCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);

  const rotates = contacts.length > 1;
  const contact = contacts[index];

  // Smart Shutdown: el temporizador solo corre con la ficha en pantalla.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !rotates) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [rotates]);

  const next = () => {
    setIndex((i) => (i + 1) % contacts.length);
    setCycle((c) => c + 1);
  };

  const timerStyle = {
    animation: `profile-timer ${ROTATE_MS}ms linear forwards`,
    animationDelay: offset && cycle === 0 ? `-${ROTATE_MS / 2}ms` : "0ms",
    animationPlayState: running && !hovered ? "running" : "paused",
  } as const;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative z-10 w-full max-w-xs ${className ? `${className} ` : ""}rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden`}
    >
      <style href="go-crm-profile-card" precedence="default">{PROFILE_CSS}</style>

      <div className="absolute inset-0 -z-10 rounded-2xl">
        <div className={lite ? "absolute inset-0 bg-white/80" : "absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]"} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
        {rim && <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />}
      </div>

      <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
        <div className="flex items-center justify-between gap-static-sm">
          {/* ── IDENTIDAD (cambia con fundido) ── */}
          <div key={`id-${index}`} className="flex items-center gap-static-sm min-w-0" style={{ animation: `profile-swap ${SWAP_MS}ms ease-out both` }}>
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center shadow-elevation-1 shrink-0">
              <span className="text-body-sm font-medium text-[var(--color-text-White-100)]">{contact.initials}</span>
            </div>
            <h3 className="text-h6 text-[var(--color-text-Black-100)] font-semibold truncate">{contact.name}</h3>
          </div>

          {/* ── PUNTOS + TEMPORIZADOR ── */}
          {rotates && (
            <div className="flex items-center gap-static-xs shrink-0" aria-hidden="true">
              {contacts.map((c, i) =>
                i === index ? (
                  <span key={c.email} className="relative block h-1.5 w-static-md rounded-full bg-[var(--color-text-Black-100)]/15 overflow-hidden">
                    {!reduced && (
                      <span
                        key={`timer-${cycle}`}
                        className="absolute inset-0 rounded-full bg-[var(--color-brand-blue)] origin-left"
                        style={timerStyle}
                        onAnimationEnd={next}
                      />
                    )}
                    {reduced && <span className="absolute inset-0 rounded-full bg-[var(--color-brand-blue)]" />}
                  </span>
                ) : (
                  <span key={c.email} className="block w-1.5 h-1.5 rounded-full bg-[var(--color-text-Black-100)]/20" />
                )
              )}
            </div>
          )}
        </div>

        {/* ── DATOS (cambian con fundido) ── */}
        <div
          key={`data-${index}`}
          className="flex flex-col gap-static-sm pt-static-sm border-t border-[var(--color-text-Black-100)]/10"
          style={{ animation: `profile-swap ${SWAP_MS}ms ease-out 60ms both` }}
        >
          <div className="flex items-center gap-static-sm">
            <Envelope aria-hidden="true" className="w-static-md h-static-md text-[var(--color-text-Black-100)]/45" />
            <span className="text-body-xs text-[var(--color-text-Black-100)]/70 font-mono">{contact.email}</span>
          </div>
          <div className="flex items-center gap-static-sm">
            <Phone aria-hidden="true" className="w-static-md h-static-md text-[var(--color-text-Black-100)]/45" />
            <span className="text-body-xs text-[var(--color-text-Black-100)]/70 font-mono">{contact.phone}</span>
          </div>
          <div className="pt-static-xs">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-static-xs border border-[var(--color-text-Black-100)]/10 rounded-full bg-white/40${lite ? "" : " backdrop-blur-sm"}`}
            >
              <Database aria-hidden="true" className="w-3.5 h-3.5 text-[var(--color-brand-blue)]" />
              <span className="text-caption font-medium text-[var(--color-text-Black-100)]/80 tracking-wide">{contact.source}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
