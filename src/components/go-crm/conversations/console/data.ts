/**
 * @description Datos de muestra de la réplica de la consola. FICTICIOS (decisión del usuario,
 * 2026-10-01): sustituyen al contacto real que aparecía en la captura. Mismo formato y longitud
 * para que la composición sea idéntica. Teléfonos en el rango 555-01xx, reservado para ficción.
 * Son datos, no interfaz: no se traducen (regla DATA-MOCK-UI). Las etiquetas de la UI sí, en
 * `goCrm.conversations.ui`.
 */

/** Agente propietario del contacto (el de la tarjeta de presentación, empleado de Epicare). */
export const AGENT = "Felipe Palacios";

export const CONTACT = {
  initials: "ML",
  first: "Mariano",
  last: "Lozano - SMS",
  thread: "Mariano Lozano - SMS",
  email: "mariano.lozano@email.com",
  phone: "(305) 555-0147",
  source: "Leadform facebook",
  index: "3/60911",
} as const;

export const TAG_ROWS: readonly (readonly string[])[] = [
  ["plan dental", "self-enrollment"],
  ["leadform", "cd080425", "ai called"],
  ["follow up 1"],
];
export const TAG_COUNT = 8;

/** Número de la agencia (el de la tarjeta de presentación) y el del contacto ficticio. */
export const NUMBERS = { from: "+13214968931", to: "+13055550147" } as const;

export const MESSAGES = {
  stop: "Responde STOP si quieres dejar de recibir mensajes",
  card: ["Acá te comparto mi tarjeta de presentación para que cuentes con toda", "mi información de contacto."],
  confirm: "Me podrías confirmar tu nombre?",
  times: ["02:38 PM", "02:39 PM", "02:39 PM"],
} as const;

export const ACTIVITY = {
  source: "Paid Social",
  campaign: "Leads | Dental | Prospect | Cd080425",
  formName: "Facebook Lead Form",
} as const;

/**
 * La historia animada (`useConsoleStory`): el agente escribe y envía el contrato; la actividad
 * registra el envío y el contacto gana una etiqueta. Datos de muestra, no se traducen.
 */
export const STORY = {
  typed: "Te envío el contrato para que lo firmes.",
  file: "Contrato_Dental.pdf",
  time: "02:40 PM",
  tag: "contract sent",
  reply: "¡Listo! Ya lo firmé.",
  signedFile: "Contrato_firmado.pdf",
  replyTime: "02:43 PM",
  signedTag: "signed",
} as const;

/** Tarjeta de presentación del agente: recorte del fotograma (es una foto, no se rehace en código). */
export const BUSINESS_CARD = "/Files/Go_CRM/Contact_Conversations/business_card.webp";
