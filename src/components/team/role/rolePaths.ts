/**
 * @description Datos del Acto 03 de /team — "Your role": los 4 caminos oficiales para sumarse a
 * Epicare (brandbook V2.2 §13.2, textos resumidos), agrupados por cómo opera la persona.
 * Los textos viven en `messages` (`team.role`); aquí solo los tipos.
 */

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
}

