"use client";

import React from "react";
import { useState } from "react";

export default function MaxWidthSection() {
  const [activeMaxWidth, setActiveMaxWidth] = useState("max-w-section-md");

  return (
    <>
      <section className="mb-32">
          <div className="mb-12 text-center">
            <h2 className="text-h1">6. Desktop Layout Max-Width</h2>
            <p className="text-body-lg text-[var(--color-text-muted)] mt-4 max-w-2xl mx-auto">
              Contenedores maestros a <strong>escala real</strong>. Usa el scroll horizontal para ver cómo se comporta el componente en su máxima extensión.
            </p>
          </div>

          <div className="flex flex-col gap-12 items-center w-full">
            {/* Dashboard Demo - Contenedor con Escala Real */}
            <div
               className="w-full mx-auto bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-2xl p-6 shadow-elevation-5 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
               style={{
                 maxWidth: activeMaxWidth === 'max-w-section-sm' ? '768px' : activeMaxWidth === 'max-w-section-md' ? '1024px' : activeMaxWidth === 'max-w-section-lg' ? '1440px' : '1536px'
               }}
            >
              {/* Fake UI Header */}
              <div className="flex justify-between items-center border-b border-[var(--color-border-Strokes-default)]/50 pb-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-h4">GO AMS Dashboard</span>
                  <span className="text-caption text-[var(--color-text-muted)]">Active Policies Overview</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface-BG-2)]"></div>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface-BG-2)]"></div>
                </div>
              </div>
              
              {/* Fake Data Grid */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 h-24 bg-[var(--color-surface-BG-1)] rounded-xl min-w-[120px]"></div>
                <div className="flex-1 h-24 bg-[var(--color-surface-BG-1)] rounded-xl min-w-[120px] hidden sm:block"></div>
                <div className="flex-1 h-24 bg-[var(--color-surface-BG-1)] rounded-xl min-w-[120px] hidden md:block"></div>
                <div className="flex-1 h-24 bg-[var(--color-surface-BG-1)] rounded-xl min-w-[120px] hidden lg:block"></div>
              </div>
              <div className="w-full bg-[var(--color-surface-BG-1)] rounded-xl flex items-center justify-center py-16">
                 <p className="text-body-sm text-[var(--color-text-hint)] text-center">
                    Demostración fluida (Max-Width):<br/>
                    <strong className="text-[var(--color-text-primary)] text-xl mt-2 block">
                      {activeMaxWidth === 'max-w-section-sm' ? '768px' : activeMaxWidth === 'max-w-section-md' ? '1024px' : activeMaxWidth === 'max-w-section-lg' ? '1440px' : '1536px'}
                    </strong>
                    <span className="text-caption text-[var(--color-text-muted)] mt-1 block">({activeMaxWidth})</span>
                 </p>
              </div>
            </div>

            {/* Controles de Medida (La tabla debajo) */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {[
                { id: 'max-w-section-sm', px: '768px', rem: '48rem', desc: 'Formularios y Login' },
                { id: 'max-w-section-md', px: '1024px', rem: '64rem', desc: 'Hero Subtitles / 2-Col layouts' },
                { id: 'max-w-section-lg', px: '1440px', rem: '90rem', desc: 'Dashboards GO AMS / Full Grids' },
                { id: 'max-w-section-xl', px: '1536px', rem: '96rem', desc: 'Ultra-wide Cinematic (hero covers)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveMaxWidth(opt.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all w-60 ${
                    activeMaxWidth === opt.id 
                      ? 'bg-[var(--color-surface-BG-base)] border-[var(--color-text-primary)] shadow-elevation-2 scale-105' 
                      : 'bg-[var(--color-surface-BG-1)] border-[var(--color-border-Strokes-default)]/50 hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  <span className="text-ui-label font-bold mb-1">{opt.id}</span>
                  <span className="text-data text-[var(--color-text-primary)]">{opt.px}</span>
                  <span className="text-caption text-[var(--color-text-muted)] mt-2">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}