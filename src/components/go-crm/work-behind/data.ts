/**
 * @description Pantallazos (vídeos de la UI de GO CRM) de los 3 pasos de "El trabajo detrás de una
 * venta", en el mismo orden que `goCrm.workBehind.steps`. El copy vive en `messages/*.json`.
 * Rutas sin codificar: `asset()` las prefija y el navegador codifica los espacios.
 */
const DIR = "/Files/Go_CRM/THE WORK BEHIND A SALE";

export const STEP_VIDEOS = [
  `${DIR}/Catch_Opportunity.mp4`,
  `${DIR}/Tasks and notes.mp4`,
  `${DIR}/Appointments.mp4`,
] as const;

export interface StepCopy {
  title: string;
  desc: string;
}

export const stepNumber = (i: number) => String(i + 1).padStart(2, "0");
