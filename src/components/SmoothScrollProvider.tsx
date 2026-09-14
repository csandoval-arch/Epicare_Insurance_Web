"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── LENIS SMOOTH SCROLL CONFIG ──
const LENIS_OPTIONS = {
  duration: 1.1,
  // easeOutExpo — natural, premium deceleration
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
} as const;

/**
 * @description Global smooth-scroll provider (Lenis) synced with the GSAP ticker so
 * every ScrollTrigger pin/scrub (Hero, Bento coverflow, ProductLines, Metrics, etc.)
 * stays perfectly in sync with the smoothed scroll position. Respects
 * `prefers-reduced-motion` — when the user opts out, Lenis is not initialized and native
 * scrolling is used. Mounts once at the app root; cleans up ticker + instance on unmount.
 *
 * Also handles cross-page GSAP cleanup: on every route change it kills all zombie
 * ScrollTriggers (pins, scrubs) left over by the previous page so child components of
 * the incoming page can create their own contexts with a clean GSAP state.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ── ROUTE CHANGE: RESET SCROLL & REFRESH ─────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    // Refresh ScrollTrigger positions after the DOM settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);
  // ─────────────────────────────────────────────────────────────────────────

  // ── LENIS INIT (once, on mount) ───────────────────────────────────────────
  useEffect(() => {
    // Accessibility: honor reduced-motion — skip smoothing entirely.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis(LENIS_OPTIONS);

    // Expose the instance so components can drive programmatic scrolls
    // (e.g. Bento progress-bar seek) through Lenis instead of fighting it.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Keep ScrollTrigger in lockstep with Lenis' smoothed scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's single RAF loop (avoids a competing rAF).
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  return <>{children}</>;
}
