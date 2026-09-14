/**
 * MOTION TOKENS — La firma de movimiento de Epicare.
 *
 * @description Valores canónicos de easing, duración, stagger, distancias y scrub,
 * extraídos de la firma real de la landing (censo 2026-07-22). Los componentes
 * IMPORTAN de aquí; nunca declaran estos valores inline.
 * Doc: Graph-Design-Framework/WorkFlow-Docs/Design-Agent-Skills/MOTION-BIBLE.md
 */

// ── EASINGS GSAP ──
export const EASE = {
  /** Reveal estándar de entrada (el default de la página) */
  out: "power3.out",
  /** Text-birth y momentos con peso dramático */
  dramatic: "power4.out",
  /** Transiciones entre estados (salidas del loader, swaps) */
  inOut: "power3.inOut",
  /** Micro-interacciones snappy */
  snap: "power2.out",
  /** Loops infinitos (breathing, drift) */
  breath: "sine.inOut",
  /** Todo lo atado a scrub va SIEMPRE sin ease */
  none: "none",
} as const;

/** CustomEase de firma ("proReveal", usado en PeopleReveal).
 * Registrar: CustomEase.create("proReveal", EASE_SIGNATURE_PATH) */
export const EASE_SIGNATURE_PATH = "M0,0 C0.65,0.05 0.36,1 1,1";

// ── EASINGS CSS (Tailwind arbitrary values) ──
export const EASE_CSS = {
  /** Hovers/CTAs/expansiones — usar con duration 450–700ms */
  ui: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

// ── DURACIONES (segundos) ──
export const DUR = {
  micro: 0.2, //  hover in
  microOut: 0.3, //  hover out (retorno más relajado)
  fast: 0.5, //  elementos pequeños (pills, badges)
  base: 0.9, //  reveal estándar
  slow: 1.2, //  bloques grandes, imágenes
  birth: 1.4, //  text-birth de titulares
  cinematic: 1.8, //  momentos de firma (máx. 1 por sección)
  count: 2.5, //  count-up de métricas
} as const;

// ── STAGGERS (segundos) ──
export const STAGGER = {
  tight: 0.04, //  caracteres / pills
  base: 0.08, //  líneas de texto / subtítulos
  wave: 0.15, //  cards / bloques grandes
} as const;

// ── DISTANCIAS DE REVEAL ──
export const REVEAL = {
  sm: 24, //  px — elementos UI menores
  md: 40, //  px — cards, párrafos (el estándar)
  lg: 60, //  px — bloques hero
  /** yPercent inicial del text-birth (máscara overflow-hidden) */
  birthPercent: 120,
  blurSoft: 6, //  px — texto
  blurBase: 12, //  px — logos, elementos medios
  blurHeavy: 20, //  px — cards grandes
} as const;

// ── SCRUB (suavizado de ScrollTrigger) ──
export const SCRUB = {
  crisp: 1, //  pins y efectos que siguen al dedo
  smooth: 2, //  parallax estándar
  heavy: 3, //  slats, marquees, fondos pesados
} as const;

// ── TRIGGERS ESTÁNDAR ──
export const TRIGGER = {
  early: "top 90%", //  elementos que deben estar listos al llegar
  standard: "top 80%", //  el default de entrada
  late: "top 75%", //  titulares protagonistas
  parallaxStart: "top bottom",
  parallaxEnd: "bottom top",
} as const;

// ── RATIOS DE PARALLAX (velocidad relativa al contenido) ──
export const PARALLAX = {
  bg: 0.7,
  mid: 0.85,
} as const;
