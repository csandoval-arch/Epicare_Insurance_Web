"use client";

/**
 * @file CreditsTeam.tsx
 * @description Acto 04 de /team — "Credits": cierre como los créditos finales de una película.
 * Los departamentos (mono) y sus nombres (Inter Tight) suben en dos columnas centradas; los créditos
 * terminan en una sola línea — "Starring: you." —, luego "Go beyond growth." y el CTA final.
 * La última imagen es el agente, no Epicare. Fondo oscuro en los dos temas (sigue al Acto 03).
 * - Desktop (≥lg, con motion): pin corto. El encuadre queda fijo y los créditos lo atraviesan a la
 *   velocidad del scroll (departamento y nombres juntos: a dos velocidades se despegaban y dejaban de
 *   leerse). Cuando el último nombre sale del encuadre, el remate nace al centro.
 * - Móvil / reduced-motion: sin pin — los créditos ruedan con el scroll natural y el remate entra
 *   una vez al llegar.
 */

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PrimaryCta from "@/components/go-crm/cta/PrimaryCta";
import { DUR, EASE, REVEAL, SCRUB, STAGGER, TRIGGER } from "@/lib/motion";
import { CREDITS, type CreditDept } from "./credits/creditsData";

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const FLOW = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";
/** Fracción del pin en la que los créditos terminan de salir; el resto es el remate. */
const ROLL_END = 0.85;

export default function CreditsTeam() {
  const t = useTranslations("team.credits");
  const depts = t.raw("departments") as Record<CreditDept, string>;
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(el);

    // ── DESKTOP: encuadre fijo, los créditos lo atraviesan ──
    mm.add(PINNED, () => {
      const roll = el.querySelector<HTMLElement>(".cr-roll")!;
      const travel = () => roll.offsetHeight + window.innerHeight;
      gsap
        .timeline({
          defaults: { ease: EASE.none, force3D: true },
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${travel() / ROLL_END}`, pin: true, scrub: SCRUB.crisp, invalidateOnRefresh: true },
        })
        // Posiciones/duraciones en fracción del recorrido (timeline scrub de duración 1), no segundos.
        .fromTo(roll, { y: 0 }, { y: () => -travel(), duration: ROLL_END }, 0)
        .to(".cr-eyebrow", { y: -REVEAL.sm, opacity: 0, duration: 0.06, ease: EASE.out }, ROLL_END - 0.06)
        .fromTo(".cr-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: 0.08, ease: EASE.dramatic }, ROLL_END + 0.01)
        .fromTo(".cr-after", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06, ease: EASE.out, stagger: 0.03 }, ROLL_END + 0.06);
    });

    // ── MÓVIL: scroll natural + remate one-shot ──
    mm.add(FLOW, () => {
      const final = el.querySelector(".cr-final");
      gsap
        .timeline({ scrollTrigger: { trigger: final, start: TRIGGER.late } })
        .fromTo(".cr-birth", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic })
        .fromTo(".cr-after", { y: REVEAL.md, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.wave }, "-=0.8");
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="dark relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)] overflow-hidden">
      <div className="relative motion-safe:lg:h-svh">
        {/* ── RÓTULO: en desktop queda fijo arriba del encuadre mientras los nombres pasan (dos velocidades
            sin despegar departamento y nombre); se retira con ellos. ── */}
        <p className="cr-eyebrow relative z-10 text-overline text-[var(--color-text-accent-blue)] text-center pt-section-md motion-safe:lg:absolute motion-safe:lg:inset-x-0 motion-safe:lg:top-0 motion-safe:lg:pt-section-sm">
          {t("eyebrow")}
        </p>

        {/* ── VENTANA: los créditos se funden en los bordes del encuadre (margen creativo: máscara) ── */}
        <div className="motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:overflow-hidden motion-safe:lg:[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
          <div className="cr-roll w-full max-w-section-sm mx-auto px-gutter-sm pt-static-2xl pb-section-sm motion-safe:lg:absolute motion-safe:lg:inset-x-0 motion-safe:lg:top-full motion-safe:lg:py-0">
            <dl className="flex flex-col gap-static-2xl">
              {CREDITS.map(({ dept, names }) => (
                <div key={dept} className="grid grid-cols-2 gap-x-static-xl items-start">
                  <dt className="cr-dept text-right text-ui-label text-[var(--color-text-secondary)] pt-static-xs">{depts[dept]}</dt>
                  <dd className="flex flex-col gap-static-xs">
                    {names.map((name) => (
                      <span key={name} className="text-body-xl">
                        {name}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── REMATE: la última línea de los créditos es el agente ── */}
        <div className="cr-final relative px-gutter-sm pt-section-sm pb-section-lg flex flex-col items-center text-center gap-static-lg motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:justify-center motion-safe:lg:p-0 motion-safe:lg:pointer-events-none">
          <h2 className="text-display-xl overflow-hidden pb-static-xs">
            <span className="cr-birth block">{t("starring")}</span>
          </h2>
          <p className="cr-after text-body-xl text-[var(--color-text-secondary)]">{t("statement")}</p>
          <div className="cr-after motion-safe:lg:pointer-events-auto">
            <PrimaryCta label={t("cta")} />
          </div>
        </div>
      </div>
    </section>
  );
}
