"use client";

/**
 * @description Acto C en móvil / reduced-motion: el día como línea de tiempo vertical, sin pin. Cada
 * fila: hora (mono) sobre el raíl, avatar de quien la hace, la tarea y su nombre. La última fila es
 * del agente y cierra en azul. En desktop con motion queda solo para lectores de pantalla (el
 * escenario pineado es decorativo).
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, TRIGGER } from "@/lib/motion";
import CrewPortrait from "../crew/CrewPortrait";
import type { DayItem } from "./dayData";

export default function DayList({ items, names, className = "" }: { items: DayItem[]; names: (who: DayItem["who"]) => string; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".dl-row", el).forEach((row) =>
        gsap.fromTo(row, { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, scrollTrigger: { trigger: row, start: TRIGGER.early } })
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <ol ref={ref} className={`relative flex flex-col border-l border-[var(--color-border-Strokes-default)] ml-static-xs ${className}`}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li key={it.time} className="dl-row relative pl-static-lg pb-static-xl last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-1 top-static-xs w-2 h-2 rounded-full ${last ? "bg-[var(--color-brand-blue)]" : "bg-[var(--color-hero-ink)]"}`}
            />
            <p className={`text-meta ${last ? "text-[var(--color-text-accent-blue)]" : "text-[var(--color-text-secondary)]"}`}>{it.time}</p>
            <div className="flex items-start gap-static-md pt-static-sm">
              <CrewPortrait who={it.who} round className="w-static-2xl shrink-0" />
              <div className="flex flex-col gap-static-xs">
                <p className="text-body-lg text-[var(--color-text-primary)]">{it.task}</p>
                <p className="text-meta text-[var(--color-text-secondary)]">{names(it.who)}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
