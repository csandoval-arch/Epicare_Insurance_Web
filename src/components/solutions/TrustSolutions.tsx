"use client";

/**
 * @file TrustSolutions.tsx
 * @description Sección 6 de /solutions — «El sello, en grande».
 *
 * Concepto: la página termina como se cierra un expediente, con el sello estampado. Toda la
 * sección está al eje —la única de /solutions que lo está a pantalla completa— y el sello es el
 * objeto grande del que cuelga todo lo demás: debajo la acreditación, el titular y la cláusula;
 * y el último llamado lo pone, ya fuera de esta sección, el banner de CTA compartido
 * (`CTABannerEpicare`), el mismo de la landing y de /licensing.
 *
 * Por qué centrada: arriba todo va en bandera a la izquierda. Cambiar de eje es lo que avisa de
 * que esto es el final y no un bloque de texto más — era el fallo de la versión anterior, "tres
 * bloques de texto seguidos" (13-10-2026).
 *
 * El sello es geometría propia (anillo doble + marca de verificación). **No imita la marca de
 * G2 Risk Solutions**: la acreditación se nombra en texto, que es lo que se puede afirmar.
 *
 * Paradigmas quemados aquí: la banda azul de cierre a sangre ("ese bloque azul ahí tan feo",
 * 13-10-2026) y el cierre en dos columnas con el sello pequeño al lado.
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";

export default function TrustSolutions() {
  const t = useTranslations("solutionsPage.trust");
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      // El sello se estampa: entra grande y se asienta.
      gsap.fromTo(
        ".tr-seal",
        { opacity: 0, scale: 1.18 },
        {
          opacity: 1,
          scale: 1,
          duration: DUR.cinematic,
          ease: EASE.dramatic,
          force3D: true,
          ...oneShot(el, TRIGGER.late),
        }
      );
      gsap.fromTo(".tr-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".tr-fade", CARD_FROM, { ...CARD_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });

    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={SECTION}>
      <div className={`mx-auto w-full ${CONTAINER} flex flex-col items-center text-center`}>
        {/* ── EL SELLO ── */}
        <span
          aria-hidden="true"
          className="tr-seal inline-flex items-center justify-center w-[calc(var(--spacing-static-2xl)*2.5)] h-[calc(var(--spacing-static-2xl)*2.5)] text-[var(--color-text-accent-blue)]"
        >
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <g fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="24" cy="24" r="23" />
              <circle cx="24" cy="24" r="18" />
              <path d="M15.5 24.5l5.5 5.5L32.5 19" strokeWidth="1.2" />
            </g>
          </svg>
        </span>

        <p className="tr-fade text-overline text-[var(--color-text-primary)] pt-static-md">{t("sealTitle")}</p>
        <p className="tr-fade text-body-sm text-[var(--color-text-muted)] pt-static-xs">{t("badge")}</p>

        {/* ── LA CLÁUSULA ── */}
        <div className="overflow-hidden pb-1 pt-static-xl">
          <h2 className="tr-birth text-display lg:text-display-lg text-[var(--color-text-primary)] max-w-4xl">
            {t("headline")}
          </h2>
        </div>
        <p className="tr-fade text-body-lg text-[var(--color-text-secondary)] max-w-2xl pt-static-md">{t("desc")}</p>

      </div>
    </section>
  );
}
