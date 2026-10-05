/**
 * @description Créditos del Acto 04 de /team: departamentos (la etiqueta sale de i18n,
 * `team.credits.departments`) y las personas de cada uno.
 *
 * ⚠️ PLACEHOLDER — los nombres son PROVISIONALES (elegidos por el usuario solo para ver el efecto).
 * Sustituir por el equipo real, con el consentimiento de cada persona, ANTES de publicar /team.
 * Mientras `CREDITS_ARE_PLACEHOLDER` sea true, la página no debe ir a producción.
 */

export const CREDITS_ARE_PLACEHOLDER = true;

export type CreditDept = "licensing" | "contracting" | "compliance" | "marketing" | "technology" | "support" | "training";

export const CREDITS: { dept: CreditDept; names: string[] }[] = [
  { dept: "licensing", names: ["Andrea Molina", "Daniel Ortiz"] },
  { dept: "contracting", names: ["Valeria Ruiz", "Marco Silva"] },
  { dept: "compliance", names: ["Laura Méndez"] },
  { dept: "marketing", names: ["Sofía Herrera", "Javier Castro"] },
  { dept: "technology", names: ["Diego Romero", "Camila Torres", "Nicolás Vega"] },
  { dept: "support", names: ["Paula Navarro", "Andrés Rivas"] },
  { dept: "training", names: ["Elena Suárez"] },
];
