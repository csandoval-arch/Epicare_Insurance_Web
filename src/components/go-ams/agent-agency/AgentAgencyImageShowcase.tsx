"use client";

import React from "react";
import { BleedLeft } from "./BleedLeft";
import { AgentAgencyImageShowcaseProps } from "./types";

export function AgentAgencyImageShowcase({
  images,
  activeSlide,
  imageContainerRef,
  onMouseEnter,
  onMouseLeave,
}: AgentAgencyImageShowcaseProps) {
  return (
    <div
      className="aa-image-showcase col-span-6 md:col-span-8 lg:col-span-6 w-full h-[320px] sm:h-[440px] lg:h-full lg:min-h-[580px] xl:min-h-[640px] relative order-2 lg:order-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <BleedLeft className="w-full h-full">
        <div
          ref={imageContainerRef}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: "1.75rem",
            borderBottomRightRadius: "1.75rem",
          }}
          className="relative w-full h-full overflow-hidden bg-transparent transition-colors duration-500 shadow-elevation-2 flex items-center justify-center !rounded-tl-none !rounded-bl-none !rounded-tr-[1.75rem] !rounded-br-[1.75rem]"
        >
          {/* Imágenes Bleed-Left: recortando el radio embebido del PNG para que la izquierda sea 100% recta y plana contra el borde */}
          {images.map((img, idx) => {
            const isActive = idx === activeSlide;
            if (!isActive) return null;
            return (
              <div
                key={img.id}
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: "1.75rem",
                  borderBottomRightRadius: "1.75rem",
                }}
                className="active-screen-img absolute inset-0 w-full h-full overflow-hidden bg-transparent !rounded-tl-none !rounded-bl-none !rounded-tr-[1.75rem] !rounded-br-[1.75rem]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full md:w-[calc(100%+24px)] max-w-none h-full object-cover object-left-top md:-translate-x-4"
                />
              </div>
            );
          })}
          
          {/* Overlay de borde para asegurar que siempre sea visible por encima de la imagen */}
          <div className="absolute inset-0 border border-l-0 border-[var(--color-border-Strokes-Hover)] !rounded-tl-none !rounded-bl-none !rounded-tr-[1.75rem] !rounded-br-[1.75rem] pointer-events-none z-10" />
        </div>
      </BleedLeft>
    </div>
  );
}
