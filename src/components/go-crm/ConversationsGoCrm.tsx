"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function ConversationsGoCrm() {
  const t = useTranslations("goCrm.conversations");
  const container = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Text Reveal
      gsap.fromTo(
        ".conv-text-reveal",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
          }
        }
      );

      // Chat Bubbles Staggered Reveal
      const bubbles = gsap.utils.toArray<HTMLElement>(".chat-bubble");
      
      gsap.fromTo(
        bubbles,
        { 
          y: 50, 
          opacity: 0,
          scale: 0.9,
          transformOrigin: "bottom center"
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: threadRef.current,
            start: "top 60%",
          }
        }
      );

      // B3: Latent Life - Typing Indicator
      gsap.to(".typing-dot", {
        y: -4,
        opacity: 1,
        duration: 0.4,
        stagger: 0.15,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      });

    }, container);

    return () => ctx.revert();
  }, []);

  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
    gsap.to(el, { x, y, rotateX: -y, rotateY: x, duration: 0.5, ease: "power2.out" });
  };
  
  const handleMagneticLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  return (
    <section ref={container} className="relative w-full min-h-[90vh] bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex items-center justify-center py-24 lg:py-32 border-y border-[var(--color-border-Strokes-default)]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-3xl max-h-3xl bg-[var(--color-brand-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* GRID CONTAINER */}
      <div className="w-full max-w-[1440px] mx-auto px-gutter-md grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-20">
        
        {/* TEXT BLOCK (Left) */}
        <div className="flex flex-col items-start text-left lg:pr-8">
          <div className="overflow-hidden mb-6 flex justify-start">
            <p className="conv-text-reveal text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
              08 — {t("overline", { defaultMessage: "CONVERSATIONS" })}
            </p>
          </div>
          
          <div className="overflow-hidden pb-4">
            <h2 className="conv-text-reveal text-display-lg font-bold tracking-tighter leading-[1.0] text-[var(--color-text-primary)]">
              {t("headline", { defaultMessage: "Every conversation stays connected to the sale." })}
            </h2>
          </div>
          
          <div className="overflow-hidden mt-4 flex justify-start">
            <p className="conv-text-reveal text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              {t("description", { defaultMessage: "WhatsApp, Email, and SMS don't happen in a vacuum. They belong inside the opportunity." })}
            </p>
          </div>
        </div>

        {/* VISUAL BLOCK (Right) */}
        <div className="w-full flex justify-center lg:justify-end relative z-10 perspective-[1000px]">
          
          <div 
            ref={threadRef} 
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="w-full max-w-2xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-[2rem] shadow-elevation-5 p-6 md:p-10 flex flex-col gap-6 relative transform-style-3d cursor-crosshair"
          >
          {/* Header of the fake UI */}
          <div className="flex items-center justify-between border-b border-[var(--color-border-Strokes-default)] pb-4 mb-2">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface-BG-3)] overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Client" className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="text-body font-semibold text-[var(--color-text-primary)]">Sarah Jenkins</h4>
                   <p className="text-meta text-[var(--color-text-muted)]">Opportunity: Commercial Auto Fleet</p>
                </div>
             </div>
             <div className="hidden md:flex gap-2">
                <span className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">W</span>
                <span className="w-8 h-8 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center">E</span>
                <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">S</span>
             </div>
          </div>

          {/* Chat Bubbles */}
          
          {/* WhatsApp - Inbound */}
          <div className="chat-bubble flex flex-col items-start gap-1 w-full max-w-[85%] md:max-w-[70%] relative">
            <span className="text-meta text-[var(--color-text-muted)] ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> WhatsApp • 10:42 AM
            </span>
            <div className="px-5 py-3.5 bg-[var(--color-surface-BG-2)] text-[var(--color-text-primary)] rounded-2xl rounded-tl-sm text-body shadow-sm border border-[var(--color-border-Strokes-default)]">
              I just sent over the fleet documents. Can we lock in the rate today?
            </div>
          </div>

          {/* Email - Outbound */}
          <div className="chat-bubble flex flex-col items-end gap-1 w-full max-w-[85%] md:max-w-[70%] self-end relative">
            <span className="text-meta text-[var(--color-text-muted)] mr-2 flex items-center gap-2 flex-row-reverse">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" /> Email • 11:15 AM
            </span>
            <div className="px-5 py-3.5 bg-[var(--color-brand-blue)] text-white rounded-2xl rounded-tr-sm text-body shadow-sm">
              <p className="font-semibold text-sm mb-1 text-white/90">Subject: Rate Locked - Commercial Auto Fleet</p>
              Got them, Sarah. The rate is locked. I'll call you in 5 to review the bindings.
            </div>
          </div>

          {/* SMS - Inbound */}
          <div className="chat-bubble flex flex-col items-start gap-1 w-full max-w-[85%] md:max-w-[70%] relative">
            <span className="text-meta text-[var(--color-text-muted)] ml-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" /> SMS • 11:20 AM
            </span>
            <div className="px-5 py-3.5 bg-[var(--color-surface-BG-2)] text-[var(--color-text-primary)] rounded-2xl rounded-tl-sm text-body shadow-sm border border-[var(--color-border-Strokes-default)]">
              Perfect. Waiting for your call!
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="chat-bubble flex items-center gap-2 mt-4 ml-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-BG-3)] flex items-center justify-center overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop" alt="Agent" className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-2 bg-[var(--color-surface-BG-2)] rounded-full flex items-center gap-1 border border-[var(--color-border-Strokes-default)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] typing-dot opacity-30" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] typing-dot opacity-30" style={{ animationDelay: "0.15s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] typing-dot opacity-30" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>

        </div>
      </div>

      </div>
    </section>
  );
}
