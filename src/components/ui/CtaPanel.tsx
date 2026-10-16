import type { ReactNode } from "react";
import Button from "@/components/ui/Button";

/**
 * @file CtaPanel.tsx
 * @description Fuente única del panel azul de los banners finales (landing, /licensing, /solutions,
 * /go-ams, /go-crm) y de sus botones. Cada sección pone su geometría (radio, ancho, padding) y su
 * entrada GSAP; el fondo y los botones viven solo aquí.
 */

/** Lado de la tesela del grano: se repite, así el SVG se rasteriza una vez en vez de estirarse. */
const NOISE_TILE = "12.5rem";

/**
 * Monolito del banner: azul de marca plano + grano (`bg-noise`, sin imagen ni blend-mode).
 * `className` aporta el radio y el selector que usa la entrada GSAP de cada sección.
 */
export function CtaPanel({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`relative w-full overflow-hidden shadow-elevation-4 border border-white/10 ${className}`}>
      <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--color-brand-blue)]" aria-hidden="true">
        <div className="bg-noise absolute inset-0 opacity-60" style={{ backgroundSize: NOISE_TILE }} />
      </div>
      {children}
    </div>
  );
}

/**
 * Botón sobre el panel azul. El primario azul se perdería en el fondo: el principal usa la superficie
 * clara del DS (`glass-light`) y el secundario el cristal con borde (`glass-dark`). Móvil: `sm` (44px)
 * compacto; desde md recupera las medidas del `md` (48px).
 */
export function CtaPanelButton({
  label,
  kind = "primary",
  href,
  onClick,
  className = "",
}: {
  label: string;
  kind?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      label={label}
      href={href}
      onClick={onClick}
      variant={kind === "primary" ? "glass-light" : "glass-dark"}
      size="sm"
      layout="auto"
      className={`md:h-static-2xl md:pl-static-lg md:pr-static-sm${className ? ` ${className}` : ""}`}
    />
  );
}
