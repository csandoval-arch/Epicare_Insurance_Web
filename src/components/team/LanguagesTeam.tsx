"use client";

/**
 * @file LanguagesTeam.tsx
 * @description Acto B de /team — "Two languages. One team.": EN + ES en paralelo, no traducción
 * (brandbook). Una frase del equipo escrita en los dos idiomas — cada versión original en su idioma —
 * como un párrafo por idioma: al cambiar, el párrafo sale hacia arriba por su máscara y el otro
 * idioma entra desde abajo. Un interruptor EN/ES elige; mientras nadie lo toca, el tablero alterna
 * solo (una hairline azul bajo el interruptor mide el tiempo hasta el próximo cambio — vida latente,
 * pausada fuera de pantalla). Los tres bloques (encabezado, interruptor y tablero) apilados en las
 * columnas 4–11 de desktop, alineados a la izquierda; en móvil, a todo el ancho.
 * El párrafo vive en `team.languages.paragraph` como par { en, es } (igual en los dos diccionarios).
 */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import CaseHeader from "./case/CaseHeader";

type Lang = "en" | "es";
const LANGS: Lang[] = ["en", "es"];
/** Segundos que cada idioma se queda en el tablero cuando alterna solo. Margen creativo. */
const AUTO_HOLD = 4;
const FULL = "(prefers-reduced-motion: no-preference)";

export default function LanguagesTeam() {
  const t = useTranslations("team.languages");
  /** Jerarquía dentro del párrafo: todo en peso ligero; las ideas clave (`<k>`) recuperan el peso del
   *  token y la principal (`<b>`) además va en el azul de marca. Margen creativo: font-light en display. */
  const key = (chunks: ReactNode) => <span className="font-semibold">{chunks}</span>;
  const blue = (chunks: ReactNode) => <span className="font-semibold text-[var(--color-text-accent-blue)]">{chunks}</span>;
  const ref = useRef<HTMLElement>(null);
  const [lang, setLang] = useState<Lang>("en");
  const auto = useRef(true);
  const first = useRef(true);

  const locale = useLocale();
  const boardRef = useRef<HTMLDivElement>(null);
  /** Idioma visible, para colocar las líneas cuando SplitText vuelve a partir (resize, fuentes). */
  const langRef = useRef<Lang>("en");

  // ── EL TABLERO: cada párrafo se parte en sus líneas REALES (donde corta el ancho, sin saltos
  //    forzados), cada una en su máscara. La versión activa en su sitio; la otra, fuera por debajo.
  //    Se rehace al cambiar el idioma de la página (el tablero se remonta con `key={locale}`). ──
  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    gsap.registerPlugin(SplitText);
    const splits = LANGS.map((l) => {
      const p = el.querySelector<HTMLElement>(`.lt-${l}`)!;
      return SplitText.create(p, {
        type: "lines",
        mask: "lines",
        linesClass: "lt-line",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(self.lines, { yPercent: l === langRef.current ? 0 : 110 });
          gsap.set(p, { visibility: "visible" });
        },
      });
    });
    return () => splits.forEach((s) => s.revert());
  }, [locale]);

  // ── EL CAMBIO: tablero de salidas — las líneas del idioma que sale suben por su máscara y las del
  //    que entra suben desde abajo, línea a línea (en ola). ──
  useLayoutEffect(() => {
    langRef.current = lang;
    if (first.current) {
      first.current = false;
      return;
    }
    const el = boardRef.current;
    if (!el) return;
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = (l: Lang) => el.querySelectorAll(`.lt-${l} .lt-line`);
    const motion = { duration: instant ? 0 : DUR.base, ease: EASE.dramatic, stagger: instant ? 0 : STAGGER.wave, force3D: true, overwrite: true };
    const ctx = gsap.context(() => {
      gsap.to(lines(lang === "en" ? "es" : "en"), { yPercent: -110, ...motion });
      gsap.fromTo(lines(lang), { yPercent: 110 }, { yPercent: 0, ...motion });
    }, el);
    return () => ctx.kill();
  }, [lang]);

  // ── ALTERNANCIA AUTOMÁTICA + ENTRADA ──
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add(FULL, () => {
      const timer = gsap.fromTo(
        ".lt-timer",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: AUTO_HOLD,
          ease: EASE.none,
          paused: true,
          repeat: -1,
          onRepeat: () => auto.current && setLang((l) => (l === "en" ? "es" : "en")),
        }
      );
      ScrollTrigger.create({ trigger: el, start: "top 70%", end: "bottom 30%", onToggle: (self) => (self.isActive && auto.current ? timer.play() : timer.pause()) });
    });
    return () => mm.revert();
  }, []);

  /** Elegir a mano apaga la alternancia: el tablero ya es de quien lo toca. */
  const choose = (l: Lang) => {
    auto.current = false;
    const timer = ref.current?.querySelector(".lt-timer");
    if (timer) {
      gsap.getTweensOf(timer).forEach((tw) => tw.pause());
      gsap.set(timer, { scaleX: 0 });
    }
    setLang(l);
  };

  return (
    <section ref={ref} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] py-section-md lg:py-section-lg">
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md">
        <div className="grid-layout gap-y-static-2xl items-start">
          <div className="col-span-full lg:col-start-4 lg:col-span-8">
            <CaseHeader ns="team.languages" />
          </div>

          {/* ── INTERRUPTOR EN / ES ── */}
          <div className="col-span-full lg:col-start-4 lg:col-span-8 w-fit flex flex-col gap-static-sm">
            <div role="group" aria-label={t("toggleLabel")} className="relative grid grid-cols-2 rounded-full border border-[var(--color-border-Strokes-default)] p-1 w-fit">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[var(--color-hero-ink)] transition-[translate] duration-500 ease-out"
                style={{ translate: lang === "en" ? "0 0" : "100% 0" }}
              />
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => choose(l)}
                  className={`relative z-10 h-static-xl px-static-lg rounded-full text-ui-label transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-border-Strokes-focus)] ${
                    lang === l ? "text-[var(--color-hero-ivory)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {t(`toggle.${l}`)}
                </button>
              ))}
            </div>
            <div aria-hidden="true" className="h-px w-full bg-[var(--color-border-Strokes-default)] overflow-hidden">
              <span className="lt-timer block h-full origin-left bg-[var(--color-brand-blue)] scale-x-0" />
            </div>
          </div>

          {/* ── EL TABLERO: cada idioma es UN párrafo; los dos se apilan en la misma celda (alto = el más
              largo) y SplitText los parte en líneas con máscara (ver efectos arriba).
              Margen creativo: 0.12em de holgura bajo cada máscara para los descendentes (g, p, y),
              devuelta con margen negativo para no alterar el interlineado. ── */}
          <style href="team-languages" precedence="default">{`.lt-line-mask{padding-bottom:0.12em;margin-bottom:-0.12em}`}</style>
          <div key={locale} ref={boardRef} aria-live="polite" className="col-span-full lg:col-start-4 lg:col-span-8 grid text-display lg:text-display-lg">
            {LANGS.map((l) => (
              <p
                key={l}
                lang={l}
                aria-hidden={lang !== l}
                className={`lt-${l} [grid-area:1/1] font-light`}
                // Sin JS se lee el inglés; el español aparece cuando SplitText ya colocó sus líneas.
                style={l === "es" ? { visibility: "hidden" } : undefined}
              >
                {t.rich(`paragraph.${l}`, { b: blue, k: key })}
              </p>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
