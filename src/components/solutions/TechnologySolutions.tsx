"use client";

/**
 * @file TechnologySolutions.tsx
 * @description Sección 5 de /solutions — «Una sola frase».
 *
 * Concepto: la tecnología no se enumera, se **dice**. Un párrafo grande nombra las cuatro piezas
 * dentro del texto corrido, con los dos productos que tienen página propia convertidos en enlace.
 * Y el colofón de Business Intelligence es un segundo golpe tipográfico: su frase a tamaño de
 * titular y el detalle debajo a dos columnas de periódico. Ni filas, ni viñetas, ni tarjetas.
 *
 * Esto responde a la reunión mejor que cualquier inventario: *"solamente vamos a mencionar los
 * puntos… no lo hagas tan largo y tan directivo, más como informativo"* (César, 13-10-2026).
 *
 * **Paradigma prohibido en esta sección: la lista de nombre + descripción.** Rechazada cuatro
 * veces el 13-10-2026 en todas sus formas —celdas de retícula, ficha sobre vídeo, planos a doble
 * página y filas a hairline—: *"no quiero un componente con esa lista fea"*. Si hay que nombrar
 * las piezas, se nombran dentro del texto, como aquí.
 *
 * Sin imagen: se quitó la fotografía de la plataforma el 13-10-2026. La sección vive solo de
 * tipografía, que es también lo que la separa de todas sus vecinas.
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";

/** Los nombres que, además de resaltar, llevan a su página. El resto solo pesa más. */
const PRODUCT_HREF: Record<string, string> = {
  "GO CRM": "/go-crm",
  "GO AMS": "/go-ams",
};

/**
 * Parte el párrafo por las marcas `**…**`. Lo marcado sube a primario; si además es un producto
 * con página, se convierte en enlace subrayado dentro del propio texto.
 */
function renderStatement(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) => {
    if (i % 2 === 0) return chunk;
    const href = PRODUCT_HREF[chunk];
    if (!href) {
      return (
        <strong key={i} className="font-medium text-[var(--color-text-primary)]">
          {chunk}
        </strong>
      );
    }
    return (
      <Link
        key={i}
        href={href}
        className="font-medium text-[var(--color-text-primary)] underline decoration-[var(--color-brand-blue)] decoration-2 underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--color-text-accent-blue)]"
      >
        {chunk}
      </Link>
    );
  });
}

export default function TechnologySolutions() {
  const t = useTranslations("solutionsPage.technology");
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      gsap.fromTo(".tc-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".tc-fade", CARD_FROM, { ...CARD_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={SECTION}>
      <div className={`mx-auto w-full ${CONTAINER} flex flex-col gap-static-2xl`}>
        {/* ── EL ENUNCIADO ── */}
        <div className="flex flex-col items-start gap-static-md max-w-5xl">
          <div className="overflow-hidden">
            <p className="tc-birth text-overline text-[var(--color-text-accent-blue)]">{t("overline")}</p>
          </div>
          <div className="overflow-hidden pb-1">
            <h2 className="tc-birth text-display lg:text-display-lg text-[var(--color-text-primary)]">
              {t("headline")}
            </h2>
          </div>
        </div>

        {/* ── LAS DOS MITADES DEL ARGUMENTO ──
            Un solo titular manda en la sección. Debajo, las herramientas y el equipo que las
            mantiene van en paralelo y al MISMO rango: misma etiqueta, mismo cuerpo, misma regla
            encima. Esa es la unión que pidió la reunión —desarrollo y Business Intelligence no
            son dos temas, son uno— y por eso BI ya no lleva titular propio compitiendo con el
            de arriba. */}
        <div className="tc-fade grid-layout gap-y-static-xl items-start">
          {/* Cada mitad abre con su frase gancho —mismo tamaño, mismo peso en las dos— y sigue
              con el detalle en cuerpo menor. Sin ese escalón, las dos columnas se leían como dos
              párrafos sueltos puestos uno al lado del otro. */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-static-sm border-t border-[var(--color-border-Strokes-default)] pt-static-md">
            <p className="text-overline text-[var(--color-text-accent-blue)] pb-static-xs">{t("platformLabel")}</p>
            <p className="text-h4 text-[var(--color-text-primary)]">{t("platformLead")}</p>
            <p className="text-body text-[var(--color-text-secondary)]">{renderStatement(t("statement"))}</p>
          </div>

          <div className="col-span-12 lg:col-start-8 lg:col-span-5 flex flex-col gap-static-sm border-t border-[var(--color-border-Strokes-default)] pt-static-md">
            <p className="text-overline text-[var(--color-text-muted)] pb-static-xs">{t("biOverline")}</p>
            <p className="text-h4 text-[var(--color-text-primary)]">{t("biLead")}</p>
            <p className="text-body text-[var(--color-text-secondary)]">{t("biBody")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
