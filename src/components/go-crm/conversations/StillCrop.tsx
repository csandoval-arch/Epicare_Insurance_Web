/**
 * @description Ventana sobre un rectángulo del fotograma fijo de la consola (`STILL`). El marco toma
 * la proporción del recorte y la imagen se escala/desplaza para que solo se vea ese rectángulo.
 * Todas las ventanas comparten el mismo archivo: un solo decode.
 */

import { asset } from "@/lib/asset";
import { STILL, STILL_ASPECT, type ZoneRect } from "./convData";

interface Props {
  rect: ZoneRect;
  className?: string;
}

export default function StillCrop({ rect, className = "" }: Props) {
  const aspect = (rect.width / rect.height) * STILL_ASPECT;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
      <img
        src={asset(STILL)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute max-w-none h-auto"
        style={{ width: `${100 / rect.width}%`, left: `${(-rect.left / rect.width) * 100}%`, top: `${(-rect.top / rect.height) * 100}%` }}
      />
    </div>
  );
}
