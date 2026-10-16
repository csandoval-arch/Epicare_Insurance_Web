"use client";

import Button from "@/components/ui/Button";
import { loginModalStore } from "@/lib/loginModalStore";
import { joinModalStore } from "@/lib/joinModalStore";

/**
 * @description CTA primario (el del Hero de GO CRM): azul de marca con flecha en burbuja y swap
 * diagonal al hover. Abre el modal de login (o el de alta con `intent="join"`). Envoltorio fino sobre
 * `ui/Button`: el aspecto vive allí. Se usa en los momentos grandes de la página (Hero, Métricas); el
 * resto de puntos de conversión usa `SecondaryCta`.
 */
export default function PrimaryCta({ label, className = "", onClick, intent = "login" }: { label: string; className?: string; /** Acción extra tras abrir el modal (p. ej. cerrar el menú móvil). */ onClick?: () => void; /** Qué modal abre: el de acceso (por defecto) o el de alta en /solutions. */ intent?: "login" | "join" }) {
  return (
    <Button
      label={label}
      layout="wide-mobile"
      className={className}
      onClick={() => {
        (intent === "join" ? joinModalStore : loginModalStore).open();
        onClick?.();
      }}
    />
  );
}
