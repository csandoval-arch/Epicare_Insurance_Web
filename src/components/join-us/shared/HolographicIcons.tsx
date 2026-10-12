"use client";

/**
 * @file HolographicIcons.tsx
 * @description Iconografía abstracta diegética (Holographic Tech Visuals) para /join-us.
 * Diseñada según `.agents/skills/holographic-tech-visuals/SKILL.md`:
 * - Sin stroke perimetral en el contenedor (flota libremente sobre la tarjeta).
 * - Tamaño aumentado (w-14 h-14 / SVG w-9 h-9 a w-10 h-10).
 * - Glow ambiental + micro-interacción al hover.
 */

interface HolographicIconProps {
  type: "marketing" | "contracting" | "commissions";
  className?: string;
}

export default function HolographicIcon({ type, className = "" }: HolographicIconProps) {
  return (
    <div
      className={`relative w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center shrink-0 ${className}`}
    >
      {/* ── 1. GLOW AMBIENTAL HOLOGRÁFICO (Z-0, sin borde perimetral) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[var(--color-brand-blue)]/20 blur-[12px] transition-all duration-500 ease-out group-hover:bg-[var(--color-brand-blue)]/35 group-hover:scale-110 opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[var(--color-brand-blue)]/5 transition-transform duration-500 ease-out group-hover:scale-125"
      />

      {/* ── 2. VISUAL DIEGÉTICA POR CONCEPTO (Z-10) ── */}
      {type === "marketing" && <MarketingVisual />}
      {type === "contracting" && <ContractingVisual />}
      {type === "commissions" && <CommissionsVisual />}
    </div>
  );
}

/**
 * Marketing Personalizado: Target Radar / Audience Beacon
 * Retícula concéntrica simétrica con retículo de precisión y nodo focal activo.
 */
function MarketingVisual() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10 w-9 h-9 lg:w-10 lg:h-10 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-all duration-300 group-hover:scale-105"
    >
      {/* Círculos concéntricos de targeting */}
      <circle cx="12" cy="12" r="9.5" strokeOpacity="0.35" />
      <circle cx="12" cy="12" r="5.5" strokeOpacity="0.7" />

      {/* Guías de precisión en cruz */}
      <line x1="12" y1="1.5" x2="12" y2="4" strokeOpacity="0.8" />
      <line x1="12" y1="20" x2="12" y2="22.5" strokeOpacity="0.8" />
      <line x1="1.5" y1="12" x2="4" y2="12" strokeOpacity="0.8" />
      <line x1="20" y1="12" x2="22.5" y2="12" strokeOpacity="0.8" />

      {/* Nodo focal activo de datos */}
      <circle
        cx="12"
        cy="12"
        r="2"
        className="fill-[var(--color-brand-blue)] stroke-[var(--color-brand-blue)] transition-transform duration-300 group-hover:scale-125"
      />
    </svg>
  );
}

/**
 * Contratación Ágil: Fast Protocol / Quantum Contracting
 * Documento tech simétrico con rayo de aceleración cinética y micro-nodo de validación.
 */
function ContractingVisual() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10 w-9 h-9 lg:w-10 lg:h-10 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-all duration-300 group-hover:scale-105"
    >
      {/* Marco de protocolo digital */}
      <rect x="4" y="2.5" width="16" height="19" rx="2" strokeOpacity="0.35" />
      <line x1="8" y1="6.5" x2="12" y2="6.5" strokeOpacity="0.6" />
      <line x1="8" y1="10.5" x2="16" y2="10.5" strokeOpacity="0.6" />

      {/* Rayo de validación cinética / velocidad */}
      <path
        d="M13 13.5L9 18H12L11 21.5L15 17H12L13 13.5Z"
        className="fill-[var(--color-brand-blue)]/25 stroke-[var(--color-brand-blue)] transition-transform duration-300 group-hover:translate-x-0.5"
      />

      {/* Nodo activo de estado (validado) */}
      <circle
        cx="16"
        cy="6.5"
        r="1.75"
        className="fill-[var(--color-brand-blue)] stroke-[var(--color-brand-blue)]"
      />
    </svg>
  );
}

/**
 * Comisiones de Primer Nivel: Tiered Growth Apex / Value Prism
 * Prisma de niveles simétricos coronado por el ápice de producción top-tier.
 */
function CommissionsVisual() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10 w-9 h-9 lg:w-10 lg:h-10 text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-all duration-300 group-hover:scale-105"
    >
      {/* Pirámide / Prisma de niveles escalonados */}
      <polygon points="12 2.5 20.5 18.5 3.5 18.5" strokeOpacity="0.35" />
      <line x1="6.8" y1="13" x2="17.2" y2="13" strokeOpacity="0.6" />
      <line x1="9.5" y1="7.8" x2="14.5" y2="7.8" strokeOpacity="0.6" />

      {/* Vértice superior de rendimiento (Apex Node) */}
      <circle
        cx="12"
        cy="2.5"
        r="2"
        className="fill-[var(--color-brand-blue)] stroke-[var(--color-brand-blue)] transition-transform duration-300 group-hover:scale-125"
      />

      {/* Vector de crecimiento vertical */}
      <line
        x1="12"
        y1="7.8"
        x2="12"
        y2="13"
        className="stroke-[var(--color-brand-blue)]"
      />
    </svg>
  );
}
