/**
 * @description Datos de /join-us que no son texto: las 4 versiones de la página (`?role=`), el
 * formulario de GoHighLevel y la foto de cada una, y la retícula.
 * Los textos viven en `messages` (`joinUs.*`); un rol sin textos propios usa los de `agent-licensed`.
 *
 * ⚠️ PENDIENTE — las 4 versiones apuntan al MISMO formulario (`nQpPub6lsr5H4pIPp1tG`) y solo
 * `agent-licensed` tiene textos propios. Cuando lleguen los formularios y el copy de cada rol, se
 * rellenan aquí y en `messages` y nada más.
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

const AGENT_FORM: FormEmbed = { formId: "nQpPub6lsr5H4pIPp1tG", formName: "Website - Be an Epicare Agent" };
const UNLICENSED_FORM: FormEmbed = { formId: "hZW6rrsjvuTNq5rUKJlk", formName: "Website - Get agent license" };
const FMO_FORM: FormEmbed = { formId: "vkKPrcsUSPzIKDU82wkr", formName: "Website - FMO Partner" };
const TRADEMARK_FORM: FormEmbed = { formId: "7apIAFW8GEHMZI2eiVfh", formName: "Website - Trademark Model" };

export const FORMS: Record<JoinPathKey, FormEmbed> = {
  "agent-licensed": AGENT_FORM,
  "agent-unlicensed": UNLICENSED_FORM,
  "agency-fmo": FMO_FORM,
  "agency-trademark": TRADEMARK_FORM,
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
  "agent-licensed": "/Files/for-who/agent-hero.jpeg",
  "agent-unlicensed": "/Files/for-who/agent-hero.jpeg",
  "agency-fmo": "/Files/for-who/agency-hero.jpeg",
  "agency-trademark": "/Files/for-who/agency-hero.jpeg",
};

/** Ancla del formulario (destino de los botones "Register"). */
export const JOIN_FORM_ID = "join-form";
