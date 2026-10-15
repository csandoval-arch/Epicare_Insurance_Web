/**
 * @description Datos reales de contacto de Epicare Insurance Corp. (no se traducen).
 * Única fuente: los consumen el footer y las 4 versiones de `/join-us`. Si cambian aquí,
 * cambian en todas partes — no los repitas en `messages/*.json`.
 */
export const CONTACT = {
  address: ["6970 Bird Rd APT 308", "Miami, FL 33155-3779", "Estados Unidos"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=6970+Bird+Rd+APT+308+Miami+FL+33155-3779",
  email: "agents@epicareinsurance.com",
  phone: "+1 (888) 374-2467",
  tel: "+18883742467",
} as const;

/** La dirección en una línea, sin país: para fichas compactas (celdas de `/join-us`). */
export const CONTACT_ADDRESS_LINE = CONTACT.address.slice(0, 2).join(", ");
