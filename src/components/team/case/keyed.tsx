import type { ReactNode } from "react";

/**
 * @description Jerarquía de peso dentro de una frase display: el texto va en peso ligero (lo pone el
 * contenedor con `font-light`) y lo marcado con `<k>…</k>` en el diccionario recupera el peso del
 * token. Margen creativo: `font-light` sobre display (pedido del usuario, igual que en "Bilingual").
 */
export function keyed(line: string): ReactNode {
  return line.split(/(<k>.*?<\/k>)/g).map((part, i) =>
    part.startsWith("<k>") ? (
      <span key={i} className="font-semibold">
        {part.slice(3, -4)}
      </span>
    ) : (
      part
    )
  );
}
