/**
 * @description Paginador de los carruseles automáticos de los dashboards: un punto por página y,
 * en la activa, una barra que se vacía durante `ROTATE_MS`. La barra es el propio temporizador: un
 * keyframe CSS de `scaleX` (compositor) que al terminar avisa con `onAnimationEnd`. Sin
 * `setInterval`: cuando la sección sale de pantalla, `.is-offscreen` pausa el keyframe y con él la
 * rotación. Con movimiento reducido no hay keyframe y la página no rota.
 */

import { ROTATE_MS } from "./data";

interface TimerDotsProps {
  count: number;
  active: number;
  onDone: () => void;
  /** Color del activo (token CSS). */
  color: string;
}

export default function TimerDots({ count, active, onDone, color }: TimerDotsProps) {
  return (
    <div className="flex gap-2" aria-hidden="true">
      {Array.from({ length: count }, (_, i) =>
        i === active ? (
          <div key={i} className="relative w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}>
            <div
              key={active}
              onAnimationEnd={onDone}
              className="md-timer absolute inset-0 rounded-full origin-left"
              style={{ backgroundColor: color, animationDuration: `${ROTATE_MS}ms` }}
            />
          </div>
        ) : (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-border-Strokes-strong)]" />
        )
      )}
    </div>
  );
}
