"use client";

import React from "react";
import Button, { IconButton } from "@/components/ui/Button";
import ArrowUR from "@/components/icons/ArrowUR";

export default function InteractiveSection() {


  return (
    <>
      <section className="mb-32 animate-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-h1">5. Interactive & Glass</h2>
            <div className="h-[0.0625rem] flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-2">
              <h3 className="text-h3">Buttons</h3>
              <p className="text-body-sm text-[var(--color-text-muted)] mb-6">
                Rectángulos de 10px (<code>rounded-button</code>), ya no píldoras. Siempre vía <code>ui/Button</code>: nunca <code>rounded-full</code> en un botón.
              </p>
              <div className="relative rounded-3xl overflow-hidden py-12 px-6 bg-transparent border border-[var(--color-border-Strokes-default)] flex flex-col justify-center items-center gap-8 min-h-[25rem] bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"2\" cy=\"2\" r=\"2\"/%3E%3C/g%3E%3C/svg%3E')"}}>
                
                {/* Componentes reales de `ui/Button.tsx`: la única fuente de botones del sitio. */}
                <Button label="Primary" variant="primary" />
                <Button label="Action (negro / blanco por tema)" variant="action" />
                <Button label="Glass light" variant="glass-light" size="sm" />
                <div className="flex items-center gap-4">
                  <IconButton label="Icon button" size="md">
                    <ArrowUR className="w-static-md h-static-md rotate-90" />
                  </IconButton>
                  <IconButton label="Icon button · acción" variant="action" size="lg">
                    <ArrowUR className="w-static-md h-static-md rotate-90" />
                  </IconButton>
                </div>

                {/* Los dos tokens de forma, a escala real */}
                <div className="flex items-end gap-6 text-meta text-[var(--color-text-muted)]">
                  <span className="flex flex-col items-center gap-2">
                    <span className="w-16 h-16 rounded-button border border-[var(--color-border-Strokes-strong)] bg-[var(--color-surface-BG-1)]" />
                    rounded-button
                  </span>
                  <span className="flex flex-col items-center gap-2">
                    <span className="w-16 h-16 rounded-button-inner border border-[var(--color-border-Strokes-strong)] bg-[var(--color-surface-BG-1)]" />
                    rounded-button-inner
                  </span>
                </div>

              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden p-12 flex items-center justify-center min-h-[25rem] bg-[var(--color-surface-BG-2)]">
              <div className="absolute top-10 right-10 w-48 h-48 bg-[var(--color-brand-orange)] rounded-full mix-blend-screen filter blur-2xl opacity-50" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-[var(--color-brand-blue)] rounded-full mix-blend-screen filter blur-3xl opacity-30" />
              <div className="organic-glass-panel breathing-card w-full max-w-sm p-8 relative z-10">
                <p className="text-overline text-[var(--color-brand-orange)] mb-2">Signature Glass</p>
                <h4 className="text-h3 mb-4 text-[var(--color-text-primary)]">Soft Organic Card</h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-6">Foundation of our liquid organic interface.</p>
                <button className="btn-secondary w-full">Interact</button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}