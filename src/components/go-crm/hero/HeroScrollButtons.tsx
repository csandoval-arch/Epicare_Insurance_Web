"use client";

import type Lenis from "lenis";

export const HERO_WRAPPER_ID = "hero-wrapper";

/** Lleva a la sección siguiente al Hero. Siempre por Lenis: `window.scrollTo` smooth pelea con él. */
function scrollPastHero() {
  const next = document.getElementById(HERO_WRAPPER_ID)?.nextElementSibling;
  if (!(next instanceof HTMLElement)) return;
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) {
    lenis.scrollTo(next);
  } else {
    window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  }
}

const ArrowDown = ({ className }: { className: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

/**
 * @description Burbuja de scroll junto al CTA. Solo < lg.
 */
export function HeroScrollButtonMobile({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={scrollPastHero}
      className="lg:hidden shrink-0 w-static-2xl h-static-2xl rounded-full flex items-center justify-center bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 active:scale-95 transition-transform cursor-pointer"
      aria-label={label}
    >
      <ArrowDown className="w-5 h-5" />
    </button>
  );
}

/**
 * @description Botón de scroll flotando a la izquierda del showcase, con swap vertical de flecha
 * en hover. Solo ≥ lg.
 */
export function HeroScrollButtonDesktop({ label }: { label: string }) {
  return (
    <div className="absolute top-[140px] left-[-24px] -translate-x-full z-20 hidden lg:flex">
      <button
        type="button"
        onClick={scrollPastHero}
        className="group relative w-static-2xl h-static-2xl md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-elevation-4 active:scale-95 cursor-pointer"
        aria-label={label}
      >
        <div className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
        <span className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
          <ArrowDown className="absolute w-5 h-5 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-10" />
          <ArrowDown className="absolute w-5 h-5 -translate-y-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-hover:translate-y-0" />
        </span>
      </button>
    </div>
  );
}
