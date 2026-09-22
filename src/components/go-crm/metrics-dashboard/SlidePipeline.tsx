"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CHART_X_LABELS, PIPELINE_DONUTS, donutArcs } from "./data";
import { SHELL, SURFACE, TYPE, trendClass } from "./surfaces";
import TimerDots from "./TimerDots";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CHART_LINE = "M0,150 C40,115 60,110 100,100 C150,85 180,160 220,160 C260,160 280,100 300,70 C320,40 360,60 400,60 C440,60 470,120 500,120";
const CHART_NODES: [number, number][] = [[100, 100], [220, 160], [400, 60], [500, 120]];
/** Líneas guía del gráfico: valor y posición vertical (% del alto). Las etiquetas van en HTML: dentro
 * del SVG (`preserveAspectRatio="none"`) el texto se deformaba con el ancho. */
const CHART_GRID = [
  { value: 40, y: 50 },
  { value: 30, y: 100 },
  { value: 20, y: 150 },
];

type DonutData = (typeof PIPELINE_DONUTS)[number];

/** Una página del carrusel de donuts. Entra/sale con opacity + translate (compositor). */
function Donut({ data, isActive }: { data: DonutData; isActive: boolean }) {
  const t = useTranslations("goCrm.metricsDash.pipeline");
  const segments = [
    { color: data.accent, percent: 55 },
    { color: "var(--color-text-primary)", percent: 25 },
    { color: "var(--color-border-Strokes-strong)", percent: 15 },
    { color: "var(--color-border-Strokes-default)", percent: 5 },
  ];
  const arcs = donutArcs(segments.map((s) => s.percent), CIRCUMFERENCE);

  return (
    <div
      aria-hidden={!isActive}
      className={`absolute inset-0 flex flex-col justify-between p-static-md lg:p-static-xl transition-[opacity,translate] duration-700 ease-in-out ${
        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      <div className="pr-16">
        <h3 className={`${TYPE.label} mb-1`}>{t(data.key)}</h3>
        <div className="flex items-center gap-static-sm">
          <span className={TYPE.hero}>{data.value}</span>
          <span className={`${TYPE.badge} ${trendClass(true)}`}>↓ {data.trend}</span>
        </div>
      </div>

      <div className="flex items-center gap-static-lg mt-auto">
        <div className="relative shrink-0">
          <svg viewBox="0 0 120 120" className="w-28 h-28 lg:w-35 lg:h-35 -rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-surface-BG-2)" strokeWidth="6" />
            {segments.map((seg, i) => {
              const { dash, offset: dashOffset } = arcs[i];
              return (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="6"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dasharray] duration-1000 ease-out"
                  style={{
                    strokeDasharray: isActive ? `${dash} ${CIRCUMFERENCE - dash}` : `0 ${CIRCUMFERENCE}`,
                    transitionDelay: isActive ? `${i * 100}ms` : "0ms",
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={TYPE.caption}>{data.key === "revenue" ? "Q3" : t("total")}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {data.agents.map((val, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: segments[i].color }} />
                <span className={`${TYPE.label} truncate`}>
                  {t("agent")} {i + 1}
                </span>
              </div>
              <span className={TYPE.num}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * @description Dashboard "Leads y ventas" (mock de la UI): carrusel de 2 donuts que rota solo
 * (temporizador CSS, ver `TimerDots`) + gráfico de área. Tipografía: escala `TYPE` de `surfaces`.
 * Desktop: 2 columnas a 600px de alto. Móvil: solo el gráfico (el título va fuera, en el slider).
 */
export default function SlidePipeline() {
  const t = useTranslations("goCrm.metricsDash.pipeline");
  const [active, setActive] = useState(0);

  return (
    <div className={`${SHELL} h-auto lg:h-[600px] p-static-md lg:p-static-xl`}>
      {/* ── CABECERA (desktop) ── */}
      <div className="hidden lg:flex w-full justify-between items-end gap-static-md pb-static-md border-b border-[var(--color-border-Strokes-default)] mb-static-lg">
        <div>
          <h2 className={`${TYPE.title} mb-1`}>{t("title")}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-green-main)] animate-pulse" aria-hidden="true" />
            <span className={TYPE.subtitle}>{t("live")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] rounded-lg p-1" aria-hidden="true">
          {["1W", "1M", "3M", "YTD"].map((tab, i) => (
            <span
              key={tab}
              className={`px-3 py-1 rounded-md text-caption font-medium ${
                i === 1 ? `${SURFACE} shadow-elevation-1 text-[var(--color-text-primary)]` : "text-[var(--color-text-muted)]"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* ── CUERPO ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full gap-static-xl min-h-0">
        {/* Carrusel de donuts (desktop) */}
        <div className={`${SURFACE} hidden lg:block lg:w-[45%] lg:h-full relative rounded-3xl border border-[var(--color-border-Strokes-default)] shadow-elevation-1 overflow-hidden`}>
          <div className="absolute top-6 right-6 z-20">
            <TimerDots count={PIPELINE_DONUTS.length} active={active} onDone={() => setActive((a) => (a + 1) % PIPELINE_DONUTS.length)} color={PIPELINE_DONUTS[active].accent} />
          </div>
          {PIPELINE_DONUTS.map((d, i) => (
            <Donut key={d.key} data={d} isActive={active === i} />
          ))}
        </div>

        {/* Gráfico de área */}
        <div className="w-full lg:w-[55%] h-72 lg:h-full flex flex-col relative group mb-static-lg lg:mb-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className={`${TYPE.label} mb-1`}>{t("newLeads")}</h3>
              <div className="flex items-baseline gap-2">
                <span className={TYPE.hero}>3,412</span>
                <span className={TYPE.caption}>{t("period")}</span>
              </div>
            </div>
            <div className="text-caption font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-BG-2)] px-3 py-1 rounded-md border border-[var(--color-border-Strokes-default)] flex items-center gap-1.5" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t("analyze")}
            </div>
          </div>

          <div className="flex-1 relative mt-auto ml-7 border-t border-l border-[var(--color-border-Strokes-default)]">
            {/* Tooltip de demo al hover (solo opacity) */}
            <div className="absolute top-[35%] left-[60%] -translate-x-1/2 -translate-y-[120%] bg-[var(--color-overlay-tooltip-bg)] text-[var(--color-text-White-100)] px-3 py-2 rounded-lg shadow-elevation-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none flex flex-col items-center">
              <span className="text-caption opacity-60">03 Sep</span>
              <span className="text-body-sm font-medium">{t("tooltip")}</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-overlay-tooltip-bg)] rotate-45" />
            </div>
            <div className="absolute top-[35%] left-[60%] w-px h-[65%] bg-[var(--color-text-primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 pointer-events-none" />

            {/* Eje Y */}
            {CHART_GRID.map(({ value, y }) => (
              <span key={value} className={`${TYPE.caption} tabular-nums absolute -left-7 w-5 text-right -translate-y-1/2`} style={{ top: `${y / 2}%` }} aria-hidden="true">
                {value}
              </span>
            ))}

            <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible" aria-hidden="true">
              {CHART_GRID.map(({ y }) => (
                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="var(--color-border-Strokes-default)" strokeWidth="1" strokeDasharray="2 4" />
              ))}
              <defs>
                <linearGradient id="metricsChartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-blue)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--color-brand-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${CHART_LINE} L500,200 L0,200 Z`} fill="url(#metricsChartGrad)" />
              <path d={CHART_LINE} fill="none" stroke="var(--color-brand-blue)" strokeWidth="2" strokeLinecap="round" />
              {CHART_NODES.map(([cx, cy]) => (
                <circle key={cx} cx={cx} cy={cy} r="3" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
              ))}
              <circle cx="300" cy="70" r="4" fill="var(--color-brand-blue)" stroke="var(--color-surface-BG-base)" strokeWidth="2" />
            </svg>

            {/* Eje X */}
            <div className={`${TYPE.caption} tabular-nums absolute -bottom-7 left-0 w-full flex justify-between`} aria-hidden="true">
              {CHART_X_LABELS.map((label, i) => (
                <span key={label} className={i % 2 ? "hidden lg:inline" : ""}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
