"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from "@/lib/motion";
import { HERO_COLUMN_EVENT, HERO_DESKTOP_MQ } from "./geometry";

// ── VALORES FUERA DE TOKEN (margen creativo declarado; los de la versión "Go beyond growth") ──
/** Entrada de la columna (desktop): escala vertical inicial (≈ 0; 0 exacto daría 1/0 en la inversa). */
const GROW_FROM = 0.001;
const CTA_START_SCALE = 0.9;
/** Flecha de scroll: segundos quieta y visible, y pausa (fuera de la máscara) antes de repetir. */
const ARROW_HOLD = 0.6;
const ARROW_REST = 0.3;
/** Si el loader nunca avisa (p. ej. navegación SPA sin loader), la entrada arranca igual. */
const LOADER_FALLBACK_MS = 4000;
/** Acto 2: recorrido del pin y respiro final con el vídeo a pantalla completa. */
const PIN_LENGTH = "+=130%";
const HOLD = 0.15;
/** Lo que el telón empuja hacia los lados en el acto 2. */
const CURTAIN = "25vw";
const ACT2_MQ = `${HERO_DESKTOP_MQ} and (prefers-reduced-motion: no-preference)`;

/** Altura (px) de la línea de los links del header: la columna "pasa por debajo" si la cruza. */
const HEADER_LINE = 40;

type LoaderWindow = Window & { epicareLoaderFinished?: boolean };

/**
 * @description Motion del hero "corte arquitectónico".
 *
 * Entrada (la de la versión anterior, Motion Tokenizer · archetype 1): titular con text-birth por
 * línea (máscara) → overline y subtítulo línea a línea → la columna de vídeo entra desde la izquierda
 * mientras el plano de dentro hace el movimiento inverso (queda quieto) → prueba social → CTAs con
 * pop. Arranca cuando el loader global emite `epicareLoaderFinished`.
 *
 * Acto 2 (solo ≥md, pin + scrub directo): el texto se abre como un telón y la columna crece a pantalla
 * completa. Hardware Symphony: la columna escala con `transform` y el plano aplica la inversa (no se
 * deforma ni se mueve); el recorte de la copia blanca se calcula en el mismo frame → siempre coincide.
 *
 * Con reduced-motion: todo visible, sin pin.
 */
export function useHeroMotion(rootRef: RefObject<HTMLElement | null>, isEn: boolean) {
  useLayoutEffect(() => {
    const el = rootRef.current;
    const frame = el?.querySelector<HTMLElement>(".hero-col");
    const plane = el?.querySelector<HTMLElement>(".hero-col-plane");
    const cut = el?.querySelector<HTMLElement>(".hero-cut-layer");
    if (!el || !frame || !plane || !cut) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Geometría + render de la columna (transform only) ──
    // Desktop: la columna entra CRECIENDO en su sitio, de abajo arriba (de una línea en su borde inferior a
    // toda la altura;
    // `grow` = scaleY). Móvil/tablet (banda a sangre): solo aparece.
    const isDesktop = window.matchMedia(HERO_DESKTOP_MQ).matches;
    const growFrom = isDesktop && !reduced ? GROW_FROM : 1;
    const state = { grow: growFrom, t: 0 };
    let W = 0;
    let H = 0;
    let col = { x: 0, y: 0, w: 0, h: 0 };

    // Avisa al header de dónde está la columna en pantalla (para poner en blanco los links que cruza).
    // `null` = no hay vídeo detrás del header (antes de que la columna aparezca o tras salir del hero).
    let last = "";
    const publish = () => {
      const r = frame.getBoundingClientRect();
      const visible = parseFloat(getComputedStyle(frame).opacity) > 0.5;
      const detail = visible && r.top <= HEADER_LINE && r.bottom >= HEADER_LINE ? { x0: r.left, x1: r.right } : null;
      const key = detail ? `${Math.round(detail.x0)}:${Math.round(detail.x1)}` : "-";
      if (key === last) return;
      last = key;
      window.dispatchEvent(new CustomEvent(HERO_COLUMN_EVENT, { detail }));
    };
    let scrollRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(publish);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const render = () => {
      const { x, y, w, h } = col;
      if (!w) return;
      const tx = -x * state.t; // acto 2: el borde izquierdo viaja a 0
      const sx = (w + (W - w) * state.t) / w; // …y el ancho a W
      const sy = state.grow; // entrada: la altura crece DESDE ABAJO (anclada a su borde inferior)…
      const ty = h * (1 - sy); // …así que el marco (origen arriba) baja lo que le falta de altura
      frame.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`;
      // Hasta que empieza a crecer no se ve (si no, quedaría una línea de 1px con su sombra abajo).
      frame.style.visibility = sy <= GROW_FROM ? "hidden" : "";
      // Plano = la sección entera, quieto en pantalla: la inversa del marco + su posición de layout.
      plane.style.transform = `scale(${1 / sx}, ${1 / sy}) translate3d(${-tx - x}px, ${-ty - y}px, 0)`;
      // Copia blanca del titular recortada al marco en este frame (también a su altura actual).
      const left = x + tx;
      const right = W - (left + w * sx);
      const top = y + ty;
      const bottom = H - (top + h * sy);
      cut.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      publish();
    };

    const measure = () => {
      W = el.clientWidth;
      H = el.clientHeight;
      // La columna la coloca el CSS (--col-l/--col-w en desktop, banda en el flujo en móvil): aquí se lee
      // su caja de layout (ignora el transform), así cualquier ajuste de CSS la sigue sin tocar el JS.
      col = { x: frame.offsetLeft, y: frame.offsetTop, w: frame.offsetWidth, h: frame.offsetHeight };
      plane.style.width = `${W}px`;
      // Desktop: el plano es la sección entera (las ventanas a un mismo plano). Móvil/tablet: la banda.
      plane.style.height = `${window.matchMedia(HERO_DESKTOP_MQ).matches ? el.clientHeight : frame.offsetHeight}px`;
      render();
    };
    measure();

    const resize = new ResizeObserver(measure);
    resize.observe(el);

    const ctx = gsap.context(() => {
      const $ = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, el);
      const isDesktop = window.matchMedia(HERO_DESKTOP_MQ).matches;

      /** Prueba social (avatares + copy) y después los CTAs con pop. Se añade a `tl` en `at`. */
      const revealProof = (tl: gsap.core.Timeline, at: gsap.Position) => {
        tl.fromTo(
          $(".hero-proof > *"),
          { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base, clearProps: "willChange" },
          at
        ).fromTo(
          $(".hero-cta"),
          { opacity: 0, scale: CTA_START_SCALE, willChange: "transform, opacity" },
          { opacity: 1, scale: 1, duration: DUR.base, ease: EASE.snap, stagger: STAGGER.wave, clearProps: "willChange" },
          "-=0.5"
        );
      };

      // ── ENTRADA ──
      const intro = gsap.timeline({ paused: true });
      if (!reduced) {
        intro
          // 1 · Titular: text-birth por línea (las dos capas: color del tema y copia blanca)
          .fromTo(
            $(".hero-title-line"),
            { yPercent: REVEAL.birthPercent, opacity: 0, willChange: "transform, opacity" },
            { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.dramatic, stagger: STAGGER.base, force3D: true, clearProps: "willChange" }
          )
          // 2 · Overline y subtítulo, línea a línea
          .fromTo(
            $(".hero-overline, .hero-tagline-line"),
            { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
            { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight, clearProps: "willChange" },
            "-=0.6"
          )
          // 3 · Desktop: la columna CRECE en su sitio (desde su borde inferior hacia arriba); el plano hace la
          //     inversa y queda quieto, y la copia blanca se recorta a su altura en cada frame (no hay blanco
          //     sobre el fondo antes de que llegue el vídeo). Móvil/tablet: la banda solo aparece.
          .add(
            isDesktop
              ? gsap.fromTo(state, { grow: GROW_FROM }, { grow: 1, duration: DUR.slow, ease: EASE.dramatic, onUpdate: render, immediateRender: false })
              : gsap.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: DUR.slow, ease: EASE.dramatic }),
            "-=0.8" // arranca 0.2s antes que el resto de la cadena (pedido 2026-10-05)
          );
        // 4-5 · Prueba social y CTAs: en desktop dentro de la entrada (se ven desde el inicio); en
        //       móvil/tablet están bajo el pliegue → se revelan al entrar en vista (más abajo).
        if (isDesktop) revealProof(intro, "-=0.7");
        // 6 · Indicador de scroll (solo desktop)
        intro.fromTo($(".hero-scroll-badge-inner"), { opacity: 0, y: REVEAL.sm }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out }, "-=0.4");
      }

      // Móvil/tablet: prueba + CTAs se revelan una vez al entrar en vista (no hay pin aquí: es una entrada).
      if (!reduced && !isDesktop) {
        const block = el.querySelector<HTMLElement>(".hero-cta-block");
        if (block) revealProof(gsap.timeline({ scrollTrigger: { trigger: block, start: TRIGGER.standard, once: true } }), 0);
      }

      // ── FLECHA DE SCROLL ── baja por su máscara (caja con overflow hidden), se queda quieta y sale por
      // abajo, en bucle. GSAP (no keyframe CSS): solo transform, pausada fuera de pantalla.
      const arrow = el.querySelector<HTMLElement>(".hero-scroll-arrow");
      if (arrow && !reduced) {
        gsap
          .timeline({
            repeat: -1,
            repeatDelay: ARROW_REST,
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
          })
          .fromTo(arrow, { yPercent: -100 }, { yPercent: 0, duration: DUR.base, ease: EASE.inOut })
          .to(arrow, { yPercent: 100, duration: DUR.base, ease: EASE.inOut }, `+=${ARROW_HOLD}`);
      }

      const play = () => intro.play();
      if ((window as LoaderWindow).epicareLoaderFinished) play();
      else window.addEventListener("epicareLoaderFinished", play, { once: true });
      const fallbackId = window.setTimeout(play, LOADER_FALLBACK_MS);

      // ── ACTO 2 (desktop): telón + la columna a pantalla completa ──
      /** Stagger del telón por capa: cada palabra usa su índice dentro de su capa (titular base o copia
       *  blanca), así las dos capas se mueven exactamente igual y la copia no se separa del texto. */
      const layerStagger = (step: number) => (i: number, target: Element) => {
        const layer = target.closest(".hero-cut-layer") ?? el;
        const peers = Array.from(layer.querySelectorAll(":scope .hero-act-left, :scope .hero-act-right")).filter(
          (n) => (n.closest(".hero-cut-layer") ?? el) === layer && n.classList.contains(target.classList.contains("hero-act-left") ? "hero-act-left" : "hero-act-right")
        );
        return Math.max(0, peers.indexOf(target)) * step;
      };

      const mm = gsap.matchMedia(el);
      mm.add(ACT2_MQ, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: PIN_LENGTH,
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
            onRefresh: measure,
          },
        });
        tl.fromTo($(".hero-act-left"), { x: 0, opacity: 1 }, { x: `-${CURTAIN}`, opacity: 0, duration: 1.5, stagger: layerStagger(0.05), ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo($(".hero-act-right"), { x: 0, opacity: 1 }, { x: CURTAIN, opacity: 0, duration: 1.5, stagger: layerStagger(0.05), ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo($(".hero-scroll-badge"), { y: 0, opacity: 1, scale: 1 }, { y: REVEAL.lg, opacity: 0, scale: 0.8, duration: 1.5, ease: "power2.inOut", immediateRender: false }, 0)
          .fromTo(state, { t: 0 }, { t: 1, duration: 2, ease: "power3.inOut", onUpdate: render, immediateRender: false }, 0)
          .fromTo($(".hero-col-shade"), { opacity: 1 }, { opacity: 0, duration: 1.5, ease: "power2.inOut", immediateRender: false }, 0.5);
        // Respiro: el vídeo a pantalla completa, quieto, el último HOLD del pin.
        tl.to({}, { duration: (tl.duration() * HOLD) / (1 - HOLD) });

        return () => {
          state.t = 0;
          render();
        };
      });

      return () => {
        window.removeEventListener("epicareLoaderFinished", play);
        window.clearTimeout(fallbackId);
        mm.revert();
      };
    }, el);

    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      window.dispatchEvent(new CustomEvent(HERO_COLUMN_EVENT, { detail: null }));
      ctx.revert();
      frame.style.cssText = "";
      plane.style.cssText = "";
      cut.style.clipPath = "";
    };
  }, [rootRef, isEn]);
}
