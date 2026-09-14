"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PANELS = [
    {
      id: "tasks",
      title: "Tasks",
      desc: "Actions assigned with a strict deadline. The engine that prevents lost sales.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Task.png",
      color: "#10B981"
    },
    {
      id: "activities",
      title: "Activities",
      desc: "Every interaction, email, and stage change recorded in a single timeline.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/client_Comunication.png",
      color: "var(--color-brand-blue)"
    },
    {
      id: "notes",
      title: "Notes",
      desc: "The critical context and preferences that make the next conversation warmer.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Automation.png",
      color: "#F59E0B"
    },
    {
      id: "followup",
      title: "Follow-up",
      desc: "Consistent contact until a decision. Where most fail, the system persists.",
      image: "/Files/Go_CRM/THE%20WORK%20BEHIND%20A%20SALE/Follow_up.png",
      color: "var(--color-brand-orange)"
    }
  ];

export default function TheWorkBehindASale() {
  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Horizontal Scroll Mechanism
      const trackWidth = track.current!.scrollWidth;
      const windowWidth = window.innerWidth;
      const scrollDistance = trackWidth - windowWidth;

      gsap.to(track.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // B2: Image Inner Parallax
      const images = gsap.utils.toArray<HTMLElement>(".parallax-image");
      images.forEach((img) => {
        gsap.to(img, {
          x: "20%", // Image moves slightly right while container moves left
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
          }
        });
      });

      // B1: Initial Text Reveal
      gsap.fromTo(".intro-text-line",
        { yPercent: 100, opacity: 0 },
        { 
          yPercent: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%"
          }
        }
      );

      // B3: Latent Life (Continuous Slow Breathing on Images)
      gsap.to(".parallax-image", {
        scale: 1.15,
        duration: 15,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center border-y border-[var(--color-border-Strokes-default)]">
      
      {/* The Horizontal Track */}
      <div ref={track} className="flex h-full w-max items-center pl-[5vw] lg:pl-[10vw]">
        
        {/* Intro Panel (Static relative to the track) */}
        <div className="w-[85vw] lg:w-[40vw] h-full flex flex-col justify-center shrink-0 pr-12 lg:pr-24">
          <div className="overflow-hidden mb-4">
            <p className="intro-text-line text-overline text-[var(--color-brand-blue)] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
              06 — THE WORK BEHIND A SALE
            </p>
          </div>
          <div className="overflow-hidden mb-8">
            <h2 className="intro-text-line text-display-xl lg:text-[4.5vw] font-bold tracking-tighter leading-[0.95] text-[var(--color-text-primary)]">
              Every opportunity creates work.
            </h2>
          </div>
          <div className="overflow-hidden">
            <p className="intro-text-line text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md">
              Tasks, activities, notes and follow-up keep the sales process moving around a specific opportunity.
            </p>
          </div>
        </div>

          {/* The 4 Image Panels */}
          {PANELS.map((panel, i) => (
            <div key={panel.id} className="relative w-[85vw] lg:w-[50vw] h-[60vh] lg:h-[75vh] shrink-0 mr-8 lg:mr-16 rounded-2xl overflow-hidden shadow-elevation-4 border border-[var(--color-border-Strokes-strong)] bg-[var(--color-surface-BG-1)] group flex flex-col">
              
              {/* Top: Image Parallax Container */}
              <div className="relative flex-1 w-full overflow-hidden bg-[var(--color-surface-BG-2)]">
                <div className="absolute inset-0 w-[120%] -left-[10%] h-full z-0 overflow-hidden">
                  <img 
                    src={panel.image} 
                    alt={panel.title} 
                    className="parallax-image absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              </div>
  
              {/* Bottom: Clean Typography Dock */}
              <div className="relative shrink-0 border-t border-[var(--color-border-Strokes-default)] p-6 lg:p-8 flex flex-col justify-center bg-[var(--color-surface-BG-1)]">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: panel.color }} />
                      <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--color-text-primary)] uppercase">
                        {panel.title}
                      </h3>
                    </div>
                    <p className="text-sm lg:text-base text-[var(--color-text-secondary)] leading-relaxed">
                      {panel.desc}
                    </p>
                  </div>
                  
                  {/* Subtle Hover Arrow */}
                  <div className="w-10 h-10 rounded-full border border-[var(--color-border-Strokes-default)] bg-[var(--color-surface-BG-2)] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                     <svg className="w-4 h-4 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
              
            </div>
        ))}

        {/* End Buffer to allow scrolling past the last card smoothly */}
        <div className="w-[10vw] shrink-0 h-full" />

      </div>

    </section>
  );
}
