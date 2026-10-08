"use client";

/**
 * @description Acto 01 "The case" — carrusel en abanico, centrado, como una mano de cartas. La ficha activa
 * al frente, plana y grande, con su información en vidrio; las que vienen se abren a la derecha y las que
 * pasaron a la izquierda, sobre un arco suave, más atrás y veladas, enseñando solo el retrato
 * (física en `carouselLayouts.ts`). Avanza solo en un loop infinito (sin rebobinar); debajo,
 * el contador de etapa y una barra que marca el tiempo que le queda y se encoge hacia el centro.
 * Interacción: clic en una ficha lateral la trae al frente, flechas anterior/siguiente, y el loop se pausa
 * con el cursor encima. Solo corre a la vista. Móvil / reduced-motion: slider nativo.
 * GPU: un transform + opacity por ficha y frame; el vidrio es una capa ya rasterizada (GlassCard).
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import { keyed } from "./keyed";
import GlassCard from "./GlassCard";
import CaseHeader, { DESKTOP, FULL, oneShot } from "./CaseHeader";
import CaseMobileSlider from "./CaseMobileSlider";
import { AGENT_STAGE, STAGE_CARDS, type CaseStage } from "./caseData";
import { FAN, deckPose } from "./carouselLayouts";

// ── MARGEN CREATIVO DECLARADO (física del coverflow: forma, escenario y ritmo en `FAN`) ──
const deck = FAN;
/** Ritmo: pausa en cada ficha y duración del paso (s). */
const HOLD = deck.hold;
const MOVE = deck.move;
/** El panel y el chip solo en la ficha activa: se van al alejarse este tramo. */
const INFO_FADE = 0.45;
const INFO_RISE = 24;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ARROW = "M15 18l-6-6 6-6";

/** `header`: false cuando el carrusel vive dentro del hero (el titular lo pone el hero). */
export default function CaseCoverflow({ stages, closing, header = true }: { stages: CaseStage[]; closing: string[]; header?: boolean }) {
  const t = useTranslations("team.case");
  const rootRef = useRef<HTMLDivElement>(null);



  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add(`${DESKTOP} and ${FULL}`, () => {
      const stage = el.querySelector<HTMLElement>(".co-stage");
      const cards = gsap.utils.toArray<HTMLElement>(".co-card", el);
      const shades = cards.map((c) => c.querySelector<HTMLElement>(".co-shade"));
      const panels = cards.map((c) => c.querySelector<HTMLElement>(".gc-panel"));
      const chips = cards.map((c) => c.querySelector<HTMLElement>(".gc-chip"));
      const fill = el.querySelector<HTMLElement>(".co-fill");
      const counter = el.querySelector<HTMLElement>(".co-count");
      const n = cards.length;
      if (!stage) return;

      // Distancia circular de la ficha i a la posición p: en [-n/2, n/2). El carrusel no tiene fin.
      const dist = (i: number, p: number) => ((((i - p) % n) + n + n / 2) % n) - n / 2;

      let lastIdx = -1;
      const render = (p: number) => {
        const w = cards[0]?.offsetWidth ?? 0;
        cards.forEach((c, i) => {
          const d = dist(i, p);
          const a = Math.abs(d);
          const o = deckPose(d, w, deck);
          c.style.transform = `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, ${o.z.toFixed(1)}px) rotateY(${o.rotY.toFixed(2)}deg) rotateZ(${o.rotZ.toFixed(2)}deg) scale(${o.scale.toFixed(4)})`;
          c.style.opacity = String(o.opacity);
          c.style.zIndex = String(100 - Math.round(a * 10));
          const shade = shades[i];
          if (shade) shade.style.opacity = String(o.shade);
          // La información solo en la activa: aparece subiendo, se va bajando.
          const info = clamp(1 - a / INFO_FADE, 0, 1);
          const panel = panels[i];
          if (panel) {
            panel.style.opacity = String(info);
            panel.style.transform = `translate3d(0, ${((1 - info) * INFO_RISE).toFixed(1)}px, 0)`;
          }
          const chip = chips[i];
          if (chip) chip.style.opacity = String(info);
        });
        const idx = ((Math.round(p) % n) + n) % n;
        if (counter && idx !== lastIdx) {
          counter.textContent = String(idx + 1).padStart(2, "0");
          lastIdx = idx;
        }
      };
      const paintTimer = (v: number) => {
        if (fill) fill.style.transform = `scaleX(${v.toFixed(4)})`;
      };

      // Loop infinito: pausa (la barra se vacía) → paso a la siguiente (la barra se llena).
      const state = { p: 0, t: 1 };
      const loop = gsap.timeline({ repeat: -1, paused: true, onUpdate: () => (render(state.p), paintTimer(state.t)) });
      for (let k = 1; k <= n; k++) {
        loop
          .to(state, { t: 0, duration: HOLD, ease: EASE.none })
          .to(state, { p: k, duration: MOVE, ease: EASE.inOut })
          .to(state, { t: 1, duration: MOVE, ease: EASE.out }, "<");
      }
      render(0);
      paintTimer(1);

      let visible = false;
      let hovering = false;
      const resume = () => {
        if (visible && !hovering) loop.play();
      };

      // Ir a una ficha concreta (clic o flechas): por el camino más corto; el loop sigue desde ahí.
      let jump: gsap.core.Tween | undefined;
      const current = () => ((Math.round(state.p) % n) + n) % n;
      const goTo = (target: number) => {
        loop.pause();
        jump?.kill();
        const from = state.p % n;
        const to = from + dist(target, from);
        state.p = from;
        jump = gsap.to(state, {
          p: to,
          t: 1,
          duration: MOVE,
          ease: EASE.inOut,
          onUpdate: () => (render(state.p), paintTimer(state.t)),
          onComplete: () => {
            const idx = ((Math.round(to) % n) + n) % n;
            loop.time(idx * (HOLD + MOVE));
            state.p = idx;
            resume();
          },
        });
      };

      const offCards = cards.map((c, i) => {
        const fn = () => {
          if (current() !== i) goTo(i);
        };
        c.addEventListener("click", fn);
        return () => c.removeEventListener("click", fn);
      });
      const prev = el.querySelector<HTMLButtonElement>(".co-prev");
      const next = el.querySelector<HTMLButtonElement>(".co-next");
      const onPrev = () => goTo(current() - 1);
      const onNext = () => goTo(current() + 1);
      prev?.addEventListener("click", onPrev);
      next?.addEventListener("click", onNext);

      const onEnter = () => {
        hovering = true;
        loop.pause();
      };
      const onLeave = () => {
        hovering = false;
        resume();
      };
      stage.addEventListener("pointerenter", onEnter);
      stage.addEventListener("pointerleave", onLeave);

      // Entrada: el escenario sube en capas (las laterales detrás de la central); el carrusel arranca al llegar.
      gsap.fromTo(stage, { y: REVEAL.lg, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, ...oneShot(stage), onComplete: resume });
      const closingLines = el.querySelectorAll(".co-closing");
      gsap.fromTo(closingLines, { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.base, ...oneShot(closingLines[0]?.parentElement ?? null, "top 88%") });

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) resume();
        else loop.pause();
      });
      io.observe(stage);

      return () => {
        io.disconnect();
        offCards.forEach((off) => off());
        prev?.removeEventListener("click", onPrev);
        next?.removeEventListener("click", onNext);
        stage.removeEventListener("pointerenter", onEnter);
        stage.removeEventListener("pointerleave", onLeave);
        jump?.kill();
        loop.kill();
        const styled = [...cards, ...shades, ...panels, ...chips, fill].filter((x): x is HTMLElement => !!x);
        styled.forEach((e) => {
          e.style.transform = "";
          e.style.opacity = "";
          e.style.zIndex = "";
        });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const arrowBtn =
    "w-static-2xl h-static-2xl rounded-full border border-[var(--color-border-Strokes-default)] flex items-center justify-center text-[var(--color-text-primary)] cursor-pointer transition-[border-color,scale] duration-200 hover:border-[var(--color-brand-blue)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-focus-ring)]";
  const arrowIcon = (flip: boolean) => (
    <svg viewBox="0 0 24 24" className={`w-static-md h-static-md ${flip ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ARROW} />
    </svg>
  );

  return (
    <div ref={rootRef}>
      {/* ── DESKTOP: COVERFLOW 3D ── */}
      <div className={`hidden lg:flex motion-reduce:hidden flex-col items-center gap-static-xl ${header ? "py-section-md" : "pt-static-lg pb-section-md"} px-gutter-md overflow-hidden`}>
        {header && <CaseHeader center large />}

        {/* Alto = el de la ficha (4:5); ancho de ficha y perspectiva salen de la config del carrusel */}
        <div className="co-stage relative w-full mt-static-lg" style={{ height: `${deck.cardWidth * 1.25}rem`, perspective: `${deck.perspective}px` }}>
          {/* Sombra de suelo bajo la ficha activa */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -bottom-static-lg w-[26rem] h-static-2xl"
            style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-overlay-backdrop) 16%, transparent), transparent)" }}
          />
          {stages.map((s, i) => (
            <div key={s.key} className={`co-card absolute top-0 left-1/2 will-change-transform cursor-pointer select-none ${i === 0 ? "" : "opacity-0"}`}
              style={{ width: `${deck.cardWidth}rem`, marginLeft: `-${deck.cardWidth / 2}rem` }}
            >
              <GlassCard stage={s} card={STAGE_CARDS[s.key]} agent={s.key === AGENT_STAGE} className="shadow-elevation-4" />
              {/* Velo de profundidad: las fichas que se alejan se funden con el fondo */}
              <span aria-hidden="true" className="co-shade pointer-events-none absolute inset-0 rounded-xl bg-[var(--color-hero-ivory)] opacity-0" />
            </div>
          ))}
        </div>

        {/* Controles: anterior · contador + temporizador · siguiente */}
        <div className="flex items-center gap-static-lg mt-static-lg">
          <button type="button" className={`co-prev ${arrowBtn}`} aria-label={t("prev")}>
            {arrowIcon(false)}
          </button>
          <div className="flex items-center gap-static-md text-data text-[var(--color-text-muted)]">
            <span className="co-count w-[2ch] text-right text-[var(--color-text-primary)]">01</span>
            <span aria-hidden="true" className="relative w-32 h-0.5 rounded-full overflow-hidden bg-[var(--color-border-Strokes-default)]">
              <span className="co-fill absolute inset-0 origin-center rounded-full bg-[var(--color-brand-blue)]" />
            </span>
            <span>{String(stages.length).padStart(2, "0")}</span>
          </div>
          <button type="button" className={`co-next ${arrowBtn}`} aria-label={t("next")}>
            {arrowIcon(true)}
          </button>
        </div>

        {/* La resolución del acto: a la izquierda desde la columna 4 (misma retícula que "Bilingual"),
            en peso ligero salvo la idea clave */}
        {/* Se sale del padding del padre y lo vuelve a aplicar por dentro del ancho máximo, como las
            demás secciones: así la columna 4 cae en la misma vertical que la de "Bilingual". */}
        <div className="self-stretch -mx-[var(--space-gutter-md)] mt-static-2xl">
          <div className="w-full max-w-section-xl mx-auto px-gutter-md grid-layout">
          {/* Un solo párrafo que fluye (sin corte forzado en la coma: dejaba "ti," huérfano) */}
          <p className="col-start-4 col-span-8 text-display-lg font-light overflow-hidden pb-static-xs">
            <span className="co-closing block">
              {closing.map((line, i) => (
                <span key={line}>
                  {i > 0 && " "}
                  {keyed(line)}
                </span>
              ))}
            </span>
          </p>
          </div>
        </div>
      </div>

      <CaseMobileSlider stages={stages} closing={closing} header={header} className="flex lg:hidden motion-reduce:flex" />
    </div>
  );
}
