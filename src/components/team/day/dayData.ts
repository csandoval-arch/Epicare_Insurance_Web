/**
 * @description Acto C de /team — "Behind the scenes": tipos y aritmética del día del equipo.
 * Las tareas (hora, quién, qué) viven en `team.day.items` (i18n); la última es del agente.
 * ⚠️ PLACEHOLDER — las tareas y sus horas son provisionales hasta que el usuario pase el día real.
 */

import type { CrewKey } from "../crew/crewData";

export interface DayItem {
  /** "HH:MM", 24 h. */
  time: string;
  who: CrewKey | "agent";
  task: string;
}

/** El día que recorre el reloj (horas). */
export const DAY_START = 8;
export const DAY_END = 18;

/** "HH:MM" → hora decimal. */
export const toHours = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

/** Posición de una hora en la regla del día (0–1). */
export const dayFraction = (time: string) => (toHours(time) - DAY_START) / (DAY_END - DAY_START);

/** Hora decimal → "HH:MM", redondeada a `step` minutos (el reloj avanza de 5 en 5). */
export const formatClock = (hours: number, step = 5) => {
  const total = Math.round((hours * 60) / step) * step;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/** Índice de la última tarea cuya hora ("HH:MM") ya pasó. */
export const activeAt = (times: string[], hours: number) => {
  let idx = 0;
  times.forEach((time, i) => {
    if (toHours(time) <= hours + 1e-6) idx = i;
  });
  return idx;
};
