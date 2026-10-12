import type { JoinPathKey } from "@/components/join/joinData";

/** Lo que cada bloque de /join-us necesita saber del rol. */
export interface RoleProps {
  role: JoinPathKey;
  /** Namespace de los textos del rol (`joinUs.roles.<rol>`, o el de `agent-licensed` si aún no existe). */
  roleNs: `joinUs.roles.${string}`;
}
