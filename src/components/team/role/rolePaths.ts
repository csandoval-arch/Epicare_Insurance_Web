/**
 * @description Datos del Acto 03 de /team — "Your role": los 4 caminos oficiales para sumarse a
 * Epicare (brandbook V2.2 §13.2), agrupados por cómo opera la persona, y la figura clay del equipo
 * que acompaña cada camino. Los textos viven en `messages` (`team.role`); aquí solo tipos y assets.
 */

import { CAST, type CastAsset } from "../cast";

export type RoleGroupKey = "agent" | "agency";

export interface RoleGroup {
  key: RoleGroupKey;
  kicker: string;
  sub: string;
}

export interface RolePath {
  key: string;
  group: RoleGroupKey;
  n: string;
  tag: string;
  title: string;
  body: string;
  guide: string;
}

/** Quién te acompaña en cada camino (figura del elenco del hero). */
export const PATH_GUIDE: Record<string, CastAsset> = {
  licensed: CAST.contracting,
  "get-licensed": CAST.licensing,
  agency: CAST.quote,
  "sub-agency": CAST.compliance,
};
