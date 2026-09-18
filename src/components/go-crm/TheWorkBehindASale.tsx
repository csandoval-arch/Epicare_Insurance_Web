"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ITEMS = [
  {
    num: "01",
    title: "Assign a Task",
    desc: "Give the opportunity a clear next action.",
    image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Task.png",
  },
  {
    num: "02",
    title: "Notes & Context",
    desc: "Keep the details that matter close to the opportunity.",
    image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Automation.png",
  },
  {
    num: "03",
    title: "Activity History",
    desc: "See what has already happened.",
    image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/client_Comunication.png",
  },
  {
    num: "04",
    title: "Pipeline UI",
    desc: "Una vista clara del proceso comercial, desde los nuevos prospectos hasta las oportunidades que avanzan.",
    image: "/Files/Go_CRM/PIpeline/Pipeline.png",
  }
];

export default function TheWorkBehindASale() {
  const container = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!introRef.current) return;
    
    let ctx = gsap.context(() => {
      const textSpans = gsap.utils.toArray(".scrub-word") as HTMLElement[];
      
      gsap.fromTo(textSpans, 
        { opacity: 0.15 },
        { 
          opacity: 1, 
          stagger: 0.1, 
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 75%",
            end: "bottom 50%",
            scrub: 0.5,
          }
        }
      );
    }, introRef);
    
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!container.current) return;
    
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          start: "top top",
          end: "+=400%", // 4 sections
          scrub: 1,
        }
      });

      // Animate the right strip up
      tl.to(".v4-right-strip", {
        yPercent: -75, // Move up by 3/4 of total height to show the 4th image
        ease: "none",
        duration: 4
      }, 0);

      // Set initial states for title blocks
      gsap.set(".v4-title-block-0", { opacity: 1, y: 0 });
      gsap.set([".v4-title-block-1", ".v4-title-block-2", ".v4-title-block-3"], { opacity: 0, y: 40 });

      // Crossfade logic for title blocks
      tl.to(".v4-title-block-0", { opacity: 0, y: -40, duration: 0.3 }, 0.7)
        .to(".v4-title-block-1", { opacity: 1, y: 0, duration: 0.3 }, 1.0)
        .to(".v4-title-block-1", { opacity: 0, y: -40, duration: 0.3 }, 1.7)
        .to(".v4-title-block-2", { opacity: 1, y: 0, duration: 0.3 }, 2.0)
        .to(".v4-title-block-2", { opacity: 0, y: -40, duration: 0.3 }, 2.7)
        .to(".v4-title-block-3", { opacity: 1, y: 0, duration: 0.3 }, 3.0);

      // Progress bar animation
      tl.to(".v4-stepper-progress", { width: "100%", duration: 4, ease: "none" }, 0);

    }, container);

    return () => ctx.revert();
  }, []);

  const renderScrubText = (text: string) => {
    return text.split(" ").map((w, i) => (
      <span key={i} className="scrub-word inline-block mr-[0.25em]">{w}</span>
    ));
  };

  return (
    <div className="w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)]">
      
      {/* BLOQUE INTRODUCTORIO (Conexión) */}
      <section ref={introRef} className="w-full max-w-4xl mx-auto px-gutter-md pt-32 pb-32 text-center flex flex-col items-center">
        <p className="text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest mb-10">
          06 — THE WORK BEHIND A SALE
        </p>
        <h2 className="text-display-sm md:text-display font-medium tracking-tight text-[var(--color-text-primary)] leading-snug">
          {renderScrubText("Every opportunity creates work. Tasks, activities, notes and follow-up keep the sales process moving around a specific opportunity.")}
        </h2>
      </section>

      {/* BLOQUE INTERACTIVO PINNED */}
      <section ref={container} className="relative w-full h-screen overflow-hidden border-y border-[var(--color-border-Strokes-default)]">
        
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT PANEL: Dynamic Typography */}
          <div className="h-full flex flex-col justify-center relative border-r border-[var(--color-border-Strokes-default)] z-20 bg-[var(--color-surface-BG-base)]">
            <div className="w-full max-w-2xl ml-auto relative h-[400px] flex flex-col justify-center">
              
              {/* Stacking Title Blocks */}
              <div className="relative w-full h-[250px]">
                {ITEMS.map((item, i) => (
                  <div 
                    key={item.num}
                    className={`v4-title-block-${i} absolute top-0 left-0 w-full px-gutter-md md:pl-gutter-lg md:pr-16 flex flex-col justify-center h-full`}
                    style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' }}
                  >
                    <p className="text-overline text-[var(--color-text-muted)] font-mono tracking-widest mb-4">
                      STEP {item.num}
                    </p>
                    <h2 className="text-display-md lg:text-display-lg font-bold tracking-tighter leading-[0.9] text-[var(--color-text-primary)] mb-6 max-w-md">
                      {item.title}
                    </h2>
                    <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 max-w-md">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Horizontal Scrollbar / Indicator */}
              <div className="w-full px-gutter-md md:pl-gutter-lg md:pr-16 absolute bottom-10 left-0">
                <div className="w-full max-w-md h-1 bg-[var(--color-border-Strokes-default)] rounded-full relative overflow-hidden">
                  <div className="v4-stepper-progress absolute left-0 top-0 bottom-0 w-0 bg-[var(--color-text-primary)] rounded-full"></div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: Visual Demonstrations Strip */}
          <div className="h-full relative overflow-hidden bg-[var(--color-surface-BG-1)] border-l flex flex-col justify-center">
            
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-blue)]/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* The scrolling strip */}
            <div className="v4-right-strip absolute top-0 w-full h-[400vh] flex flex-col z-10">
              {ITEMS.map((item, i) => (
                <div key={i} className="h-[100vh] flex items-center justify-center p-8 lg:p-16 relative">
                  <div className="w-full h-full max-h-[80vh] bg-[var(--color-surface-BG-2)] rounded-3xl border border-[var(--color-border-Strokes-default)] overflow-hidden shadow-elevation-4 relative flex flex-col">
                    {/* Fake browser chrome */}
                    <div className="h-10 bg-[var(--color-surface-BG-3)] border-b border-[var(--color-border-Strokes-default)] flex items-center px-4 gap-2 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
                    </div>
                    <div className="relative flex-1 bg-[var(--color-surface-BG-base)] p-4 overflow-hidden flex items-start justify-center">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-auto max-h-full object-contain object-top rounded-xl shadow-elevation-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
