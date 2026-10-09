/**
 * @description Estructura de filtros del modal "Join Epicare". Los textos viven en `messages` (`join.*`);
 * aquí solo la forma del árbol y los destinos.
 *
 *   agent  → agent-licensed · agent-unlicensed
 *   agency → agency-fmo     · agency-trademark
 * (Una sola vista: desktop muestra las dos ramas; móvil elige la rama con un selector.)
 *
 * Los 4 resultados llevarán a la MISMA página de formulario en 4 versiones (info y formulario
 * ligeramente distintos).
 * ⚠️ DESTINOS PENDIENTES: `href` null = el botón aún no navega. Cuando estén, se rellenan aquí y nada más.
 */

import type { JoinBranch } from "@/lib/joinModalStore";

export type JoinPathKey = "agent-licensed" | "agent-unlicensed" | "agency-fmo" | "agency-trademark";

export interface JoinPath {
  key: JoinPathKey;
  /** Destino del "More Info" (la página de formulario con su versión). null = pendiente. */
  href: string | null;
}

/** El primer filtro: las dos ramas (en desktop se ven a la vez; en móvil, con un selector). */
export const JOIN_BRANCHES: { key: JoinBranch }[] = [{ key: "agent" }, { key: "agency" }];

export const JOIN_PATHS: Record<JoinBranch, JoinPath[]> = {
  agent: [
    { key: "agent-licensed", href: null },
    { key: "agent-unlicensed", href: null },
  ],
  agency: [
    { key: "agency-fmo", href: null },
    { key: "agency-trademark", href: null },
  ],
};
