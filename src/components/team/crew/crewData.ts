/**
 * @description El equipo de /team como datos: cada persona con su retrato clay (las tarjetas cuadradas
 * de `public/Files/Team/cards`, caras cartoon), su departamento (la etiqueta sale de
 * `team.departments`) y los idiomas que habla. Lo consumen los actos C y F (Day,
 * Traits); el texto de cada acto vive en `messages` y referencia a la persona por `key`.
 *
 * ⚠️ PLACEHOLDER — nombres, idiomas y asignaciones son PROVISIONALES (los mismos que tenían los créditos). Sustituir por el equipo real, con su consentimiento, ANTES de publicar.
 */

export const CREW_IS_PLACEHOLDER = true;

/** Departamento de cada persona (la etiqueta sale de `team.departments`). */
export type CrewDept = "licensing" | "contracting" | "marketing" | "technology" | "compliance";

export type CrewKey = "licensing" | "contracting" | "marketing" | "technology" | "compliance";

export interface CrewMember {
  key: CrewKey;
  name: string;
  dept: CrewDept;
  /** Retrato 800×800 WebP. */
  portrait: string;
  languages: ("EN" | "ES")[];
}

const DIR = "/Files/Team/cards";

export const CREW: Record<CrewKey, CrewMember> = {
  licensing: { key: "licensing", name: "Andrea Molina", dept: "licensing", portrait: `${DIR}/card-licensing.webp`, languages: ["EN", "ES"] },
  contracting: { key: "contracting", name: "Marco Silva", dept: "contracting", portrait: `${DIR}/card-contracting.webp`, languages: ["EN", "ES"] },
  marketing: { key: "marketing", name: "Sofía Herrera", dept: "marketing", portrait: `${DIR}/card-lead.webp`, languages: ["EN", "ES"] },
  technology: { key: "technology", name: "Diego Romero", dept: "technology", portrait: `${DIR}/card-quote.webp`, languages: ["EN", "ES"] },
  compliance: { key: "compliance", name: "Laura Méndez", dept: "compliance", portrait: `${DIR}/card-compliance.webp`, languages: ["EN", "ES"] },
};

/** El agente (el protagonista, blazer azul): no es del equipo, pero cierra el día y firma el remate. */
export const AGENT_PORTRAIT = `${DIR}/card-close.webp`;

export const CREW_ORDER: CrewKey[] = ["licensing", "contracting", "marketing", "technology", "compliance"];
