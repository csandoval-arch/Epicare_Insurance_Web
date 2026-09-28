import type { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * @description Geometría del curtain reveal del footer, válida sea el footer más bajo o más alto que
 * la pantalla (depende del viewport). Equivale al clásico footer `fixed` detrás de la página:
 * - Más bajo que la pantalla: queda anclado abajo; el telón termina cuando su borde inferior llega
 *   al fondo del viewport.
 * - Más alto: queda anclado arriba; el telón termina cuando su top llega arriba y, a partir de ahí,
 *   el scroll normal revela el resto.
 */
const taller = (el: Element | null | undefined) => !!el && (el as HTMLElement).offsetHeight > window.innerHeight;

/** Final del tramo del telón (para `end` de ScrollTrigger, re-evaluado en cada refresh). */
export const curtainEnd = (self: ScrollTrigger) => (taller(self.trigger) ? "top top" : "bottom bottom");

/** Desplazamiento inicial del footer que compensa el scroll durante el telón. */
export const curtainFrom = (stage: HTMLElement) => -Math.min(stage.offsetHeight, window.innerHeight);
