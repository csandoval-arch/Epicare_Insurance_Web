"use client";

/**
 * @description Primitivas de la réplica de la consola de GO CRM (los 3 paneles del Despiece).
 *
 * REPORTE DE MARGEN CREATIVO (declarado): esto es una réplica 1:1 de una captura del producto, no
 * UI de la landing. Por eso:
 * - Las medidas van en píxeles del fotograma original (2222 px de ancho) dentro de un `Artboard`
 *   que se escala entero para encajar en su columna (igual que la imagen a la que sustituye).
 * - Los colores son los del producto, medidos sobre el fotograma, en variables `--ui-*` locales a
 *   `.cx-ui`. La consola es SIEMPRE clara (decisión del usuario, 2026-10-01): no usa tokens del DS
 *   porque esos invierten en dark.
 */

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

// ── PALETA DEL PRODUCTO (medida sobre el fotograma) ──
export const UI_CSS = `
.cx-ui {
  --ui-page: #eceef2;
  --ui-panel: #f7f9fd;
  --ui-card: #ffffff;
  --ui-border: #e4e7ec;
  --ui-border-strong: #d0d5dd;
  --ui-text: #101828;
  --ui-text-2: #344054;
  --ui-text-3: #667085;
  --ui-blue: #155eef;
  --ui-blue-soft: #eef4fe;
  --ui-blue-line: #b2ccff;
  --ui-bubble: #e9effb;
  --ui-pill: #f2f4f7;
  --ui-tab-active: #ebecf1;
  --ui-avatar: #f5d1fe;
  --ui-source: #eff8ff;
  --ui-source-text: #18719f;
  --ui-blue-circle: #d2e0fd;
  --ui-green-circle: #e7fccd;
  --ui-green: #4ca30d;
  --ui-purple-circle: #ebe9fe;
  --ui-purple: #6938ef;
  --ui-send: #87abf5;
  --ui-scroll: #c4c6ca;
  --ui-timeline: #bcbeca;
  --ui-section: #f2f4f5;
  --ui-flag-red: #d80027;
  --ui-flag-blue: #0052b4;
  font-family: var(--font-inter-display), ui-sans-serif, system-ui, sans-serif;
  font-variation-settings: normal;
  font-optical-sizing: auto;
  color: var(--ui-text);
  -webkit-font-smoothing: antialiased;
}
`;

/** Vista del artboard que se muestra (unidades del fotograma). */
export interface ArtView {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ArtboardProps {
  /** Tamaño del panel completo en píxeles del fotograma. */
  w: number;
  h: number;
  /** Recorte visible (por defecto, el panel entero). */
  view?: ArtView;
  className?: string;
  children: ReactNode;
}

/** Escala inicial antes de medir (≈ desktop 1440): evita un primer frame a tamaño 1:1. */
const INITIAL_SCALE = 0.6;

/**
 * @description Lienzo de tamaño fijo (w×h px del fotograma) escalado para llenar el ancho de su
 * contenedor; la caja toma la proporción de la vista, así que se comporta como una imagen.
 */
export function Artboard({ w, h, view, className = "", children }: ArtboardProps) {
  const v = view ?? { x: 0, y: 0, w, h };
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const fit = () => {
      const s = box.clientWidth / v.w;
      inner.style.transform = `scale(${s}) translate(${-v.x}px, ${-v.y}px)`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [v.x, v.y, v.w]);

  return (
    <div ref={boxRef} className={`cx-ui relative overflow-hidden ${className}`} style={{ aspectRatio: `${v.w} / ${v.h}` }}>
      <div
        ref={innerRef}
        aria-hidden="true"
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: w, height: h, transform: `scale(${INITIAL_SCALE}) translate(${-v.x}px, ${-v.y}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// ── TEXTO POSICIONADO ──
type Weight = 400 | 500 | 600;

interface TProps {
  /** Borde izquierdo (o derecho con `right`) y CENTRO vertical de la línea, en px del fotograma. */
  x: number;
  y: number;
  size: number;
  weight?: Weight;
  color?: string;
  right?: boolean;
  className?: string;
  children: ReactNode;
}

/** Línea de texto anclada por su centro vertical (así se mide en la captura). */
export function T({ x, y, size, weight = 400, color = "var(--ui-text)", right = false, className = "", children }: TProps) {
  return (
    <span
      className={`absolute whitespace-nowrap leading-none -translate-y-1/2 ${className}`}
      style={{ [right ? "right" : "left"]: x, top: y, fontSize: size, fontWeight: weight, color }}
    >
      {children}
    </span>
  );
}

// ── ICONOS (trazo, estilo lucide) ──
const PATHS = {
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  x: "M18 6 6 18M6 6l12 12",
  plus: "M12 8v8M8 12h8",
  search: "m21 21-4.3-4.3",
  filter: "M3 6h18M7 12h10M10 18h4",
  message: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92zM14.05 2a9 9 0 0 1 8 7.94M14.05 6A5 5 0 0 1 18 10",
  folderPlus:
    "M12 10v6M9 13h6M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
  eye: "M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0",
  minus: "M5 12h14",
  maximize: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7",
  smile: "M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  clip: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  zap: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  tag: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42zM7.5 7.5h.01",
  dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  backspace: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM12 9l6 6M18 9l-6 6",
  send: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zM21.854 2.147l-10.94 10.939",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  history: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2",
  nodes: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3",
  scan: "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 17c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 10 2 2 4-4M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
  pen: "M12 20h9M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  file: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M9 13h6M9 17h6",
  circleDollar: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6",
  keyboard: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10",
  more: "M12 5h.01M12 12h.01M12 19h.01",
  play: "m10 8 6 4-6 4z",
} as const;

/** Círculos extra que acompañan a algunos trazos. */
const CIRCLES: Partial<Record<keyof typeof PATHS, [number, number, number][]>> = {
  plus: [[12, 12, 10]],
  search: [[11, 11, 8]],
  eye: [[12, 12, 3]],
  smile: [[12, 12, 10]],
  user: [[12, 7, 4]],
  nodes: [[12, 18, 3], [6, 6, 3], [18, 6, 3]],
  scan: [[12, 10, 2.5]],
  circleDollar: [[12, 12, 10]],
  play: [[12, 12, 10]],
};

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  /** Centro del icono y tamaño de la caja, en px del fotograma. */
  x: number;
  y: number;
  size: number;
  color?: string;
  stroke?: number;
}

/** Trazo de un icono (sin posición): lo comparten `Icon` (absoluto) e `InlineIcon` (en línea). */
function Glyph({ name, className, style, stroke }: { name: IconName; className: string; style: CSSProperties; stroke: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
      {CIRCLES[name]?.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
    </svg>
  );
}

/** Icono posicionado por su centro (px del fotograma). */
export function Icon({ name, x, y, size, color = "var(--ui-text-2)", stroke = 2 }: IconProps) {
  return <Glyph name={name} stroke={stroke} className="absolute" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, color }} />;
}

/** Icono dentro de una línea de texto (tras una etiqueta): hereda el color salvo que se indique. */
export function InlineIcon({ name, size, color = "currentColor", stroke = 2 }: { name: IconName; size: number; color?: string; stroke?: number }) {
  return <Glyph name={name} stroke={stroke} className="inline-block shrink-0" style={{ width: size, height: size, color }} />;
}

/** Caja posicionada (px del fotograma). */
export function Box({ x, y, w, h, className = "", style, children }: { x: number; y: number; w: number; h: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`absolute ${className}`} style={{ left: x, top: y, width: w, height: h, ...style }}>
      {children}
    </div>
  );
}
