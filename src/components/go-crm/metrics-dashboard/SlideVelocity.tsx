"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VELOCITY_WIDGETS, donutArcs, type WidgetData } from "./data";
import { SHELL, SURFACE, TYPE, trendClass } from "./surfaces";
import TimerDots from "./TimerDots";

const RADIUS = 15.9155;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const RING = "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";
const CARD = "border border-[var(--color-border-Strokes-default)] rounded-xl shadow-elevation-1";

interface Kpi {
  label: string;
  value: string;
  trend?: string;
  isAlert?: boolean;
}

function KpiCard({ label, value, trend, isAlert }: Kpi) {
  return (
    <div
      className={`flex flex-col justify-center gap-1 rounded-xl p-4 border shadow-elevation-1 ${
        isAlert ? "border-[var(--color-status-red-border)]/40 bg-[var(--color-status-red-surface-subtle)]" : `border-[var(--color-border-Strokes-default)] ${SURFACE}`
      }`}
    >
      <span className={TYPE.label}>{label}</span>
      <div className="flex items-center justify-between">
        <span className={isAlert ? "text-h5 tabular-nums text-[var(--color-status-red-text-Medium)]" : TYPE.value}>{value}</span>
        {trend && <span className={`${TYPE.badge} ${trendClass(false)}`}>↑ {trend}</span>}
      </div>
    </div>
  );
}

/** Widget de donut. En móvil (<lg) queda en lo esencial: título, tendencia y donut; la leyenda por agente es solo desktop. */
function Widget({ data, title, className = "flex" }: { data: WidgetData; title: string; className?: string }) {
  const arcs = donutArcs(data.segments.map((s) => s.percent), CIRCUMFERENCE);
  return (
    <div className={`${SURFACE} ${CARD} p-3 ${className} flex-col justify-between h-full min-w-0`}>
      <div className="flex flex-col items-start gap-1">
        <h3 className={`${TYPE.heading} truncate max-w-full`}>{title}</h3>
        <span className={`${TYPE.badge} ${trendClass(data.trendDown)}`}>
          {data.trendDown ? "↓" : "↑"} {data.trend}
        </span>
      </div>

      <div className="flex items-center justify-center lg:justify-between gap-2 flex-1 mt-static-sm lg:mt-1">
        <div className="relative w-20 h-20 lg:w-18 lg:h-18 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" aria-hidden="true">
            <path d={RING} fill="none" stroke="var(--color-surface-BG-2)" strokeWidth="4" />
            {data.segments.map((seg, i) => {
              const { dash, offset: dashOffset } = arcs[i];
              return (
                <path
                  key={seg.name}
                  d={RING}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="4"
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center ${TYPE.num}`}>{data.value}</div>
        </div>

        <div className="hidden lg:flex flex-col gap-1 w-[55%] min-w-0">
          {data.segments.map((seg) => (
            <div key={seg.name} className="flex justify-between items-center gap-1 text-caption">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="truncate text-[var(--color-text-muted)]">{seg.name}</span>
              </div>
              <span className="font-medium tabular-nums text-[var(--color-text-primary)]">{seg.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * @description Dashboard "Velocidad y omnicanal" (mock de la UI): 6 widgets de donut + resumen de
 * KPIs que rota solo (temporizador CSS, ver `TimerDots`). Tipografía: escala `TYPE` de `surfaces`.
 * Desktop: rejilla 3×2 + columna de resumen a 600px de alto. Móvil: las 2 cifras de cabecera y los 4
 * estados del embudo, sin leyendas ni resumen.
 */
export default function SlideVelocity() {
  const t = useTranslations("goCrm.metricsDash.velocity");
  const [page, setPage] = useState(0);

  const pages: Kpi[][] = [
    [
      { label: t("kpiLeads"), value: "761" },
      { label: t("kpiWon"), value: "144" },
      { label: t("kpiChargebacks"), value: "0" },
    ],
    [
      { label: t("kpiPaymentError"), value: "132", trend: "4300%", isAlert: true },
      { label: t("kpiLeadChargeback"), value: "0" },
      { label: t("kpiChurn"), value: "25%" },
    ],
  ];

  return (
    <div className={`${SHELL} h-auto lg:h-[600px] p-static-md lg:p-static-xl`}>
      {/* ── CABECERA ── */}
      <div className="w-full flex flex-wrap justify-between items-end gap-static-md pb-static-md border-b border-[var(--color-border-Strokes-default)] mb-static-md">
        <div className="hidden lg:block">
          <h2 className={`${TYPE.title} mb-1`}>{t("title")}</h2>
          <span className={TYPE.subtitle}>{t("subtitle")}</span>
        </div>
        <div className="flex items-center gap-static-lg">
          {[
            [t("velocity"), "$48.95K/m"],
            [t("duration"), "5d 2h"],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 lg:items-end">
              <span className={TYPE.label}>{label}</span>
              <span className={TYPE.value}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CUERPO ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-static-lg lg:gap-static-xl min-h-0">
        <div className="w-full lg:w-[65%] grid grid-cols-2 lg:grid-cols-3 gap-static-sm lg:h-full">
          {VELOCITY_WIDGETS.map((w, i) => (
            // Móvil: solo los 4 estados del embudo; las llamadas se quedan en desktop
            <Widget key={w.key} data={w} title={t(w.key)} className={i < 4 ? "flex" : "hidden lg:flex"} />
          ))}
        </div>

        <div className="hidden lg:flex lg:w-[35%] flex-col lg:h-full bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] rounded-3xl p-static-md overflow-hidden relative">
          <div className="flex justify-between items-center mb-static-md">
            <h3 className={TYPE.heading}>{t("summary")}</h3>
            <TimerDots count={pages.length} active={page} onDone={() => setPage((p) => (p + 1) % pages.length)} color="var(--color-text-primary)" />
          </div>

          <div className="relative flex-1">
            {pages.map((kpis, i) => (
              <div
                key={i}
                aria-hidden={page !== i}
                className={`absolute inset-0 flex flex-col gap-3 transition-[opacity,translate] duration-700 ease-in-out ${
                  page === i ? "opacity-100 translate-x-0" : `opacity-0 pointer-events-none ${i === 0 ? "-translate-x-4" : "translate-x-4"}`
                }`}
              >
                {kpis.map((kpi) => (
                  <KpiCard key={kpi.label} {...kpi} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
