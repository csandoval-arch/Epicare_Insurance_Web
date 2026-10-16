"use client";

/**
 * @file HeroEpicare.tsx
 * @description Hero de la landing (`/`) en dos actos, con el video `Hero_02`:
 * - ACTO 1: el video enmarcado en un cuadro (contraído) sobre el fondo de la página, con el logo grande.
 *   Entra cuando el loader termina.
 * - ACTO 2: al scrollear (~1 pantalla) el cuadro se expande hasta cubrir la pantalla y aparecen el
 *   titular, el subtítulo, el CTA "Join Us" y (solo desktop) la flecha de scroll animada.
 *
 * ── CÓMO SE ANIMA (todo en la GPU) ──
 * - El escenario es `position: sticky` NATIVO dentro de un contenedor alto (no hay pin de GSAP): no
 *   recalcula nada cuando la barra del navegador sube o baja en un teléfono.
 * - El video está SIEMPRE a pantalla completa y quieto. El cuadro es una "ventana" (`windowRef`) a pantalla
 *   completa que se ESCALA hacia abajo, y el video lleva la escala inversa, de modo que se ve sin deformar
 *   y recortado por la ventana. Expandir = llevar ambas escalas a 1: solo `transform`, cero layout y cero
 *   repintado (con `clip-path` o `width/height` el navegador repinta el video a pantalla completa en cada
 *   fotograma del scroll, y en un teléfono eso es el lag).
 * - Alturas en `lvh` (la pantalla más alta, barra oculta) para el escenario y el video, y en `svh` (la zona
 *   que siempre se ve) para el contenido: el escenario nunca cambia de alto y nada queda tras la barra.
 *
 * Acto 2 sobre una retícula de 12 col × 12 filas (≥lg); en móvil/tablet las piezas se apilan, centradas,
 * ancladas abajo. El CTA es el `Button` del sitio (abre el modal de alta).
 */

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import HeaderEpicare from './HeaderEpicare';
import { asset } from '@/lib/asset';
import { EASE, DUR, STAGGER, SCRUB, REVEAL } from '@/lib/motion';
import { joinModalStore } from '@/lib/joinModalStore';
import Button from '@/components/ui/Button';

// ── ENTRADA DEL ACTO 1 ──
/** Segundos tras los que la entrada arranca aunque el loader no avise. */
const ENTRANCE_FALLBACK_S = 6;

// ── EL CUADRO (VENTANA) ──
/** Escala final de la ventana (>1): así sus esquinas redondeadas quedan FUERA de la pantalla al terminar. */
const WINDOW_END_SCALE = 1.06;
/** Radio visible de las esquinas superiores del cuadro contraído (= 2rem), en px. */
const BOX_RADIUS_PX = 32;

// ── SCROLL DEL HERO ──
// El contenedor mide `h-[195lvh]`: 100lvh del escenario + 95lvh de recorrido (~1 pantalla de scroll).
/** Progreso de la timeline desde el que el header pasa a pastilla y a estilo oscuro (video ya casi a pantalla completa). */
const HEADER_SWITCH_AT = 0.45;

// ── FLECHA DE SCROLL DEL ACTO 2 ──
// Baja por su máscara, se queda quieta y sale por abajo, en bucle.
/** Segundos quieta y visible antes de salir. */
const ARROW_HOLD = 0.6;
/** Pausa (fuera de la máscara) antes de repetir. */
const ARROW_REST = 0.3;
/** Alto del cuerpo de la flecha en px = `h-24` (6rem). El viewBox sigue a este alto (1 unidad = 1px) para que la punta no se deforme. */
const ARROW_H = 96;

/** Sombra de texto móvil: barata y estática (un `drop-shadow` es un filtro que se repinta con la opacidad). */
const MOBILE_TEXT_SHADOW = 'max-lg:drop-shadow-none max-lg:[text-shadow:0_2px_16px_rgb(0_0_0/0.55)]';

export default function HeroEpicare() {
  const t = useTranslations('landingV2.hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeaderForcedDark, setIsHeaderForcedDark] = useState(false);
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  /** Contenedor alto: da el recorrido del scroll; el escenario va `sticky` dentro. */
  const containerRef = useRef<HTMLDivElement>(null);
  /** El escenario (viewport pegado): referencia para medir el cuadro contraído. */
  const stageRef = useRef<HTMLDivElement>(null);
  /** Sonda invisible con el tamaño/posición del cuadro contraído (sus clases son la única fuente de esa medida). */
  const boxRef = useRef<HTMLDivElement>(null);
  /** Capa de la entrada del acto 1. */
  const curtainRef = useRef<HTMLDivElement>(null);
  /** La ventana a pantalla completa que se escala hacia abajo para formar el cuadro. */
  const windowRef = useRef<HTMLDivElement>(null);
  /** Capa del video con la escala inversa de la ventana (el video se ve sin deformar). */
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const bigLogoRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  const scrollLineWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fix para móvil: ignorar el resize de la barra de direcciones
    ScrollTrigger.config({ ignoreMobileResize: true });

    let cleanupEntrance = () => {};
    const ctx = gsap.context(() => {
      // Animación infinita de la línea de scroll
      gsap.fromTo(scrollLineRef.current,
        { yPercent: -100 },
        { yPercent: 100, duration: 1.5, ease: EASE.inOut, repeat: -1 }
      );

      // Ocultar la UI del acto 2 al inicio
      gsap.set(heroContentRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        y: 30,
        scale: 0.98
      });

      // Asegurar que la viñeta oscura empiece invisible
      gsap.set(vignetteRef.current, { opacity: 0 });

      // ── ENTRADA DEL ACTO 1 ── la capa del video entra al terminar el loader; luego nacen el logo y el
      // indicador. Solo toca la capa `curtain` y los hijos del logo y del indicador: nada que anime la
      // timeline de scroll, así que no se pisan.
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Móvil: opacidad + desplazamiento (GPU). Desktop: cortina de clip-path (solo se paga una vez, al entrar).
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      let playEntrance: (() => void) | null = null;
      if (!reduceMotion) {
        if (isMobile) gsap.set(curtainRef.current, { opacity: 0, y: REVEAL.md });
        else gsap.set(curtainRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });
        // Refs directos (no selectores por clase): el evento del loader dispara fuera del scope de
        // este contexto y los selectores no se resolvían ("target not found").
        const logoEl = logoImgRef.current;
        const scrollEls = [scrollTextRef.current, scrollLineWrapRef.current];
        gsap.set(logoEl, { opacity: 0, y: 28 });
        gsap.set(scrollEls, { opacity: 0, y: 16 });
        // La timeline se crea AQUÍ, en pausa y dentro de este contexto, y el evento solo le hace play().
        // Crearla dentro del evento NO sirve: lo dispara el callback de un tween del loader, GSAP
        // registra todo lo creado ahí en el contexto del loader, y al desmontarse éste hace revert()
        // y se lleva la animación (el hero se quedaba oculto).
        const entrance = gsap.timeline({ paused: true, defaults: { ease: EASE.dramatic } });
        entrance
          .to(
            curtainRef.current,
            isMobile
              ? { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out, clearProps: 'opacity,transform' }
              : { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.birth, clearProps: 'clipPath' },
            0
          )
          .to(logoEl, { opacity: 1, y: 0, duration: DUR.base }, 0.55)
          .to(scrollEls, { opacity: 1, y: 0, duration: DUR.base, stagger: STAGGER.base }, 1.0);
        playEntrance = () => { entrance.play(); };
      }
      const onLoaderFinished = () => { playEntrance?.(); playEntrance = null; };
      if (playEntrance) {
        if (window.epicareLoaderFinished === true) onLoaderFinished();
        else {
          window.addEventListener('epicareLoaderFinished', onLoaderFinished, { once: true });
          // Red de seguridad: si el loader nunca emite el evento, el hero no se queda oculto.
          gsap.delayedCall(ENTRANCE_FALLBACK_S, onLoaderFinished);
        }
      }
      cleanupEntrance = () => {
        window.removeEventListener('epicareLoaderFinished', onLoaderFinished);
      };

      // Flecha vertical animada del acto 2 (solo transform).
      if (arrowRef.current && !reduceMotion) {
        gsap
          .timeline({ repeat: -1, repeatDelay: ARROW_REST })
          .fromTo(arrowRef.current, { yPercent: -100 }, { yPercent: 0, duration: DUR.base, ease: EASE.inOut })
          .to(arrowRef.current, { yPercent: 100, duration: DUR.base, ease: EASE.inOut }, `+=${ARROW_HOLD}`);
      }

      // ── LA VENTANA ── medidas del cuadro contraído, tomadas de la sonda `boxRef` respecto al escenario.
      // Origen de las dos capas: el centro del borde inferior. `y0` baja el cuadro hasta la sonda (en móvil
      // la sonda queda `--chrome` px sobre el borde inferior del escenario).
      const win = { sx0: 1, sy0: 1, y0: 0, p: 0 };
      const apply = () => {
        const p = win.p;
        const sx = win.sx0 + (WINDOW_END_SCALE - win.sx0) * p;
        const sy = win.sy0 + (WINDOW_END_SCALE - win.sy0) * p;
        const y = win.y0 * (1 - p);
        gsap.set(windowRef.current, { scaleX: sx, scaleY: sy, y });
        // Escala inversa (y traslación inversa): el video queda quieto en pantalla mientras la ventana se mueve.
        gsap.set(videoWrapperRef.current, { scaleX: 1 / sx, scaleY: 1 / sy, y: -y / sy });
      };
      const measure = () => {
        const stage = stageRef.current?.getBoundingClientRect();
        const box = boxRef.current?.getBoundingClientRect();
        const el = windowRef.current;
        if (!stage || !box || !el) return;
        win.sx0 = box.width / stage.width;
        win.sy0 = box.height / stage.height;
        win.y0 = box.bottom - stage.bottom;
        // Radio en el espacio local de la ventana (la escala lo encoge): así se VE de 32px al inicio.
        const radius = `${BOX_RADIUS_PX / win.sx0}px ${BOX_RADIUS_PX / win.sy0}px`;
        el.style.borderTopLeftRadius = radius;
        el.style.borderTopRightRadius = radius;
        apply();
      };
      gsap.set([windowRef.current, videoWrapperRef.current], { transformOrigin: '50% 100%' });
      measure();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom", // el escenario es `sticky`: el recorrido es lo que sobra del contenedor alto
          onRefresh: measure, // vuelve a medir el cuadro si cambia el tamaño de la ventana
          // Táctil: la animación sigue al dedo sin arrastre (con `scrub: 1` se queda ~1 s rezagada y se siente
          // "con lag"). Con mouse se conserva el suavizado.
          scrub: window.matchMedia('(pointer: coarse)').matches ? true : SCRUB.crisp,
          onUpdate: (self) => {
            // Desactivar el paralaje del mouse en cuanto el usuario empiece a scrollear
            setIsExpanded(self.progress > 0.05);

            // Estilo oscuro del header durante el acto 2 (el video a pantalla completa queda detrás de él)
            setIsHeaderForcedDark(self.progress >= HEADER_SWITCH_AT && self.progress < 0.95);

            // El header pasa a pastilla desde el acto 2
            setIsHeaderPill(self.progress >= HEADER_SWITCH_AT);
          }
        }
      });

      // Acto 1 -> Desaparece el indicador de scroll y el gran logo apenas se mueve la rueda
      tl.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: EASE.snap
      }, 0);

      tl.to(bigLogoRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.2,
        ease: EASE.snap
      }, 0);

      // Acto 1 -> Expansión de la ventana (escala) hasta cubrir la pantalla; el video no se mueve
      tl.to(win, { p: 1, duration: 0.7, ease: EASE.inOut, onUpdate: apply }, 0);

      // Acto 1 -> Aparece la viñeta oscura
      tl.to(vignetteRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: EASE.inOut
      }, 0);

      // Acto 2 -> Revelación del contenido
      tl.to(heroContentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: "auto",
        duration: 0.35,
        ease: EASE.snap,
        stagger: 0.1
      }, 0.45);

      // Respiro final: el contenido queda quieto un instante antes de soltar el escenario.
      tl.to({}, { duration: 0.15 });

    }, containerRef);

    // Pausa el video cuando el hero sale de pantalla y lo reanuda al volver. Decodificar 1080p fuera de
    // vista no se ve, pero en un teléfono le roba al resto de la página fluidez de scroll durante todo el recorrido.
    const heroEl = containerRef.current;
    const videoObserver = heroEl
      ? new IntersectionObserver(([entry]) => {
          const video = videoRef.current;
          if (!video) return;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        })
      : null;
    if (heroEl) videoObserver?.observe(heroEl);

    return () => {
      videoObserver?.disconnect();
      cleanupEntrance();
      ctx.revert();
    };
  }, []);

  // Paralaje del video con el mouse (solo acto 1, ≥md): el video se desplaza unos px dentro de la ventana.
  // El `scale-[1.05]` del video deja margen de sobra para este desplazamiento.
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isExpanded || !videoRef.current || window.innerWidth < 768) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;

    gsap.to(videoRef.current, {
      x: xPos * 12,
      y: yPos * 12,
      ease: 'power2.out',
      duration: 0.6
    });
  };

  const handleMouseLeave = () => {
    if (isExpanded || !videoRef.current || window.innerWidth < 768) return;
    gsap.to(videoRef.current, {
      x: 0,
      y: 0,
      ease: 'power3.out',
      duration: 1
    });
  };

  return (
    // `overflow-x-clip` (no `hidden`): `hidden` crearía un contenedor de scroll y rompería el `sticky` del escenario.
    <div className="w-full overflow-x-clip bg-[var(--color-surface-BG-base)]">

      {/* Header Reutilizable y Autogestionado */}
      <HeaderEpicare isHeaderPill={isHeaderPill} isHeaderForcedDark={isHeaderForcedDark} />

      {/* Contenedor alto: 100lvh del escenario + 95lvh de recorrido del scroll */}
      <div ref={containerRef} className="w-full relative z-10 h-[195lvh] bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)]">

        {/* ESCENARIO: sticky nativo. `lvh` = pantalla más alta posible (barra del navegador oculta): nunca cambia de
            alto cuando la barra sube o baja. `--chrome` = alto de la barra (lvh − svh): 0 en desktop. El contenido se
            ancla a `svh` (lo que SIEMPRE se ve, con la barra puesta) para que nada quede detrás de ella. */}
        <div
          ref={stageRef}
          className="sticky top-0 h-[100lvh] w-full overflow-hidden bg-[var(--color-surface-BG-base)]"
          style={{ '--chrome': 'calc(100lvh - 100svh)' } as React.CSSProperties}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          {/* CUADRO CONTRAÍDO DEL ACTO 1 (sonda): invisible, anclado sobre la barra y centrado. Sus clases son la
              ÚNICA fuente del tamaño del cuadro (`measure` lo mide); además aloja el logo grande. */}
          <div
            ref={boxRef}
            className="absolute bottom-[var(--chrome)] left-1/2 -translate-x-1/2 w-[calc(100%-2*var(--space-gutter-sm))] md:w-[85%] lg:w-[1100px] max-w-full h-[85svh] md:h-[70svh] z-[60] pointer-events-none"
          >
            {/* GRAN LOGO CENTRAL (ACTO 1) */}
            <div
              ref={bigLogoRef}
              className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <img
                ref={logoImgRef}
                src={asset("/epicare_logo.svg")}
                alt="Epicare"
                className="w-[180px] md:w-[240px] filter brightness-0 invert opacity-100 md:mix-blend-difference"
              />
            </div>
          </div>

          {/* EL VIDEO: siempre a pantalla completa y quieto. `curtain` = capa de la entrada; `window` = ventana que se
              escala (ACTO 1: cuadro, sin viñeta -> ACTO 2: pantalla completa, con viñeta); dentro, el video con la
              escala inversa. */}
          <div ref={curtainRef} className="absolute inset-0 z-0">
            <div
              ref={windowRef}
              className="absolute inset-0 overflow-hidden origin-bottom bg-[var(--color-surface-BG-black)] will-change-transform"
            >
              <div ref={videoWrapperRef} className="absolute inset-0 origin-bottom will-change-transform">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")}
                  className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
                >
                  <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Overlay gradient que empieza oculto y aparece en pantalla completa */}
            <div ref={vignetteRef} className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none opacity-0" />
          </div>

          {/* INDICADOR DE SCROLL MINIMALISTA (ACTO 1) */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-[calc(var(--chrome)_+_2rem)] left-1/2 -translate-x-1/2 flex flex-col items-center gap-static-md z-[60] pointer-events-none drop-shadow-md"
          >
            <span ref={scrollTextRef} className="text-[0.5625rem] uppercase tracking-[0.4em] text-white font-light">
              {t('scrollDown')}
            </span>
            <div ref={scrollLineWrapRef} className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
              <div ref={scrollLineRef} className="w-full h-full bg-white opacity-80" />
            </div>
          </div>

          {/* UI LAYER SUPERPUESTA: la zona `svh` (siempre visible) */}
          <div className="absolute top-0 inset-x-0 h-[100svh] z-[200] flex flex-col pointer-events-none">

            {/* ACTO 2: retícula de 12 columnas × 12 filas iguales (≥lg). En móvil/tablet las piezas se apilan,
                centradas, ancladas abajo. */}
            <section ref={heroContentRef} className="w-full flex-1 px-[var(--space-gutter-sm)] lg:px-[var(--space-gutter-md)] flex flex-col pt-[24svh] lg:pt-[120px] pb-[40px] md:pb-[60px] relative">
              {/* Móvil/tablet: el bloque ARRANCA en el tercio superior (bajo el header), no pegado abajo. Desktop: filas fijas. */}
              <div className="grid-layout flex-1 max-w-section-xl w-full mx-auto pointer-events-auto [align-content:start] lg:grid-rows-12">

                {/* Titular */}
                <div className="[grid-column:1/-1] lg:col-start-1 lg:col-span-9 lg:row-start-2 lg:row-span-2 lg:self-end">
                  <h1 className={`text-display-xl lg:text-display-2xl text-white drop-shadow-lg ${MOBILE_TEXT_SHADOW}`}>
                    {t('act2Title')}
                  </h1>
                </div>

                {/* Subtítulo 1. Móvil: a la izquierda (4 de 6 columnas), a 3 líneas ("Insurance / distribution /
                    redefined") por su ancho en `ch`, con peso normal como en desktop. */}
                <div className="max-lg:col-span-4 max-lg:mt-20 lg:col-start-1 lg:col-span-5 lg:row-start-5 lg:row-span-2 lg:self-start">
                  <p className={`text-display-sm md:text-display lg:text-display font-normal whitespace-pre-line text-[var(--color-text-White-100)] max-lg:max-w-[12ch] ${MOBILE_TEXT_SHADOW}`}>
                    {t('act2Sub1')}
                  </p>
                </div>

                {/* Subtítulo 2. Móvil: a la DERECHA del subtítulo 1, en su misma fila (2 de 6 columnas), con el texto
                    alineado a la izquierda y a 3 líneas ("The / insurtech / IMO") por su ancho en `ch`. */}
                <div className="max-lg:col-span-2 max-lg:mt-20 lg:col-start-10 lg:col-span-1 lg:row-start-7 lg:row-span-2 lg:self-start">
                  <p className={`text-body-xl font-light whitespace-pre-line text-[var(--color-text-White-100)] max-lg:max-w-[9ch] ${MOBILE_TEXT_SHADOW}`}>
                    {t('act2Sub2')}
                  </p>
                </div>

                {/* CTA: el `Button` del header. Móvil: compacto (a su ancho natural), a la izquierda y con aire sobre
                    el texto. Desktop: 13.5rem de ancho y la burbuja de flecha siempre al borde derecho (`justify-between`). */}
                <div className="[grid-column:1/-1] max-lg:mt-static-2xl lg:col-start-1 lg:col-span-5 lg:row-start-7 lg:row-span-2 lg:self-start flex justify-start lg:justify-self-stretch">
                  <Button
                    label={t('act2Cta')}
                    size="sm"
                    onClick={() => joinModalStore.open()}
                    className="max-lg:h-static-2xl max-lg:pl-static-lg max-lg:pr-static-sm max-lg:text-body-md max-lg:w-52 max-lg:justify-between lg:w-54 lg:min-h-13 lg:justify-between"
                  />
                </div>

                {/* Flecha de scroll: solo desktop */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:col-start-9 lg:col-span-1 lg:row-start-7 lg:row-span-2 lg:self-start lg:justify-self-end text-white drop-shadow-lg"
                >
                  <div className="relative overflow-hidden w-3 h-24">
                    <svg ref={arrowRef} viewBox={`0 0 12 ${ARROW_H}`} fill="none" stroke="currentColor" className="absolute inset-0 w-full h-full">
                      <path
                        d={`M6 0V${ARROW_H - 2}M6 ${ARROW_H - 2}L1 ${ARROW_H - 8}M6 ${ARROW_H - 2}L11 ${ARROW_H - 8}`}
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
