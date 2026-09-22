import OppArt from "./OppArt";

export interface OppCopy {
  label: string;
  desc: string;
}

interface OppCardProps {
  opp: OppCopy;
  index: number;
  /** Clase de animación: `a2-card` (desktop) o `m2-card` (móvil). */
  motionClass: string;
  className?: string;
  /**
   * Sin `backdrop-filter` ni halo desenfocado (Hardware Symphony): en móvil la tarjeta viaja dentro
   * de una pista animada y un blur de fondo se recalcularía en cada frame.
   */
  lite?: boolean;
}

/**
 * @description Tarjeta de cristal de una oportunidad (Dental · Health · Vida) con su ilustración
 * holográfica. La misma pieza en el grid de desktop y en el carrusel de móvil.
 */
export default function OppCard({ opp, index, motionClass, className = "", lite = false }: OppCardProps) {
  return (
    <div
      className={`${motionClass} group relative flex flex-col justify-start overflow-hidden rounded-t-xl rounded-b-[2rem] border border-white/20 shadow-elevation-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-elevation-5 hover:border-white/40 ${lite ? "bg-[var(--color-surface-BG-white)]/15" : "bg-[var(--color-surface-BG-white)]/8"}${className ? ` ${className}` : ""}`}
      style={{
        backdropFilter: lite ? undefined : "blur(24px)",
        aspectRatio: "3/4",
        maxHeight: "30rem",
        WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 rounded-t-xl rounded-b-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] pointer-events-none" />
      {!lite && (
        <div className="absolute -inset-20 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none" />
      )}

      {/* Texto arriba, para que el difuminado inferior no le quite legibilidad */}
      <div className="relative z-10 p-static-lg flex flex-col gap-static-lg">
        <div>
          <h3 className="opp-text text-h2 font-semibold text-[var(--color-text-White-100)] tracking-tight mb-static-xs">{opp.label}</h3>
          <p className="opp-text text-body-md text-white/80 leading-relaxed">{opp.desc}</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center mb-static-xl -translate-y-6" aria-hidden="true">
        <OppArt index={index} />
      </div>
    </div>
  );
}
