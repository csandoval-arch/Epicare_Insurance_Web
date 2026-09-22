"use client";

import { useTranslations } from "next-intl";
import { SHELL, SURFACE, SURFACE_MUTED } from "./surfaces";

const TIMES = ["09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM"];
const DATES = ["12", "13", "14", "15", "16"];
const TODAY = 2;
/** Jueves y viernes solo caben en desktop: en móvil la semana se recorta a lun-mié. */
const desktopOnly = (i: number) => (i > TODAY ? "hidden lg:flex" : "flex");

const EVENT = "absolute left-1.5 right-1.5 lg:left-2 lg:right-2 px-2 lg:px-3 py-1.5 rounded-xl flex flex-col justify-center overflow-hidden z-20 border [&>span]:shrink-0";
const EVENT_BLUE = `${EVENT} bg-[var(--color-status-blue-surface-subtle)] border-[var(--color-status-blue-border)]/40 text-[var(--color-status-blue-text-Medium)]`;

/**
 * @description Dashboard "Calendario" de la sección de métricas (mock estático de la UI).
 * Desktop: semana de 5 días a 600px de alto. Móvil: 3 días y alto natural, sin `scale()`.
 */
export default function SlideCalendar() {
  const t = useTranslations("goCrm.metricsDash.calendar");
  const days = t.raw("days") as string[];

  return (
    <div className={`${SHELL} h-auto lg:h-[600px]`}>
      {/* ── CABECERA ── */}
      <div className={`${SURFACE_MUTED} hidden lg:flex w-full px-8 pt-8 pb-6 border-b border-[var(--color-border-Strokes-default)] items-end justify-between`}>
        <div>
          <h3 className="text-display-xs text-[var(--color-text-primary)]">{t("title")}</h3>
          <p className="text-body-sm text-[var(--color-text-secondary)] mt-1">{t("subtitle")}</p>
        </div>
        <div className="hidden lg:flex items-center gap-2" aria-hidden="true">
          {["M15 19l-7-7 7-7", "M9 5l7 7-7 7"].map((d) => (
            <div key={d} className="w-8 h-8 rounded-full border border-[var(--color-border-Strokes-default)] flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── DÍAS ── */}
      <div className={`${SURFACE_MUTED} w-full flex border-b border-[var(--color-border-Strokes-default)]`}>
        <div className="w-14 lg:w-24 shrink-0" />
        <div className="flex-1 grid grid-cols-3 lg:grid-cols-5">
          {DATES.map((date, i) => (
            <div key={date} className={`${desktopOnly(i)} flex-col items-center justify-center py-4`}>
              <span className={`text-meta uppercase ${i === TODAY ? "text-[var(--color-brand-blue)]" : "text-[var(--color-text-muted)]"}`}>{days[i]}</span>
              <div
                className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center text-h5 ${
                  i === TODAY ? "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2" : "text-[var(--color-text-primary)]"
                }`}
              >
                {date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LÍNEA DE TIEMPO ── */}
      <div className="w-full h-104 lg:h-auto lg:flex-1 flex relative">
        <div className={`${SURFACE} w-14 lg:w-24 shrink-0 flex flex-col border-r border-[var(--color-border-Strokes-default)] relative z-20`}>
          {TIMES.map((time) => (
            <div key={time} className="flex-1 flex items-start justify-center pt-2">
              <span className="text-caption text-[var(--color-text-muted)] -mt-2 px-1 lg:px-2 whitespace-nowrap">{time}</span>
            </div>
          ))}
        </div>

        <div className={`${SURFACE} flex-1 relative overflow-hidden`}>
          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {TIMES.map((time) => (
              <div key={time} className="flex-1 w-full border-t border-[var(--color-border-Strokes-default)]" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-cols-3 lg:grid-cols-5 pointer-events-none">
            {DATES.map((date, i) => (
              <div key={date} className={`${i > TODAY ? "hidden lg:block" : ""} relative h-full border-r border-[var(--color-border-Strokes-default)] last:border-r-0`}>
                {i === TODAY && <div className="absolute inset-0 bg-[var(--color-status-blue-surface-subtle)]/40" />}
              </div>
            ))}
          </div>

          {/* EVENTOS */}
          <div className="absolute inset-0 grid grid-cols-3 lg:grid-cols-5">
            <div className="relative h-full row-start-1 col-start-1">
              <div className={`${EVENT_BLUE} top-[12.5%] h-[12.5%]`}>
                <span className="text-caption font-semibold truncate">{t("onboarding")}</span>
                <span className="text-caption opacity-70 truncate">10:00 AM</span>
              </div>
            </div>
            <div className="relative h-full row-start-1 col-start-2">
              <div className={`${EVENT} top-[50%] h-[12.5%] bg-[var(--color-surface-BG-2)] border-[var(--color-border-Strokes-default)] text-[var(--color-text-secondary)]`}>
                <span className="text-caption font-semibold truncate">{t("admin")}</span>
                <span className="text-caption opacity-70 truncate">01:00 PM</span>
              </div>
            </div>
            <div className="relative h-full row-start-1 col-start-3">
              <div className="absolute top-[31.25%] h-[25%] left-1.5 right-1.5 lg:left-2 lg:right-2 px-2 py-3 lg:px-4 bg-[var(--color-brand-blue)] rounded-2xl shadow-elevation-4 flex flex-col justify-center overflow-hidden z-40 text-[var(--color-text-White-100)] [&>*]:shrink-0">
                <div className="flex items-center gap-1.5 opacity-90 mb-1">
                  <span className="w-1.5 h-1.5 bg-[var(--color-surface-BG-white)] rounded-full animate-pulse" />
                  <span className="text-caption lg:text-meta whitespace-nowrap">11:30 AM</span>
                </div>
                <span className="text-body-sm font-semibold truncate">Sarah Jenkins</span>
                <span className="text-caption opacity-80 truncate">
                  {t("review")}
                  <span className="hidden lg:inline"> · Google Meet</span>
                </span>
              </div>
            </div>
            {/* Seguimiento: jueves en desktop; en móvil (sin jueves) cae en miércoles, bajo la cita activa */}
            <div className="relative h-full row-start-1 col-start-3 lg:col-start-4">
              <div className={`${EVENT_BLUE} top-[62.5%] h-[12.5%]`}>
                <span className="text-caption font-semibold truncate">{t("followUp")}</span>
                <span className="text-caption opacity-70 truncate">02:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
