"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import ArrowUR from "@/components/icons/ArrowUR";

/**
 * @file ui/Button.tsx
 * @description FUENTE ÚNICA de los botones de Epicare. Dos piezas:
 * - `Button`     — CTA con texto + burbuja de flecha (swap diagonal al hover).
 * - `IconButton` — botón cuadrado-redondeado solo de ícono (flechas de scroll, cerrar, siguiente…).
 *
 * Radio (design system, 2026-10-16): todos los botones son rectángulos de 10px (`rounded-button`),
 * ya NO píldoras; la burbuja interior usa `rounded-button-inner` (6px, concéntrica). Ambos tokens
 * viven en `globals.css` (@theme). No escribir `rounded-full` en un botón: se importa este componente.
 *
 * `PrimaryCta` / `SecondaryCta` (go-crm/cta) son envoltorios finos sobre `Button`: mantienen su API.
 */

// ── TOKENS DE FORMA Y MOTION (idénticos a los que ya usaban los CTAs sueltos) ──
const BASE =
  "group rounded-button flex items-center gap-3 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.96] active:opacity-80 active:duration-150 cursor-pointer";

const SIZE = {
  /** 48px — el de Hero, secciones de valor y cierre. */
  md: "h-static-2xl pl-static-lg pr-static-sm text-body-sm font-medium",
  /** 44px — el del header y los CTAs secundarios dentro de un visual. */
  sm: "h-11 pl-5 pr-1.5 text-body-sm font-medium normal-case",
} as const;

/** Variante de aire lateral del tamaño `md` para el CTA del hero de /go-ams: más holgado en móvil. */
const SIZE_MD_ROOMY = "h-static-2xl pl-8 md:pl-static-lg pr-3 md:pr-static-sm text-body-sm font-medium";

const LAYOUT = {
  auto: "w-fit",
  /** Móvil: ancho mínimo cómodo y etiqueta/burbuja en extremos; desde md, compacto. */
  "wide-mobile": "w-fit min-w-[220px] md:min-w-0 justify-between md:justify-start",
  /** Móvil: ocupa todo el ancho; desde md, compacto. */
  "full-mobile": "w-full md:w-fit justify-between md:justify-start",
} as const;

/** Superficie de cada variante: `pill` = el botón, `bubble` = la burbuja de flecha. */
const VARIANT = {
  /** Azul de marca + texto blanco. El CTA estándar. */
  primary: {
    pill: "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2 hover:shadow-elevation-4",
    bubble: "bg-[var(--color-surface-BG-white)] text-[var(--color-brand-blue)]",
  },
  /** Azul de marca + texto del fondo de la página (se invierte con el tema). Usado en /go-ams. */
  "primary-adaptive": {
    pill: "bg-[var(--color-brand-blue)] text-[var(--color-surface-BG-base)] shadow-elevation-2 hover:shadow-elevation-4",
    bubble: "bg-[var(--color-surface-BG-base)] text-[var(--color-brand-blue)]",
  },
  /** Tokens de acción del DS (`action-primary-*`): negro/blanco según tema. */
  action: {
    pill: "bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 hover:shadow-elevation-4",
    bubble: "bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)]",
  },
  /** Color de acento propio (pásalo con `accentVar`): texto blanco, burbuja blanca. */
  accent: {
    pill: "text-white shadow-elevation-2 hover:shadow-elevation-4",
    bubble: "bg-white text-black",
  },
  /** Cristal blanco translúcido: sobre fondos oscuros o imagen. */
  "glass-dark": {
    pill: "border bg-white/10 border-white/40 text-[var(--color-text-White-100)] hover:bg-white/20 shadow-elevation-1 hover:shadow-elevation-3",
    bubble: "bg-white/10 text-[var(--color-text-White-100)]",
  },
  /**
   * Sin color propio: solo sombra. El color lo pone quien llama con `className` (+ `bubbleClassName`).
   * Para superficies que dependen del estado de su contenedor (el header cambia con el scroll y el tema).
   */
  plain: {
    pill: "shadow-elevation-1 hover:shadow-elevation-3",
    bubble: "",
  },
  /** Cristal más tenue (borde 20 %, blur solo desde md): sobre la imagen del cierre de /go-ams. */
  "glass-soft": {
    pill: "border bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-elevation-1 md:backdrop-blur-sm",
    bubble: "bg-white/20 text-white",
  },
  /** Superficie clara del DS con borde (bimodal): sobre fondos de página. */
  "glass-light": {
    pill: "border bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-1)] border-[var(--color-border-Strokes-default)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-blue)] shadow-elevation-1 hover:shadow-elevation-3",
    bubble: "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)]",
  },
} as const;

export type ButtonVariant = keyof typeof VARIANT;

/** Burbuja de flecha: dos flechas, una sale y otra entra en diagonal al hover del botón (`group`). */
export function ArrowBubble({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`relative w-static-xl h-static-xl rounded-button-inner flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={style}
      aria-hidden="true"
    >
      <ArrowUR className="absolute w-static-md h-static-md transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
      <ArrowUR className="absolute w-static-md h-static-md -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: keyof typeof SIZE;
  layout?: keyof typeof LAYOUT;
  /** Con `href` es un enlace (`<Link>` para rutas internas, `<a>` para anclas y externos). */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Más aire lateral en móvil (solo `size="md"`): el CTA del hero de /go-ams. */
  roomyMobile?: boolean;
  /** Burbuja de flecha. Por defecto sí. */
  bubble?: boolean;
  /**
   * Solo visual: renderiza un `<span>` sin enlace ni foco, para dentro de una tarjeta que ya es el
   * enlace entero (evita `<a>` anidados). No lleva `group` propio: el hover (swap de flecha) lo
   * dispara el `group` de la tarjeta.
   */
  decorative?: boolean;
  /** `glass-dark` sin `backdrop-filter` (Hardware Symphony): capas que se escalan en móvil. */
  lite?: boolean;
  /** Variable CSS del color de acento (`--color-…`) para la variante `accent`. */
  accentVar?: string;
  /** Sustituye el color de la burbuja de la variante (útil con `plain`). */
  bubbleClassName?: string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/**
 * @description CTA estándar de Epicare: rectángulo de 10px con etiqueta y burbuja de flecha.
 * @example <Button label={t("cta")} onClick={() => joinModalStore.open()} />
 * @example <Button label="Ver GO AMS" href="/go-ams" variant="glass-dark" size="sm" />
 */
export default function Button({
  label,
  variant = "primary",
  size = "md",
  layout = "auto",
  href,
  onClick,
  type = "button",
  roomyMobile = false,
  bubble = true,
  decorative = false,
  lite = false,
  accentVar,
  bubbleClassName,
  className = "",
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANT[variant];
  const blur = variant === "glass-dark" && !lite ? " backdrop-blur-md" : "";
  const sizeCls = roomyMobile && size === "md" ? SIZE_MD_ROOMY : SIZE[size];
  const base = decorative ? BASE.replace("group ", "") : BASE;
  const cls = `${base} ${sizeCls} ${LAYOUT[layout]} ${v.pill}${blur}${className ? ` ${className}` : ""}`;
  const styled = accentVar ? { ...style, backgroundColor: `var(${accentVar})` } : style;
  const inner = (
    <>
      <span>{label}</span>
      {bubble && <ArrowBubble className={bubbleClassName ?? v.bubble} style={accentVar ? { color: `var(${accentVar})` } : undefined} />}
    </>
  );

  if (decorative) {
    return (
      <span className={cls} style={styled} aria-hidden="true">
        {inner}
      </span>
    );
  }

  if (href) {
    const external = /^(https?:|mailto:|tel:|#)/.test(href);
    return external ? (
      <a href={href} className={cls} style={styled} onClick={onClick} {...rest}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls} style={styled} onClick={onClick} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} style={styled} {...rest}>
      {inner}
    </button>
  );
}

// ── ICON BUTTON ──

const ICON_SIZE = {
  /** 48px. */
  md: "w-static-2xl h-static-2xl",
  /** 48px en móvil, 56px desde md (el botón de "bajar" del hero). */
  lg: "w-static-2xl h-static-2xl md:w-14 md:h-14",
} as const;

const ICON_VARIANT = {
  primary: "bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)] shadow-elevation-2",
  action: "bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2",
} as const;

export interface IconButtonProps {
  /** `aria-label` obligatorio: el botón no tiene texto visible. */
  label: string;
  variant?: keyof typeof ICON_VARIANT;
  size?: keyof typeof ICON_SIZE;
  /** `lift`: sube y gana sombra al hover (botones grandes). `press`: solo reacciona al click. */
  motion?: "lift" | "press";
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * @description Botón de solo ícono, rectángulo de 10px. Para flechas de scroll, "siguiente", cerrar.
 * @example <IconButton label={t("scrollDown")} motion="lift" size="lg" onClick={scroll}><ArrowDown /></IconButton>
 */
export function IconButton({ label, variant = "primary", size = "md", motion = "press", onClick, className = "", children }: IconButtonProps) {
  const motionCls =
    motion === "lift"
      ? "group relative transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-elevation-4 active:scale-95"
      : "transition-transform active:scale-95";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`shrink-0 ${ICON_SIZE[size]} rounded-button flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)] ${ICON_VARIANT[variant]} ${motionCls}${className ? ` ${className}` : ""}`}
    >
      {children}
    </button>
  );
}
