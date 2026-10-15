"use client";

/**
 * @file TechnologySolutions.tsx
 * @description Sección 5 de /solutions — «La plancha partida».
 *
 * Concepto: **una sola fotografía, cortada en tres**. El acto II no es una imagen al lado de un
 * texto ni una plancha con una banda de pie: es la misma escena repartida en tres franjas
 * separadas por el aire del DS, y cada franja lleva encima su lectura del equipo en una hoja de
 * vidrio líquido. Juntas se leen como una sola fotografía; separadas, cada una sostiene su idea.
 *
 * Paradigma traído de `ContactVsOpportunity` de /go-crm (APROBADO 2026-10-07, *"hermoso"*), por
 * pedido del usuario el 15-10-2026: cortina por franja de izquierda a derecha, la foto asentándose
 * a otra velocidad detrás, y la tarjeta subiendo después de cada franja. Lo que se trae es la
 * mecánica; el material del vidrio es el del DS (`glass-liquid`), no el CSS local de aquella.
 *
 * Dos actos:
 *  I · EL TITULAR — «**Business Intelligence** es el equipo que mantiene la agencia por delante
 *      del mercado», con el nombre del equipo en azul de marca DENTRO del título (pedido del
 *      usuario, 14-10-2026; por eso la sección no lleva overline: sería la misma etiqueta dos
 *      veces). Al lado, en columna corta, sobre qué plataforma opera el agente: las cuatro piezas
 *      se nombran dentro del texto corrido, porque la lista de nombre + descripción se rechazó
 *      cuatro veces el 13-10-2026 (*"no quiero un componente con esa lista fea"*).
 *  II · LAS TRES FRANJAS — qué hace el equipo, escrito sobre la escena.
 *
 * Paradigmas ya rechazados por el usuario en esta sección, en `_quarantine/solutions/` (no volver
 * a proponerlos): dos columnas de párrafo bajo un titular-losa · foto a un lado y texto al otro
 * (dos veces, con y sin sangrado) · tríptico de tres fotografías distintas.
 *
 * Desviaciones declaradas (Reporte de Margen Creativo):
 *  · El velo de cada franja es un `linear-gradient` derivado por `color-mix` del token
 *    `--color-overlay-backdrop`: el DS no tiene tokens de gradiente y el hex a mano está prohibido.
 *  · Alturas de encuadre en `vh`, igual que el hero de esta página.
 *  · `SLICE_IMAGE_START`: la foto arranca un 8% más cerca dentro de su franja y se asienta — es lo
 *    que da la segunda velocidad detrás de la cortina.
 */

import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/asset";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import { BIRTH_FROM, BIRTH_TO, CARD_FROM, CARD_TO, CONTAINER, FULL, SECTION, oneShot } from "./shared";
import { ChartLineUp, GearSix, PlugsConnected } from "@phosphor-icons/react";

/**
 * Iconos de las tres lecturas, rediseñados el 15-10-2026: los holográficos de `HoloIcon` se
 * retiraron por pedido del usuario y entran los de la sección aprobada de /go-crm — trazo Phosphor
 * en `bold` dentro de un círculo translúcido con hairline, y un anillo que se expande y se apaga
 * detrás, desfasado entre tarjetas. Cada uno con su carácter: la métrica sube, el enchufe late, el
 * engranaje gira.
 * Vida latente en CSS (solo transform/opacity), en pausa fuera de pantalla y con reduced-motion.
 * Margen creativo declarado: duraciones propias de loop, curvas suaves tipo sine.
 */
const READING_ICONS = [
  { Icon: ChartLineUp, loop: "tc-ico-rise" },
  { Icon: PlugsConnected, loop: "tc-ico-beat" },
  { Icon: GearSix, loop: "tc-ico-turn" },
] as const;

const ICON_LOOPS_CSS = `
@keyframes tc-rise { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -3px, 0); } }
@keyframes tc-beat { 0%, 40%, 100% { transform: scale(1); } 10% { transform: scale(1.12); } 20% { transform: scale(1); } 30% { transform: scale(1.06); } }
@keyframes tc-turn { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tc-ring { 0% { transform: scale(0.6); opacity: 0.45; } 70%, 100% { transform: scale(1.7); opacity: 0; } }
.tc-ico-rise { animation: tc-rise 3s cubic-bezier(0.37, 0, 0.63, 1) infinite; }
.tc-ico-beat { animation: tc-beat 1.8s cubic-bezier(0.37, 0, 0.63, 1) infinite; }
.tc-ico-turn { animation: tc-turn 14s linear infinite; }
.tc-ico-ring { animation: tc-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.tc-paused .tc-ico-rise, .tc-paused .tc-ico-beat, .tc-paused .tc-ico-turn, .tc-paused .tc-ico-ring { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .tc-ico-rise, .tc-ico-beat, .tc-ico-turn, .tc-ico-ring { animation: none; } .tc-ico-ring { opacity: 0; } }
`;


/**
 * ⚠️ PROVISIONAL: fotografía de archivo, no es el equipo de Epicare. Sustituir por la sesión
 * propia de Business Intelligence antes de dar la página por cerrada.
 */
const PLATE_PHOTO = "/Files/Solutions/people-tech-convergence.webp";

const SLICES = [0, 1, 2] as const;

/** Separación entre franjas: 0 desde el 15-10-2026 (pedido del usuario) — la foto vuelve a leerse
 *  entera y el corte lo marca solo la cortina al entrar. El cálculo se mantiene parametrizado. */
const SLICE_GAP = "0px";

/** Zoom de partida de la foto dentro de cada franja mientras se descubre (segunda velocidad). */
const SLICE_IMAGE_START = 1.08;

/**
 * Velo de cada franja: oscurece la parte baja, que es donde se apoya el vidrio. Sin él, el blanco
 * de la tarjeta se juega el contraste contra lo que haya en la foto.
 */
const PHOTO_SCRIM =
  "absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--color-overlay-backdrop)]/65 via-[var(--color-overlay-backdrop)]/25 to-transparent pointer-events-none";

/**
 * Parte el texto por las marcas `**…**` para la palabra que vive SOBRE la fotografía. Todo el texto
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

/**
 * Fondo propio de la sección: `--color-surface-BG-contrast`, el único token de superficie que
 * INVIERTE el sentido del tema (añadido al DS el 15-10-2026 para este caso). En claro es el gris
 * profundo `#191A1A`; en oscuro sube al gris de marca `#2F3437`, más claro que la página — así el
 * corte de sección se ve en los DOS modos. Con el token normal la sección desaparecía en oscuro.
 * Antes se probaron el azul y el escalón BG-1, descartados.
 *
 * ⚠️ El `dark` local va DENTRO (`.tc-ink`), nunca en esta misma clase: si la sección lleva `dark`,
 * resuelve el token contra su propio bloque `.dark` y se queda clavada en `#2F3437` en los dos
 * temas — el fondo deja de cambiar y se pierde el corte justo en claro. El fondo lo pone la
 * sección (tema de la página); la tinta clara, el envoltorio de dentro.
 * El `pt` es la excepción declarada a la regla de un solo dueño del espacio: sin él el corte de
 * color cae pegado al titular.
 */
const SECTION_SURFACE =
  SECTION.replace("bg-[var(--color-surface-BG-base)]", "bg-[var(--color-surface-BG-contrast)]") +
  " pt-section-sm lg:pt-section-md";

/**
 * Tinta del bloque que vive sobre esa superficie: remapea los dos tokens de texto a la pareja
 * invertida del DS. Todo lo que haya dentro (titular, párrafo, enlaces) se aclara u oscurece con
 * la plancha, sin tocar una clase. La escena de la foto NO lo usa: su vidrio es siempre el oscuro.
 */
const INK_ON_CONTRAST = {
  "--color-text-primary": "var(--color-text-on-contrast)",
  "--color-text-secondary": "var(--color-text-on-contrast-soft)",
} as React.CSSProperties;

export default function TechnologySolutions() {
  const t = useTranslations("solutionsPage.technology");
  const readings = t.raw("readings") as string[];
  const sectionRef = useRef<HTMLElement>(null);
  /** Los bucles de los iconos solo corren con la escena en pantalla (HARDWARE-SYMPHONY). */
  const [plateInView, setPlateInView] = useState(false);
  /** Móvil: mueve el tramo del indicador según el progreso del scroll horizontal (sin re-render). */
  const thumbRef = useRef<HTMLSpanElement>(null);
  const onRowScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const max = row.scrollWidth - row.clientWidth;
    if (thumbRef.current) thumbRef.current.style.transform = `translate3d(${max > 0 ? (row.scrollLeft / max) * 100 : 0}%, 0, 0)`;
  };

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia(el);

    mm.add(FULL, () => {
      // ── ACTO I ──
      gsap.fromTo(".tc-birth", BIRTH_FROM, { ...BIRTH_TO, stagger: STAGGER.base, ...oneShot(el, TRIGGER.late) });
    });

    // ── ACTO II (desktop) · la escena entra ENTERA (15-10-2026: nada de tres columnas).
    //    Una sola cortina sube desde abajo mientras su interior hace lo inverso —la foto se queda
    //    quieta y lo que viaja es el corte— y la imagen se asienta detrás a otra velocidad. Solo
    //    cuando la escena está puesta llegan las tres lecturas, escalonadas. Solo transform/opacity. ──
    mm.add(`(min-width: 768px) and ${FULL}`, () => {
      const scene = el.querySelector(".tc-plate");
      const tl = gsap.timeline({ defaults: { force3D: true }, ...oneShot(scene, TRIGGER.early) });

      tl.fromTo(".tc-curtain", { yPercent: 100 }, { yPercent: 0, duration: DUR.slow, ease: EASE.dramatic }, 0)
        .fromTo(".tc-curtain-inner", { yPercent: -100 }, { yPercent: 0, duration: DUR.slow, ease: EASE.dramatic }, 0)
        .fromTo(".tc-shot", { scale: SLICE_IMAGE_START }, { scale: 1, duration: DUR.cinematic, ease: EASE.out }, 0)
        .fromTo(".tc-glass", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.wave }, 0.55)
        .fromTo(".tc-read", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.base, ease: EASE.dramatic, stagger: STAGGER.wave }, 0.65);
    });

    // ── ACTO II (móvil) · los cuadrados de vidrio suben escalonados al asomar la foto ──
    mm.add(`(max-width: 767px) and ${FULL}`, () => {
      gsap.fromTo(".tc-m-card", CARD_FROM, {
        ...CARD_TO,
        stagger: STAGGER.wave,
        ...oneShot(el.querySelector(".tc-m-photo"), TRIGGER.standard),
      });
    });

    // Los iconos holográficos solo laten con la escena a la vista.
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

  /**
   * La lectura `i` dentro de su hoja de vidrio. Sin icono (15-10-2026: los holográficos se
   * retiraron por pedido del usuario): la única marca es una regla corta de azul de marca sobre
   * la frase — el mismo acento que cierra el resto de la página.
   */
  const readingCard = (i: number, { compact = false } = {}) => {
    const { Icon, loop } = READING_ICONS[i] ?? READING_ICONS[0];
    return (
      <>
        <span aria-hidden="true" className="glass-liquid-sheen pointer-events-none absolute inset-0" />

        {/* Círculo translúcido con hairline y anillo que se expande detrás; el trazo toma el color
            del texto, así vale igual sobre el vidrio oscuro que en cualquier superficie clara. */}
        <span
          aria-hidden="true"
          className="relative shrink-0 grid place-items-center rounded-full border border-[var(--color-text-White-100)]/30 bg-[var(--color-text-White-100)]/10 text-[var(--color-text-White-100)] size-static-2xl"
        >
          <span
            className="tc-ico-ring absolute inset-0 rounded-full border border-[var(--color-text-White-100)]"
            style={{ animationDelay: `${i * 0.8}s` }}
          />
          <Icon weight="bold" className={`${loop} relative size-1/2`} style={{ animationDelay: `${i * 0.4}s` }} />
        </span>

        {/* Altura reservada de 3 líneas (`lh` = la altura de línea del propio token): las tres
            frases ocupan la misma caja aunque una sea más corta, y ninguna empuja a su tarjeta.
            Un token por encima del tamaño anterior (h3→h2 en desktop, h4→h3 en móvil). */}
        <div className="relative overflow-hidden pb-1 [min-height:3lh]">
          <p className={`tc-read ${compact ? "text-h3" : "text-h2"} text-[var(--color-text-White-100)]`}>
            {renderOverImage(readings[i] ?? "")}
          </p>
        </div>
      </>
    );
  };

  return (
    <section ref={sectionRef} className={`${SECTION_SURFACE} ${plateInView ? "" : "tc-paused"}`}>
      <style href="tc-icon-loops" precedence="default">{ICON_LOOPS_CSS}</style>

      {/* ── ACTO I · EL TITULAR ──
          Dos columnas desiguales: la plataforma se lee AL LADO del título, no 200px más abajo.
          La tinta se remapea a la pareja invertida del token de superficie: así el titular y el
          párrafo son blancos sobre la plancha oscura del modo claro y tinta sobre la plancha clara
          del modo oscuro, sin un `dark` local (que congelaría el fondo; ver SECTION_SURFACE). */}
      <div
        className={`tc-ink mx-auto w-full ${CONTAINER} grid-layout gap-y-static-lg items-end`}
        style={INK_ON_CONTRAST}
      >
        {/* El titular ocupa la retícula entera desde el 15-10-2026: la columna corta con la
            plataforma ("Everything an agent works on is ours…") se retiró por pedido del usuario
            para darle sitio.
            El fondo de la sección NO va en una caja rectangular alrededor del titular: va en el
            propio texto, con `box-decoration-clone`, así cada LÍNEA se lleva su trozo de plancha y
            el borde sigue la forma de la palabra. Como la escena sube por debajo, la que se mete
            en la foto es la última línea: ahí es donde se produce el corte. */}
        <div className="col-span-12">
          {/* La máscara del text-birth es `overflow-hidden`, así que su `padding-bottom` es lo
              único que separa el borde de corte de la línea base: con 4px, las colas de la "g" y
              la "y" de un `display-lg` se cortaban. `static-md` (16px) les da sitio y no deja
              asomar el titular antes de tiempo (entra desde +120%, muy por debajo del borde). */}
          {/* `translate-y`: lo que baja es EL TITULAR, no la foto. Con un margen negativo en la
              escena el solape crece igual, pero quien se mueve es la imagen y el titular se queda
              donde estaba — no es lo que se pidió (15-10-2026). */}
          <div className="relative z-10 translate-y-[calc(var(--space-static-md)+var(--space-static-sm)+var(--space-static-xs))] overflow-hidden pb-static-md">
            {/* Nada de saltos forzados: el titular rompe solo. Lo único que se controla es la
                MEDIDA — 19 caracteres, que es lo que lo deja en 3 líneas (margen creativo
                declarado: el DS no tiene tokens de medida tipográfica).
                Sin radio: la intersección con la foto va en punta (15-10-2026).

                El interlineado es el del token, intacto. El corte de la "g" NO se arregla abriendo
                la línea: la caja de fondo de un inline mide lo que dicen las métricas de la fuente
                (87px aquí), no el `line-height` (75.6px), así que las planchas se solapan siempre.
                Lo que se arregla es el ORDEN DE PINTADO: el texto vive en un span propio con
                `relative z-10`, que lo manda a la capa de posicionados — se pinta DESPUÉS de todos
                los fondos de línea, así que ninguna plancha puede taparle la cola a la anterior. */}
            <h2 className="tc-birth text-display lg:text-display-lg max-w-[19ch] text-[var(--color-text-primary)]">
              <span className="box-decoration-clone bg-[var(--color-surface-BG-contrast)] pr-static-md">
                <span className="relative z-10">
                  <span className="text-[var(--color-brand-blue)]">{t("headlineAccent")}</span>{" "}
                  {t("headlineRest")}
                </span>
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* ── ACTO II · LA ESCENA ── */}
      {/* La escena sube para meterse bajo la caja del titular: ese solape es el "cortecito".
          El titular va en z-10, así que la plancha de su fondo recorta la foto. */}
      <div className="tc-plate relative w-full -mt-static-2xl">
        {/* DESKTOP: UNA sola fotografía. Las franjas desaparecieron el 15-10-2026: el usuario no
            quiere que la imagen entre partida en tres columnas. La escena entra como una pieza —
            una cortina única que sube mientras la foto se asienta detrás a otra velocidad— y lo
            que llega escalonado después son las tres lecturas.
            `dark` local: las hojas viven sobre una fotografía, así que su vidrio es SIEMPRE el
            oscuro, en los dos temas de la página. */}
        <div className={`dark hidden md:block mx-auto w-full ${CONTAINER}`}>
          <div className="relative grid grid-cols-3 h-[76vh] min-h-[30rem] lg:max-h-[46rem] overflow-hidden">
            {/* Cortina única: el contenedor sube desde abajo y su interior hace lo inverso, así la
                foto se queda quieta y lo que viaja es el corte. */}
            <div className="tc-curtain absolute inset-0 overflow-hidden col-span-3">
              <div className="tc-curtain-inner absolute inset-0">
                <img
                  src={asset(PLATE_PHOTO)}
                  alt={t("imageAlt")}
                  className="tc-shot absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <span className={PHOTO_SCRIM} aria-hidden="true" />
              </div>
            </div>

            {/* Las tres lecturas, en UNA fila sobre la escena (no una dentro de cada franja): así
                comparten retícula y el grid las estira al mismo alto, aunque una frase sea más
                corta que otra. El `min-h` las levanta por encima de su contenido — las queremos
                altas, no ajustadas al texto. */}
            <div className="absolute inset-x-0 bottom-0 p-static-sm grid grid-cols-3 gap-static-sm items-stretch">
              {SLICES.map((i) => (
                <div
                  key={i}
                  className="tc-glass relative overflow-hidden rounded glass-liquid flex flex-col items-start justify-between gap-static-lg p-static-lg lg:p-static-xl min-h-64 lg:min-h-80"
                >
                  {readingCard(i)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MÓVIL: la foto a sangre y, sobre su parte baja, una fila con scroll horizontal nativo de
            las tres lecturas en cuadrados de vidrio (sin pin). */}
        <div className="dark md:hidden w-full">
          <div className="tc-m-photo relative aspect-[4/5] overflow-hidden">
            <img
              src={asset(PLATE_PHOTO)}
              alt={t("imageAlt")}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <span className={PHOTO_SCRIM} aria-hidden="true" />

            <div
              onScroll={onRowScroll}
              className="absolute inset-x-0 bottom-0 pb-static-lg flex gap-static-sm overflow-x-auto snap-x snap-mandatory scroll-px-static-sm px-static-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SLICES.map((i) => (
                <div
                  key={i}
                  className="tc-m-card relative overflow-hidden rounded glass-liquid shrink-0 w-[72%] snap-start flex flex-col items-start justify-between gap-static-lg p-static-md"
                >
                  {readingCard(i, { compact: true })}
                </div>
              ))}
            </div>

            {/* Indicador de scroll ultraminimalista: hairline corta con un tramo blanco que sigue al scroll */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-static-sm w-12 h-px bg-[var(--color-text-White-100)]/30 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <span ref={thumbRef} className="block h-full w-1/3 bg-[var(--color-text-White-100)] will-change-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
