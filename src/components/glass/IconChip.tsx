/**
 * @description IconChip — pastilla de icono del sistema de vidrio líquido (azul de marca al 14 %, icono azul).
 * - `size`: `sm` fija (32px) · `md` responsive (32px móvil → 48px desktop).
 * - `live`: dentro de un tile con `group/tile` (ver `LIGHT_TILE` en GlassLight), se enciende con el hover
 *   del tile en desktop: azul lleno e icono blanco.
 * Margen creativo: el 14 % de azul del relleno.
 */

import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

export type ChipIcon = ComponentType<IconProps>;

export function IconChip({ icon: I, size = "md", live = false }: { icon: ChipIcon; size?: "sm" | "md"; live?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 inline-flex items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--color-brand-blue)_14%,transparent)] text-[var(--color-text-accent-blue)] ${
        size === "sm" ? "w-static-xl h-static-xl" : "w-static-xl h-static-xl lg:w-static-2xl lg:h-static-2xl"
      }${live ? " transition-colors duration-300 ease-out lg:group-hover/tile:bg-[var(--color-brand-blue)] lg:group-hover/tile:text-[var(--color-text-White-100)]" : ""}`}
    >
      <I weight="regular" className={size === "sm" ? "w-static-md h-static-md" : "w-static-md h-static-md lg:w-static-lg lg:h-static-lg"} />
    </span>
  );
}

