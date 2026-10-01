/**
 * @description Datos de "Conversaciones": el fotograma fijo de la consola y el mapa de sus 3
 * paneles reales (contacto · hilo · actividad), medidos sobre la imagen en píxeles y pasados a
 * fracciones (0–1) de su ancho/alto.
 */

/** Fotograma de la consola de GO CRM (2222×1226, WebP 104 KB). Un solo archivo, un solo decode. */
export const STILL = "/Files/Go_CRM/Contact_Conversations/conversation_still.webp";
export const STILL_ASPECT = 2222 / 1226;

export const CARD_KEYS = [1, 2, 3] as const;

export interface ConvFeature {
  title: string;
  desc: string;
}

/** Rectángulo de un panel de la UI, en fracciones del fotograma. */
export interface ZoneRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Los 3 paneles, en el orden de las features: ficha del contacto (llamadas) · hilo (documentos) ·
 * actividad + raíl (automatización). Desktop usa el panel entero.
 */
export const PANEL_RECTS: readonly ZoneRect[] = [
  { left: 0.01, top: 0.125, width: 0.215, height: 0.858 },
  { left: 0.234, top: 0.125, width: 0.4885, height: 0.858 },
  { left: 0.731, top: 0.125, width: 0.264, height: 0.858 },
];

/**
 * Móvil: recorte más apaisado de la parte que importa de cada panel (teléfono · tarjeta enviada ·
 * actividad); el panel entero mediría ~800 px de alto a 390.
 */
export const PANEL_RECTS_MOBILE: readonly ZoneRect[] = [
  { left: 0.01, top: 0.55, width: 0.215, height: 0.43 },
  { left: 0.234, top: 0.25, width: 0.4885, height: 0.4 },
  { left: 0.731, top: 0.125, width: 0.264, height: 0.4 },
];
