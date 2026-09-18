"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function ConversationsGoCrm() {
  const t = useTranslations("goCrm.conversations");
  const container = useRef<HTMLElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      {/* Text Reveal */}
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

      // Central Console Animation (Scale + Blur)
      gsap.fromTo(
        consoleRef.current,
        { scale: 0.95, opacity: 0, filter: "blur(10px)", y: 40 },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: consoleRef.current,
            start: "top 80%",
          }
        }
      );

      // Bottom Cards
      const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full min-h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden flex flex-col items-center justify-start py-section-md lg:py-section-lg border-y border-[var(--color-border-Strokes-default)]">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-4xl max-h-4xl bg-[var(--color-brand-blue)]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER CENTRAL */}
      <div className="w-full max-w-6xl mx-auto px-gutter-md text-center relative z-20 flex flex-col items-center mb-16 lg:mb-24">
        <div className="overflow-hidden mb-6">
          <p className="conv-text-reveal text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] relative">
              <span className="absolute inset-0 bg-[var(--color-brand-blue)] rounded-full animate-ping opacity-75"></span>
            </span>
            {t("overline", { defaultMessage: "08 — CONVERSACIONES & CONTACTO TOTAL" })}
          </p>
        </div>
        
        <div className="overflow-hidden pb-4 w-full max-w-[1100px] mx-auto">
          <h2 className="conv-text-reveal text-display-sm lg:text-display-lg font-bold tracking-tighter leading-[1.0] text-[var(--color-text-primary)]">
            {t("headline", { defaultMessage: "Cada conversación, tarea y documento, conectados a la venta." })}
          </h2>
        </div>
        
        <div className="overflow-hidden mt-4">
          <p className="conv-text-reveal text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            {t("description", { defaultMessage: "Habla directamente con cada prospecto, realiza llamadas en un clic, solicita contratos y automatiza el seguimiento desde un único centro de mando omnicanal." })}
          </p>
        </div>
      </div>

      {/* CENTRAL VISUAL (Video Component) */}
      <div className="w-full max-w-5xl mx-auto px-gutter-md relative z-10 perspective-[1200px] mb-24 lg:mb-32">
        <div 
          ref={consoleRef} 
          className="w-full rounded-[2rem] shadow-elevation-5 overflow-hidden flex flex-col border border-[var(--color-border-Strokes-strong)]"
        >
          <video
            src="/Files/Go_CRM/Contact_Conversations/conversation_contact.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover block"
          />
        </div>
      </div>

      {/* 3-COLUMN BENTO GRID */}
      <div className="features-grid w-full max-w-6xl mx-auto px-gutter-md grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1 */}
        <div className="feature-card bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-8 rounded-[2rem] flex flex-col gap-4 hover:border-[var(--color-brand-blue)]/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-default)] flex items-center justify-center text-[var(--color-brand-blue)] group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
          </div>
          <h3 className="text-body-lg font-bold text-[var(--color-text-primary)]">
            {t("card1Title", { defaultMessage: "Llamadas & Teléfono Directo" })}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t("card1Desc", { defaultMessage: "Tienes su número siempre a mano. Haz llamadas directas en un clic y mantén el registro sonoro y cronológico dentro de la oportunidad." })}
          </p>
        </div>

        {/* Card 2 */}
        <div className="feature-card bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-8 rounded-[2rem] flex flex-col gap-4 hover:border-[#10B981]/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-default)] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 15.75h3.75M18 19.5a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18H8.857c-1.03 0-1.996-.53-2.568-1.43L4.5 13.5m11.25 4.5v-1.5a3 3 0 00-3-3h-1.5M15.75 18h1.5a2.25 2.25 0 002.25-2.25v-1.5M4.5 13.5V15M4.5 13.5l3 3m-3-3l-3 3" /></svg>
          </div>
          <h3 className="text-body-lg font-bold text-[var(--color-text-primary)]">
            {t("card2Title", { defaultMessage: "Contratos & Documentos Seguros" })}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t("card2Desc", { defaultMessage: "Pide identificaciones, formularios y pólizas firmadas en el mismo hilo. Notificación inmediata cuando el cliente sube su archivo." })}
          </p>
        </div>

        {/* Card 3 */}
        <div className="feature-card bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] p-8 rounded-[2rem] flex flex-col gap-4 hover:border-[#F26023]/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-default)] flex items-center justify-center text-[#F26023] group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
          </div>
          <h3 className="text-body-lg font-bold text-[var(--color-text-primary)]">
            {t("card3Title", { defaultMessage: "Tareas & Mensajes Automáticos" })}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t("card3Desc", { defaultMessage: "El pipeline activa tareas automáticas ante cada cambio de etapa. Envía mensajes sin esfuerzo manual y jamás pierdas un prospecto." })}
          </p>
        </div>

      </div>

    </section>
  );
}
