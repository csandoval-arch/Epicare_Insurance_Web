"use client";

/**
 * @file GlassModal.tsx
 * @description Carcasa de los modales de vidrio líquido (Join, Login): velo + hoja `glass-liquid` + brillo,
 * cabecera con título y cerrar, y el contenido centrado a `max-w-section-lg` (no se estira).
 * - Desktop (lg+): hoja casi a pantalla completa (24px de margen). Entra expandiéndose (96 → 100 %) y sale
 *   expandiéndose un poco más (→ 102 %) mientras se desvanece: nunca se encoge.
 * - Móvil: hoja inferior (bottom sheet) a ancho completo, esquinas redondeadas solo arriba y asa de arrastre.
 *   Sube desde abajo y baja al cerrar; arrastrar el asa (o la cabecera) hacia abajo la cierra.
 *   Así se distingue del menú hamburguesa (que cae desde arriba) y puede abrirse ENCIMA de él sin cerrarlo.
 * - Accesible: role="dialog", Escape y tap en el velo cierran, foco a la hoja al abrir y devuelto al cerrar.
 *   Escape se captura antes que el del menú: cierra solo el modal.
 * - Bloqueo de scroll compartido con el menú (`data-mnav-lock` + Lenis): si ya estaba bloqueado al abrir
 *   (menú abierto), al cerrar se deja como estaba.
 * - GPU: un único backdrop-filter en pantalla. El vidrio es una capa fija aparte del scroll (desplazar no
 *   recompone el blur) y, mientras está abierto, el vidrio de debajo (menú, píldora del header) se apaga
 *   (`data-glass-modal`, ver globals.css). Solo opacity/transform; vídeos de detrás en pausa.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import type Lenis from "lenis";
import { CaretDown, X } from "@phosphor-icons/react";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";

const LOCK_ATTR = "data-mnav-lock";
/* Mientras hay un modal abierto: el vidrio que queda debajo (menú móvil, píldora del header) deja de difuminar
   (ver globals.css) → nunca hay dos backdrop-filter apilados. */
const GLASS_ATTR = "data-glass-modal";
const MOBILE = "(max-width: 1023px)";
/* Desktop: escalas de entrada/salida (nunca se encoge). Móvil: la salida acelera hacia abajo.
   Margen creativo: escalas 0.96 / 1.02, salida con power2.in, cierre por arrastre a partir de 80px. */
const ENTER_SCALE = 0.96;
const EXIT_SCALE = 1.02;
const EXIT_EASE = "power2.in";
const DRAG_CLOSE = 80;

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  /** id del título (aria-labelledby). */
  titleId: string;
  title: ReactNode;
  closeLabel: string;
  /** Capa (z-index) del modal. */
  zClass?: string;
  /** Tras abrir (foco ya en la hoja): p. ej. desplazar la hoja a una sección. */
  onOpened?: (sheet: HTMLElement) => void;
  children: ReactNode;
}

export default function GlassModal({ open, onClose, titleId, title, closeLabel, zClass = "z-[9999990]", onOpened, children }: GlassModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  // En refs: un callback nuevo en cada render (p. ej. inline) no debe re-ejecutar el efecto de apertura
  const onOpenedRef = useRef(onOpened);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onOpenedRef.current = onOpened;
    onCloseRef.current = onClose;
  });

  const parts = () => {
    const el = rootRef.current;
    return { sheet: el?.querySelector<HTMLElement>(".gm-sheet") ?? null, veil: el?.querySelector<HTMLElement>(".gm-veil") ?? null };
  };

  // ── Salida: desktop se expande y desvanece; móvil baja fuera de pantalla ──
  const closing = useRef(false);
  const requestClose = useCallback(() => {
    if (closing.current) return;
    const { sheet, veil } = parts();
    if (!sheet || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onCloseRef.current();
    closing.current = true;
    gsap.killTweensOf([sheet, veil]);
    gsap.to(veil, { opacity: 0, duration: DUR.micro, ease: EXIT_EASE });
    if (window.matchMedia(MOBILE).matches) {
      gsap.to(sheet, { y: sheet.offsetHeight, duration: DUR.microOut, ease: EXIT_EASE, force3D: true, onComplete: () => onCloseRef.current() });
    } else {
      gsap.to(sheet, { opacity: 0, scale: EXIT_SCALE, duration: DUR.micro, ease: EXIT_EASE, force3D: true, onComplete: () => onCloseRef.current() });
    }
  }, []);

  // ── Móvil: arrastrar el asa / la cabecera hacia abajo ──
  const drag = useRef<{ y0: number; t0: number; dy: number } | null>(null);
  const onDragStart = (e: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia(MOBILE).matches || (e.target as HTMLElement).closest("button")) return;
    drag.current = { y0: e.clientY, t0: performance.now(), dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const { sheet, veil } = parts();
    if (!d || !sheet) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    gsap.set(sheet, { y: d.dy, force3D: true });
    gsap.set(veil, { opacity: 1 - Math.min(1, d.dy / sheet.offsetHeight) });
  };
  const onDragEnd = () => {
    const d = drag.current;
    const { sheet, veil } = parts();
    drag.current = null;
    if (!d || !sheet) return;
    const fast = d.dy / Math.max(1, performance.now() - d.t0) > 0.5; // px/ms: un gesto rápido también cierra
    if (d.dy > DRAG_CLOSE || (fast && d.dy > 16)) return requestClose();
    gsap.to(sheet, { y: 0, duration: DUR.microOut, ease: EASE.out, force3D: true });
    gsap.to(veil, { opacity: 1, duration: DUR.microOut, ease: EASE.out });
  };
  const dragProps = { onPointerDown: onDragStart, onPointerMove: onDragMove, onPointerUp: onDragEnd, onPointerCancel: onDragEnd };

  // ── Al abrir: bloqueo de scroll (compartido con el menú), vídeos en pausa, foco, Escape ──
  useEffect(() => {
    if (!open) return;
    closing.current = false;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    const wasLocked = html.hasAttribute(LOCK_ATTR);
    const wasStopped = !!lenis?.isStopped;
    html.setAttribute(LOCK_ATTR, "");
    lenis?.stop();
    const paused = Array.from(document.querySelectorAll("video")).filter((v) => !v.paused);
    paused.forEach((v) => v.pause());
    html.setAttribute(GLASS_ATTR, "");
    const sheet = rootRef.current?.querySelector<HTMLElement>(".gm-sheet");
    if (sheet) {
      sheet.querySelector<HTMLElement>(".gm-scroll")?.focus();
      onOpenedRef.current?.(sheet);
    }
    // Captura: el modal recibe Escape antes que el menú y no lo deja pasar (cierra solo el modal)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      requestClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      html.removeAttribute(GLASS_ATTR);
      if (!wasLocked) html.removeAttribute(LOCK_ATTR);
      if (!wasStopped) lenis?.start();
      paused.forEach((v) => v.isConnected && v.play().catch(() => {}));
      returnFocus.current?.focus?.();
    };
  }, [open, requestClose]);

  // ── Entrada: desktop se expande desde el centro; móvil sube desde abajo ──
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!open || !el) return;
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".gm-veil", { opacity: 0 }, { opacity: 1, duration: DUR.micro, ease: EASE.snap });
      gsap.fromTo(".gm-reveal", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.microOut, stagger: STAGGER.tight, ease: EASE.snap, force3D: true, clearProps: "transform" });
    });
    mm.add(`(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, () => {
      gsap.fromTo(".gm-sheet", { opacity: 0, scale: ENTER_SCALE }, { opacity: 1, scale: 1, duration: DUR.microOut, ease: EASE.out, force3D: true, clearProps: "transform" });
    });
    mm.add(`${MOBILE} and (prefers-reduced-motion: no-preference)`, () => {
      gsap.fromTo(".gm-sheet", { yPercent: 100 }, { yPercent: 0, duration: DUR.fast, ease: EASE.out, force3D: true });
    });
    return () => mm.revert();
  }, [open]);

  if (!open) return null;

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`gm-root glass-milky fixed inset-0 ${zClass} text-[var(--color-text-primary)]`}>
      {/* ── VELO (tap fuera = cerrar) ── */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={requestClose} className="gm-veil absolute inset-0 w-full h-full glass-liquid-veil cursor-default" />

      {/* ── HOJA DE VIDRIO ──
          Móvil: hoja inferior a ancho completo (alto según contenido, deja ver un poco de arriba), redondeada arriba.
          Desktop: casi a pantalla completa con 24px de margen.
          Rendimiento: el vidrio (backdrop-filter) es una capa FIJA aparte y el scroll va en una capa transparente
          encima → al desplazar no se recompone el blur (crítico en móvil, sobre todo iOS). */}
      <div className="gm-sheet absolute inset-x-0 bottom-0 max-h-[calc(100dvh_-_var(--spacing-static-2xl))] lg:max-h-none lg:inset-static-lg flex flex-col rounded-t-xl lg:rounded-xl isolate">
        <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] glass-liquid pointer-events-none" />
        <div aria-hidden="true" className="glass-liquid-sheen absolute inset-0 rounded-[inherit] pointer-events-none" />

        <div data-lenis-prevent tabIndex={-1} className="gm-scroll relative flex-1 min-h-0 overflow-y-auto overscroll-contain outline-none rounded-[inherit]" style={{ scrollbarWidth: "none" }}>
          {/* Asa (móvil): pista de "se arrastra"; pegada arriba mientras la hoja hace scroll */}
          <div aria-hidden="true" {...dragProps} className="lg:hidden sticky top-0 z-10 flex justify-center pt-static-sm pb-static-xs touch-none cursor-grab">
            <span className="w-static-2xl h-static-xs rounded-full bg-[var(--glass-liquid-divider)]" />
          </div>

          {/* Ritmo: cabecera → (lg móvil / section-xs desktop) → contenido. Móvil: respeta la barra de inicio del sistema */}
          <div className="relative min-h-full px-static-md pt-static-xs pb-[calc(var(--spacing-static-lg)_+_env(safe-area-inset-bottom))] md:p-static-xl lg:p-[var(--space-section-xs)] flex flex-col gap-static-lg lg:gap-[var(--space-section-xs)]">
            {/* Cabecera: título del modal + cerrar; mismo ancho máximo que el contenido → bordes compartidos.
                En móvil también sirve para arrastrar la hoja hacia abajo. */}
            <header {...dragProps} className="gm-reveal w-full max-w-section-lg mx-auto flex items-center justify-between gap-static-md max-lg:touch-none">
              <h1 id={titleId} className="text-h2 lg:text-h3">
                {title}
              </h1>
              <button
                type="button"
                onClick={requestClose}
                aria-label={closeLabel}
                className="group/close glass-liquid-tile shrink-0 w-static-2xl h-static-2xl rounded-full flex items-center justify-center cursor-pointer transition-[scale,box-shadow,color] duration-300 ease-out hover:[--glass-liquid-tile-edge:var(--color-brand-blue)] hover:text-[var(--color-text-accent-blue)] active:scale-95 active:duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
              >
                {/* Móvil: chevron abajo (la hoja baja al cerrar); desktop: X. Hover: canto y X en azul, la X gira 90° */}
                <CaretDown className="lg:hidden w-static-md h-static-md" aria-hidden="true" />
                <X className="hidden lg:block w-static-md h-static-md transition-transform duration-300 ease-out group-hover/close:rotate-90" aria-hidden="true" />
              </button>
            </header>

            {/* El contenido NO se estira: ancho máximo y tamaño natural; centrado en desktop, arriba en móvil */}
            <div className="flex-1 flex items-start lg:items-center">
              <div className="w-full max-w-section-lg mx-auto">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
