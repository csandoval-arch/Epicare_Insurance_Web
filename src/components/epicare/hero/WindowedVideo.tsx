"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { HERO_VIDEO } from "./data";
import { offsetWithin } from "./geometry";

/**
 * @description Una "ventana" al vídeo del hero. El vídeo mide lo que la sección entera y se
 * desplaza lo contrario a la posición del marco, así que todas las ventanas muestran trozos de un
 * mismo plano continuo, alineados entre sí.
 *
 * Hardware Symphony:
 * - Se mide solo cuando cambia el layout (ResizeObserver), no por frame, y se escribe directo en el
 *   DOM (sin estado de React). La posición sale de `offsetLeft/Top` (layout): ignora el `transform`
 *   de la entrada; mientras el marco entra deslizándose, `.hero-video-counter` hace el movimiento
 *   inverso (ver `useHeroEntrance`) y el plano se queda quieto.
 * - Fuera de pantalla el vídeo se pausa. `autoPlay` se mantiene: es el LCP de la página.
 */
export default function WindowedVideo() {
  const windowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = windowRef.current;
    const video = videoRef.current;
    const section = frame?.closest("section");
    if (!frame || !video || !section) return;

    const measure = () => {
      const { x, y } = offsetWithin(frame, section);
      video.style.width = `${section.clientWidth}px`;
      video.style.height = `${section.clientHeight}px`;
      video.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    };

    const resize = new ResizeObserver(measure);
    resize.observe(section);
    resize.observe(frame);

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    visibility.observe(frame);

    return () => {
      resize.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    // Fondo marfil opaco: el vídeo (90 %) se asienta sobre el mismo color que la sección, así que se ve
    // igual, y en el acto 2 una ventana no transparenta a la otra cuando se solapan.
    <div ref={windowRef} className="hero-window relative w-full h-full overflow-hidden bg-[var(--color-hero-ivory)]" aria-hidden="true">
      <div className="hero-video-counter absolute top-0 left-0">
        {/* Capa del acto 2 (desktop): la inversa de la escala del marco, para que el plano no se
            deforme ni se mueva mientras la ventana crece (ver `useHeroAct2`). */}
        <div className="hero-video-act absolute top-0 left-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute top-0 left-0 max-w-none object-cover grayscale opacity-90"
          >
            <source src={asset(HERO_VIDEO)} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
