"use client";

import React, { useState } from "react";
import ColorCard from "./ColorCard";

export default function SemanticTextColorsSection({ isDark }: { isDark: boolean }) {
  const [sandboxBg, setSandboxBg] = useState("bg-[var(--color-surface-BG-base)]");
  const [sandboxTextColor, setSandboxTextColor] = useState("text-[var(--color-text-primary)]");


  return (
    <>
      <section className="mb-32 animate-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-h1">2. Semantic Text Colors</h2>
            <div className="h-[0.0625rem] flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            <ColorCard name="Primary" variable="text-[var(--color-text-primary)]" hex="Dynamic" colorClass="bg-[var(--color-text-primary)]" textWhite={isDark ? false : true} />
            <ColorCard name="Secondary" variable="text-[var(--color-text-secondary)]" hex="Dynamic" colorClass="bg-[var(--color-text-primary)]-secondary" textWhite={isDark ? false : true} />
            <ColorCard name="Tertiary" variable="text-[var(--color-text-muted)]" hex="Dynamic" colorClass="bg-[var(--color-text-primary)]-tertiary" textWhite />
            <ColorCard name="Muted" variable="text-[var(--color-text-muted)]" hex="Dynamic" colorClass="bg-muted" textWhite />
            <ColorCard name="Accent (Orange)" variable="text-[var(--color-accent-main)]" hex="Dynamic" colorClass="bg-[var(--color-accent-main)]" textWhite />
            <ColorCard name="Accent Blue" variable="text-[var(--color-text-accent-blue)]" hex="Dynamic" colorClass="bg-[var(--color-text-accent-blue)]" textWhite />
            <ColorCard name="Accent Dark" variable="text-[var(--color-text-accent-dark)]" hex="Dynamic" colorClass="bg-[var(--color-text-accent-dark)]" textWhite={isDark ? false : true} />
            <ColorCard name="Inverse" variable="text-[var(--color-text-primary-Reverted)]" hex="Dynamic" colorClass="bg-[var(--color-surface-BG-base)]" textWhite={isDark ? true : false} />
          </div>

          <div className="organic-glass-panel p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 pb-8 border-b border-[var(--color-border-Strokes-default)]/50">
              <div className="max-w-md">
                <h3 className="text-h3 text-[var(--color-text-primary)] mb-2">Typography Sandbox</h3>
                <p className="text-body-sm text-[var(--color-text-muted)]">
                  Test how our semantic text tokens adapt to different backgrounds.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col gap-3">
                  <span className="text-ui-label text-[var(--color-text-muted)]">1. Select Text Color</span>
                  <div className="flex flex-wrap items-center gap-2 max-w-[15.625rem]">
                    {[
                      { id: "text-[var(--color-text-primary)]", label: "Primary" },
                      { id: "text-[var(--color-text-secondary)]", label: "Secondary" },
                      { id: "text-[var(--color-text-muted)]", label: "Muted" },
                      { id: "text-[var(--color-text-hint)]", label: "Hint" },
                      { id: "text-[var(--color-accent-main)]", label: "Accent Orange" },
                      { id: "text-[var(--color-text-accent-blue)]", label: "Accent Blue" },
                      { id: "text-[var(--color-text-accent-dark)]", label: "Accent Dark" },
                      { id: "text-[var(--color-text-primary-Reverted)]", label: "Inverse" }
                    ].map((tc) => (
                      <button 
                        key={tc.id}
                        onClick={() => setSandboxTextColor(tc.id)}
                        className={`px-3 py-1 rounded-full text-caption font-medium transition-all border ${sandboxTextColor === tc.id ? 'bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] border-foreground shadow-elevation-2' : 'bg-transparent text-[var(--color-text-primary)] border-[var(--color-border-Strokes-default)] hover:bg-[var(--color-surface-BG-1)]'}`}
                      >
                        {tc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-ui-label text-[var(--color-text-muted)]">2. Select Background</span>
                  <div className="flex items-center gap-3">
                    {["bg-[var(--color-surface-BG-base)]", "bg-[var(--color-surface-BG-1)]", "bg-[var(--color-surface-BG-2)]", "bg-[var(--color-surface-BG-3)]", "bg-[var(--color-brand-dark)]", "bg-[var(--color-brand-orange)]"].map(bg => (
                      <button 
                        key={bg}
                        onClick={() => setSandboxBg(bg)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${sandboxBg === bg ? "border-[var(--color-brand-orange)] scale-110" : "border-[var(--color-border-Strokes-default)]/30 hover:scale-105"} ${bg}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-10 md:p-16 rounded-3xl transition-colors duration-500 ${sandboxBg} ${['bg-[var(--color-surface-BG-2)]', 'bg-[var(--color-surface-BG-3)]'].includes(sandboxBg) ? 'dark shadow-elevation-5' : 'shadow-elevation-1 border border-[var(--color-border-Strokes-default)]/50'}`}>
              <div className="max-w-3xl mx-auto flex flex-col gap-8 items-start">
                <div className="inline-block px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full mb-2">
                  <span className="text-caption font-mono opacity-60">Applied class: {sandboxTextColor}</span>
                </div>
                <h4 className={`text-display-sm leading-[1.1] transition-colors duration-300 ${sandboxTextColor}`}>
                  Protection built on <span className="italic font-light text-[var(--color-brand-orange)]">Trust</span>
                </h4>
                <p className={`text-h4 leading-snug transition-colors duration-300 ${sandboxTextColor}`}>
                  When a client signs with Epicare, they are not just buying a policy. They are securing peace of mind for the people who depend on them most.
                </p>
                <p className={`text-body leading-relaxed max-w-2xl transition-colors duration-300 ${sandboxTextColor}`}>
                  Every plan is carefully tailored by licensed agents who understand that real coverage is about people, not paperwork. We build long-term relationships grounded in clarity, speed, and genuine care.
                </p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}