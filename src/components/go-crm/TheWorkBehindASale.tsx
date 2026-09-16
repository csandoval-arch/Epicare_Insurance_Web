"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PANELS = [
    {
      id: "tasks",
      title: "Assign a Task",
      desc: "Give the opportunity a clear next action.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Task.png",
      color: "#10B981"
    },
    {
      id: "notes",
      title: "Notes & Context",
      desc: "Keep the details that matter close to the opportunity.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Automation.png",
      color: "#F59E0B"
    },
    {
      id: "activities",
      title: "Activity History",
      desc: "See what has already happened.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/client_Comunication.png",
      color: "var(--color-brand-blue)"
    }
  ];

export default function TheWorkBehindASale() {
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Contexto GSAP SÍNCRONO para evitar saltos y flashes en el DOM
    let ctx = gsap.context(() => {
      
      const getScrollAmount = () => {
        if (!track.current) return 0;
        return track.current.scrollWidth - window.innerWidth;
      };

      // 1. Scroll Horizontal (Hardware Accelerated)
      gsap.to(track.current, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // 2. Parallax Interno de Imágenes (Calculado Dinámicamente)
      const images = gsap.utils.toArray<HTMLElement>(".parallax-image");
      images.forEach((img) => {
        gsap.to(img, {
          x: "15%",
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });

      // 3. Revelado de Texto Inicial (Simplificado a 'y' en lugar de 'yPercent' para evitar colapso de alto)
      gsap.fromTo(".intro-text-line",
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%"
          }
        }
      );

      // 4. Vida Latente (Escala muy sutil para no desincronizar la GPU)
      gsap.to(".parallax-image", {
        scale: 1.05,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

    }, container);

    // Refresco seguro post-hidratación para asegurar medidas perfectas
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center border-y border-[var(--color-border-Strokes-default)]">
      
      {/* El Track Horizontal con aceleración de GPU (transform-gpu) para prevenir que Chrome oculte nodos */}
      <div ref={track} className="flex h-full w-max items-center pl-[5vw] lg:pl-[10vw] transform-gpu will-change-transform">
        
        {/* Intro Panel */}
        <div className="w-[85vw] lg:w-[40vw] h-full flex flex-col justify-center shrink-0 pr-12 lg:pr-24">
          <div className="overflow-hidden mb-4">
            <p className="intro-text-line text-overline text-[var(--color-brand-blue)] uppercase tracking-widest flex items-center gap-2 transform-gpu">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
              06 — THE WORK BEHIND A SALE
            </p>
          </div>
          <div className="overflow-hidden mb-8">
            <h2 className="intro-text-line text-display-xl lg:text-[4.5vw] font-bold tracking-tighter leading-[0.95] text-[var(--color-text-primary)] transform-gpu">
              Every opportunity creates work.
            </h2>
          </div>
          <div className="overflow-hidden">
            <p className="intro-text-line text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md transform-gpu">
              Tasks, activities, notes and follow-up keep the sales process moving around a specific opportunity.
            </p>
          </div>
        </div>

          {/* The 3 Panels */}
          {PANELS.map((panel, i) => (
            <div key={panel.id} className="w-[85vw] lg:w-[50vw] shrink-0 mr-8 lg:mr-16 flex flex-col group transform-gpu">
              
              {/* Imagen Superior */}
              <div className="relative w-full h-[50vh] lg:h-[55vh] rounded-xl overflow-hidden shadow-elevation-2 border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-2)] mb-6 transform-gpu">
                <div className="absolute inset-0 w-[120%] -left-[10%] h-full z-0 overflow-hidden">
                  <img 
                    src={panel.image} 
                    alt={panel.title} 
                    className="parallax-image absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              </div>
  
              {/* Texto Inferior Limpio */}
              <div className="flex flex-col transform-gpu">
                <h3 className="text-xl lg:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 flex items-center gap-3">
                  <span className="text-[var(--color-text-secondary)] font-mono text-lg font-normal">0{i + 1} —</span> 
                  {panel.title}
                </h3>
                <p className="text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed pl-[42px]">
                  {panel.desc}
                </p>
              </div>
              
            </div>
        ))}

        {/* End Buffer */}
        <div className="w-[10vw] shrink-0 h-full" />

      </div>

    </section>
  );
}
