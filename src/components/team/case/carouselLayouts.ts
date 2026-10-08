/**
 * @description Física del carrusel del Acto 01. Dada la distancia `d` de una ficha a la activa
 * (fraccionaria durante el paso) devuelve su pose; el carrusel solo escribe transform/opacity con ella.
 * La forma sale de `DeckConfig`; `FAN` es la elegida (baraja lineal). Con `arc`/`tilt` la misma física da
 * el antiguo abanico (una mano de cartas sobre un arco). Con `pastExit` las que pasaron no se abren a la izquierda: salen de escena
 * (mazo). `turn` gira las laterales sobre su eje vertical (coverflow).
 *
 * MARGEN CREATIVO declarado: separación, arco, giro y profundidad son física de composición.
 */

export interface Pose {
  /** px */
  x: number;
  y: number;
  z: number;
  /** grados */
  rotZ: number;
  rotY: number;
  scale: number;
  opacity: number;
  /** velo de profundidad 0–1 */
  shade: number;
}

export interface DeckConfig {
  /** Separación horizontal por paso, en fracción del ancho de la ficha. */
  spread: number;
  /** Caída del arco: px por paso² (0 = línea recta). */
  arc: number;
  /** Profundidad por paso (px hacia atrás). */
  depth: number;
  /** Inclinación en el plano por paso (grados, rotateZ). */
  tilt: number;
  /** Giro sobre el eje vertical de las laterales (grados, rotateY). */
  turn: number;
  /** Reducción de escala por paso, y pasos hasta los que sigue reduciendo. */
  scaleStep: number;
  scaleReach: number;
  /** Pasos hasta los que crece la pose (más allá, las fichas se amontonan). */
  reach: number;
  /** Distancia a la que una ficha deja de verse y tramo en el que se funde. */
  visible: number;
  fade: number;
  /** Velo de profundidad por paso y máximo. */
  shadeStep: number;
  shadeMax: number;
  /** Las que pasaron salen por la izquierda en vez de abrirse (mazo). */
  pastExit: boolean;
  /** Escenario: ancho de la ficha (rem) y perspectiva (px). */
  cardWidth: number;
  perspective: number;
  /** Ritmo: pausa en cada ficha y duración del paso (s). */
  hold: number;
  move: number;
}

/** Baraja lineal elegida por el usuario en el panel de debug (2026-10-08): fila recta, fichas casi
 *  contiguas y todas del mismo tamaño (sin escala ni profundidad: el usuario quitó el escalado de las
 *  laterales), solo la vecina inmediata a cada lado visible y velada. */
export const FAN: DeckConfig = {
  spread: 1.07,
  arc: 0,
  depth: 0,
  tilt: 0,
  turn: 0,
  scaleStep: 0,
  scaleReach: 3,
  reach: 3,
  visible: 2.1,
  fade: 0.4,
  shadeStep: 0.15,
  shadeMax: 0.2,
  pastExit: false,
  cardWidth: 22,
  perspective: 2000,
  hold: 2.6,
  move: 1.2,
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function deckPose(d: number, w: number, k: DeckConfig = FAN): Pose {
  const a = Math.abs(d);
  // Mazo: la que pasó sale de escena por la izquierda y se funde.
  if (k.pastExit && d < 0) {
    return { x: d * w * 1.1, y: 0, z: 0, rotZ: 0, rotY: 0, scale: 1, opacity: clamp(1 + d * 1.4, 0, 1), shade: 0 };
  }
  const c = Math.min(a, k.reach);
  const s = Math.sign(d);
  return {
    x: s * c * w * k.spread,
    y: c * c * k.arc,
    z: -a * k.depth,
    rotZ: s * c * k.tilt,
    rotY: -s * Math.min(a, 1) * k.turn,
    scale: 1 - Math.min(a, k.scaleReach) * k.scaleStep,
    opacity: clamp((k.visible - a) / k.fade, 0, 1),
    shade: clamp(a * k.shadeStep, 0, k.shadeMax),
  };
}
