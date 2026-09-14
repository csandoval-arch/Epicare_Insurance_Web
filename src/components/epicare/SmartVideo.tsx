"use client";

import React, { useEffect, useRef } from "react";

type SmartVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  className?: string;
};

/**
 * @description Vídeo decorativo que solo descarga y reproduce cuando está a punto
 * de verse. Sustituye a `<video autoPlay>` crudo, que en esta landing descargaba
 * los 19 vídeos de la página en la primera carga (~18 MB) aunque estuvieran fuera
 * de pantalla o en la variante de tema oculta.
 *
 * Dos observers con propósitos distintos:
 *  1. Precarga con `rootMargin` — empieza a bajar el archivo un 25% de viewport
 *     ANTES de asomar, para que no haya hueco vacío al entrar en pantalla
 *     (necesario mientras no existan `poster`).
 *  2. Reproducción con `threshold` — play/pause según visibilidad real, para no
 *     gastar compositor en vídeos que nadie ve.
 *
 * Clave para el ahorro: un elemento en `display:none` NUNCA interseca. Como las
 * cards montan la versión light y la dark a la vez (`dark:hidden` /
 * `hidden dark:block`), la que no corresponde al tema activo no descarga un solo
 * byte — y en móvil tampoco descargan las del Bento desktop (`hidden md:block`).
 *
 * Extraído de la implementación que ya existía en BentoGridMobile.
 */
export default function SmartVideo({ src, className, ...props }: SmartVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const preloader = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (video.preload !== "auto") {
            video.preload = "auto";
            video.load();
          }
          preloader.disconnect();
        }
      },
      { rootMargin: "25% 0px" }
    );

    const player = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    preloader.observe(video);
    player.observe(video);

    return () => {
      preloader.disconnect();
      player.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden="true"
      {...props}
    />
  );
}
