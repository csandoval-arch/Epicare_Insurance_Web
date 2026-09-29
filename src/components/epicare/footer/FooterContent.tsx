"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowUR from "@/components/icons/ArrowUR";
import EpicareMark from "@/components/icons/EpicareMark";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import WindowedVideo from "../hero/WindowedVideo";
import { CONTACT } from "./data";
import FooterGrid from "./FooterGrid";
import { FooterLegal } from "./parts";
import { BG, GUTTER, HAIRLINE, SPACE, SURFACE } from "./theme";
import { findStage, useCurtainReveal } from "./useCurtainReveal";

/** El wordmark: [isotipo "e"] + "pi" + [ventana al vídeo] + "care". */
const WORD = { before: "pi", after: "care" };
/**
 * Máscara de cada letra (nace desde abajo): amplía el recorte bajo la línea base para no cortar los
 * descendentes (la "p") y lo compensa con margen negativo, así la palabra no se desplaza.
 */
const LETTER_BOX = "block overflow-hidden pb-[0.22em] -mb-[0.22em]";
/** Caja del wordmark: margen lateral `gutter-lg` (84px elegidos ≈ 80px); la letra escala con su ancho (`cqi`). */
const WORDMARK_BOX = `@container px-gutter-sm md:px-gutter-lg ${SPACE.wordmarkTop} ${SPACE.wordmarkBottom}`;

/** Con el telón (scrub) nace el mensaje. */
function build(tl: gsap.core.Timeline, el: HTMLElement) {
  tl.fromTo(el.querySelectorAll(".fc-line"), { yPercent: REVEAL.birthPercent }, { yPercent: 0, ease: EASE.none }, 0);
}

/** Fracción del wordmark que debe verse para disparar su entrada. */
const WORDMARK_VISIBLE = 0.35;

/**
 * @description Entrada del wordmark: one-shot (no scrub). Se dispara cuando la palabra es VISIBLE de
 * verdad: dentro de la pantalla y por debajo del borde del telón (mientras se destapa, el footer va
 * `fixed` y el `clip-path` del contenedor la tapa aunque esté "en pantalla", por eso un
 * IntersectionObserver no sirve). La visibilidad se mide en vivo en cada scroll: no depende de
 * posiciones precalculadas (el scrub del tramo tras el telón se quedaba a medias). Si la palabra
 * vuelve a quedar oculta por debajo, se rearma.
 * Hardware Symphony: solo transform (`yPercent` de las letras y `scale` de la ventana), `will-change`
 * solo durante la animación. Con movimiento reducido no se anima.
 */
function useWordmarkEntrance(boxRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    const stage = box && findStage(box);
    if (!box || !stage) return;
    const mm = gsap.matchMedia(box);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = box.querySelectorAll(".fc-letter");
      const windows = box.querySelectorAll(".fc-window");
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          letters,
          { yPercent: 100, willChange: "transform" },
          { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.tight * 2, force3D: true, clearProps: "willChange" }
        )
        .fromTo(
          windows,
          { scale: 0, willChange: "transform" },
          { scale: 1, duration: DUR.slow, ease: EASE.dramatic, force3D: true, clearProps: "willChange" },
          STAGGER.wave
        );
      // Fracción visible = la parte de la palabra dentro de la pantalla y por debajo del borde del telón.
      const check = () => {
        const r = box.getBoundingClientRect();
        const top = Math.max(r.top, stage.getBoundingClientRect().top, 0);
        const bottom = Math.min(r.bottom, window.innerHeight);
        const visible = Math.max(0, bottom - top) / r.height;
        if (visible >= WORDMARK_VISIBLE) tl.play();
        // Rearme solo cuando vuelve a quedar oculta por debajo (se subió la página), nunca a mitad de lectura.
        else if (visible === 0 && r.top > 0) tl.pause(0);
      };
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        refreshPriority: -1,
        onUpdate: check,
        onRefresh: check,
        // Salto por encima del footer (navegación entre páginas: el scroll vuelve arriba de golpe desde
        // donde estaba la página anterior) → sin frames intermedios: rearme explícito.
        onLeaveBack: () => tl.pause(0),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [boxRef]);
}

/**
 * @description Contenido del footer, sobre grafito:
 * - Arriba: el mensaje de cierre, grande ("Go beyond growth.").
 * - La retícula de estudio enmarcada: índice con línea azul superior al hover · celda final azul de
 *   marca como resolución ("Escríbenos" + dirección, teléfono y email).
 * - El wordmark "epicare" a todo el ancho (entre márgenes): la "e" del isotipo como primera letra y
 *   una ventana al plano de vídeo del hero entre "pi" y "care"; se revela con el scroll tras el telón.
 * - Abajo del todo: barra de cierre (copyright · legales · volver arriba).
 */
export default function FooterContent() {
  const t = useTranslations("landingV2.footer");
  const root = useRef<HTMLElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  useCurtainReveal(root, build);
  useWordmarkEntrance(wordmark);
  const statement = t.raw("statement") as string[];

  return (
    <section ref={root} className={`relative w-full flex flex-col ${SURFACE} overflow-hidden`}>
      {/* ── MENSAJE DE CIERRE ── */}
      <div className={`${GUTTER} ${SPACE.top} ${SPACE.gap}`}>
        <h2 className="text-display-xl font-medium tracking-tight">
          {statement.map((line) => (
            <span key={line} className="block overflow-hidden pb-2">
              <span className="fc-line block">{line}</span>
            </span>
          ))}
        </h2>
      </div>

      {/* ── RETÍCULA ── */}
      <div className={GUTTER}>
        <FooterGrid
          hoverLine
          tailClass="bg-[var(--color-brand-blue)]"
          tail={
            <a href={`mailto:${CONTACT.email}`} className="group/cta w-full h-full flex flex-col justify-between gap-static-lg">
              <span className="flex w-full items-start justify-between gap-static-md">
                <span className="text-h3 font-medium">{t("cta")}</span>
                <ArrowUR className="w-static-xl h-static-xl shrink-0 transition-[translate] duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
              </span>
              <span className="flex flex-col gap-static-xs text-body-md">
                {CONTACT.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <span>{CONTACT.phone}</span>
                <span>{CONTACT.email}</span>
              </span>
            </a>
          }
        />
      </div>

      {/* ── WORDMARK con la ventana al vídeo entre "pi" y "care" (div: contiene la ventana) ── */}
      <div ref={wordmark} className={WORDMARK_BOX}>
        <div className="text-footer-wordmark flex items-end justify-center whitespace-nowrap select-none" role="img" aria-label="Epicare">
          {/* La "e" del isotipo en lugar de la primera letra (como en el lockup de marca), alta como la x */}
          <span className={LETTER_BOX} aria-hidden="true">
            <span className="fc-letter block">
              <EpicareMark className="block h-[0.6em] w-auto mb-[0.02em] mr-[0.03em]" />
            </span>
          </span>
          {[...WORD.before].map((c, i) => (
            <span key={`b${i}`} className={LETTER_BOX} aria-hidden="true">
              <span className="fc-letter block">{c}</span>
            </span>
          ))}
          {/* Ventana al plano del hero: alta como la x, apoyada en la línea base */}
          <span className="fc-window block w-[0.6em] h-[0.53em] mx-[0.05em] mb-[0.11em] overflow-hidden" aria-hidden="true">
            <WindowedVideo surface={BG} />
          </span>
          {[...WORD.after].map((c, i) => (
            <span key={`a${i}`} className={LETTER_BOX} aria-hidden="true">
              <span className="fc-letter block">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── BARRA DE CIERRE: copyright · legales · volver arriba ── */}
      <div className={GUTTER}>
        <FooterLegal className={`border-t ${HAIRLINE} ${SPACE.legal} text-[var(--color-text-White-100)]/60`} />
      </div>
    </section>
  );
}
