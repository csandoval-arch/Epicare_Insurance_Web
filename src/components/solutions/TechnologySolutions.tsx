"use client";

/**
 * @file TechnologySolutions.tsx
 * @description Sección 5 de /solutions — «La plancha».
 *
 * Concepto: **una sola fotografía, y la palabra encima.** El acto II no es una imagen al lado de
 * un texto: es una plancha cinematográfica a sangre de 92vh sobre la que se componen las tres
 * lecturas del equipo, en blanco, cada una colgada de una regla que se dibuja de izquierda a
 * derecha. La fotografía viaja más despacio que la plancha y respira cuando el scroll se detiene.
 *
 * Dos actos:
 *  I · EL TITULAR — «**Business Intelligence** es el equipo que mantiene la agencia por delante
 *      del mercado», con el nombre del equipo en azul de marca DENTRO del título (pedido del
 *      usuario, 14-10-2026; por eso la sección no lleva overline: sería la misma etiqueta dos
 *      veces). Al lado, en columna corta, sobre qué plataforma opera el agente: las cuatro piezas
 *      se nombran dentro del texto corrido, porque la lista de nombre + descripción se rechazó
 *      cuatro veces el 13-10-2026 (*"no quiero un componente con esa lista fea"*).
 *  II · LA PLANCHA — qué hace el equipo, escrito sobre la escena.
 *
 * Paradigmas ya rechazados por el usuario en esta sección, en `_quarantine/solutions/` (no volver
 * a proponerlos): dos columnas de párrafo bajo un titular-losa · foto a un lado y texto al otro
 * (dos veces, con y sin sangrado) · tríptico de tres fotografías.
 *
 * Desviaciones declaradas (Reporte de Margen Creativo):
 *  · El velo de la plancha es un `linear-gradient` inline derivado por `color-mix` del token
 *    `--color-surface-BG-black`: el DS no tiene tokens de gradiente y el hex a mano está prohibido.
 *  · Alturas de encuadre en `vh`, igual que el hero de esta página.
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { DUR, EASE, STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";
import HoloIcon, { type HoloVariant } from "./HoloIcon";

/**
 * Iconografía diegética de las tres lecturas (skill `holographic-tech-visuals`). Siluetas nuevas,
 * no las de la sección de la agencia: dos secciones de la misma página no comparten icono.
 */
const READING_ICONS: HoloVariant[] = ["metrics", "build", "tools"];

/**
 * ⚠️ PROVISIONAL: fotografía de archivo, no es el equipo de Epicare. Sustituir por la sesión
 * propia de Business Intelligence antes de dar la página por cerrada.
 */
const PLATE_PHOTO = "/Files/Solutions/people-tech-convergence.jpg";

/**
 * Velo de la plancha. Doble: oscurece de izquierda a derecha (donde vive la palabra) y remata por
 * abajo, para que el blanco se lea sobre las zonas claras de la foto sin apagar la escena entera.
 */
const PLATE_VEIL =
  "linear-gradient(to top, color-mix(in srgb, var(--color-surface-BG-black) 62%, transparent) 0%, color-mix(in srgb, var(--color-surface-BG-black) 24%, transparent) 38%, transparent 68%)";

/** Los nombres que, además de resaltar, llevan a su página. El resto solo pesa más. */
const PRODUCT_HREF: Record<string, string> = {
  "GO CRM": "/go-crm",
  "GO AMS": "/go-ams",
};

/** Parte el texto por las marcas `**…**`: lo marcado sube a primario y, si es producto, enlaza. */
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

/**
 * Igual que `renderStatement`, pero para la palabra que vive SOBRE la fotografía. Todo el texto
 * va en blanco pleno (sin grises, decisión del usuario 14-10-2026): la jerarquía dentro de la
 * frase la marca solo el peso. Aquí no hay enlaces: una frase sobre una escena no se interrumpe
 * con un subrayado.
 */
function renderOverImage(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 0 ? chunk : (
      <strong key={i} className="font-semibold">
        {chunk}
      </strong>
    )
  );
}

export default function TechnologySolutions() {
  const t = useTranslations("solutionsPage.technology");
  const readings = t.raw("readings") as string[];
  const sectionRef = useRef<HTMLElement>(null);
  /** Los bucles de los iconos solo corren con la plancha en pantalla (HARDWARE-SYMPHONY). */
  const [plateInView, setPlateInView] = useState(false);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      // ── ACTO I ──
      gsap.fromTo(".tc-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
      gsap.fromTo(".tc-fade", CARD_FROM, { ...CARD_TO, ...oneShot(el, TRIGGER.late) });

      // ── ACTO II · la plancha, con disparador propio ──
      const plate = el.querySelector(".tc-plate");

      // Cortina: la plancha se levanta desde abajo. Nada entra con un fade plano.
      gsap.fromTo(
        ".tc-plate",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: DUR.cinematic,
          ease: EASE.dramatic,
          ...oneShot(plate, TRIGGER.early),
        }
      );

      gsap.fromTo(".tc-read", BIRTH_FROM, {
        ...BIRTH_TO,
        stagger: STAGGER.wave,
        ...oneShot(plate, TRIGGER.late),
      });

      // Entrada de las tarjetas: suben escalonadas y sueltan el transform al acabar. Barata a
      // propósito —son vidrio, y mantener un `will-change` vivo obliga a recomponer el blur.
      gsap.fromTo(".tc-glass", CARD_FROM, {
        ...CARD_TO,
        stagger: STAGGER.wave,
        ...oneShot(plate, TRIGGER.late),
      });

      // La fotografía NO se mueve: cualquier desplazamiento suyo (parallax o respiración) obliga
      // al `backdrop-filter` de las tres tarjetas a recomponerse en cada frame y el vidrio se
      // arrastra sobre los bordes. Retirado por petición del usuario (14-10-2026).
    });

    // Los iconos holográficos solo laten con la plancha a la vista.
    const watcher = ScrollTrigger.create({
      trigger: el.querySelector(".tc-plate"),
      start: TRIGGER.parallaxStart,
      end: TRIGGER.parallaxEnd,
      onToggle: ({ isActive }) => setPlateInView(isActive),
    });

    return () => {
      watcher.kill();
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={SECTION}>
      {/* ── ACTO I · EL TITULAR ──
          Dos columnas desiguales: la plataforma se lee AL LADO del título, no 200px más abajo. */}
      <div className={`mx-auto w-full ${CONTAINER} grid-layout gap-y-static-lg items-end`}>
        <div className="col-span-12 lg:col-span-7">
          <div className="overflow-hidden pb-1">
            <h2 className="tc-birth text-display lg:text-display-lg text-[var(--color-text-primary)]">
              <span className="text-[var(--color-brand-blue)]">{t("headlineAccent")}</span>{" "}
              {t("headlineRest")}
            </h2>
          </div>
        </div>

        <p className="tc-fade col-span-12 lg:col-start-9 lg:col-span-4 text-body text-[var(--color-text-secondary)]">
          {renderStatement(t("statement"))}
        </p>
      </div>

      {/* ── ACTO II · LA PLANCHA ──
          Fuera del contenedor: toca los dos bordes del viewport. Una sola imagen; lo que se dice
          encima de ella es lo que separa y jerarquiza el trabajo del equipo. */}
      <div className="tc-plate relative w-full mt-static-2xl h-[88vh] min-h-[34rem] lg:h-[92vh] lg:max-h-[52rem] overflow-hidden bg-[var(--color-surface-BG-1)]">
        {/* Quieta: el vidrio de las tarjetas difumina lo que tiene detrás, y una imagen en
            movimiento bajo un `backdrop-filter` se arrastra en cada frame. */}
        <img
          src={asset(PLATE_PHOTO)}
          alt={t("imageAlt")}
          className="tc-shot absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />

        <span aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: PLATE_VEIL }} />

        {/* ── LA BANDA DE PIE ──
            Las tres lecturas no se apilan: se reparten en pie de plancha, en celdas iguales
            separadas por una hairline, alineadas a la misma retícula que el resto de la página.
            Cada celda es UNA frase completa —el verbo en blanco pleno, el resto atenuado—, no un
            título con su descripción debajo: así ninguna se lee partida por la mitad. */}
        {/* `dark` local: la banda vive sobre una fotografía, así que su vidrio es SIEMPRE el
            oscuro, en los dos temas de la página. El bloque `.glass-milky` de `globals.css` ya
            contempla este caso ("tampoco dentro de un `.dark` local"). */}
        <div className="dark absolute inset-x-0 bottom-0">
          <div className={`mx-auto w-full ${CONTAINER} pb-section-xs lg:pb-section-sm`}>
            {/* Tres hojas de vidrio independientes, radio 4px (pedido del usuario, 14-10-2026).
                Nota de rendimiento: el sistema pide un único blur en pantalla; aquí son tres
                sobre una fotografía con parallax. Es una desviación consciente, acotada a esta
                banda y solo en desktop ancho. */}
            <ol className="grid grid-cols-1 lg:grid-cols-3 gap-static-md">
              {readings.map((reading, i) => (
                <li
                  key={reading}
                  className="tc-glass relative overflow-hidden rounded glass-liquid flex flex-col items-start justify-between gap-static-xl px-gutter-sm py-static-lg md:px-static-lg md:py-static-xl lg:p-static-xl lg:min-h-72"
                >
                  <span aria-hidden="true" className="glass-liquid-sheen pointer-events-none absolute inset-0" />

                  {/* El icono es la única marca de la tarjeta: sin regla debajo. */}
                  <span className="relative">
                    <HoloIcon variant={READING_ICONS[i] ?? "metrics"} active={plateInView} chrome={false} />
                  </span>

                  <div className="relative overflow-hidden pb-1">
                    <p className="tc-read text-h2 text-[var(--color-text-White-100)]">
                      {renderOverImage(reading)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
