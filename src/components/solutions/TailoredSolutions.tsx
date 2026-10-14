"use client";

/**
 * @file TailoredSolutions.tsx
 * @description Sección 4 de /solutions — «Tres columnas altas».
 *
 * Paradigma: **tríptico centrado**. Enunciado al eje y tres tarjetas altas en la misma fila, cada
 * una con su icono a línea fina arriba y su pilar abajo. Sin escena, sin gráfico que descifrar:
 * el mensaje de la reunión —todo se arma alrededor del agente— se sostiene en el texto y en la
 * presencia de las tres piezas.
 *
 * Paradigmas quemados en esta sección (no reintroducir):
 *   1. Manifiesto fijo + lista de tres puntos — repetía la firma de la sección vecina.
 *   2. Configurador con pestañas de perfil — "no entiendo la sección, ¿por qué hay tabs?" (13-10).
 *   3. La plantilla como barras grises vacías — "¿qué significa eso?" (13-10).
 *   4. La comparación plantilla/tuyo renglón a renglón — moría como tabla de texto.
 *   5. La escena orbital con la figura de arcilla — "quita esa visual" (13-10).
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoloPlate, { type HoloPlateVariant } from "./HoloPlate";
import { STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";

interface TailoredItem {
  title: string;
  desc: string;
}

/** Una ilustración holográfica por pilar, en el orden del diccionario. */
const PLATES: HoloPlateVariant[] = ["flow", "signature", "support"];

/**
 * El diccionario marca con `**…**` lo que debe pesar. Aquí se parte en trozos y solo esos van en
 * la variante gruesa: el resto se queda en el peso ligero, que es lo que crea la jerarquía dentro
 * de una frase larga sin tener que partirla en dos bloques.
 */
function emphasize(text: string, strongClass: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClass}>
        {chunk}
      </strong>
    ) : (
      chunk
    )
  );
}

/**
 * El titular: lo importante en 700 y primario, contra el 300 del resto de la frase.
 * El `!` es obligatorio — los tokens `text-display-*` fijan su propio `font-weight` y, sin él,
 * la clase de peso no gana y el juego se queda solo en el color.
 */
const HEADLINE_STRONG = "font-bold! text-[var(--color-text-primary)]";
/** Los subtextos de las tarjetas: un escalón más suave, de secundario a primario. */
const CARD_STRONG = "font-medium text-[var(--color-text-primary)]";

export default function TailoredSolutions() {
  const t = useTranslations("solutionsPage.tailored");
  const items = t.raw("items") as TailoredItem[];
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".tl-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".tl-fade", CARD_FROM, { ...CARD_TO, ...oneShot(el, TRIGGER.late) });

      const row = el.querySelector(".tl-row");
      gsap.fromTo(".tl-card", CARD_FROM, { ...CARD_TO, stagger: STAGGER.wave, ...oneShot(row) });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={SECTION}>
      <div className={`mx-auto w-full ${CONTAINER} flex flex-col gap-static-xl lg:gap-static-2xl`}>
        {/* ── ENUNCIADO · a la izquierda en móvil, al eje en escritorio ── */}
        <header className="flex flex-col items-start text-left gap-static-sm max-w-3xl lg:items-center lg:text-center lg:mx-auto">
          <div className="overflow-hidden">
            <p className="tl-birth text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
          </div>
          {/* Sin `overflow-hidden`: el titular ya no nace por líneas, es una frase larga que entra
              entera. Dos pesos del mismo tamaño hacen la jerarquía. */}
          <h2 className="tl-fade text-display lg:text-display-lg font-light! text-balance text-[var(--color-text-secondary)] max-w-5xl">
            {emphasize(t("headline"), HEADLINE_STRONG)}
          </h2>
          <p className="tl-fade text-body-lg text-[var(--color-text-muted)] max-w-2xl">{t("statement")}</p>
        </header>

        {/* ── LOS TRES PILARES ──
            <lg: carrusel con imán, sangrando hasta el borde de la pantalla.
            lg: subgrid — las tres tarjetas comparten las mismas filas (ilustración, título,
            texto), así que los títulos arrancan a la misma altura aunque los párrafos midan
            distinto; la fila de la ilustración es la flexible y se come la diferencia. */}
        <div className="tl-row flex gap-static-md overflow-x-auto snap-x snap-mandatory overscroll-x-contain -mx-gutter-sm px-gutter-sm scroll-px-[var(--space-gutter-sm)] pb-static-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-layout lg:gap-y-static-md lg:mx-0 lg:px-0 lg:pb-0 lg:overflow-visible lg:grid-rows-[1fr_auto_auto] lg:min-h-[calc(var(--spacing-static-2xl)*10)]">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="tl-card group/tile relative snap-start shrink-0 w-[82%] sm:w-[58%] md:w-[46%] lg:w-auto lg:col-span-4 flex flex-col gap-static-md lg:grid lg:grid-rows-subgrid lg:row-span-3 lg:gap-0 rounded-lg border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-1)] p-static-lg lg:p-static-xl transition-colors duration-500 hover:border-[var(--color-brand-blue)]"
            >
              <HoloPlate variant={PLATES[i] ?? PLATES[0]} />

              {/* El corte a dos líneas viene del diccionario: igual en las tres y en los dos idiomas. */}
              <h3 className="text-display-sm whitespace-pre-line text-[var(--color-text-primary)] lg:self-end">
                {item.title}
              </h3>
              <p className="text-body-lg text-pretty text-[var(--color-text-secondary)] lg:pt-static-sm">
                {emphasize(item.desc, CARD_STRONG)}
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
