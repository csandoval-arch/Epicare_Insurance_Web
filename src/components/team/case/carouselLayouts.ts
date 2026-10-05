/**
 * @description Física del carrusel del Acto 01 — "Abanico", como una mano de cartas: la ficha activa al
 * frente y en el centro; las que vienen se abren a la derecha y las que pasaron a la izquierda, sobre un
 * arco suave, más atrás y veladas. Dada la distancia `d` de una ficha a la activa (fraccionaria durante
 * el paso) devuelve su pose; el carrusel solo escribe transform/opacity con ella.
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
  scale: number;
  opacity: number;
  /** velo de profundidad 0–1 */
  shade: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function fanPose(d: number, w: number): Pose {
  const a = Math.abs(d);
  const c = Math.min(a, 2.4);
  return {
    x: Math.sign(d) * c * w * 0.34,
    y: c * c * 9,
    z: -a * 70,
    rotZ: Math.sign(d) * c * 7,
    scale: 1 - Math.min(a, 2) * 0.05,
    opacity: clamp((2.6 - a) / 0.5, 0, 1),
    shade: clamp(a * 0.16, 0, 0.4),
  };
}
