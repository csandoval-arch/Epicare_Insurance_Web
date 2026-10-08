"use client";

/**
 * @file ContactVsOpportunity.tsx
 * @description Sección 3 de GO CRM — "Cartera" (Fractura · ronda 6, 2026-10-07). Un solo acto:
 *   Titular vivo: "Detrás de *Elena*, más de una venta." — el nombre es el de la persona de la foto y
 *   cambia con ella (texto, foto y oportunidades rotan juntos cada `PERSON_MS`).
 *   Primer plano: la foto grande dentro de los márgenes, con el nombre de la persona en display sobre ella.
 *   Scroll (desktop, pin + scrub): el nombre se retira, la foto se parte en 3 franjas que se separan y cada
 *   franja revela, escrita sobre la imagen, una oportunidad (Dental · Salud · Vida) con su prima y etapa.
 * Sin tarjetas blancas: el texto vive sobre la foto con velo. Solo transform/opacity.
 * Móvil: sin pin; foto con el nombre + lista de hairlines con las 3 oportunidades.
 * QUEMADOS: ver sections/go-crm/context.md (rondas 1–5 en `_quarantine/go-crm/contact-vs-opp/`).
 */

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, REVEAL, SCRUB, STAGGER, TRIGGER } from "@/lib/motion";
import { CycleTimer, PEOPLE, PeopleStack, SwapStyle, useCvoCopy, usePersonCycle, type Person } from "./contact-vs-opp/shared";
import type { ContactSource } from "./contact-vs-opp/data";
import { BellRinging, Clock, Heartbeat, Tooth, Umbrella } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

// ── VALORES FUERA DE TOKEN (margen creativo declarado) ──
const PIN_LENGTH = "+=170%";
/** Tramo quieto al inicio del pin: la tarjeta de la persona se queda (con su blur) antes de retirarse.
 *  El blur se apaga en cuanto su contenedor baja de opacidad 1, por eso la salida espera. */
const NAME_HOLD = 0.3;
/** Escala final de cada franja: al encogerse se abre la separación sin salir de los márgenes. */
const SLICE_END_SCALE = 0.95;
/** Encuadre de las fotos (verticales) en la escena apaisada. */
const PHOTO_POSITION = "object-[50%_38%]";
const SLICES = [0, 1, 2] as const;
/** Etapa cuyo siguiente paso tiene plazo ("Seguimiento en 2 días"): lleva reloj junto a la campana. */
const TIMED_STAGE = 0;
/** Velocidad de la salida de las tarjetas al volver al acto 1 (la entrada va a 1×). */
const CARDS_EXIT_SPEED = 3;

const firstName = (p: Person) => p.contact.name.split(" ")[0];

/** Icono de cada oportunidad (Dental · Salud · Vida), todos en azul de marca, con su loop propio. */
const OPP_ICONS = [
  { Icon: Tooth, loop: "cvo-ico-float" },
  { Icon: Heartbeat, loop: "cvo-ico-beat" },
  { Icon: Umbrella, loop: "cvo-ico-sway" },
] as const;

/**
 * Vida latente de los iconos (CSS, solo transform/opacity, en pausa fuera de pantalla y con reduced-motion):
 * cada uno con su carácter — el diente flota, el latido late en doble golpe, el paraguas se mece — y detrás
 * de todos un anillo que se expande y se apaga, desfasado entre tarjetas. Margen creativo declarado
 * (duraciones propias de loop; curvas suaves tipo sine).
 */
const ICON_LOOPS_CSS = `
@keyframes cvo-float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -3px, 0); } }
@keyframes cvo-beat { 0%, 40%, 100% { transform: scale(1); } 10% { transform: scale(1.14); } 20% { transform: scale(1); } 30% { transform: scale(1.08); } }
@keyframes cvo-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
@keyframes cvo-ring { 0% { transform: scale(0.6); opacity: 0.45; } 70%, 100% { transform: scale(1.7); opacity: 0; } }
.cvo-ico-float { animation: cvo-float 3s cubic-bezier(0.37, 0, 0.63, 1) infinite; }
.cvo-ico-beat { animation: cvo-beat 1.8s cubic-bezier(0.37, 0, 0.63, 1) infinite; }
.cvo-ico-sway { animation: cvo-sway 3.2s cubic-bezier(0.37, 0, 0.63, 1) infinite; transform-origin: 50% 15%; }
.cvo-ico-ring { animation: cvo-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.cvo-paused .cvo-ico-float, .cvo-paused .cvo-ico-beat, .cvo-paused .cvo-ico-sway, .cvo-paused .cvo-ico-ring { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .cvo-ico-float, .cvo-ico-beat, .cvo-ico-sway, .cvo-ico-ring { animation: none; } .cvo-ico-ring { opacity: 0; } }
`;

/**
 * Liquid glass claro de las 4 tarjetas, con letra blanca. El contraste NO lo pone el vidrio: lo pone la foto
 * (un degradado oscuro en la parte baja de cada franja, `PHOTO_SCRIM`). Así el vidrio puede ser transparente
 * de verdad — blur fuerte, saturate y relleno blanco mínimo — sin tinte gris ni bordes.
 * La tarjeta lleva `dark`: dentro, los tokens resuelven a su versión clara (texto blanco, azul #7DD3FC).
 * Margen creativo declarado (valores del material). El blur solo vive con el contenedor a opacidad 1.
 */
const GLASS = "dark cvo-glass relative overflow-hidden rounded-xl text-[var(--color-text-primary)]";

const GLASS_CSS = `
.cvo-glass {
  background: linear-gradient(160deg, rgb(255 255 255 / 0.22), rgb(255 255 255 / 0.06) 55%, rgb(255 255 255 / 0.1));
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgb(255 255 255 / 0.28);
  box-shadow: 0 20px 40px -20px rgb(0 0 0 / 0.45);
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
}
`;

/** Degradado oscuro en la parte baja de la foto: da al vidrio (y al texto blanco) un fondo estable. */
const PHOTO_SCRIM =
  "absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[var(--color-overlay-backdrop)]/65 via-[var(--color-overlay-backdrop)]/25 to-transparent pointer-events-none";



/** Sin capa extra: el borde es un stroke blanco claro (1px, 28%) en `.cvo-glass`. */
const Sheen = () => null;

/** Color de marca de cada fuente (identidad de terceros, no tokens del DS: margen creativo declarado). */
const SOURCE_COLORS: Record<ContactSource, string> = {
  Salesforce: "#00A1E0",
  WhatsApp: "#25D366",
  Facebook: "#1877F2",
  "Google Ads": "#FBBC04",
  Eppigo: "var(--color-brand-blue)",
};

/** Chip de la fuente del contacto: píldora translúcida con el punto de color de la red. */
function SourceChip({ source }: { source: ContactSource }) {
  return (
    <span className="inline-flex w-fit items-center gap-static-sm rounded-full border border-[var(--glass-liquid-tile-edge)] bg-[var(--glass-liquid-tile)] px-static-sm py-static-xs text-meta text-[var(--color-text-primary)]">
      <span className="size-static-sm rounded-full" style={{ background: SOURCE_COLORS[source] }} aria-hidden="true" />
      {source}
    </span>
  );
}

/**
 * Tarjeta de liquid glass claro con la persona sobre la foto: iniciales,
 * nombre, fuente y el reloj del ciclo.
 * Blur moderado (md): vive sobre una foto quieta y en desktop sale antes de la fractura.
 */
function GlassName({ person, running, onCycle }: { person: Person; running: boolean; onCycle: () => void }) {
  const c = useCvoCopy();
  /** Prima mensual total de la persona (suma de sus oportunidades). */
  const total = person.opps.reduce((sum, o) => sum + Number(o.price.replace(/\D/g, "")), 0);
  return (
    <div className={`${GLASS} p-static-lg flex flex-col gap-static-md`}>
      <Sheen />
      <div className="relative flex items-center gap-static-md">
      <span className="relative size-static-2xl shrink-0 rounded-full bg-[var(--color-text-primary)] text-[var(--color-surface-BG-white)] dark:text-[var(--color-surface-BG-black)] text-meta grid place-items-center" aria-hidden="true">
        {person.contact.initials}
      </span>
      <span key={person.contact.name} className="cvo-swap relative flex flex-col gap-static-xs min-w-0">
        <span className="text-h3 truncate">{person.contact.name}</span>
        <SourceChip source={person.contact.source} />
      </span>
      </div>
      {/* Segundo dato: sus oportunidades abiertas y la prima total (cambia con la persona) */}
      <span key={`${person.contact.name}-t`} className="cvo-swap relative block border-t border-[var(--glass-liquid-divider)] pt-static-sm text-body-sm font-medium text-[var(--color-text-primary)]">
        {c.openOpps(person.opps.length)} · <span className="font-semibold text-[var(--color-action-link-hover)]">${total}
        {c.perMonth}</span>
      </span>
      <CycleTimer running={running} onCycle={onCycle} className="absolute left-0 bottom-0" />
    </div>
  );
}

export default function ContactVsOpportunity() {
  const c = useCvoCopy();
  const rootRef = useRef<HTMLElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const { index, running, next } = usePersonCycle(root);
  const person = PEOPLE[index];
  const thumbRef = useRef<HTMLSpanElement>(null);
  /** Móvil: mueve el tramo del indicador según el progreso del scroll horizontal (sin re-render). */
  const onRowScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const max = row.scrollWidth - row.clientWidth;
    if (thumbRef.current) thumbRef.current.style.transform = `translate3d(${max > 0 ? (row.scrollLeft / max) * 100 : 0}%, 0, 0)`;
  };

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setRoot(el);
    const mm = gsap.matchMedia(el);

    // ── ENTRADA (todas las anchuras): titular por palabras + cierre ──
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".cvo-word", { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.birth, ease: EASE.dramatic, stagger: STAGGER.tight, scrollTrigger: { trigger: el, start: TRIGGER.standard } });
      gsap.fromTo(".cvo-rise", { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.tight, scrollTrigger: { trigger: el, start: TRIGGER.standard } });
    });

    // ── DESKTOP: la foto se parte en 3 ──
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap
        .timeline({
          defaults: { ease: EASE.none, force3D: true },
          scrollTrigger: { trigger: el, start: "top top", end: PIN_LENGTH, pin: true, scrub: SCRUB.crisp, invalidateOnRefresh: true },
        })
        .addLabel("split", NAME_HOLD + 0.15)
        // 1 · el nombre sobre la foto se retira
        .to(".cvo-nameblock", { y: -REVEAL.md, opacity: 0, duration: 0.35 }, NAME_HOLD)
        // 2 · la foto se parte: las franjas se separan con desnivel
        .to(".cvo-slice", { scale: SLICE_END_SCALE, ease: "power2.inOut", duration: 0.9 }, "split")
        // Tramo final del scrub sin cambios: las tarjetas entran por tiempo (abajo), no con el scroll
        .to({}, { duration: 0.6 });

      // 3 · las tarjetas de cada franja entran por TIEMPO (no scrub), en orden izquierda → centro → derecha,
      // cuando el scrub pasa CARDS_AT del pin; si vuelves arriba, salen en orden inverso.
      const cardsIn = gsap.timeline({ paused: true, defaults: { force3D: true } });
      gsap.utils.toArray<HTMLElement>(".cvo-oppcard", el).forEach((card, i) => {
        const at = i * STAGGER.wave;
        cardsIn
          .fromTo(card, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.out }, at)
          .fromTo(card.querySelectorAll(".cvo-opp"), { yPercent: REVEAL.birthPercent }, { yPercent: 0, duration: DUR.base, ease: EASE.dramatic }, at + 0.1)
          .fromTo(card.querySelectorAll(".cvo-oppmeta"), { y: REVEAL.sm, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.fast, ease: EASE.out, stagger: STAGGER.tight }, at + 0.2);
      });
      const cardsAt = (tl.labels.split + 0.45) / tl.duration();
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: PIN_LENGTH,
        onUpdate: (self) => {
          // Entrada a ritmo normal y escalonada; salida rápida (CARDS_EXIT_SPEED×) para que las tarjetas se
          // vayan antes de que la foto se recomponga al volver al acto 1.
          if (self.progress >= cardsAt) cardsIn.timeScale(1).play();
          else cardsIn.timeScale(CARDS_EXIT_SPEED).reverse();
        },
      });

    });

    return () => mm.revert();
  }, []);

  /** Nombre que cambia dentro del titular. */
  const punct = c.title[1].match(/^[,.]/)?.[0] ?? "";
  const rest = c.title[1].slice(punct.length).trim();
  const liveName = (
    <>
      <span key={person.contact.name} className="cvo-swap inline-block font-light italic pr-static-xs text-[var(--color-text-accent-blue)]">
        {firstName(person)}
      </span>
      {punct}
    </>
  );

  /** Producto de la oportunidad `i`: su icono encima y el nombre. */
  const oppLabel = (i: number, { compact = false } = {}) => {
    const { Icon, loop } = OPP_ICONS[i];
    return (
      <span className={`flex flex-col items-start ${compact ? "gap-static-sm" : "gap-static-md"}`}>
        {/* Icono en círculo translúcido con el trazo del color del texto: blanco dentro del vidrio (que lleva
            `dark`), tinta en fondo claro (tarjetas de móvil). */}
        <span className={`relative shrink-0 grid place-items-center rounded-full border border-[var(--color-text-primary)]/30 bg-[var(--color-text-primary)]/10 text-[var(--color-text-primary)] size-static-2xl`} aria-hidden="true">
          <span className="cvo-ico-ring absolute inset-0 rounded-full border border-[var(--color-text-primary)]" style={{ animationDelay: `${i * 0.8}s` }} />
          <Icon weight="bold" className={`${loop} relative size-1/2`} style={{ animationDelay: `${i * 0.4}s` }} />
        </span>
        <span className={compact ? "text-h3" : "text-display-sm"}>{c.opps[i]?.label}</span>
      </span>
    );
  };

  /** Prima + etapa de la oportunidad `i` de la persona activa (cambia con ella). */
  const oppMeta = (i: number) => {
    const opp = person.opps[i];
    return (
      <span key={`${person.contact.name}-${i}`} className="cvo-swap flex flex-col gap-static-xs md:flex-row md:items-baseline md:gap-static-md text-[var(--color-text-primary)]">
        <span className="text-body-xl font-semibold text-[var(--color-action-link-hover)]">
          {opp.price}
          <span className="font-normal">{c.perMonth}</span>
        </span>
        <span className="text-body-md font-medium">{c.stages[opp.stage]}</span>
      </span>
    );
  };

  /** Siguiente paso de la oportunidad `i` (según su etapa): texto a la izquierda, campana de aviso a la derecha. */
  const oppNext = (i: number) => {
    const opp = person.opps[i];
    return (
      <span key={`${person.contact.name}-n${i}`} className="cvo-swap flex items-center justify-between gap-static-md border-t border-[var(--glass-liquid-divider)] pt-static-sm text-[var(--color-text-primary)]">
        <span className="text-body-md font-semibold">{c.nextSteps[opp.stage]}</span>
        {/* Aviso: el siguiente paso como recordatorio del CRM; el reloj solo cuando el paso tiene plazo */}
        <span className="flex items-center gap-static-sm shrink-0" aria-hidden="true">
          {opp.stage === TIMED_STAGE && <Clock weight="bold" className="size-static-md" />}
          <BellRinging weight="fill" className="size-static-md" />
        </span>
      </span>
    );
  };

  return (
    <section ref={rootRef} className={`relative w-full md:h-dvh flex flex-col ${running ? "" : "cvo-paused"} bg-[var(--color-surface-BG-base)] overflow-hidden`}>
      <SwapStyle />
      <style href="cvo-icon-loops" precedence="default">{ICON_LOOPS_CSS + GLASS_CSS}</style>

      {/* ── CABECERA: titular vivo, centrado (bajada + CTA retirados por ahora, 2026-10-07) ── */}
      <div className="w-full max-w-section-xl mx-auto px-gutter-sm md:px-gutter-md pt-static-2xl md:pt-section-xs pb-static-xl">
        <div className="flex flex-col items-start text-left md:items-center md:text-center gap-static-md">
          <p className="cvo-rise text-overline text-[var(--color-text-secondary)]">{c.overline}</p>
          <h2 className="text-display md:text-display-lg text-[var(--color-text-primary)]">
            <span className="inline-block overflow-hidden align-bottom pb-static-xs">
              <span className="cvo-word inline-block">{c.title[0].trim()}</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom pb-static-xs">
              <span className="cvo-word inline-block">{liveName}</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom pb-static-xs">
              <span className="cvo-word inline-block">{rest}</span>
            </span>
          </h2>
        </div>
      </div>

      {/* ── ESCENA (desktop): la foto grande que se parte en 3 ── */}
      <div className="hidden md:block w-full max-w-section-xl mx-auto px-gutter-md flex-1 min-h-0 pb-section-xs">
        <div className="relative w-full h-full">
          {SLICES.map((i) => (
            <div key={i} className="cvo-slice absolute top-0 bottom-0 overflow-hidden rounded-lg" style={{ left: `${(i * 100) / 3}%`, width: `${100 / 3}%` }}>
              {/* La misma foto en las 3 franjas, desplazada: juntas recomponen la imagen entera */}
              <div className="cvo-slice-img absolute top-0 bottom-0" style={{ left: `${-i * 100}%`, width: "300%" }}>
                <PeopleStack active={index} imgClassName={PHOTO_POSITION} />
              </div>
              <div className={PHOTO_SCRIM} aria-hidden="true" />
              {/* La oportunidad de esta franja: tarjeta de liquid glass sobre la foto */}
              <div className="absolute inset-x-0 bottom-0 p-static-sm">
                <div className={`cvo-oppcard ${GLASS} p-static-lg flex flex-col gap-static-sm`}>
                  <Sheen />
                  <span className="relative block overflow-hidden pb-static-xs">
                    <span className="cvo-opp block">{oppLabel(i)}</span>
                  </span>
                  <span className="cvo-oppmeta relative block">{oppMeta(i)}</span>
                  <span className="cvo-oppmeta relative block mt-static-xs">{oppNext(i)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Tarjeta de vidrio con la persona (se retira al partirse la foto). Blur moderado: vive sobre una
              foto quieta y sale antes de la fractura. */}
          <div className="cvo-nameblock absolute left-1/2 -translate-x-1/2 bottom-static-md w-96 pointer-events-none">
            <GlassName person={person} running={running} onCycle={next} />
          </div>
        </div>
      </div>

      {/* ── MÓVIL: la foto de la persona (sin su tarjeta) y, sobre la parte baja, una fila con scroll
          horizontal nativo de sus 3 oportunidades en cuadrados de liquid glass (sin pin) ── */}
      <div className="md:hidden w-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          <PeopleStack active={index} />
          <div className={PHOTO_SCRIM} aria-hidden="true" />
          {/* Sin tarjeta de la persona en móvil: solo su reloj (hairline arriba), que hace rotar a las personas */}
          <CycleTimer running={running} onCycle={next} className="absolute left-0 top-0 h-0.5 !bg-[var(--color-text-White-100)]" />
          <div
            onScroll={onRowScroll}
            className="absolute inset-x-0 bottom-0 pb-static-lg flex gap-static-sm overflow-x-auto snap-x snap-mandatory scroll-px-static-sm px-static-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SLICES.map((i) => (
              <div key={i} className={`${GLASS} shrink-0 w-[54%] aspect-square snap-start p-static-md flex flex-col justify-center gap-static-lg`}>
                {oppLabel(i, { compact: true })}
                <div className="flex flex-col gap-static-sm">
                  {oppMeta(i)}
                </div>
              </div>
            ))}
          </div>
          {/* Indicador de scroll ultraminimalista: hairline corta con un tramo blanco que sigue al scroll */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-static-sm w-12 h-px bg-[var(--color-text-White-100)]/30 overflow-hidden pointer-events-none" aria-hidden="true">
            <span ref={thumbRef} className="block h-full w-1/2 bg-[var(--color-text-White-100)] will-change-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
