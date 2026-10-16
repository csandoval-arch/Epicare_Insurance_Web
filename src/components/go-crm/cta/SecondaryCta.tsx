"use client";

import Button from "@/components/ui/Button";
import { loginModalStore } from "@/lib/loginModalStore";

interface SecondaryCtaProps {
  label: string;
  /**
   * - `dark` (por defecto): sobre fondos oscuros/imagen. Cristal blanco translúcido.
   * - `light`: sobre las superficies claras del DS (bimodal). Con borde y burbuja azul.
   */
  tone?: "dark" | "light";
  /** Sin `backdrop-filter` (Hardware Symphony): para capas que se escalan en móvil. Solo `dark`. */
  lite?: boolean;
  /** Acción propia (p. ej. scroll a una sección). Sin ella, abre el modal de login. */
  onClick?: () => void;
  className?: string;
}

/**
 * @description CTA secundario (el mismo del header, "Más de Epicare"): rectángulo de 10px con borde y
 * flecha en burbuja con swap diagonal al hover. Abre el modal de login, igual que `PrimaryCta`.
 * Envoltorio fino sobre `ui/Button` (tamaño `sm`, 44px): el aspecto vive allí.
 */
export default function SecondaryCta({ label, tone = "dark", lite = false, onClick, className = "" }: SecondaryCtaProps) {
  return (
    <Button
      label={label}
      size="sm"
      variant={tone === "dark" ? "glass-dark" : "glass-light"}
      lite={lite}
      onClick={onClick ?? (() => loginModalStore.open())}
      className={`pointer-events-auto${className ? ` ${className}` : ""}`}
    />
  );
}
