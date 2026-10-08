"use client";

/**
 * @description Acto C (desktop con motion): un día del equipo que se cuenta solo — sin pin ni scrub.
 * Al entrar en pantalla el reloj corre de tarea en tarea (avanza de 5 en 5 minutos, escrito directo
 * en el DOM: cero renders por frame) y se detiene en cada una; al llegar a su hora cambia la escena:
 * la tarea nace de su máscara, el retrato de quien la hace sube como un telón dentro de su marco y la
 * firma le sigue. Debajo, la regla del día: la línea azul sigue al reloj y cada hito se enciende al
 * pasar. Tras el remate (18:00, el agente) el día vuelve a empezar. Pausado fuera de pantalla.
 * Los hitos son botones: clic (o teclado) lleva el reloj a esa hora y el día sigue solo desde ahí.
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL } from "@/lib/motion";
import CrewPortrait from "../crew/CrewPortrait";
import { DAY_END, DAY_START, activeAt, dayFraction, formatClock, toHours, type DayItem } from "./dayData";

const PLAYING = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
/** Segundos que se queda cada escena antes de que el reloj siga (margen creativo: el mismo respiro
 *  que la pausa del carrusel de "The case"). */
const SCENE_HOLD = 1.6;
/** Segundos que se sostiene el remate (18:00) antes de volver a empezar el día. Margen creativo. */
const END_HOLD = 3;

/** Entra al montarse (el padre lo remonta con `key` en cada cambio de escena). */
function Enter({ from, children, className = "" }: { from: gsap.TweenVars; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const tween = gsap.fromTo(ref.current, from, { yPercent: 0, y: 0, opacity: 1, duration: DUR.base, ease: EASE.dramatic, force3D: true });
    return () => {
      tween.kill();
    };
  }, [from]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const TASK_FROM = { yPercent: REVEAL.birthPercent };
const CURTAIN_FROM = { yPercent: 100 };
const SIGN_FROM = { y: REVEAL.sm, opacity: 0 };

export default function DayStage({ items, names }: { items: DayItem[]; names: (who: DayItem["who"]) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const dayRef = useRef<gsap.core.Timeline | null>(null);
  const [idx, setIdx] = useState(0);
  const item = items[idx];
  // La animación depende solo de las horas (iguales en los dos idiomas): cambiar de idioma no la recrea.
  const timesKey = items.map((it) => it.time).join(",");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const times = timesKey.split(",");
    const mm = gsap.matchMedia(el);
    mm.add(PLAYING, () => {
      // Un solo valor (la hora) mueve el reloj, la línea y la escena.
      const progress = el.querySelector(".dy-progress");
      const state = { h: DAY_START };
      const render = () => {
        gsap.set(progress, { scaleX: (state.h - DAY_START) / (DAY_END - DAY_START) });
        if (clockRef.current) clockRef.current.textContent = formatClock(state.h);
        const next = activeAt(times, state.h);
        setIdx((prev) => (prev === next ? prev : next));
      };
      const day = gsap.timeline({ paused: true, repeat: -1, repeatDelay: END_HOLD, onUpdate: render });
      // El reloj corre hasta la hora de cada tarea y se detiene en su escena (etiqueta `s<i>` = llegada).
      day.addLabel("s0", 0);
      times.slice(1).forEach((time, i) => day.to(state, { h: toHours(time), duration: DUR.cinematic, ease: EASE.inOut }, `+=${SCENE_HOLD}`).addLabel(`s${i + 1}`));
      dayRef.current = day;
      render();
      // Corre solo mientras la sección está en pantalla.
      ScrollTrigger.create({ trigger: el, start: "top 75%", end: "bottom 25%", onToggle: (self) => (self.isActive ? day.play() : day.pause()) });
    });
    return () => {
      mm.revert();
      dayRef.current = null;
    };
  }, [timesKey]);

  /** Clic en un hito: el reloj corre rápido (adelante o atrás) hasta esa hora y el día sigue solo desde ahí. */
  const jumpTo = (i: number) => {
    const day = dayRef.current;
    if (!day) return;
    day.tweenTo(`s${i}`, { duration: DUR.base, ease: EASE.inOut, onComplete: () => void day.play() });
  };

  return (
    <div ref={ref} className="dy-stage w-full py-section-md">
      <div className="w-full max-w-section-xl mx-auto px-gutter-md flex flex-col gap-[var(--space-section-xs)]">
        {/* La escena es decorativa: el contenido lo leen los lectores de pantalla en `DayList` */}
        <div className="grid-layout items-end" aria-hidden="true">
          {/* ── EL RELOJ + LA ESCENA ── */}
          <div className="col-span-7 flex flex-col gap-static-lg">
            <p ref={clockRef} className="text-display-3xl tabular-nums text-[var(--color-text-primary)]">
              {formatClock(DAY_START)}
            </p>
            <div className="overflow-hidden pb-static-xs min-h-[2lh] text-display-sm">
              <Enter key={idx} from={TASK_FROM}>
                <p>{item.task}</p>
              </Enter>
            </div>
            <Enter key={`s${idx}`} from={SIGN_FROM} className="flex items-center gap-static-sm">
              <span aria-hidden="true" className="h-px w-static-xl bg-[var(--color-brand-blue)]" />
              <span className="text-meta text-[var(--color-text-secondary)]">{names(item.who)}</span>
            </Enter>
          </div>

          {/* ── QUIEN LO HACE: telón dentro del marco ── */}
          <div className="col-start-9 col-span-4 overflow-hidden rounded-lg bg-[var(--color-surface-BG-2)] aspect-square">
            <Enter key={`p${idx}`} from={CURTAIN_FROM} className="h-full">
              <CrewPortrait who={item.who} className="w-full h-full" />
            </Enter>
          </div>
        </div>

        {/* ── LA REGLA DEL DÍA ── */}
        <div className="relative pt-static-lg">
          <div className="relative h-px bg-[var(--color-border-Strokes-default)]">
            <span className="dy-progress absolute inset-0 origin-left bg-[var(--color-brand-blue)]" />
          </div>
          {items.map((it, i) => (
            // Hito clicable: el padding agranda el área de clic; -mt-static-sm lo compensa para que el punto siga sobre la línea.
            <button
              key={it.time}
              type="button"
              aria-label={`${it.time} — ${it.task}`}
              aria-current={i === idx ? "step" : undefined}
              onClick={() => jumpTo(i)}
              className="group/pt absolute top-static-lg -mt-static-sm -translate-x-1/2 px-static-sm pt-static-sm pb-static-xs flex flex-col items-center gap-static-sm cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
              style={{ left: `${dayFraction(it.time) * 100}%` }}
            >
              {/* -mt-1 = medio punto: el centro del punto cae sobre la línea */}
              <span
                className={`block w-2 h-2 -mt-1 rounded-full border transition-[background-color,border-color,scale] duration-200 ease-out group-hover/pt:scale-150 ${
                  i <= idx ? "bg-[var(--color-brand-blue)] border-[var(--color-brand-blue)] scale-125" : "bg-[var(--color-hero-ivory)] border-[var(--color-border-Strokes-strong)] group-hover/pt:border-[var(--color-brand-blue)]"
                }`}
              />
              <span
                className={`text-meta transition-colors duration-200 ${
                  i === idx ? "text-[var(--color-text-accent-blue)]" : i < idx ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] group-hover/pt:text-[var(--color-text-primary)]"
                }`}
              >
                {it.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
