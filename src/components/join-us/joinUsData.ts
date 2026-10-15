/**
 * @description Datos de /join-us que no son texto: las 4 versiones de la página (`?role=`), el
 * formulario de GoHighLevel y la foto de cada una, y la retícula.
 * Los textos viven en `messages` (`joinUs.*`); un rol sin textos propios usa los de `agent-licensed`.
 *
 * Cada rol tiene su formulario propio en inglés y en español (el de GoHighLevel lleva ` - ESP` en
 * su nombre interno); `JoinForm` elige por el idioma activo.
 *
 * ⚠️ PENDIENTE — solo `agent-licensed` tiene textos propios; los demás roles usan los suyos. Cuando
 * llegue el copy de cada rol se rellena en `messages` y nada más.
 */

import type { JoinPathKey } from "@/components/join/joinData";

/** Retícula de la página: 4 columnas en móvil, 8 en tablet, 12 en desktop (la misma de /team). */
export const JOIN_GRID = "grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-[var(--space-fluid-xs)]";

export const DEFAULT_ROLE: JoinPathKey = "agent-licensed";
export const ROLES: JoinPathKey[] = ["agent-licensed", "agent-unlicensed", "agency-fmo", "agency-trademark"];

export interface FormEmbed {
  formId: string;
  /** Nombre interno del formulario en GoHighLevel (lo lee su script de embed, no se muestra). */
  formName: string;
}

/** Idiomas con formulario propio en GoHighLevel. */
export type FormLocale = "en" | "es";

/** El formulario de cada rol en cada idioma. Los ids los da GoHighLevel: no se inventan ni se derivan. */
export const FORMS: Record<JoinPathKey, Record<FormLocale, FormEmbed>> = {
  "agent-licensed": {
    en: { formId: "nQpPub6lsr5H4pIPp1tG", formName: "Website - Be an Epicare Agent" },
    es: { formId: "2TkTT3fC214aKx4zNAeH", formName: "Website - Be an Epicare Agent - ESP" },
  },
  "agent-unlicensed": {
    en: { formId: "hZW6rrsjvuTNq5rUKJlk", formName: "Website - Get agent license" },
    es: { formId: "IDbnvixQ1aUe1b2cXKbJ", formName: "Website - Get agent license - ESP" },
  },
  "agency-fmo": {
    en: { formId: "vkKPrcsUSPzIKDU82wkr", formName: "Website - FMO Partner" },
    es: { formId: "SU31hrMvyTCYp0qCLjmh", formName: "Website - FMO Partner - ESP" },
  },
  "agency-trademark": {
    en: { formId: "7apIAFW8GEHMZI2eiVfh", formName: "Website - Trademark Model" },
    es: { formId: "taiLowmUAybwI0YJ8FiG", formName: "Website - Trademark Model - ESP" },
  },
};

export const FORM_HOST = "https://link.epicareinsurance.com";

export type BenefitKey = "carriers" | "contracting" | "commissions" | "marketing" | "training";

export interface Benefit {
  key: BenefitKey;
  title: string;
  body: string;
}

/** Foto del díptico por rol (agente / agencia). 1376×768. ⚠️ JPEG: pendiente pasar a WebP (no hay cwebp en esta máquina). */
export const PHOTOS: Record<JoinPathKey, string> = {
  "agent-licensed": "/Files/for-who/agent-hero.webp",
  "agent-unlicensed": "/Files/for-who/agent-hero.webp",
  "agency-fmo": "/Files/for-who/agency-hero.webp",
  "agency-trademark": "/Files/for-who/agency-hero.webp",
};

/** Ancla del formulario (destino de los botones "Register"). */
export const JOIN_FORM_ID = "join-form";
