"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * @file ProblemGoCrm.tsx
 * @description Diseño Simétrico en Scroll Horizontal.
 * Todos los puntos (1 al 5) tienen la misma jerarquía y fluyen como columnas idénticas.
 */
export default function ProblemGoCrm() {
  const t = useTranslations("goCrm.problem");
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Horizontal Scroll
      gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 0.5, // Reducido de 1 a 0.5 para que se sienta más responsivo
          // Reducimos la distancia de scroll vertical necesaria a la mitad (0.5)
          end: () => "+=" + (track.current!.scrollWidth * 0.5)
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const points = [
    { 
      num: "01", 
      text: <>"{t.rich("p1", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "02", 
      text: <>"{t.rich("p2", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "03", 
      text: <>"{t.rich("p3", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "04", 
      text: <>"{t.rich("p4", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}"</> 
    },
    { 
      num: "05", 
      text: <>{t.rich("p5", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })} {t.rich("cierre", { b: (chunks) => <strong className="font-semibold">{chunks}</strong> })}</> 
    }
  ];

  return (
    <section ref={container} className="h-screen w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center">
      
      {/* Track Horizontal que contiene el Título y las columnas simétricas */}
      <div ref={track} className="flex h-full w-max items-stretch">
        
        {/* Panel 0: Título Masivo (Acto 0 con más margen izquierdo) */}
        <div className="w-[100vw] lg:w-[60vw] h-full flex flex-col justify-center px-8 lg:pr-16 lg:pl-[8vw] xl:pl-[12vw] border-r border-[var(--color-border-Strokes-default)] shrink-0">
          <p className="text-meta uppercase tracking-[0.2em] text-[var(--color-brand-blue)] mb-8">
            {t("overline")}
          </p>
          <h2 className="text-display-md lg:text-[4.5vw] font-medium tracking-tight leading-[1.05] max-w-4xl">
            {t("h2")}
          </h2>
        </div>

        {/* Paneles 1 al 4: Puntos idénticos (excepto el 4 que lleva fondo azul y es más ancho) */}
        {points.map((pt, i) => {
          const isHighlight = i === 4;
          return (
            <div 
              key={i} 
              className={`${isHighlight ? "w-[90vw] lg:w-[35vw]" : "w-[85vw] lg:w-[28vw]"} h-full flex flex-col justify-center px-8 lg:px-16 border-r border-[var(--color-border-Strokes-default)] shrink-0 transition-colors duration-500
                ${isHighlight 
                  ? "bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-blue)]" 
                  : "bg-[var(--color-surface-BG-base)] hover:bg-[var(--color-surface-BG-1)] text-[var(--color-text-primary)]"
                }
              `}
            >
              {isHighlight ? (
                <div className="mb-12 flex items-center">
                  <svg className="w-40 h-auto" viewBox="0 0 192 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M144.984 50.7739H142.714V54.8659H145.004C145.774 54.8659 146.344 54.6759 146.716 54.2979C147.088 53.9199 147.274 53.4159 147.274 52.7899C147.274 52.1639 147.092 51.6879 146.726 51.3219C146.36 50.9559 145.78 50.7739 144.984 50.7739Z" fill="#FFFFFF"/>
                    <path d="M166.592 43.738H124.83C122.552 53.58 115.744 61.698 106.724 65.774H172.314V49.46C172.314 46.3 169.752 43.738 166.592 43.738ZM129.07 57.812C129.37 58.498 129.804 59.026 130.372 59.398C130.94 59.77 131.622 59.956 132.418 59.956C133.28 59.956 133.97 59.77 134.492 59.398C135.014 59.026 135.36 58.508 135.53 57.842H138.544C138.282 59.264 137.618 60.384 136.548 61.2C135.478 62.016 134.114 62.424 132.458 62.424C131.088 62.424 129.906 62.128 128.914 61.534C127.922 60.94 127.158 60.112 126.624 59.048C126.088 57.984 125.822 56.754 125.822 55.358C125.822 53.962 126.09 52.728 126.624 51.658C127.158 50.588 127.922 49.752 128.914 49.152C129.906 48.552 131.086 48.252 132.458 48.252C134.116 48.252 135.478 48.67 136.548 49.504C137.618 50.34 138.284 51.514 138.544 53.028H135.53C135.374 52.296 135.03 51.732 134.502 51.334C133.974 50.936 133.278 50.736 132.418 50.736C131.622 50.736 130.94 50.922 130.372 51.294C129.804 51.666 129.37 52.198 129.07 52.89C128.77 53.582 128.62 54.404 128.62 55.356C128.62 56.308 128.77 57.128 129.07 57.812ZM147.058 62.186L144.578 56.862H142.712V62.186H139.972V48.484H145.16C146.268 48.484 147.186 48.674 147.91 49.052C148.634 49.43 149.176 49.936 149.534 50.57C149.892 51.202 150.072 51.91 150.072 52.694C150.072 53.426 149.898 54.11 149.554 54.75C149.208 55.39 148.67 55.902 147.938 56.286C147.77 56.374 147.59 56.45 147.4 56.518L150.188 62.188H147.056H147.058V62.186ZM166.358 62.186H163.618V53.122L160.074 60.266H157.902L154.34 53.122V62.186H151.6V48.484H154.888L159.018 56.92L163.09 48.484H166.36V62.186H166.358Z" fill="#FFFFFF"/>
                    <path d="M93.4722 7.02612C78.1922 7.02612 65.6362 18.6801 64.2002 33.5841H77.6382C78.9862 26.0581 85.5602 20.3461 93.4742 20.3461C102.362 20.3461 109.568 27.5521 109.568 36.4401C109.568 45.3281 102.362 52.5341 93.4742 52.5341C88.2002 52.5341 83.5222 49.9941 80.5882 46.0741V62.8801C84.4802 64.7821 88.8502 65.8541 93.4742 65.8541C109.718 65.8541 122.888 52.6861 122.888 36.4401C122.888 20.1941 109.718 7.02612 93.4722 7.02612Z" fill="#FFFFFF" />
                    <path d="M27.8141 20.8321C29.4501 24.6321 31.6981 28.0041 34.3881 30.6781C36.6981 24.6321 42.5501 20.3341 49.4101 20.3341C54.8261 20.3341 59.6141 23.0161 62.5281 27.1201C63.8801 22.6021 66.1901 18.4961 69.2221 15.0341C63.9601 10.0741 56.8741 7.02612 49.0721 7.02612C41.2701 7.02612 34.1321 10.0941 28.8641 15.0881C28.7381 15.2321 28.6041 15.3801 28.4561 15.5361C26.9941 17.0881 27.1901 19.0641 27.8141 20.8301V20.8321Z" fill="#FFFFFF"/>
                    <path d="M78.418 37.484H50.206V46.982H61.514C58.568 50.354 54.242 52.49 49.41 52.49C40.53 52.49 33.332 45.292 33.332 36.412C33.332 35.338 33.44 34.29 33.64 33.276C29.834 29.848 26.656 25.326 24.648 20.072C21.516 24.744 19.686 30.364 19.686 36.412C19.686 52.642 32.842 65.798 49.072 65.798C56.362 65.798 63.026 63.138 68.16 58.742L68.918 58.182V65.696H78.416V37.748C78.42 37.66 78.428 37.572 78.432 37.484H78.416H78.418Z" fill="#FFFFFF"/>
                    <path d="M130.372 51.294C130.94 50.922 131.622 50.736 132.418 50.736C133.28 50.736 133.974 50.936 134.502 51.334C135.03 51.732 135.374 52.296 135.53 53.028H138.544C138.282 51.514 137.618 50.34 136.548 49.504C135.478 48.67 134.114 48.252 132.458 48.252C131.088 48.252 129.906 48.552 128.914 49.152C127.922 49.752 127.158 50.5879 126.624 51.6579C126.088 52.728 125.822 53.9619 125.822 55.3579C125.822 56.754 126.09 57.984 126.624 59.048C127.158 60.112 127.922 60.94 128.914 61.534C129.906 62.128 131.086 62.424 132.458 62.424C134.116 62.424 135.478 62.016 136.548 61.2C137.618 60.384 138.284 59.266 138.544 57.842H135.53C135.36 58.508 135.014 59.026 134.492 59.398C133.97 59.77 133.278 59.956 132.418 59.956C131.622 59.956 130.94 59.77 130.372 59.398C129.804 59.026 129.37 58.498 129.07 57.812C128.77 57.126 128.62 56.308 128.62 55.356C128.62 54.404 128.77 53.582 129.07 52.89C129.37 52.198 129.804 51.666 130.372 51.294Z" fill="#FFFFFF" />
                    <path d="M147.94 56.2859C148.67 55.9019 149.208 55.3879 149.556 54.7499C149.902 54.1099 150.074 53.4259 150.074 52.6939C150.074 51.9119 149.894 51.2039 149.536 50.5699C149.176 49.9379 148.636 49.4319 147.912 49.0519C147.188 48.6739 146.27 48.4839 145.162 48.4839H139.974V62.1859H142.714V56.8619H144.58L147.06 62.1859H150.192L147.404 56.5159C147.592 56.4479 147.774 56.3719 147.942 56.2839H147.94V56.2859ZM142.714 50.7739H144.984C145.78 50.7739 146.36 50.9579 146.726 51.3219C147.092 51.6859 147.274 52.1759 147.274 52.7899C147.274 53.4039 147.088 53.9179 146.716 54.2979C146.344 54.6759 145.772 54.8659 145.004 54.8659H142.714V50.7739Z" fill="#FFFFFF" />
                    <path d="M163.09 48.4839L159.018 56.9219L154.888 48.4839H151.6V62.1859H154.34V53.1239L157.902 60.2679H160.074L163.618 53.1239V62.1859H166.358V48.4839H163.09Z" fill="#FFFFFF" />
                  </svg>
                </div>
              ) : (
                <span className="block text-body-md font-mono mb-12 text-[var(--color-text-muted)]">
                  {pt.num}
                </span>
              )}
              <p className={`leading-relaxed ${isHighlight ? "text-display-sm font-bold text-white tracking-tight" : "text-display-xs font-light text-[var(--color-text-secondary)]"}`}>
                {pt.text}
              </p>
            </div>
          );
        })}

        {/* Espacio final (buffer) para que la última tarjeta respire al terminar el scroll */}
        <div className="w-[10vw] lg:w-[20vw] h-full shrink-0 bg-[var(--color-surface-BG-base)]" />

      </div>
    </section>
  );
}
