"use client";

/**
 * @file JoinModal.tsx
 * @description Modal "Join Epicare" — el paso entre cualquier CTA de unirse y la página de formulario,
 * con el mismo vidrio líquido del menú móvil (velo + hoja `glass-liquid` + brillo + tiles).
 * Filtro doble en UNA sola vista (sin pantalla intermedia):
 *   Agente  → Soy agente · No soy agente
 *   Agencia → Únete como FMO Partner · Licencia de marca
 * Las dos ramas siempre a la vez (pregunta + sus 2 resultados): un solo clic, sin pestañas.
 * - Desktop: dos columnas con divisor vertical.
 * - Móvil: apiladas en scroll, divisor horizontal, 2 resultados por fila; `open("agency")` desplaza a esa rama.
 * Cada resultado lleva a la misma página de formulario en su versión (destinos en `joinData.ts`).
 * - Se abre desde cualquier sitio: `joinModalStore.open()` / `open("agency")`, o enlaces `#join`,
 *   `#join-agent`, `#join-agency`. Montado una vez en `app/layout.tsx`.
 * - Accesible: role="dialog", Escape y tap en el velo cierran, foco devuelto al cerrar.
 * - GPU (como el menú): un único backdrop-filter (la hoja), solo opacity/transform, vídeos de detrás en
 *   pausa mientras está abierto; scroll bloqueado con el mismo atributo del menú (`data-mnav-lock`).
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import type Lenis from "lenis";
import { X } from "@phosphor-icons/react";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import { branchFromHash, joinModalStore, useJoinModal } from "@/lib/joinModalStore";
import { JOIN_BRANCHES, JOIN_PATHS } from "./joinData";
import { BRANCH_ICON, BranchHead, JoinTile, PATH_ICON } from "./JoinCards";

const LOCK_ATTR = "data-mnav-lock";

export default function JoinModal() {
  const t = useTranslations("join");
  const { isOpen, branch: initialBranch, close } = useJoinModal();
  const rootRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // ── Abrir por hash desde cualquier enlace ──
  useEffect(() => {
    const fromHash = () => {
      const b = branchFromHash(window.location.hash);
      if (b === undefined) return;
      joinModalStore.open(b);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // ── Al abrir: bloqueo de scroll, vídeos en pausa, foco, Escape; en móvil, scroll a la rama pedida ──
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    html.setAttribute(LOCK_ATTR, "");
    lenis?.stop();
    const paused = Array.from(document.querySelectorAll("video")).filter((v) => !v.paused);
    paused.forEach((v) => v.pause());
    const sheet = rootRef.current?.querySelector<HTMLElement>(".jm-sheet");
    sheet?.focus();
    // Apiladas en móvil: si se pidió una rama (`open("agency")`, `#join-agency`), la hoja arranca en ella
    const target = initialBranch && sheet?.querySelector<HTMLElement>(`[data-branch="${initialBranch}"]`);
    if (target && window.matchMedia("(max-width: 1023px)").matches) target.scrollIntoView({ block: "start" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.removeAttribute(LOCK_ATTR);
      lenis?.start();
      paused.forEach((v) => v.isConnected && v.play().catch(() => {}));
      returnFocus.current?.focus?.();
    };
  }, [isOpen, initialBranch, close]);

  // ── Entrada (como el menú): velo + hoja en fundido, la hoja baja un poco, el contenido en ola ──
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!isOpen || !el) return;
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo([".jm-veil", ".jm-sheet"], { opacity: 0 }, { opacity: 1, duration: DUR.micro, ease: EASE.snap });
      gsap.fromTo(".jm-sheet", { y: -REVEAL.sm }, { y: 0, duration: DUR.microOut, ease: EASE.snap, force3D: true });
      gsap.fromTo(".jm-reveal", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.microOut, stagger: STAGGER.tight, ease: EASE.snap, force3D: true, clearProps: "transform" });
    });
    return () => mm.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-labelledby="join-modal-title" className="fixed inset-0 z-[9999990] text-[var(--color-text-primary)]">
      {/* ── VELO (tap fuera = cerrar) ── */}
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={close} className="jm-veil absolute inset-0 w-full h-full glass-liquid-veil cursor-default" />

      {/* ── HOJA DE VIDRIO ── casi a pantalla completa: solo un margen fino alrededor (8px móvil, 24px desktop) */}
      <div
        data-lenis-prevent
        tabIndex={-1}
        className="jm-sheet absolute inset-2 lg:inset-static-lg overflow-y-auto overscroll-contain outline-none rounded-xl glass-liquid isolate"
        style={{ scrollbarWidth: "none" }}
      >
        <div aria-hidden="true" className="glass-liquid-sheen absolute inset-0 pointer-events-none" />

        {/* Ritmo por proximidad. Móvil: cabecera → (lg) → rama → (xl) → rama; dentro: etiqueta → (md) → cards.
            Desktop: cabecera → (section-xs) → dos columnas. */}
        <div className="relative min-h-full p-static-md md:p-static-xl lg:p-[var(--space-section-xs)] flex flex-col gap-static-lg lg:gap-[var(--space-section-xs)]">
          {/* Cabecera: el título del modal (nivel superior a las ramas h4) + cerrar */}
          <header className="jm-reveal w-full max-w-section-lg mx-auto flex items-center justify-between gap-static-md">
            <h1 id="join-modal-title" className="text-h2 lg:text-h3">
              {t("eyebrow")}
            </h1>
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="glass-liquid-tile w-static-2xl h-static-2xl rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
            >
              <X className="w-static-md h-static-md" aria-hidden="true" />
            </button>
          </header>

          {/* Las dos ramas. Desktop: dos columnas que comparten filas (subgrid) → cabeceras y tiles alineados
              entre ramas aunque los textos midan distinto; divisor de vidrio centrado. Móvil: apiladas en scroll, sin
              divisor: las separa el espacio (xl). */}
          {/* El contenido NO se estira: ancho máximo y tamaño natural; centrado en la hoja en desktop, arriba en móvil.
              La cabecera usa el mismo ancho máximo: etiqueta y X comparten bordes con las columnas. */}
          <div className="flex-1 flex items-start lg:items-center">
          <div className="relative w-full max-w-section-lg mx-auto grid lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-y-static-xl lg:gap-y-static-lg lg:gap-x-[var(--space-section-sm)]">
            <span aria-hidden="true" className="hidden lg:block absolute inset-y-0 left-1/2 w-px bg-[var(--glass-liquid-divider)]" />
            {JOIN_BRANCHES.map((b) => (
              <section
                key={b.key}
                data-branch={b.key}
                aria-label={t(`${b.key}.tag`)}
                className="jm-reveal scroll-mt-static-md flex flex-col gap-static-md lg:gap-static-lg lg:row-span-2 lg:grid lg:grid-rows-subgrid"
              >
                <BranchHead icon={BRANCH_ICON[b.key]} tag={t(`${b.key}.tag`)} title={t(`${b.key}.title`)} body={t(`${b.key}.body`)} />
                <div className="grid grid-cols-2 gap-static-sm lg:gap-static-md">
                  {JOIN_PATHS[b.key].map((p) => (
                    <JoinTile key={p.key} icon={PATH_ICON[p.key]} title={t(`paths.${p.key}.title`)} text={t(`paths.${p.key}.text`)} more={t("moreInfo")} href={p.href} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
