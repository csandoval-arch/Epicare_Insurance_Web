import type { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * @description Final del tramo del telón del footer (para `end` de ScrollTrigger, re-evaluado en cada
 * refresh). El footer puede ser más bajo o más alto que la pantalla según el viewport:
 * - Más bajo: queda fijo abajo; el telón termina cuando su borde inferior llega al fondo.
 * - Más alto: queda fijo arriba; el telón termina cuando su top llega arriba y, a partir de ahí,
 *   el scroll normal revela el resto (ver `FooterEpicare`).
 */
export const curtainEnd = (self: ScrollTrigger) => (isTaller(self) ? "top top" : "bottom bottom");

const isTaller = (self: ScrollTrigger) => !!self.trigger && (self.trigger as HTMLElement).offsetHeight > window.innerHeight;
