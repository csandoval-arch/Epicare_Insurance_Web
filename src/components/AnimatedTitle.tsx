'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, REVEAL, STAGGER, TRIGGER } from '@/lib/motion';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * @description Titular con entrada de una sola vez: el bloque sube (`REVEAL.sm`) y sus frases
 * (`AnimatedTitleLine`) se encienden en secuencia. Solo transform/opacity → sin repintado por frame
 * (sustituye al relleno "scrub" con background-clip, que repintaba el texto en cada scroll y daba lag
 * en móvil). Las frases siguen siendo inline: la maquetación del titular no cambia.
 */
export function AnimatedTitle({ children, className = "" }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = containerRef.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: TRIGGER.standard, once: true } })
        .from(el, { y: REVEAL.sm, duration: DUR.base, ease: EASE.out, clearProps: 'transform' })
        .from(gsap.utils.toArray('.title-fill-line', el), {
          opacity: 0.15,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.wave,
        }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <h2 ref={containerRef} className={className}>
      {children}
    </h2>
  );
}

/** Frase del titular (inline: no fuerza saltos de línea). */
export function AnimatedTitleLine({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`title-fill-line ${className}`}>
      {children}{' '}
    </span>
  );
}
