import React from "react";
import { useTranslations } from "next-intl";

export default function ThePipeline() {
  const t = useTranslations("goCrm.pipeline");

  return (
    <section className="relative w-full min-h-[90vh] bg-[var(--color-surface-BG-base)] border-y border-[var(--color-border-Strokes-default)] overflow-hidden flex flex-col items-center justify-center py-24 lg:py-32">
      
      {/* Top Column: Typography (Centered Title) */}
      <div className="w-full max-w-4xl mx-auto px-gutter-md flex flex-col items-center text-center relative z-10 mb-16">
        <div className="flex items-center gap-static-sm mb-static-md">
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand-blue)]" />
          <p className="text-overline text-[var(--color-text-accent-blue)] uppercase">{t("overline")}</p>
        </div>
        
        <h2 className="text-display-lg font-bold tracking-tighter leading-[0.9] text-[var(--color-text-primary)]">
          {t("headline")}
        </h2>
      </div>

      {/* Center Column: Dashboard Image */}
      <div className="w-full max-w-5xl px-gutter-md relative z-0">
        <div className="w-full aspect-[16/10] md:aspect-video rounded-2xl border border-[var(--color-border-Strokes-default)] shadow-elevation-4 bg-[var(--color-surface-BG-1)] overflow-hidden relative mx-auto">
           {/* Simple Browser Chrome */}
           <div className="absolute top-0 left-0 right-0 h-10 bg-[var(--color-surface-BG-2)] border-b border-[var(--color-border-Strokes-default)] flex items-center px-gutter-sm gap-static-xs z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-BG-4)]" />
           </div>
           
           {/* Image */}
           <div className="absolute inset-0 pt-10">
              <img 
                src="/Files/Go_CRM/PIpeline/Pipeline.png" 
                alt="Pipeline UI" 
                className="w-full h-full object-cover object-top" 
              />
           </div>
        </div>
      </div>

      {/* Bottom Column: Description Text */}
      <div className="w-full max-w-2xl mx-auto px-gutter-md mt-12 text-center">
        <p className="text-body-lg text-[var(--color-text-secondary)] leading-relaxed">
          {t("description")}
        </p>
      </div>

    </section>
  );
}
