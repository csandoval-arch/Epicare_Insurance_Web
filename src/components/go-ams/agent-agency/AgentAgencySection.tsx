"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER, REVEAL, TRIGGER } from "@/lib/motion";
import { RoleMode, FeaturePill } from "./types";
import { AGENT_IMAGES, AGENCY_IMAGES } from "./data";
import { AgentAgencyHeader } from "./AgentAgencyHeader";
import { AgentAgencyImageShowcase } from "./AgentAgencyImageShowcase";
import { AgentAgencyFeatureCards } from "./AgentAgencyFeatureCards";

export interface AgentAgencySectionProps {
  id?: string;
  className?: string;
}

/**
 * @description S07/S08 · Agente y Agencia (Audiencias y Vistas de Rol)
 * Conmutador interactivo de alta fidelidad, 12 columnas arquitectónicas,
 * showcase Bleed-Left con Hardware Symphony, Smart Shutdown y Wave Stagger Cards.
 */
export function AgentAgencySection({
  id = "s07-agent-agency",
  className = "",
}: AgentAgencySectionProps) {
  const t = useTranslations('goAms.agentAgency');
  const [activeRole, setActiveRole] = useState<RoleMode>("agent");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const interactivePanelRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // 1. Core Reveal con Motion Tokenizer & Hardware Symphony
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".aa-title-line, .aa-header-elem, .aa-image-showcase, .aa-feature-headline, .aa-feature-card", { 
          opacity: 1, 
          y: 0, 
          yPercent: 0, 
          scale: 1
        });
        return;
      }

      // Título con GPU transform reveal
      gsap.fromTo(
        ".aa-title-line",
        { yPercent: 120, opacity: 0, willChange: "transform, opacity" },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: STAGGER.base,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "all",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse",
          },
        }
      );

      // Subtítulo y Tabs
      gsap.fromTo(
        ".aa-header-elem",
        { opacity: 0, y: REVEAL.md, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          stagger: STAGGER.base,
          ease: EASE.out,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: TRIGGER.standard,
            toggleActions: "play none none reverse",
          },
        }
      );

      // Imagen Showcase (Entrada lateral desde la izquierda con aceleración GPU)
      const panelEl = interactivePanelRef.current;

      gsap.fromTo(
        ".aa-image-showcase",
        { opacity: 0, x: -120, scale: 0.96, willChange: "transform, opacity" },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          force3D: true,
          clearProps: "transform,willChange",
          scrollTrigger: {
            trigger: panelEl || el,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Columna Derecha: Headline
      gsap.fromTo(
        ".aa-feature-headline",
        { opacity: 0, y: REVEAL.sm, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: panelEl || el,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Columna Derecha: 3 Cards con Wave Stagger (Arquetipo 3)
      gsap.fromTo(
        ".aa-feature-card",
        { opacity: 0, y: REVEAL.md, scale: 0.97, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.base,
          stagger: STAGGER.wave, // 0.15s ola fluida
          ease: EASE.out,
          force3D: true,
          clearProps: "willChange",
          scrollTrigger: {
            trigger: panelEl || el,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Smart Shutdown Protocol: Pausar timers cuando el elemento está fuera de pantalla
      ScrollTrigger.create({
        trigger: el,
        start: "top 100%",
        end: "bottom 0%",
        onEnter: () => setIsInViewport(true),
        onLeave: () => setIsInViewport(false),
        onEnterBack: () => setIsInViewport(true),
        onLeaveBack: () => setIsInViewport(false),
      });

    }, el);

    return () => ctx.revert();
  }, []);

  // 2. Smart Shutdown Timer (Solo corre cuando el usuario está viendo la sección)
  useEffect(() => {
    if (isPaused || !isInViewport) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const currentImages = activeRole === "agent" ? AGENT_IMAGES : AGENCY_IMAGES;
        return (prev + 1) % currentImages.length;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, isInViewport, activeRole, activeSlide]);

  // 3. Transición visual suave entre imágenes con GPU Compositor
  useEffect(() => {
    if (!imageContainerRef.current) return;
    const activeImg = imageContainerRef.current.querySelector(".active-screen-img");
    if (activeImg) {
      gsap.fromTo(
        activeImg,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.5, ease: EASE.out, force3D: true }
      );
    }
  }, [activeSlide]);

  const handleRoleSwitch = (newRole: RoleMode) => {
    if (newRole === activeRole) return;
    setActiveRole(newRole);
    setActiveSlide(0);

    // Micro-animación de transición al cambiar de pestaña (Headline + Cards)
    if (interactivePanelRef.current) {
      gsap.fromTo(
        interactivePanelRef.current.querySelectorAll(".aa-feature-card, .aa-feature-headline"),
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: DUR.fast, stagger: 0.04, ease: EASE.snap, force3D: true, clearProps: "willChange" }
      );
    }
  };

  const isAgent = activeRole === "agent";

  const currentFeatures: FeaturePill[] = isAgent
    ? [
        {
          title: t('agentFeature1Title'),
          description: t('agentFeature1Desc'),
          badge: "Policies",
        },
        {
          title: t('agentFeature2Title'),
          description: t('agentFeature2Desc'),
          badge: "Details",
        },
        {
          title: t('agentFeature3Title'),
          description: t('agentFeature3Desc'),
          badge: "Quote & Enroll",
        },
      ]
    : [
        {
          title: t('agencyFeature1Title'),
          description: t('agencyFeature1Desc'),
          badge: "Policies",
        },
        {
          title: t('agencyFeature2Title'),
          description: t('agencyFeature2Desc'),
          badge: "Details",
        },
        {
          title: t('agencyFeature3Title'),
          description: t('agencyFeature3Desc'),
          badge: "Contracts",
        },
      ];

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`w-full bg-[var(--color-surface-BG-base)] py-section-md px-gutter-sm lg:px-gutter-md relative z-10 overflow-x-hidden ${className}`}
    >
      <div className="w-full max-w-section-xl mx-auto flex flex-col gap-fluid-xs">
        {/* ── 1. Cabecera Editorial & Selector de Rol (12 Columnas) ── */}
        <AgentAgencyHeader
          activeRole={activeRole}
          onRoleChange={handleRoleSwitch}
        />

        {/* ── 2. Panel Principal Dinámico Asimétrico ── */}
        <div
          ref={interactivePanelRef}
          className="w-full grid-layout gap-y-10 lg:gap-fluid-lg items-center relative"
        >
          {/* Columna Izquierda: Imagen Bleed-Left (Cols 1-6) */}
          <AgentAgencyImageShowcase
            images={isAgent ? AGENT_IMAGES : AGENCY_IMAGES}
            activeSlide={activeSlide}
            imageContainerRef={imageContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          />

          {/* Columna Derecha: Manifiesto de Rol & Mini Cards (Cols 7-12) */}
          <AgentAgencyFeatureCards
            isAgent={isAgent}
            features={currentFeatures}
            activeSlide={activeSlide}
            isPaused={isPaused}
            onSelectSlide={setActiveSlide}
          />
        </div>
      </div>
    </section>
  );
}

export default AgentAgencySection;
