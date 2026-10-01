"use client";

/**
 * @description "Conversaciones" — Despiece (vista explosionada de producto). ✅ APROBADO 2026-10-01.
 * La consola llega montada, con sus 3 paneles reales juntos. Con el scroll (scrub, sin pin) los
 * paneles se separan hasta quedar en 3 columnas, y bajo cada uno nace la feature que lo explica:
 * ficha del contacto → llamadas · hilo → documentos · actividad → automatización. Los paneles
 * son UI real (réplica 1:1 de la captura en `console/`, siempre clara), escalada como un artboard.
 * - Desktop (≥md): scrub ligado al scroll, solo transform/opacity.
 * - Móvil (<md): slider horizontal nativo (`ConvMobileSlider`): un slide por panel + su feature.
 */

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, REVEAL } from "@/lib/motion";
import FeatureTitle from "./FeatureTitle";
import ConvMobileSlider from "./ConvMobileSlider";
import { PANELS, type ConvFeature } from "./convData";
import { CARD_FROM, CARD_TO, DESKTOP, FULL, MOBILE, oneShot } from "./useConversationsMotion";
import { Artboard, UI_CSS } from "./console/ui";
import ContactPanel from "./console/ContactPanel";
import ThreadPanel from "./console/ThreadPanel";
import ActivityPanel from "./console/ActivityPanel";
import { buildActivityStory, buildDesktopStory, buildThreadStory, resetStoryText } from "./console/story";

/** Columnas proporcionales al ancho real de cada panel: montados, encajan como en la UI. */
const PANEL_COLS = PANELS.map((p) => `${p.w}fr`).join(" ");
const PANEL_UI = [ContactPanel, ThreadPanel, ActivityPanel] as const;
/** Escala de la consola montada (margen creativo declarado). */
const ASSEMBLED_SCALE = 0.94;
const PANEL = "rounded-lg border border-[var(--color-border-Strokes-strong)] shadow-elevation-3";
/**
 * Desfase entre columnas dentro del scrub, en fracción del recorrido (el timeline dura 1): el
 * equivalente de `STAGGER` cuando el tiempo es el scroll y no segundos.
 */
const SCRUB_STAGGER = 0.1;

/** La historia de la consola empieza al final del scrub (desktop) o con el panel bien dentro (móvil). */
const STORY_START = "center 45%";
const STORY_START_MOBILE = "top 70%";

/**
 * El loop corre solo mientras su panel está a la vista: se pausa al salir por abajo o por arriba y,
 * si se vuelve por encima del inicio, se rearma al diseño estático (la consola se monta limpia).
 */
function playWhileVisible(trigger: Element, start: string, story: gsap.core.Timeline, scope: Element) {
  ScrollTrigger.create({
    trigger,
    start,
    end: "bottom top",
    onEnter: () => story.play(),
    onEnterBack: () => story.play(),
    onLeave: () => story.pause(),
    onLeaveBack: () => {
      story.pause(0);
      resetStoryText(scope);
    },
  });
}

export default function ConvExploded({ cards }: { cards: ConvFeature[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Registro propio: este efecto corre antes que el del encabezado (los hijos van primero).
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);

    mm.add(`${DESKTOP} and ${FULL}`, () => {
      const stage = el.querySelector<HTMLElement>(".cx-stage");
      const panels = gsap.utils.toArray<HTMLElement>(".cx-panel", el);
      if (!stage || panels.length !== 3) return;
      // Hueco real entre columnas: lo que cada panel lateral tiene que recorrer para "encajar".
      const gap = () => parseFloat(getComputedStyle(stage).columnGap || "0");

      const tl = gsap.timeline({
        defaults: { ease: EASE.none },
        scrollTrigger: { trigger: stage, start: "top 85%", end: "center 45%", scrub: true, invalidateOnRefresh: true },
      });
      tl.fromTo(stage, { scale: ASSEMBLED_SCALE }, { scale: 1, duration: 1 }, 0)
        .fromTo(panels[0], { x: () => gap() }, { x: 0, duration: 1 }, 0)
        .fromTo(panels[2], { x: () => -gap() }, { x: 0, duration: 1 }, 0)
        // El panel central se adelanta un instante (profundidad) y vuelve al plano de la retícula.
        .fromTo(panels[1], { y: 0 }, { y: -REVEAL.sm, duration: 0.5, ease: EASE.out }, 0)
        .to(panels[1], { y: 0, duration: 0.5, ease: EASE.out }, 0.5)
        .fromTo(".cx-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: SCRUB_STAGGER }, 0.45)
        .fromTo(".cx-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: 0.45, stagger: SCRUB_STAGGER }, 0.55)
        .fromTo(".cx-desc", { opacity: 0, y: REVEAL.sm }, { opacity: 1, y: 0, duration: 0.4, stagger: SCRUB_STAGGER }, 0.65);

      // La historia arranca cuando el despiece termina (fin del scrub).
      const desk = el.querySelector(".cx-desktop");
      if (desk) playWhileVisible(stage, STORY_START, buildDesktopStory(desk), desk);
    });

    mm.add(`${MOBILE} and ${FULL}`, () => {
      // El slider entra como bloque (Pilar 1 móvil: nunca sus hijos).
      const slider = el.querySelector(".cx-slider");
      gsap.fromTo(slider, CARD_FROM, { ...CARD_TO, ...oneShot(slider) });
      // Móvil: el hilo y la actividad tienen su propio loop (las etiquetas no caen en el recorte del contacto).
      const items = gsap.utils.toArray<HTMLElement>(".cx-item", el);
      if (items.length !== 3) return;
      playWhileVisible(items[1], STORY_START_MOBILE, buildThreadStory(items[1]), items[1]);
      playWhileVisible(items[2], STORY_START_MOBILE, buildActivityStory(items[2]), items[2]);
    });

    // Smart Shutdown del parpadeo del cursor (keyframe CSS) fuera de pantalla.
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-offscreen", !entry.isIntersecting));
    io.observe(el);

    return () => {
      io.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full max-w-section-xl md:px-gutter-md mt-static-xl lg:mt-static-2xl">
      <style href="go-crm-console-ui" precedence="default">{UI_CSS}</style>
      {/* ── DESKTOP: PANELES (montados → despiezados) + FEATURES BAJO CADA UNO ── */}
      <div className="cx-desktop hidden md:block">
        <div className="cx-stage grid items-start gap-x-static-xl" style={{ gridTemplateColumns: PANEL_COLS } as CSSProperties}>
          {PANELS.map((panel, i) => {
            const Ui = PANEL_UI[i];
            return (
              <div key={i} className={`cx-panel overflow-hidden ${PANEL}`}>
                <Artboard w={panel.w} h={panel.h}>
                  <Ui />
                </Artboard>
              </div>
            );
          })}
        </div>
        <div className="grid gap-x-static-xl mt-static-xl" style={{ gridTemplateColumns: PANEL_COLS } as CSSProperties}>
          {cards.map((card, i) => (
            <div key={card.title} className="relative pt-static-lg">
              <span aria-hidden="true" className="cx-rule absolute top-0 inset-x-0 h-px origin-left bg-[var(--color-border-Strokes-default)]" />
              <span aria-hidden="true" className="absolute top-0 left-0 w-static-xl h-0.5 bg-[var(--color-brand-blue)]" />
              <div className="overflow-hidden">
                <FeatureTitle card={card} index={i} className="cx-birth" />
              </div>
              <p className="cx-desc mt-static-sm text-body-sm text-[var(--color-text-secondary)] max-w-md">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MÓVIL: SLIDER HORIZONTAL (panel + feature por slide) ── */}
      <ConvMobileSlider cards={cards} panels={PANEL_UI} panelClass={PANEL} />
    </div>
  );
}
