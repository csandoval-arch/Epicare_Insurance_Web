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
  /**
   * Móvil: recorte apaisado de la parte que importa (teléfono · tarjeta enviada · actividad);
   * el panel entero mediría ~800 px de alto a 390.
   */
  mobile: ArtView;
}

/** En el orden de las features: contacto (llamadas) · hilo (documentos) · actividad (automatización). */
export const PANELS: readonly PanelGeometry[] = [
  { ...CONTACT_SIZE, mobile: { x: 0, y: 521, w: CONTACT_SIZE.w, h: 527 } },
  { ...THREAD_SIZE, mobile: { x: 0, y: 153, w: THREAD_SIZE.w, h: 490 } },
  { ...ACTIVITY_SIZE, mobile: { x: 0, y: 0, w: ACTIVITY_SIZE.w, h: 490 } },
];
