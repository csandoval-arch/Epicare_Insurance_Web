/**
 * @description Contenido del modal de login (Link Hub). Textos en `messages` (`login.*` y las descripciones
 * de producto que ya existen en `landingV2`); aquí la forma y los destinos.
 * - PLATFORMS: las plataformas Epicare (tiles principales).
 * - LINK_GROUPS: enlaces secundarios (más pequeños), en dos grupos.
 * ⚠️ DESTINOS PENDIENTES: `href` null = aún no navega. Cuando estén, se rellenan aquí y nada más.
 */

// Academy aún no tiene sección: en móvil se muestra como "próximamente" (LoginModal), no como plataforma
export type PlatformId = "crm" | "ams" | "eppigo";

export interface Platform {
  id: PlatformId;
  /** Nombre visible junto al logo (CRM y AMS ya lo llevan en el wordmark). */
  name: string | null;
  /** Clave de la descripción en `messages`. */
  descKey: string;
  href: string | null;
}

export const PLATFORMS: Platform[] = [
  { id: "crm", name: null, descKey: "landingV2.bento.card1Desc", href: null },
  { id: "ams", name: null, descKey: "landingV2.bento.card4Desc", href: null },
  { id: "eppigo", name: "Eppigo", descKey: "landingV2.spotlight.eppigo.desc", href: null },
];

export interface SecondaryLink {
  /** Nombre propio (no se traduce)… */
  label?: string;
  /** …o clave en `login.links`. */
  key?: string;
  href: string | null;
}

export const LINK_GROUPS: { key: "enrollment" | "carriers"; links: SecondaryLink[] }[] = [
  {
    key: "enrollment",
    links: [
      { label: "Sunfire (MAPD)", href: null },
      { label: "Health Sherpa (ACA)", href: null },
    ],
  },
  {
    key: "carriers",
    links: [
      { key: "medicare", href: null },
      { key: "supplementals", href: null },
      { key: "aca", href: null },
    ],
  },
];
