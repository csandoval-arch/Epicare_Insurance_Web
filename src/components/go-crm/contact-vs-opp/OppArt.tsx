import type { ReactNode } from "react";

/**
 * @description Ilustraciones holográficas de las 3 tarjetas de oportunidad (Dental · Health · Vida).
 * Son decorativas (`aria-hidden` en el contenedor). Las clases `.art-*` las animan:
 * - Desktop: `useContactVsOppMotion` (GSAP, incluido el `filter` del brillo).
 * - Móvil: keyframes CSS en `MobileContactVsOpp`, solo `transform`/`opacity` (Hardware Symphony).
 *   El brillo holográfico en móvil es `.art-glow`: una copia del trazo con el `drop-shadow` YA
 *   aplicado (estático) a la que solo se le anima la opacidad. En desktop queda a opacidad 0.
 */

const STROKE = "rgba(255,255,255,0.4)";
const GLOW_STYLE = { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))" };

const PulseRings = ({ className }: { className: string }) => (
  <>
    <div className={`${className} absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0`} />
    <div className={`${className} absolute w-28 h-28 rounded-full border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-0`} />
  </>
);

const Glow = () => <div className="absolute w-24 h-24 bg-white/10 blur-[20px] rounded-full" />;

/** Capa de brillo (solo móvil): el mismo dibujo en blanco pleno con su resplandor horneado. */
const GlowLayer = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className="art-glow absolute w-24 h-24 z-10 overflow-visible opacity-0" fill="none" style={GLOW_STYLE}>
    {children}
  </svg>
);

const TOOTH_PATH =
  "M12 5.5c-2.5-3.5-7-1.5-7 2.5 0 2.5 1 4.5 1.5 6.5l.5 5.5c.5 1.5 2.5 1.5 3 .5l1-3c.5-1.5 1.5-1.5 2 0l1 3c.5 1 2.5 1 3-.5l.5-5.5c.5-2 1.5-4 1.5-6.5 0-4-4.5-5.5-7-2.5z";
const SHIELD_PATH = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const LEAF_PATHS = [
  "M12 22 v-10", // tallo
  "M12 14 C8 14 6 10 6 7 C8 7 12 9 12 14 Z", // hoja izquierda
  "M12 18 C16 18 19 14 19 11 C17 11 12 13 12 18 Z", // hoja derecha
  "M12 12 C9 10 10 5 12 3 C14 5 15 10 12 12 Z", // hoja superior
];
const LINE = { strokeWidth: "0.8", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function DentalArt() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <Glow />
      <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
        <path className="art-tooth" d={TOOTH_PATH} stroke={STROKE} {...LINE} />
      </svg>
      <GlowLayer>
        <path d={TOOTH_PATH} stroke="white" {...LINE} />
      </GlowLayer>
      <PulseRings className="art-pulse-circle" />
      {/* Punto indicador pegado al trazo, arriba a la derecha */}
      <div
        className="art-node absolute w-2.5 h-2.5 bg-white/80 rounded-full z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{ top: "calc(27% + 3px)", right: "calc(34% + 1px)" }}
      />
    </div>
  );
}

function HealthArt() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <Glow />
      <PulseRings className="art-pulse-health" />
      <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
        {/* Escudo (la póliza) */}
        <path className="art-health-silhouette" d={SHIELD_PATH} stroke={STROKE} {...LINE} />
        {/* Cruz médica */}
        <path className="art-health-core" d="M13 9h-2v2H9v2h2v2h2v-2h2v-2h-2V9z" fill="rgba(255,255,255,1)" stroke="none" />
      </svg>
      <GlowLayer>
        <path d={SHIELD_PATH} stroke="white" {...LINE} />
      </GlowLayer>
    </div>
  );
}

function LifeArt() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <Glow />
      <PulseRings className="art-pulse-life" />
      <svg viewBox="0 0 24 24" className="w-24 h-24 relative z-10 overflow-visible" fill="none">
        <g className="art-plant">
          {LEAF_PATHS.map((d) => (
            <path key={d} d={d} stroke={STROKE} {...LINE} />
          ))}
        </g>
      </svg>
      <GlowLayer>
        {LEAF_PATHS.map((d) => (
          <path key={d} d={d} stroke="white" {...LINE} />
        ))}
      </GlowLayer>
      {/* Semilla: punto de energía en la raíz */}
      <div
        className="art-spore-root absolute w-static-sm h-static-sm bg-white rounded-full z-20"
        style={{ top: "81%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}

const ARTS = [DentalArt, HealthArt, LifeArt];

export default function OppArt({ index }: { index: number }) {
  const Art = ARTS[index];
  return Art ? <Art /> : null;
}
