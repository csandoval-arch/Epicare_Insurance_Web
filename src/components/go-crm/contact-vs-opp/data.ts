/**
 * @description Datos de demo de ContactVsOpportunity. Los contactos son ficticios y sirven de mock
 * de UI (nombres, correos, teléfonos y orígenes de CRM no se traducen). El copy traducible vive
 * en `messages/*.json` → `goCrm.contactVsOpp`.
 */

export const CONTACT_IMAGES = {
  auto: "/client_auto.jpg",
  family: "/client_family.jpg",
  blobs: "/Files/Go_CRM/blue_blobs_bg_light_v2.jpg",
} as const;

/** Orígenes permitidos en el chip de la ficha (decisión de producto: no añadir otros). */
export type ContactSource = "Google Ads" | "Salesforce" | "WhatsApp" | "Facebook" | "Eppigo";

export interface DemoContact {
  initials: string;
  name: string;
  email: string;
  phone: string;
  /** Origen del contacto (chip de la ficha). */
  source: ContactSource;
}

/** Ficha izquierda (y la de móvil): rota entre estos contactos. El primero es el de la foto. */
export const CONTACTS_LEFT: DemoContact[] = [
  { initials: "ER", name: "Elena Rojas", email: "e.rojas@email.com", phone: "+1 (555) 234-9812", source: "Salesforce" },
  { initials: "DO", name: "Daniel Ortiz", email: "d.ortiz@email.com", phone: "+1 (555) 610-4471", source: "WhatsApp" },
  { initials: "SM", name: "Sofia Mendez", email: "s.mendez@email.com", phone: "+1 (555) 382-1190", source: "Eppigo" },
];

/** Ficha derecha: rota entre estos contactos. El primero es el de la foto. */
export const CONTACTS_RIGHT: DemoContact[] = [
  { initials: "ML", name: "Maria Lopez", email: "m.lopez@family.com", phone: "+1 (555) 987-6543", source: "Salesforce" },
  { initials: "JC", name: "James Carter", email: "j.carter@email.com", phone: "+1 (555) 745-2208", source: "Facebook" },
  { initials: "AT", name: "Ana Torres", email: "a.torres@email.com", phone: "+1 (555) 519-3364", source: "Google Ads" },
];
