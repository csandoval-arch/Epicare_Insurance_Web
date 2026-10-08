/**
 * @description Retrato clay de una persona del equipo — o del agente, el protagonista (blazer azul) —
 * en tarjeta cuadrada con cara cartoon y el fondo papel del propio render. Decorativo: el nombre
 * siempre se anuncia como texto al lado. `round` lo recorta en círculo (avatar de firma/lista); si no,
 * esquinas casi cuadradas (TASTE-LEDGER).
 */

import { asset } from "@/lib/asset";
import { AGENT_PORTRAIT, CREW, type CrewKey } from "./crewData";

export default function CrewPortrait({ who, round = false, className = "" }: { who: CrewKey | "agent"; round?: boolean; className?: string }) {
  const src = who === "agent" ? AGENT_PORTRAIT : CREW[who].portrait;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza
    <img
      src={asset(src)}
      alt=""
      aria-hidden="true"
      width={800}
      height={800}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`block aspect-square object-cover object-top select-none bg-[var(--color-surface-BG-2)] ${round ? "rounded-full" : "rounded-lg"} ${className}`}
    />
  );
}
