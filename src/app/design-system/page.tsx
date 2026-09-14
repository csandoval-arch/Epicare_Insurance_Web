"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ColorsSection from "./components/ColorsSection";
import SemanticTextColorsSection from "./components/SemanticTextColorsSection";
import TypographySection from "./components/TypographySection";
import SpacingSection from "./components/SpacingSection";
import InteractiveSection from "./components/InteractiveSection";
import MaxWidthSection from "./components/MaxWidthSection";
import { ElevationSection } from "./components/ElevationSection";
import AnimationsSection from "./components/AnimationsSection";


export default function DesignSystemPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-fade-up", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.to(".breathing-card", {
        y: "-=0.5rem",
        yoyo: true,
        repeat: -1,
        duration: 4,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] transition-colors duration-500"
    >
      {/* BACKGROUND TEXTURE SIMULATION */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* THEME TOGGLE */}
      <div className="fixed top-6 right-6 z-50 animate-fade-up">
        <button 
          onClick={toggleTheme}
          className="organic-glass-panel px-4 py-2 flex items-center gap-2 hover:bg-[var(--color-surface-BG-1)] transition-colors"
        >
          <span className="text-[1.125rem]">{isDark ? '🌙' : '☀️'}</span>
          <span className="text-ui-label text-[var(--color-text-primary)] hidden sm:block">
            {isDark ? 'Dark Theme' : 'Light Theme'}
          </span>
        </button>
      </div>

      <div className="max-w-section-xl mx-auto px-gutter-md py-24 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-24 text-center max-w-3xl mx-auto animate-fade-up">
          <p className="text-overline text-[var(--color-brand-orange)] mb-4">
            Premium Framework
          </p>
          <h1 className="text-display mb-6">Modern Design System</h1>
          <p className="text-subtitle text-[var(--color-text-muted)]">
            A visual reference for developers and AI agents. This page documents the Epicare
            design system — brand color, typography, spacing and motion — in one living surface.
            <br/><br/>
            <strong>Currently exploring:</strong> {isDark ? 'Dark Theme (Dark)' : 'Light Theme (Light)'}
          </p>
        </header>

        <ColorsSection isDark={isDark} />
        <SemanticTextColorsSection isDark={isDark} />
        <TypographySection />
        <SpacingSection />
        <ElevationSection />
        <InteractiveSection />
        <AnimationsSection />

      </div>

      <div className="w-full px-gutter-md pb-24 relative z-10">
        <MaxWidthSection />
      </div>
    </main>
  );
}

