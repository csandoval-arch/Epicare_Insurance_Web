"use client";

/**
 * @file RoleTeam.tsx
 * @description Acto 03 de /team — "Your role": casting de caminos. En lugar de una lista, dos
 * preguntas (¿cómo trabajas? → ¿desde dónde empiezas?) llevan a uno de los 4 caminos oficiales del
 * brandbook, junto a la figura de quien te acompaña y el CTA. Los 4 caminos quedan visibles en una
 * lista compacta debajo: el selector acelera la decisión, no esconde nada (y la lista también elige).
 * Fondo oscuro en los dos temas (`dark` en la sección): es el "fundido a negro" de la página.
 * - Desktop (≥lg): preguntas a la izquierda (col 1-6), resultado a la derecha (col 8-12).
 * - Móvil: todo apilado; las opciones a todo el ancho.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import CaseHeader from "./case/CaseHeader";
import RoleResult from "./role/RoleResult";
import type { RoleGroup, RoleGroupKey, RolePath } from "./role/rolePaths";

// ── ESTILOS DE OPCIÓN (seleccionada / libre) ──
const GROUP_BTN =
  "group/opt w-full text-left rounded-lg border px-static-lg py-static-md flex flex-col gap-static-xs transition-[translate,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)] cursor-pointer";
const GROUP_ON = "border-[var(--color-brand-blue)] bg-[var(--color-surface-BG-1)]";
const GROUP_OFF = "border-[var(--color-border-Strokes-default)] hover:border-[var(--color-border-Strokes-Hover)]";
const PILL_BTN =
  "rounded-full border px-static-lg h-static-2xl text-body-md transition-[translate,border-color,background-color,color] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)] cursor-pointer";
const PILL_ON = "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)] text-[var(--color-text-White-100)]";
const PILL_OFF = "border-[var(--color-border-Strokes-default)] text-[var(--color-text-primary)] hover:border-[var(--color-border-Strokes-Hover)]";

export default function RoleTeam() {
  const t = useTranslations("team.role");
  const groups = t.raw("groups") as RoleGroup[];
  const paths = t.raw("paths") as RolePath[];
  const ref = useRef<HTMLElement>(null);

  const [pathKey, setPathKey] = useState(paths[0].key);
  const [touched, setTouched] = useState(false);
  const path = paths.find((p) => p.key === pathKey) ?? paths[0];
  const groupPaths = paths.filter((p) => p.group === path.group);

  const choose = (key: string) => {
    setTouched(true);
    setPathKey(key);
  };
  /** Cambiar de grupo lleva al primer camino de ese grupo (si ya estabas en él, no cambia nada). */
  const chooseGroup = (group: RoleGroupKey) => {
    if (group === path.group) return;
    choose(paths.find((p) => p.group === group)!.key);
  };

  // ── ENTRADA (one-shot al llegar) ──
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = (trigger: string) => ({ scrollTrigger: { trigger: el.querySelector(trigger), start: TRIGGER.standard } });
      gsap.fromTo(".rt-reveal", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, stagger: STAGGER.wave, ...st(".rt-steps") });
      gsap.fromTo(".rr-figure", { y: REVEAL.lg, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, ease: EASE.out, delay: STAGGER.wave, ...st(".rt-steps") });
      gsap.fromTo(".rt-path", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, ...st(".rt-list") });
    });
    return () => mm.revert();
  }, []);

  // ── VIDA LATENTE: la respiración de la figura se pausa fuera de pantalla ──
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-offscreen", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="rt-root dark relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] py-section-md lg:py-section-lg overflow-hidden">
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md">
        <div className="grid-layout gap-y-static-2xl items-end">
          {/* ── PREGUNTAS ── */}
          <div className="col-span-full lg:col-span-6 flex flex-col gap-static-2xl">
            <CaseHeader ns="team.role" />

            <div className="rt-steps flex flex-col gap-static-xl">
              <div className="rt-reveal flex flex-col gap-static-sm">
                <p className="text-meta text-[var(--color-text-secondary)]">{t("stepOne")}</p>
                <div className="grid sm:grid-cols-2 gap-static-sm">
                  {groups.map((g) => {
                    const on = g.key === path.group;
                    return (
                      <button key={g.key} type="button" aria-pressed={on} onClick={() => chooseGroup(g.key)} className={`${GROUP_BTN} ${on ? GROUP_ON : GROUP_OFF}`}>
                        <span className="text-h5">{g.kicker}</span>
                        <span className="text-body-md text-[var(--color-text-secondary)]">{g.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rt-reveal flex flex-col gap-static-sm">
                <p className="text-meta text-[var(--color-text-secondary)]">{t("stepTwo")}</p>
                <div className="flex flex-wrap gap-static-sm">
                  {groupPaths.map((p) => {
                    const on = p.key === path.key;
                    return (
                      <button key={p.key} type="button" aria-pressed={on} onClick={() => choose(p.key)} className={`${PILL_BTN} ${on ? PILL_ON : PILL_OFF}`}>
                        {p.tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── RESULTADO ── */}
          <div className="col-span-full lg:col-start-7 lg:col-span-6">
            <RoleResult key={path.key} path={path} guideLabel={t("guideLabel")} cta={t("cta")} animate={touched} />
          </div>
        </div>

        {/* ── LOS 4 CAMINOS (siempre visibles; también eligen) ── */}
        <div className="rt-list pt-section-sm">
          <p className="text-meta text-[var(--color-text-secondary)] mb-static-md">{t("allPaths")}</p>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-static-lg lg:gap-x-static-xl gap-y-static-lg">
            {paths.map((p) => {
              const on = p.key === path.key;
              return (
                <li key={p.key} className="rt-path">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(p.key)}
                    className="group/path relative w-full text-left pt-static-md border-t border-[var(--color-border-Strokes-default)] flex flex-col gap-static-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)]"
                  >
                    {/* El tramo de la hairline se pinta de azul: activo, o al hover */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -top-px h-px bg-[var(--color-brand-blue)] origin-left transition-transform duration-500 ease-out ${on ? "scale-x-100" : "scale-x-0 group-hover/path:scale-x-100"}`}
                    />
                    <span className="text-meta text-[var(--color-text-secondary)]">
                      {p.n} · {p.tag}
                    </span>
                    <span className={`text-body-lg transition-colors duration-200 ${on ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover/path:text-[var(--color-text-primary)]"}`}>
                      {p.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
