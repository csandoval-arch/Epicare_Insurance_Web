"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EASE,
  DUR,
  STAGGER,
  REVEAL,
  TRIGGER,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function Coverage52Epicare() {
  const t = useTranslations("landingV2.coverage");
  const sectionRef = useRef<HTMLElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Reveal del Header y CTA en cascada
      if (elementsRef.current) {
        gsap.fromTo(
          elementsRef.current.children,
          {
            opacity: 0,
            y: REVEAL.sm,
          },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.base,
            scrollTrigger: {
              trigger: el,
              start: TRIGGER.standard,
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full pb-section-md relative border-b border-[var(--color-border-Strokes-default)] overflow-hidden"
    >
      <div className="mx-auto max-w-section-xl px-[0.875rem] md:px-gutter-md">
        
        {/* Contenido en Grid de 12 columnas */}
        <div ref={elementsRef} className="grid grid-cols-12 gap-[var(--space-fluid-sm)] items-end pb-[var(--space-static-xl)] border-b border-[var(--color-border-Strokes-default)]/30">
          <div className="col-span-full md:col-span-9">
            <h2 className="text-display-xl text-[var(--color-text-primary)] tracking-tight">
              {t("title")}
            </h2>
          </div>
          <div className="col-span-full md:col-span-3 flex md:justify-end md:pb-3">
            <Link 
              href="/licensing"
              className="inline-flex items-center justify-center px-[var(--space-static-xl)] py-[var(--space-static-sm)] border border-[var(--color-border-Strokes-strong)] rounded-full text-ui-label text-[var(--color-text-primary)] bg-transparent hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface-BG-base)] transition-colors duration-300"
            >
              {t("cta")}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
