"use client";

/**
 * @description Acto 03 en móvil — los 4 caminos como tarjetas con halo en un slider de 3 infinito (como el
 * hero): la activa al centro, las vecinas asomando y veladas. Cada tarjeta: número · etiqueta arriba,
 * título y texto abajo. Debajo, el indicador con contador 01/04 y el CTA (todos llevan al mismo alta).
 * Sustituye en móvil a las 2 preguntas, el resultado y la lista "Los 4 caminos" de desktop.
 */

import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { useInfiniteSnap } from "../useInfiniteSnap";
import SlideIndicator from "../SlideIndicator";
import { GLOW } from "./RoleResult";
import type { RolePath } from "./rolePaths";

export default function RoleMobileSlider({ paths, cta, className = "" }: { paths: RolePath[]; cta: string; className?: string }) {
  const n = paths.length;
  const { trackRef, onScroll, current, active, copies } = useInfiniteSnap(n, true);
  const items = Array.from({ length: copies }, (_, c) => paths.map((p) => ({ p, c }))).flat();

  return (
    <div className={`flex-col gap-static-xl ${className}`}>
      <ul
        ref={trackRef}
        onScroll={onScroll}
        // El padding lateral (18vw = (100 - 64) / 2) centra cualquier tarjeta.
        className="w-full flex gap-static-sm overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-[18vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ p, c }, k) => {
          // Margen creativo: velo de las vecinas (opacidad 0.5); solo la copia central existe para lectores.
          const side = k !== current;
          return (
            <li
              key={`${c}-${p.key}`}
              aria-hidden={c !== 1 || undefined}
              className={`w-[64vw] max-w-80 shrink-0 snap-center transition-opacity duration-300 ease-out ${side ? "opacity-50" : "opacity-100"}`}
            >
              <article
                className="aspect-[4/5] h-full flex flex-col justify-between rounded-lg border border-[var(--color-border-Strokes-default)] p-static-lg"
                style={GLOW}
              >
                <span className="text-meta text-[var(--color-text-secondary)]">
                  {p.n} · {p.tag}
                </span>
                <div className="flex flex-col gap-static-sm">
                  <h3 className="text-display-sm">{p.title}</h3>
                  <p className="text-body-md text-[var(--color-text-secondary)]">{p.body}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <SlideIndicator n={n} active={active} counter />
      <div className="px-gutter-sm">
        <PrimaryCta label={cta} />
      </div>
    </div>
  );
}
