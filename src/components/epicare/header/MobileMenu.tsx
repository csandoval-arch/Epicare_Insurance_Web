"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type Lenis from "lenis";
import ArrowUR from "@/components/icons/ArrowUR";
import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { DUR, EASE, STAGGER, REVEAL } from "@/lib/motion";
import { joinModalStore } from "@/lib/joinModalStore";

export interface MobileNavGroup {
  key: string;
  label: string;
  /** `soon`: producto aún no disponible → tarjeta desactivada con chip "Próximamente". */
  /** `shortTitle`: nombre corto para las tarjetas cuadradas del móvil (si no, `title`). */
  items: { title: string; shortTitle?: string; desc?: string; href: string; soon?: boolean }[];
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  groups: MobileNavGroup[];
  /** Fuerza la superficie oscura aunque la página esté en claro (headers sobre fondos oscuros). */
  forceDark: boolean;
  loginLabel: string;
  moreLabel: string;
  soonLabel: string;
}

// ── CONFIG ──
/** El grupo de productos se muestra como tiles de vidrio con su descripción; el resto, en columnas. */
const FEATURED_GROUP = "gohub";
/** Margen creativo (pedido del usuario): las tarjetas cuadradas llevan padding px-2.5 / py-4.5 (10/18px),
 *  +2px sobre static-sm/static-md — no hay token intermedio. Ancho calc((100vw-3.25rem)/2): caben 2 y la
 *  tercera asoma ~12px. */
/** El cierre corre la misma línea a doble velocidad. */
const CLOSE_TIMESCALE = 2;
/** Atributo en <html> que bloquea el scroll (CSS en globals.css). No toca el style inline de <body>,
 *  que también usan el loader y el modal de login. */
const LOCK_ATTR = "data-mnav-lock";
const DESKTOP_MQ = "(min-width: 1280px)";

/**
 * @description Menú móvil "Liquid sheet": una hoja de vidrio líquido que baja desde el pill del
 * header sobre un velo. Productos (GO Hub) en tiles con descripción; Nosotros y Soluciones en dos
 * columnas; acceso abajo. Respuesta a un tap: todo visible en ~300ms.
 * GPU: solo `opacity`/`transform`, un único `backdrop-filter` (la hoja, sin vidrio anidado) y los
 * vídeos de detrás en pausa mientras está abierto (si no, el blur se recalcula en cada frame de vídeo).
 */
export default function MobileMenu({ open, onClose, groups, forceDark, loginLabel, moreLabel, soonLabel }: MobileMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const mountedRef = useRef(false);
  const trackRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);

  const featured = groups.find((g) => g.key === FEATURED_GROUP);
  const columns = groups.filter((g) => g.key !== FEATURED_GROUP);

  // ── SLIDER: tarjeta activa (medida como mucho una vez por frame) ──
  const onTrackScroll = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first || !featured) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
      // Al tope derecho caben 2 tarjetas: el scroll no llega a la última por paso, así que el borde manda.
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const last = featured.items.length - 1;
      const index = atEnd ? last : Math.min(last, Math.max(0, Math.round(track.scrollLeft / step)));
      setActive((prev) => (prev === index ? prev : index));
    });
  };
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // ── TIMELINE (una vez) ──
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // La raíz solo cambia `visibility`: un ancestro con opacity < 1 se vuelve "backdrop root" y la
      // hoja deja de desenfocar lo que tiene detrás durante el fundido. Se funden velo y hoja por separado.
      // `visibility` explícito en los extremos (no un tween de duración 0, que en reversa no es fiable).
      const tl = gsap.timeline({
        paused: true,
        onStart: () => gsap.set(el, { visibility: "visible" }),
        onReverseComplete: () => gsap.set(el, { visibility: "hidden" }),
      });
      tl.fromTo([".mnav-veil", ".mnav-sheet"], { opacity: 0 }, { opacity: 1, duration: DUR.micro, ease: EASE.snap });
      if (!reduced) {
        // Solo traslación: escalar una capa con backdrop-filter y sombra grande obliga a re-rasterizar.
        tl.fromTo(".mnav-sheet", { y: -REVEAL.sm }, { y: 0, duration: DUR.microOut, ease: EASE.snap, force3D: true }, "<");
        tl.fromTo(
          ".mnav-reveal",
          { y: REVEAL.sm, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.microOut, stagger: STAGGER.tight, ease: EASE.snap, force3D: true },
          "<"
        );
      }
      tlRef.current = tl;
    }, el);

    return () => ctx.revert();
  }, []);

  // ── ANIMAR (layout effect: arranca en el mismo frame del tap, no un frame después) ──
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const tl = tlRef.current;
    if (open) {
      gsap.set(rootRef.current, { visibility: "visible" });
      tl?.timeScale(1).play();
    }
    else tl?.timeScale(CLOSE_TIMESCALE).reverse();
  }, [open]);

  // ── BLOQUEO DE SCROLL + PAUSA DE VÍDEOS (solo mientras está abierto) ──
  // Todo se deshace en el cleanup, que React corre al cerrar Y al desmontar: si se navega con el menú
  // abierto, el header de la página vieja se desmonta y el scroll de la nueva queda libre.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    const stoppedLenis = !!lenis && !lenis.isStopped;

    html.setAttribute(LOCK_ATTR, "");
    if (stoppedLenis) lenis.stop();
    const pausedVideos = Array.from(document.querySelectorAll("video")).filter((v) => !v.paused);
    pausedVideos.forEach((v) => v.pause());

    return () => {
      html.removeAttribute(LOCK_ATTR);
      if (stoppedLenis) lenis.start();
      pausedVideos.forEach((v) => {
        if (v.isConnected) v.play().catch(() => {});
      });
    };
  }, [open]);

  // ── ESCAPE + PASO A DESKTOP (el menú es xl:hidden: abierto en desktop bloquearía el scroll) ──
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const mq = window.matchMedia(DESKTOP_MQ);
    const onMq = () => mq.matches && onClose();
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-[999997] xl:hidden invisible ${open ? "pointer-events-auto" : "pointer-events-none"} text-[var(--color-text-primary)]${forceDark ? " dark" : ""}`}
    >
      {/* ── VELO (tap fuera = cerrar) ── */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="mnav-veil absolute inset-0 w-full h-full opacity-0 glass-liquid-veil cursor-default" />

      {/* ── HOJA DE VIDRIO ──
          data-lenis-prevent: con Lenis detenido (menú abierto) Lenis cancela todo touchmove no puramente
          horizontal → el slider y el scroll de la hoja fallaban según el ángulo del dedo. Aquí manda el nativo. */}
      <div data-lenis-prevent className="mnav-sheet opacity-0 absolute inset-x-2 top-2 max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-xl glass-liquid isolate" style={{ scrollbarWidth: "none" }}>
        <div aria-hidden="true" className="glass-liquid-sheen absolute inset-0 pointer-events-none" />

        <nav className="relative px-2 pt-24 pb-2 flex flex-col gap-static-lg">
          {/* Productos */}
          {featured && (
            <div className="mnav-reveal">
              <p className="text-body-md text-[var(--color-text-secondary)] px-2 mb-static-sm">{featured.label}</p>
              <ul
                ref={trackRef}
                onScroll={onTrackScroll}
                className="-mx-2 px-2 scroll-px-2 flex gap-static-sm overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {featured.items.map((item) => (
                  <li key={item.title} className="w-[calc((100vw-3.25rem)/2)] aspect-square shrink-0 snap-start">
                    {item.soon ? (
                      // ── Desactivada: no es un link; chip gris en el lugar de la flecha ──
                      <div aria-disabled="true" className="glass-liquid-tile h-full rounded-lg px-2.5 py-4.5 flex flex-col justify-between gap-static-sm">
                        <span className="flex flex-col items-start gap-static-xs">
                          <span className="px-static-sm rounded-full bg-[var(--color-surface-BG-3)] text-body-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                            {soonLabel}
                          </span>
                          <span className="text-body-xl text-[var(--color-text-secondary)]">{item.shortTitle ?? item.title}</span>
                        </span>
                        {item.desc && <span className="text-body-sm text-[var(--color-text-hint)]">{item.desc}</span>}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="glass-liquid-tile h-full rounded-lg px-2.5 py-4.5 flex flex-col justify-between gap-static-sm transition-transform duration-150 active:scale-[0.97]"
                      >
                        <span className="flex items-start justify-between gap-static-xs">
                          <span className="text-body-xl">{item.shortTitle ?? item.title}</span>
                          <ArrowUR className="w-static-md h-static-md shrink-0 mt-static-xs text-[var(--color-brand-blue)]" />
                        </span>
                        {item.desc && <span className="text-body-sm text-[var(--color-text-secondary)]">{item.desc}</span>}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {/* Indicador: pista n×2rem, pulgar movido con `translate` (compositor) */}
              <div className="px-2 mt-static-md" aria-hidden="true">
                <div className="relative h-1 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${featured.items.length * 2}rem` }}>
                  <span
                    className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out"
                    style={{ translate: `${active * 100}% 0` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Compañía + soluciones */}
          <div className="mnav-reveal grid grid-cols-2 gap-static-md mx-2 pt-static-sm">
            {columns.map((group) => (
              <div key={group.key}>
                <p className="text-body-md text-[var(--color-text-secondary)] pb-static-sm mb-static-sm border-b border-glass-divider">{group.label}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-static-xs text-body-xl transition-opacity duration-150 active:opacity-50"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Acceso */}
          <div className="mnav-reveal flex flex-col items-start gap-static-sm pt-static-sm">
            <PrimaryCta label={loginLabel} onClick={onClose} />
            {/* Join Epicare: cierra el menú y abre el modal de unirse */}
            <button
              type="button"
              onClick={() => {
                onClose();
                joinModalStore.open();
              }}
              className="flex items-center gap-static-xs px-2 py-static-xs whitespace-nowrap text-body-sm text-[var(--color-text-primary)] transition-opacity duration-150 active:opacity-50 cursor-pointer"
            >
              {moreLabel}
              <ArrowUR className="w-static-md h-static-md" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
