/**
 * @description El elenco clay de /team: los assets (recortes WebP con alfa en `public/Files/Team/cast`)
 * y la composición del hero "The cast" en 3 profundidades.
 *
 * MARGEN CREATIVO declarado: las posiciones del elenco son coordenadas de composición (porcentajes
 * del escenario), no medidas del DS — es una foto de grupo, se compone a ojo como en un set.
 */

export interface CastAsset {
  src: string;
  /** Tamaño real del archivo (para reservar su proporción antes de cargar). */
  w: number;
  h: number;
}

const DIR = "/Files/Team/cast";

export const CAST = {
  agent: { src: `${DIR}/figure-agent.webp`, w: 356, h: 960 },
  compliance: { src: `${DIR}/figure-compliance.webp`, w: 393, h: 932 },
  contracting: { src: `${DIR}/figure-contracting.webp`, w: 384, h: 957 },
  licensing: { src: `${DIR}/figure-licensing.webp`, w: 424, h: 909 },
  quote: { src: `${DIR}/figure-quote.webp`, w: 417, h: 941 },
  standing: { src: `${DIR}/figure-woman-standing.webp`, w: 430, h: 984 },
  bustWoman: { src: `${DIR}/bust-woman.webp`, w: 774, h: 911 },
  bustMan: { src: `${DIR}/bust-man.webp`, w: 826, h: 919 },
} as const satisfies Record<string, CastAsset>;

export type Depth = "back" | "mid" | "front";

export interface CastSlot {
  asset: CastAsset;
  /** Borde izquierdo y base, en % del escenario; alto en % del alto del escenario. */
  left: number;
  bottom: number;
  height: number;
}

/**
 * Foto de elenco: atrás, tres figuras pequeñas; en medio, dos; delante, el agente (la figura azul,
 * el protagonista), tan cerca que el borde inferior lo recorta.
 */
export const HERO_CAST: Record<Depth, CastSlot[]> = {
  back: [
    // Detrás de la figura de Licensing, que le tapa los pies (la imagen trae una peana).
    { asset: CAST.standing, left: 12, bottom: 33, height: 38 },
    { asset: CAST.contracting, left: 37, bottom: 36, height: 36 },
    { asset: CAST.compliance, left: 70, bottom: 34, height: 38 },
  ],
  mid: [
    { asset: CAST.licensing, left: 10, bottom: 9, height: 55 },
    { asset: CAST.quote, left: 58, bottom: 7, height: 57 },
  ],
  front: [{ asset: CAST.agent, left: 33, bottom: -24, height: 96 }],
};

/** Orden de entrada y de profundidad (atrás → delante). */
export const DEPTHS: Depth[] = ["back", "mid", "front"];
