/**
 * @description Datos de "Conversaciones": las 3 features y la geometría de los 3 paneles de la
 * consola (réplica en `console/`), en píxeles del fotograma original (2222×1226).
 */

import type { ArtView } from "./console/ui";
import { CONTACT_SIZE } from "./console/ContactPanel";
import { THREAD_SIZE } from "./console/ThreadPanel";
import { ACTIVITY_SIZE } from "./console/ActivityPanel";

export const CARD_KEYS = [1, 2, 3] as const;

export interface ConvFeature {
  title: string;
  desc: string;
}

export interface PanelGeometry {
  w: number;
  h: number;
  /** Móvil: vista del slide (todas con la misma proporción, ver `MOBILE_RATIO`). */
  mobile: ArtView;
}

/**
 * Proporción alto/ancho de los slides móviles: la del hilo entero (su panel es casi cuadrado y es
 * el que más necesita verse completo). Los otros dos recortan su alto a esa misma proporción.
 */
const MOBILE_RATIO = THREAD_SIZE.h / THREAD_SIZE.w;
const mobileView = (w: number, y: number): ArtView => ({ x: 0, y, w, h: Math.round(w * MOBILE_RATIO) });

/** En el orden de las features: contacto (llamadas) · hilo (documentos) · actividad (automatización). */
export const PANELS: readonly PanelGeometry[] = [
  // Contacto: de la sección "Contact" al teléfono.
  { ...CONTACT_SIZE, mobile: mobileView(CONTACT_SIZE.w, 420) },
  // Hilo: entero (cabecera, mensajes y compositor).
  { ...THREAD_SIZE, mobile: mobileView(THREAD_SIZE.w, 0) },
  // Actividad: cabecera y eventos (donde entra la historia).
  { ...ACTIVITY_SIZE, mobile: mobileView(ACTIVITY_SIZE.w, 0) },
];
