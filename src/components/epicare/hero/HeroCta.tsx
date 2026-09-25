import Link from "next/link";
import ArrowUR from "@/components/icons/ArrowUR";
import { EASE_CSS } from "@/lib/motion";

/**
 * Transición solo de lo que toca el hover (`translate`/`scale` de Tailwind v4, sombra, brillo y
 * fondo). Con `transition-all` también suavizaba el `transform`/`opacity` que GSAP escribe en la
 * entrada y la retrasaba. Duración: la de los CTAs compartidos (450ms, sin token de DUR).
 */
const BASE =
  "hero-cta group flex h-static-2xl w-fit pl-static-lg pr-1.5 rounded-full justify-between items-center gap-3 text-body-sm font-semibold normal-case transition-[translate,scale,box-shadow,filter,background-color] duration-[450ms] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 cursor-pointer";

const VARIANTS = {
  primary: {
    pill: "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 hover:brightness-105 hover:shadow-elevation-4",
    bubble: "bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)]",
  },
  secondary: {
    pill: "border border-[var(--color-brand-blue)]/40 bg-[var(--color-surface-BG-white)]/50 dark:bg-[var(--color-surface-BG-white)]/10 text-[var(--color-hero-ink)] shadow-elevation-1 backdrop-blur-md hover:bg-[var(--color-surface-BG-white)] dark:hover:bg-[var(--color-surface-BG-white)]/20 hover:shadow-elevation-3",
    bubble: "bg-[var(--color-hero-ink)] text-[var(--color-hero-ivory)]",
  },
} as const;

const ARROW = "absolute w-static-md h-static-md transition-transform duration-300 ease-out";
const ARROW_STROKE = 2.5;

interface HeroCtaProps {
  href: string;
  label: string;
  variant: keyof typeof VARIANTS;
}

/**
 * @description CTA del hero editorial de la landing: píldora con flecha en burbuja y swap diagonal
 * al hover. Primario azul de marca; secundario de cristal sobre el marfil del hero (bimodal).
 */
export default function HeroCta({ href, label, variant }: HeroCtaProps) {
  const { pill, bubble } = VARIANTS[variant];
  return (
    <Link href={href} className={`${BASE} ${pill}`} style={{ transitionTimingFunction: EASE_CSS.ui }}>
      <span className="whitespace-nowrap">{label}</span>
      <span className={`relative w-static-xl h-static-xl rounded-full ${bubble} flex items-center justify-center overflow-hidden shrink-0`}>
        <ArrowUR strokeWidth={ARROW_STROKE} className={`${ARROW} group-hover:translate-x-5 group-hover:-translate-y-5`} />
        <ArrowUR strokeWidth={ARROW_STROKE} className={`${ARROW} -translate-x-5 translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0`} />
      </span>
    </Link>
  );
}
