/** Productos del hub, en el orden del track (GO CRM · GO AMS · GO Academy). */
export const HUB_PRODUCTS = ["crm", "ams", "academy"] as const;
export type HubProduct = (typeof HUB_PRODUCTS)[number];

/**
 * Tras qué palabra del titular va el glifo de cada producto (índice sobre el titular entero, desde 0).
 * Elegido por dirección en el panel de pruebas (06/10/2026) sobre "Vende más, / opera mejor / y sigue
 * aprendiendo." → tendencia tras «Vende», birrete tras «y» ("opera mejor" va sin glifo, 06/10/2026). El inglés ("Sell more, /
 * operate better / and keep learning.") tiene la misma estructura, así que los índices valen igual.
 */
export const MARK_SLOTS: Partial<Record<HubProduct, number>> = { crm: 0, academy: 4 };
