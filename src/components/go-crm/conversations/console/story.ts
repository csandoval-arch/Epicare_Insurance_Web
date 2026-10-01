/**
 * @description La historia de la consola, en loop (~13 s): el agente escribe y envía el contrato →
 * la actividad lo registra y el contacto gana una etiqueta → el cliente escribe y responde con el
 * contrato firmado → la actividad y las etiquetas se actualizan otra vez → pausa → todo vuelve con
 * suavidad al diseño estático y el ciclo empieza de nuevo (el final es idéntico al principio).
 *
 * Cada escena devuelve su timeline acotado a un `scope` (un árbol de paneles, vía
 * `gsap.utils.selector`: desktop y móvil están montados a la vez). Desktop encadena todas; en móvil
 * el hilo y la actividad tienen cada uno su propio loop.
 * Hardware Symphony: solo transform/opacity. El tecleo es una máscara que se encoge en `steps()`;
 * los contadores son los únicos `textContent` y solo cambian cuando cambia el número.
 */

import gsap from "gsap";
import { DUR, EASE, REVEAL, STAGGER } from "@/lib/motion";
import { STORY, TAG_COUNT } from "./data";
import { THREAD_SHIFTS } from "./ThreadPanel";
import { EVENT_SHIFT } from "./ActivityPanel";

/** Ritmo de escritura (margen creativo: ~22 caracteres/s, humano pero ágil). */
const TYPE_DUR = STORY.typed.length / 22;
/** Respiro antes de cada vuelta y pausa con la historia completa antes de volver. */
const IDLE = DUR.base;
const HOLD = DUR.count;
/** Cuánto baja la barra de scroll del hilo en cada momento (acompaña a THREAD_SHIFTS). */
const THUMB = { sent: 40, reply: 80 } as const;
/** Rebote de los tres puntos de "escribiendo…" (px del fotograma). */
const DOT_HOP = 6;
const DOT_HOPS = 5;

type Scope = Element;
type Q = (sel: string) => Element[];

const scoped = (scope: Scope): Q => gsap.utils.selector(scope) as Q;

const setText = (el: Element | undefined, value: number) => {
  if (el && el.textContent !== String(value)) el.textContent = String(value);
};

/** Contadores al estado del diseño estático (los tweens se revierten solos; el texto no). */
export function resetStoryText(scope: Scope) {
  const q = scoped(scope);
  setText(q(".cx-chars")[0], 0);
  setText(q(".cx-segs")[0], 0);
  setText(q(".cx-tag-count")[0], TAG_COUNT);
}

// ── HILO ──

/** El agente escribe: el placeholder se apaga, la máscara se retira letra a letra, enviar se activa. */
function typeScene(q: Q) {
  const tl = gsap.timeline();
  const typed = q(".cx-typed")[0] as HTMLElement | undefined;
  const cover = q(".cx-cover");
  if (!typed) return tl;
  const n = STORY.typed.length;
  const width = () => typed.offsetWidth + 4;
  const chars = q(".cx-chars")[0];
  const segs = q(".cx-segs")[0];

  tl.to(q(".cx-placeholder"), { opacity: 0, duration: DUR.micro, ease: EASE.snap })
    .set(cover, { width, scaleX: 1, transformOrigin: "right center", opacity: 1 })
    .set(typed, { opacity: 1, y: 0 })
    .to(cover, {
      scaleX: 0,
      duration: TYPE_DUR,
      ease: `steps(${n})`,
      onUpdate() {
        const c = Math.round(this.progress() * n);
        setText(chars, c);
        setText(segs, c > 0 ? 1 : 0);
      },
    })
    .to(q(".cx-caret"), { x: width, duration: TYPE_DUR, ease: `steps(${n})` }, "<")
    .to(q(".cx-send-on"), { opacity: 1, duration: DUR.fast, ease: EASE.out }, "<+=0.2");
  return tl;
}

/** Se envía: el texto sale hacia arriba, el compositor se vacía y el hilo sube con el contrato. */
function sendScene(q: Q) {
  const tl = gsap.timeline();
  tl.to(q(".cx-send-on"), { scale: 0.92, duration: DUR.micro, ease: EASE.snap, yoyo: true, repeat: 1, transformOrigin: "center" })
    .to(q(".cx-typed"), { y: -REVEAL.sm, opacity: 0, duration: DUR.fast, ease: EASE.out })
    .set(q(".cx-cover"), { opacity: 0 }, "<")
    .set(q(".cx-caret"), { x: 0 }, "<")
    .call(
      () => {
        setText(q(".cx-chars")[0], 0);
        setText(q(".cx-segs")[0], 0);
      },
      undefined,
      "<"
    )
    .to(q(".cx-placeholder"), { opacity: 1, duration: DUR.fast, ease: EASE.out }, "<+=0.1")
    .to(q(".cx-send-on"), { opacity: 0, duration: DUR.fast, ease: EASE.out }, "<")
    .to(q(".cx-thread"), { y: -THREAD_SHIFTS.sent, duration: DUR.slow, ease: EASE.inOut }, "<")
    .to(q(".cx-thumb"), { y: THUMB.sent, duration: DUR.slow, ease: EASE.inOut }, "<");
  return tl;
}

/** El cliente escribe (tres puntos que respiran) y responde con el contrato firmado. */
function replyScene(q: Q) {
  const tl = gsap.timeline();
  tl.to(q(".cx-thread"), { y: -THREAD_SHIFTS.typing, duration: DUR.base, ease: EASE.inOut })
    .fromTo(q(".cx-dots"), { opacity: 0, y: REVEAL.sm }, { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out }, "<+=0.2")
    .to(q(".cx-dot"), { y: -DOT_HOP, duration: DUR.microOut, ease: EASE.breath, yoyo: true, repeat: DOT_HOPS, stagger: STAGGER.wave }, "<")
    .to(q(".cx-dots"), { opacity: 0, duration: DUR.micro, ease: EASE.out })
    .fromTo(q(".cx-msg-in"), { opacity: 0, y: REVEAL.sm }, { opacity: 1, y: 0, duration: DUR.fast, ease: EASE.out }, "<")
    .to(q(".cx-thread"), { y: -THREAD_SHIFTS.reply, duration: DUR.slow, ease: EASE.inOut }, "<")
    .to(q(".cx-thumb"), { y: THUMB.reply, duration: DUR.slow, ease: EASE.inOut }, "<");
  return tl;
}

// ── ACTIVIDAD ──

/** Entra un evento arriba: la línea de tiempo (y los eventos previos de la historia) bajan. */
function eventScene(q: Q, event: "sent" | "signed") {
  const tl = gsap.timeline();
  const depth = event === "sent" ? 1 : 2;
  const fresh = q(`.cx-ev-${event}`);
  tl.to(q(".cx-events"), { y: EVENT_SHIFT * depth, duration: DUR.base, ease: EASE.inOut });
  if (event === "signed") tl.to(q(".cx-ev-sent"), { y: EVENT_SHIFT, duration: DUR.base, ease: EASE.inOut }, "<");
  tl.fromTo(fresh, { opacity: 0, y: -REVEAL.sm }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out }, "-=0.45").to(
    fresh.flatMap((el) => Array.from(el.querySelectorAll(".cx-ev-line"))),
    { scaleY: 1, duration: DUR.fast, ease: EASE.out },
    "-=0.35"
  );
  return tl;
}

// ── CONTACTO ──

/** La automatización etiqueta al contacto: la etiqueta aparece y el contador sube. */
function tagScene(q: Q, tag: "sent" | "signed") {
  const count = q(".cx-tag-count")[0];
  const value = TAG_COUNT + (tag === "sent" ? 1 : 2);
  return gsap
    .timeline()
    .fromTo(q(`.cx-tag-${tag}`), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: DUR.fast, ease: EASE.snap })
    .call(() => setText(count, value), undefined, "<");
}

// ── VUELTA AL INICIO ──

/**
 * Vuelta al inicio como un "refresco" del panel: el hilo y la actividad se apagan, vuelven a su sitio
 * sin verse y se encienden ya en el estado del diseño estático (deslizar hacia atrás dejaba huecos).
 */
function resetScene(q: Q) {
  const all = (...sels: string[]) => sels.flatMap(q);
  const layers = all(".cx-thread", ".cx-events");
  const moved = all(".cx-thread", ".cx-events", ".cx-ev-sent", ".cx-ev-signed");
  const tl = gsap.timeline();
  // En móvil cada panel lleva su loop: solo se anima lo que existe en él (sin avisos de GSAP).
  const safe = (targets: Element[], fn: (t: Element[]) => void) => {
    if (targets.length) fn(targets);
  };
  const back = DUR.fast;

  safe([...moved, ...all(".cx-tag-sent", ".cx-tag-signed")], (t) => tl.to(t, { opacity: 0, duration: back, ease: EASE.out }, 0));
  safe(q(".cx-thumb"), (t) => tl.to(t, { y: 0, duration: DUR.base, ease: EASE.inOut }, 0));
  safe(moved, (t) => tl.set(t, { y: 0 }, back));
  safe(q(".cx-msg-in"), (t) => tl.set(t, { opacity: 0 }, back));
  safe(q(".cx-ev-line"), (t) => tl.set(t, { scaleY: 0 }, back));
  safe(q(".cx-typed"), (t) => tl.set(t, { y: 0 }, back));
  safe(q(".cx-tag-count"), ([count]) => tl.call(() => setText(count, TAG_COUNT), undefined, back));
  safe(layers, (t) => tl.to(t, { opacity: 1, duration: DUR.base, ease: EASE.out }, back));
  return tl;
}

// ── LOOPS ──

const loop = () => gsap.timeline({ paused: true, repeat: -1 });

/** Desktop: la historia completa sobre los tres paneles. */
export function buildDesktopStory(scope: Scope) {
  const q = scoped(scope);
  return loop()
    .to({}, { duration: IDLE })
    .add(typeScene(q))
    .add(sendScene(q), `+=${DUR.fast}`)
    .add(eventScene(q, "sent"), `-=${DUR.base}`)
    .add(tagScene(q, "sent"), `-=${DUR.fast}`)
    .add(replyScene(q), `+=${DUR.base}`)
    .add(eventScene(q, "signed"), `-=${DUR.fast}`)
    .add(tagScene(q, "signed"), `-=${DUR.fast}`)
    .add(resetScene(q), `+=${HOLD}`);
}

/** Móvil · hilo: el slide muestra el panel entero, así que tiene tecleo, envío y respuesta. */
export function buildThreadStory(scope: Scope) {
  const q = scoped(scope);
  return loop()
    .to({}, { duration: IDLE })
    .add(typeScene(q))
    .add(sendScene(q), `+=${DUR.fast}`)
    .add(replyScene(q), `+=${DUR.slow}`)
    .add(resetScene(q), `+=${HOLD}`);
}

/** Móvil · actividad: los dos eventos de la historia. */
export function buildActivityStory(scope: Scope) {
  const q = scoped(scope);
  return loop()
    .to({}, { duration: IDLE })
    .add(eventScene(q, "sent"))
    .add(eventScene(q, "signed"), `+=${DUR.count}`)
    .add(resetScene(q), `+=${HOLD}`);
}
