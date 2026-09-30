"use client";

/**
 * @file PromiseCompany.tsx
 * @description La promesa de Epicare en /company: banda azul de marca (cierre de la página) con
 * tres filas — Claridad, Control, Confianza — en un "ledger" suizo de hairlines.
 * - Desktop (≥lg): filas asimétricas en Z (número · palabra · texto, y la fila central en espejo).
 * - Móvil / tablet: zigzag con hairlines — número en columna angosta a un lado, palabra + texto al otro;
 *   las filas alternan de lado.
 * Motion en `promise/usePromiseMotion.ts` (text-birth + layered unveiling). La cruz gira en CSS.
 */

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePromiseMotion } from "./promise/usePromiseMotion";

type PromiseItem = { word: string; outcome: string; text: string };

const ROW = "w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md";
/** Hairlines del ledger al 50% (sobre el azul de marca). */
const LINE = "border-[var(--color-brand-dark)]/50";

/** Texto que nace de su máscara (text-birth). */
function Birth({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`pr-birth block overflow-hidden pb-static-xs ${className}`}>
      <span className="pr-birth-in block">{children}</span>
    </span>
  );
}

// ── FILAS DEL LEDGER ──
// Móvil: zigzag — columna angosta con el número (hairline vertical) a un lado y, al otro, la palabra
// sobre el resultado + texto; la fila en espejo cambia de lado. Desktop (≥lg): retícula de 12 columnas
// en Z (número 1 · palabra 7 · texto 4; espejo: texto · palabra · número). Clases literales por lado
// para que Tailwind las detecte.
const CELL_LG = "lg:col-start-auto lg:row-start-auto lg:row-span-1";
const SIDES = {
  normal: {
    row: "grid-cols-[var(--spacing-static-xl)_1fr]",
    num: "col-start-1 border-r",
    word: "col-start-2",
    text: "col-start-2 pl-static-2xl pr-static-md lg:order-3",
  },
  mirror: {
    row: "grid-cols-[1fr_var(--spacing-static-xl)]",
    num: "col-start-2 border-l lg:border-l-0 lg:order-3",
    word: "col-start-1 justify-end text-right",
    text: "col-start-1 pl-static-md pr-static-2xl lg:order-1 lg:border-r",
  },
} as const;

function PromiseRow({ item, index, mirror }: { item: PromiseItem; index: number; mirror: boolean }) {
  const number = String(index + 1).padStart(2, "0");
  const side = SIDES[mirror ? "mirror" : "normal"];
  return (
    <div className={`grid ${side.row} lg:grid-cols-12 border-b ${LINE}`}>
      {/* Número */}
      <div className={`${side.num} row-start-1 row-span-2 ${CELL_LG} lg:col-span-1 flex justify-center pt-static-lg lg:p-static-lg ${LINE}`}>
        <Birth className="text-meta opacity-60">{number}</Birth>
      </div>

      {/* Palabra */}
      <div className={`${side.word} row-start-1 ${CELL_LG} lg:col-span-7 lg:order-2 flex items-center border-b lg:border-b-0 lg:border-r px-static-md py-static-lg lg:px-static-xl lg:py-static-2xl lg:@container ${LINE}`}>
        {/* Desktop: tracking/leading de la versión aprobada + tope por container query (margen creativo
            declarado): el tamaño es el de text-display-2xl salvo que la palabra más larga ("CONFIDENCE.")
            no quepa en su celda; entonces baja lo justo (16cqi) en vez de cruzar el hairline. */}
        <h3 className="text-display lg:text-display-2xl lg:[font-size:min(clamp(4.5rem,8vw,8rem),16cqi)] lg:tracking-tighter lg:leading-[0.85] uppercase">
          <Birth>{item.word}</Birth>
        </h3>
      </div>

      {/* Resultado + texto */}
      <div className={`${side.text} row-start-2 ${CELL_LG} lg:col-span-4 flex flex-col justify-end py-static-lg lg:p-static-2xl ${LINE}`}>
        <div className="pr-unveil">
          <h4 className="text-h5 mb-static-md">{item.outcome}</h4>
          <p className="text-body-md font-medium lg:max-w-[90%]">{item.text}</p>
        </div>
      </div>
    </div>
  );
}

export default function PromiseCompany() {
  const t = useTranslations("company.promise");
  const containerRef = useRef<HTMLElement>(null);
  const items = t.raw("items") as PromiseItem[];

  usePromiseMotion(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[var(--color-brand-blue)] text-[var(--color-brand-dark)] z-30 py-section-md overflow-hidden"
    >
      {/* ── ENCABEZADO: cruz suiza (loop CSS) + etiqueta ── */}
      <div className={`${ROW} mb-static-2xl lg:mb-[var(--space-section-xs)]`}>
        <h2 className="flex items-center gap-static-md">
          <span
            className={`relative w-static-sm h-static-sm shrink-0 border ${LINE} animate-[spin_15s_linear_infinite] motion-reduce:animate-none`}
            aria-hidden="true"
          >
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--color-brand-dark)]" />
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--color-brand-dark)]" />
          </span>
          <Birth className="text-overline">{t("overline")}</Birth>
        </h2>
      </div>

      {/* ── LEDGER ── */}
      <div className={ROW}>
        <div className={`border-t ${LINE}`}>
          {items.map((item, i) => (
            <PromiseRow key={item.word} item={item} index={i} mirror={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
