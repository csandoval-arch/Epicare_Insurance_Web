"use client";

/**
 * @description Sección "Liquid Glass" del design system: el sistema de vidrio líquido (tokens, utilidades,
 * variante lechosa, componentes reutilizables y reglas de rendimiento), visible y probable en vivo.
 * Un solo panel de vidrio en el escenario (regla: nunca vidrio sobre vidrio).
 */

import { useEffect, useRef, useState } from "react";
import { Buildings, User } from "@phosphor-icons/react";
import ArrowUR from "@/components/icons/ArrowUR";
import GlassModal from "@/components/glass/GlassModal";
import { GlassLight, LIGHT_TILE, trackPointer } from "@/components/glass/GlassLight";
import { IconChip } from "@/components/glass/IconChip";
import { joinModalStore } from "@/lib/joinModalStore";
import { loginModalStore } from "@/lib/loginModalStore";

const TOKENS: { name: string; role: string }[] = [
  { name: "--glass-liquid-fill", role: "Relleno de la hoja (degradado 160°)" },
  { name: "--glass-liquid-blur", role: "Radio del blur (sano: 8–16px)" },
  { name: "--glass-liquid-saturate", role: "Saturación del blur (cuánto color de detrás atraviesa)" },
  { name: "--glass-liquid-edge", role: "Borde interno de la hoja" },
  { name: "--glass-liquid-specular", role: "Brillo del canto superior y de esquina" },
  { name: "--glass-liquid-glow", role: "Respiración azul de marca en la esquina" },
  { name: "--glass-liquid-sheen-opacity", role: "Intensidad del brillo (capa sheen)" },
  { name: "--glass-liquid-tile", role: "Relleno de piezas internas (sin blur propio)" },
  { name: "--glass-liquid-tile-edge", role: "Borde de las piezas internas" },
  { name: "--glass-liquid-divider", role: "Divisores sobre vidrio (alfa, no gris opaco)" },
  { name: "--glass-liquid-veil", role: "Velo de la sala detrás de un modal" },
  { name: "--glass-liquid-solid", role: "Relleno sin blur para el vidrio TAPADO por un modal" },
];

const UTILITIES = [
  { cls: ".glass-liquid", desc: "La hoja: relleno + blur + saturate + canto especular + elevation-4. El ÚNICO elemento con backdrop-filter." },
  { cls: ".glass-liquid-sheen", desc: "Capa aria-hidden dentro de la hoja: brillo de esquina + respiración de marca." },
  { cls: ".glass-liquid-tile", desc: "Piezas internas (tarjetas, filas, botones): solo relleno y borde, sin blur." },
  { cls: ".glass-liquid-veil", desc: "Velo a pantalla completa detrás de un modal." },
  { cls: ".glass-milky", desc: "Variante lechosa (solo claro): en el contenedor; redefine los tokens para menos luz y más contraste." },
];

const RULES = [
  "Un solo blur en pantalla. Nunca vidrio sobre vidrio: las piezas internas usan .glass-liquid-tile.",
  "Con un GlassModal abierto, <html data-glass-modal> apaga el backdrop-filter de todo lo de debajo (menú, header, tarjetas); la hoja del menú pasa a --glass-liquid-solid.",
  "El vidrio va en una capa fija aparte del scroll: al desplazar no se recompone el blur (crítico en iOS).",
  "Blur entre 8 y 16px: más es exponencialmente caro en móvil.",
  "Solo opacity/transform en las animaciones; vídeos de detrás en pausa mientras el modal está abierto.",
  "Texto sobre vidrio claro: usa .glass-milky si el fondo de detrás es vivo (vídeo, fotos).",
];

function Code({ children }: { children: string }) {
  return <code className="text-meta text-[var(--color-brand-blue)] bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-md px-static-sm py-static-xs whitespace-nowrap">{children}</code>;
}

export default function GlassSection({ isDark }: { isDark: boolean }) {
  const [milky, setMilky] = useState(true);
  const [demoOpen, setDemoOpen] = useState(false);
  const [values, setValues] = useState<Record<string, { base: string; milky: string }>>({});
  const milkyProbe = useRef<HTMLDivElement>(null);

  // Valores reales de los tokens (cambian con el tema): base en :root, lechoso dentro de .glass-milky
  useEffect(() => {
    const read = () => {
      const root = getComputedStyle(document.documentElement);
      const probe = milkyProbe.current ? getComputedStyle(milkyProbe.current) : root;
      const next: Record<string, { base: string; milky: string }> = {};
      for (const t of TOKENS) next[t.name] = { base: root.getPropertyValue(t.name).trim() || "—", milky: probe.getPropertyValue(t.name).trim() || "—" };
      setValues(next);
    };
    const id = requestAnimationFrame(read);
    return () => cancelAnimationFrame(id);
  }, [isDark]);

  return (
    <section className="w-full py-section-md px-gutter-md border-b border-[var(--color-border-Strokes-default)]">
      <div ref={milkyProbe} aria-hidden="true" className="glass-milky hidden" />
      <div className="max-w-[var(--max-w-section-lg)] mx-auto flex flex-col gap-fluid-lg">
        {/* Header */}
        <div className="flex flex-col gap-fluid-xs">
          <h2 className="text-display-sm text-[var(--color-text-primary)]">Liquid Glass</h2>
          <p className="text-body-lg text-[var(--color-text-secondary)] max-w-[600px]">
            El vidrio del menú móvil y de los modales (Join, Login). Una hoja con blur, piezas internas sin blur, una variante lechosa para contraste y reglas para que nunca haya dos blurs a la vez.
          </p>
        </div>

        {/* ── Escenario: fondo vivo para ver el vidrio ── */}
        <div className="flex flex-col gap-static-md">
          <div className="flex flex-wrap items-center justify-between gap-static-md">
            <span className="text-h4">Escenario</span>
            <div role="radiogroup" aria-label="Variante del vidrio" className="grid grid-cols-2 gap-static-xs p-static-xs rounded-lg bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)]">
              {[
                { v: false, l: "Estándar" },
                { v: true, l: "Lechoso" },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  role="radio"
                  aria-checked={milky === o.v}
                  onClick={() => setMilky(o.v)}
                  className={`h-static-xl px-static-md rounded-md text-body-sm transition-colors cursor-pointer ${milky === o.v ? "bg-[var(--color-text-primary)] text-[var(--color-surface-BG-base)]" : "text-[var(--color-text-secondary)]"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div className={`${milky ? "glass-milky " : ""}relative overflow-hidden rounded-xl min-h-[32rem] p-static-md md:p-static-xl flex items-center justify-center bg-[var(--color-surface-BG-1)]`}>
            {/* Fondo vivo (lo que el vidrio difumina) */}
            <div aria-hidden="true" className="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 rounded-full bg-[var(--color-brand-blue)] opacity-70 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-[var(--color-brand-orange)] opacity-60 blur-3xl" />
            <span aria-hidden="true" className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-display-3xl text-[var(--color-text-primary)] opacity-80 select-none">Epicare</span>

            {/* La hoja: único elemento con blur */}
            <div className="relative w-full max-w-section-sm rounded-xl isolate">
              <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] glass-liquid" />
              <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] glass-liquid-sheen" />
              <div className="relative p-static-lg md:p-static-xl flex flex-col gap-static-lg">
                <div className="flex items-center gap-static-md">
                  <IconChip icon={User} />
                  <span className="text-h4">.glass-liquid</span>
                </div>
                <p className="text-body-md text-[var(--color-text-secondary)]">Subtítulo en --color-text-secondary: compara su contraste entre Estándar y Lechoso.</p>
                {/* Tiles con hover de luz (desktop) */}
                <div className="grid grid-cols-2 gap-static-sm md:gap-static-md">
                  {[
                    { icon: User, t: "LIGHT_TILE", s: "Pasa el cursor: luz que sigue + canto azul" },
                    { icon: Buildings, t: "IconChip live", s: "El chip se enciende con el hover" },
                  ].map((d) => (
                    <button key={d.t} type="button" onPointerMove={trackPointer} className={`${LIGHT_TILE} p-static-md flex flex-col gap-static-md`}>
                      <GlassLight />
                      <span className="relative">
                        <IconChip icon={d.icon} live />
                      </span>
                      <span className="relative flex flex-col gap-static-xs">
                        <span className="text-h4">{d.t}</span>
                        <span className="text-body-sm text-[var(--color-text-secondary)]">{d.s}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {/* Fila de vidrio (enlace secundario) */}
                <span className="glass-liquid-tile h-static-2xl px-static-md rounded-md flex items-center justify-between text-body-sm">
                  .glass-liquid-tile (fila)
                  <ArrowUR aria-hidden="true" className="w-static-md h-static-md text-[var(--color-text-accent-blue)]" />
                </span>
              </div>
            </div>
          </div>
          {isDark && <p className="text-body-sm text-[var(--color-text-secondary)]">En oscuro “Lechoso” no cambia nada: la variante solo existe en claro.</p>}
        </div>

        {/* ── Tokens ── */}
        <div className="flex flex-col gap-static-md">
          <span className="text-h4">Tokens ({isDark ? "oscuro" : "claro"})</span>
          <div className="rounded-xl border border-[var(--color-border-Strokes-default)] overflow-hidden divide-y divide-[var(--color-border-Strokes-default)]">
            {TOKENS.map((tk) => {
              const v = values[tk.name];
              const isColor = v && /rgb|#|gradient/.test(v.base);
              return (
                <div key={tk.name} className="grid md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,1fr)] gap-static-sm md:gap-static-md items-center px-static-md py-static-sm bg-[var(--color-surface-BG-1)]">
                  <span className="flex flex-col gap-static-xs">
                    <Code>{tk.name}</Code>
                    <span className="text-body-xs text-[var(--color-text-secondary)]">{tk.role}</span>
                  </span>
                  {(["base", "milky"] as const).map((k) => (
                    <span key={k} className="flex items-center gap-static-sm min-w-0">
                      {isColor && <span aria-hidden="true" className="shrink-0 w-static-xl h-static-xl rounded-md border border-[var(--color-border-Strokes-default)] bg-[repeating-conic-gradient(var(--color-surface-BG-base)_0_25%,var(--color-border-Strokes-default)_0_50%)] bg-[length:12px_12px] overflow-hidden"><span className="block w-full h-full" style={{ background: v?.[k] }} /></span>}
                      <span className="flex flex-col min-w-0">
                        <span className="text-body-xs text-[var(--color-text-secondary)]">{k === "base" ? "Base" : "Lechoso (.glass-milky)"}</span>
                        <span className="text-meta truncate">{v?.[k] ?? "…"}</span>
                      </span>
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Utilidades ── */}
        <div className="flex flex-col gap-static-md">
          <span className="text-h4">Utilidades</span>
          <div className="grid md:grid-cols-2 gap-static-md">
            {UTILITIES.map((u) => (
              <div key={u.cls} className="rounded-xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-static-lg flex flex-col gap-static-sm">
                <Code>{u.cls}</Code>
                <p className="text-body-sm text-[var(--color-text-secondary)]">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Componentes ── */}
        <div className="flex flex-col gap-static-md">
          <span className="text-h4">Componentes reutilizables</span>
          <div className="grid md:grid-cols-3 gap-static-md">
            <div className="rounded-xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-static-lg flex flex-col gap-static-sm">
              <Code>glass/GlassModal</Code>
              <p className="text-body-sm text-[var(--color-text-secondary)]">
                Carcasa de modal. Desktop: casi pantalla completa (24px), entra y sale expandiéndose. Móvil: hoja inferior a ancho completo, asa y cierre por arrastre, se abre encima del menú sin cerrarlo. Lleva .glass-milky.
              </p>
              <div className="mt-auto flex flex-wrap gap-static-sm pt-static-sm">
                <button type="button" onClick={() => setDemoOpen(true)} className="h-static-xl px-static-md rounded-md bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] text-body-sm cursor-pointer">
                  Abrir demo
                </button>
                <button type="button" onClick={() => loginModalStore.open()} className="h-static-xl px-static-md rounded-md border border-[var(--color-border-Strokes-default)] text-body-sm cursor-pointer">
                  Login
                </button>
                <button type="button" onClick={() => joinModalStore.open()} className="h-static-xl px-static-md rounded-md border border-[var(--color-border-Strokes-default)] text-body-sm cursor-pointer">
                  Join
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-static-lg flex flex-col gap-static-sm">
              <Code>glass/GlassLight</Code>
              <p className="text-body-sm text-[var(--color-text-secondary)]">
                Hover de luz para tiles (desktop): foco neutro que sigue al cursor y canto azul cerca de él. Uso: clases LIGHT_TILE, onPointerMove=trackPointer y &lt;GlassLight /&gt; como primer hijo; el contenido con relative.
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-static-lg flex flex-col gap-static-sm">
              <Code>glass/IconChip</Code>
              <p className="text-body-sm text-[var(--color-text-secondary)]">
                Pastilla de icono: azul de marca al 14 %. size sm (32px) o md (32 → 48px). live: se enciende (azul lleno, icono blanco) con el hover del tile.
              </p>
            </div>
          </div>
        </div>

        {/* ── Reglas ── */}
        <div className="flex flex-col gap-static-md">
          <span className="text-h4">Reglas de uso y rendimiento</span>
          <ol className="grid md:grid-cols-2 gap-static-sm">
            {RULES.map((r, i) => (
              <li key={r} className="flex gap-static-sm rounded-lg bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-static-md">
                <span className="text-meta text-[var(--color-brand-blue)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-body-sm text-[var(--color-text-secondary)]">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Demo de la carcasa */}
      <GlassModal open={demoOpen} onClose={() => setDemoOpen(false)} titleId="ds-glass-demo-title" title="GlassModal" closeLabel="Cerrar">
        <div className="gm-reveal flex flex-col gap-static-md max-w-section-sm">
          <p className="text-body-lg text-[var(--color-text-secondary)]">Carcasa vacía: título, cerrar, velo, hoja y entrada/salida. El contenido es tuyo.</p>
          <div className="grid grid-cols-2 gap-static-sm">
            {["Tile A", "Tile B"].map((t) => (
              <button key={t} type="button" onPointerMove={trackPointer} className={`${LIGHT_TILE} p-static-md min-h-32 flex flex-col gap-static-md`}>
                <GlassLight />
                <span className="relative">
                  <IconChip icon={User} live />
                </span>
                <span className="relative text-h4">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassModal>
    </section>
  );
}
