/**
 * @description Datos del Acto 01 "The case": las 6 etapas de un caso y la tarjeta (retrato clay en
 * primer plano, cara cartoon) de quien resuelve cada una. El texto (frente, nombre, frase) vive en
 * `team.case.stages` (i18n); aquí solo la imagen.
 */

export interface CaseStage {
  key: string;
  front: string;
  name: string;
  line: string;
}

export interface StageCard {
  src: string;
  /** La tarjeta del agente (el protagonista, blazer azul). */
  hero?: boolean;
}

const DIR = "/Files/Team/cards";

/** Tarjeta por etapa (mismo orden que `team.case.stages`). 800×800 WebP. */
export const STAGE_CARDS: Record<string, StageCard> = {
  licensing: { src: `${DIR}/card-licensing.webp` },
  contracting: { src: `${DIR}/card-contracting.webp` },
  lead: { src: `${DIR}/card-lead.webp` },
  quote: { src: `${DIR}/card-quote.webp` },
  close: { src: `${DIR}/card-close.webp`, hero: true },
  compliance: { src: `${DIR}/card-compliance.webp` },
};

/** La etapa del protagonista. */
export const AGENT_STAGE = "close";
