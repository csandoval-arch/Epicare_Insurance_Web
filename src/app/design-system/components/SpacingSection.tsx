"use client";

import React from "react";
import { useState } from "react";
import SpacingCard from "./SpacingCard";

export default function SpacingSection() {
  const [activeInternalGap, setActiveInternalGap] = useState("gap-2");
  const [activeSectionPadding, setActiveSectionPadding] = useState("py-section-md");
  const [activeFluidGap, setActiveFluidGap] = useState("gap-fluid-md");
  const [activePageGutter, setActivePageGutter] = useState("px-gutter-md");
  const [activeStaticSpacing, setActiveStaticSpacing] = useState("p-static-md");
  const [gridMode, setGridMode] = useState("desktop");

  return (
    <>
      <section className="mb-32 animate-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-h1">4. Spacing & Rhythm Studio</h2>
            <div className="h-[0.0625rem] flex-1 bg-border" />
          </div>

          {/* Spacing Overview (Restored 3 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <SpacingCard 
              label="1. Component Internal" 
              token={activeInternalGap}
              value={activeInternalGap === 'gap-1' ? '0.25rem' : activeInternalGap === 'gap-2' ? '0.5rem' : activeInternalGap === 'gap-4' ? '1rem' : '1.5rem'} 
              usage="Densidad interna de botones y tarjetas."
              options={['gap-1', 'gap-2', 'gap-4', 'gap-6']}
              activeOption={activeInternalGap}
              onOptionChange={setActiveInternalGap}
              visual={
                <div className={`flex flex-col ${activeInternalGap} p-4 bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-xl w-full transition-all duration-300`}>
                  <div className={`flex ${activeInternalGap} items-center`}>
                    <div className="w-4 h-4 bg-[var(--color-brand-orange)] rounded-full shrink-0"></div>
                    <div className="h-2 w-16 bg-muted/30 rounded shrink-0"></div>
                  </div>
                  <div className="h-3 w-full bg-muted/20 rounded"></div>
                </div>
              }
            />
            <SpacingCard 
              label="2. Layout Fluid Gaps" 
              token={activeFluidGap} 
              value={activeFluidGap === 'gap-fluid-xs' ? '0.5rem — 1.5rem' : activeFluidGap === 'gap-fluid-sm' ? '1rem — 2.5rem' : activeFluidGap === 'gap-fluid-md' ? '2rem — 5rem' : '3rem — 8rem'}
              usage="Espacio dinámico entre columnas de layout."
              options={['gap-fluid-xs', 'gap-fluid-sm', 'gap-fluid-md', 'gap-fluid-lg']}
              activeOption={activeFluidGap}
              onOptionChange={setActiveFluidGap}
              visual={
                <div className={`flex ${activeFluidGap} p-2 w-full h-20 items-stretch transition-all duration-300`}>
                  <div className="flex-1 bg-[var(--color-surface-BG-3)]/10 border border-dashed border-[var(--color-brand-blue)]/30 rounded-lg"></div>
                  <div className="flex-1 bg-[var(--color-surface-BG-3)]/10 border border-dashed border-[var(--color-brand-blue)]/30 rounded-lg"></div>
                </div>
              }
            />
            <SpacingCard 
              label="3. Section Padding" 
              token={activeSectionPadding}
              value={activeSectionPadding === 'py-section-xs' ? '2rem — 4rem' : activeSectionPadding === 'py-section-sm' ? '4.75rem (76px) — 6rem' : activeSectionPadding === 'py-section-md' ? '6rem — 10rem' : '8rem — 15rem'}
              usage="El ritmo vertical entre grandes bloques."
              options={['py-section-xs', 'py-section-sm', 'py-section-md', 'py-section-lg']}
              activeOption={activeSectionPadding}
              onOptionChange={setActiveSectionPadding}
              visual={
                <div className="flex flex-col w-full border border-dashed border-[var(--color-brand-dark)]/30 rounded-lg overflow-hidden transition-all duration-300">
                  <div className={`${activeSectionPadding === 'py-section-xs' ? 'h-2' : activeSectionPadding === 'py-section-sm' ? 'h-4' : activeSectionPadding === 'py-section-md' ? 'h-8' : 'h-12'} bg-[var(--color-surface-BG-2)]/10 border-b border-dashed border-[var(--color-brand-dark)]/20 transition-all`}></div>
                  <div className="h-12 flex items-center justify-center text-[0.625rem] text-[var(--color-text-muted)] uppercase">Contenido</div>
                  <div className={`${activeSectionPadding === 'py-section-xs' ? 'h-2' : activeSectionPadding === 'py-section-sm' ? 'h-4' : activeSectionPadding === 'py-section-md' ? 'h-8' : 'h-12'} bg-[var(--color-surface-BG-2)]/10 border-t border-dashed border-[var(--color-brand-dark)]/20 transition-all`}></div>
                </div>
              }
            />
            <SpacingCard 
              label="4. Static Paddings & Margins" 
              token={activeStaticSpacing} 
              value={activeStaticSpacing === 'p-static-xs' ? '0.25rem (4px)' : activeStaticSpacing === 'p-static-sm' ? '0.5rem (8px)' : activeStaticSpacing === 'p-static-md' ? '1rem (16px)' : '1.5rem (24px)'}
              usage="Márgenes y paddings fijos generales."
              options={['p-static-xs', 'p-static-sm', 'p-static-md', 'p-static-lg']}
              activeOption={activeStaticSpacing}
              onOptionChange={setActiveStaticSpacing}
              visual={
                <div className={`bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/30 rounded-xl transition-all duration-300 ${activeStaticSpacing}`}>
                  <div className="w-full h-10 bg-[var(--color-surface-BG-base)] rounded-md border border-[var(--color-border-Strokes-default)] flex items-center justify-center text-[0.625rem] text-[var(--color-text-muted)] font-mono">Box</div>
                </div>
              }
            />
          </div>

          <div className="border border-dashed border-[var(--color-brand-orange)]/50 rounded-3xl p-6 md:p-12 bg-[var(--color-brand-orange)]/5 relative overflow-hidden flex flex-col gap-20">
            <div className="absolute top-4 left-4 text-[var(--color-brand-orange)] font-mono text-[0.625rem] uppercase tracking-widest font-bold">
              Architectural Playground v2.0
            </div>
            
            <div className="mt-8">
              <h4 className="text-h3 mb-4">Live Studio</h4>
              <p className="text-body text-[var(--color-text-muted)] mb-12 max-w-2xl">
                Controla y visualiza la estructura de Epicare en tiempo real.
              </p>

              <div className="flex flex-col gap-20">
                {/* 01: Gutters */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h5 className="text-h5 text-[var(--color-text-primary)] flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] rounded-full flex items-center justify-center text-[0.625rem]">01</span>
                      Page Frame Strategy
                    </h5>
                    <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-1 rounded-xl w-fit shadow-elevation-1">
                      {['px-gutter-sm', 'px-gutter-md', 'px-gutter-lg', 'px-gutter-xl'].map(opt => (
                        <button key={opt} onClick={() => setActivePageGutter(opt)} className={`px-3 py-1 rounded-lg text-[0.625rem] font-bold uppercase transition-all ${activePageGutter === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-2' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
                          {opt.replace('px-gutter-', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-2xl relative h-48 overflow-hidden flex items-center justify-center shadow-elevation-4 transition-all duration-500">
                    <div className="absolute inset-y-0 left-0 bg-[var(--color-brand-orange)]/10 border-r border-dashed border-[var(--color-brand-orange)]/30 flex items-center justify-center transition-all duration-500" style={{ width: `var(--space-gutter-${activePageGutter.replace('px-gutter-', '')})` }}>
                      <span className="text-[0.625rem] font-mono text-[var(--color-brand-orange)] rotate-90 whitespace-nowrap">{activePageGutter}</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 bg-[var(--color-brand-orange)]/10 border-l border-dashed border-[var(--color-brand-orange)]/30 flex items-center justify-center transition-all duration-500" style={{ width: `var(--space-gutter-${activePageGutter.replace('px-gutter-', '')})` }}>
                      <span className="text-[0.625rem] font-mono text-[var(--color-brand-orange)] rotate-90 whitespace-nowrap">{activePageGutter}</span>
                    </div>
                    <div className="text-ui-label text-[var(--color-text-muted)] uppercase tracking-widest">Main Layout Area (87.5rem)</div>
                  </div>
                </div>

                {/* 02: Section Padding */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h5 className="text-h5 text-[var(--color-text-primary)] flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] rounded-full flex items-center justify-center text-[0.625rem]">02</span>
                      Vertical Section Rhythm
                    </h5>
                    <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-1 rounded-xl w-fit shadow-elevation-1">
                      {['py-section-xs', 'py-section-sm', 'py-section-md', 'py-section-lg'].map(opt => (
                        <button key={opt} onClick={() => setActiveSectionPadding(opt)} className={`px-3 py-1 rounded-lg text-[0.625rem] font-bold uppercase transition-all ${activeSectionPadding === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-2' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
                          {opt.replace('py-section-', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-2xl overflow-hidden shadow-elevation-4 transition-all duration-500">
                    <div className="bg-[var(--color-surface-BG-2)]/10 border-b border-dashed border-[var(--color-brand-dark)]/30 flex items-center justify-center transition-all duration-500" style={{ height: `var(--space-section-${activeSectionPadding.replace('py-section-', '')})` }}>
                      <span className="text-[0.625rem] font-mono text-[var(--color-brand-dark)] uppercase font-bold">{activeSectionPadding}</span>
                    </div>
                    <div className="py-16 text-center text-body text-[var(--color-text-muted)] uppercase tracking-[0.5em] opacity-30">Website Content Block</div>
                    <div className="bg-[var(--color-surface-BG-2)]/10 border-t border-dashed border-[var(--color-brand-dark)]/30 flex items-center justify-center transition-all duration-500" style={{ height: `var(--space-section-${activeSectionPadding.replace('py-section-', '')})` }}>
                      <span className="text-[0.625rem] font-mono text-[var(--color-brand-dark)] uppercase font-bold">{activeSectionPadding}</span>
                    </div>
                  </div>
                </div>

                {/* 03: Fluid Gaps */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h5 className="text-h5 text-[var(--color-text-primary)] flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] rounded-full flex items-center justify-center text-[0.625rem]">03</span>
                      Column Separation
                    </h5>
                    <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-1 rounded-xl w-fit shadow-elevation-1">
                      {['gap-fluid-xs', 'gap-fluid-sm', 'gap-fluid-md', 'gap-fluid-lg'].map(opt => (
                        <button key={opt} onClick={() => setActiveFluidGap(opt)} className={`px-3 py-1 rounded-lg text-[0.625rem] font-bold uppercase transition-all ${activeFluidGap === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-2' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
                          {opt.replace('gap-fluid-', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={`flex ${activeFluidGap} p-8 border border-dashed border-[var(--color-brand-blue)]/30 bg-[var(--color-surface-BG-3)]/5 rounded-2xl relative min-h-[18rem] transition-all duration-500 items-stretch`}>
                    <div className="flex-1 bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] shadow-elevation-2 rounded-xl flex items-center justify-center">
                      <span className="text-caption text-[var(--color-text-muted)] font-mono uppercase">Column A</span>
                    </div>
                    <div className="flex-1 bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] shadow-elevation-2 rounded-xl flex items-center justify-center relative">
                      <span className="text-caption text-[var(--color-text-muted)] font-mono uppercase">Column B</span>
                      <div className="absolute -left-[calc(var(--space-fluid-md)/2)] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface-BG-3)] text-[var(--color-text-primary-Reverted)] px-4 py-1.5 rounded-full text-[0.625rem] font-mono z-20 whitespace-nowrap shadow-elevation-3 font-bold">
                        {activeFluidGap}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 04: Micro Gaps */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h5 className="text-h5 text-[var(--color-text-primary)] flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] rounded-full flex items-center justify-center text-[0.625rem]">04</span>
                      Micro-Spacing
                    </h5>
                    <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-1 rounded-xl w-fit shadow-elevation-1">
                      {['gap-1', 'gap-2', 'gap-4', 'gap-6'].map(opt => (
                        <button key={opt} onClick={() => setActiveInternalGap(opt)} className={`px-3 py-1 rounded-lg text-[0.625rem] font-bold uppercase transition-all ${activeInternalGap === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-2' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
                          {opt.replace('gap-', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={`organic-glass-panel p-8 flex flex-col ${activeInternalGap} transition-all duration-300 shadow-elevation-4 max-w-md`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-brand-orange)]/20 flex items-center justify-center text-[var(--color-brand-orange)] font-bold italic">S</div>
                      <div className="flex flex-col gap-1">
                        <div className="h-3 w-24 bg-[var(--color-text-primary)]/80 rounded"></div>
                        <div className="h-2 w-16 bg-muted/40 rounded"></div>
                      </div>
                    </div>
                    <p className="text-body-sm text-[var(--color-text-muted)]">Demostración del token <strong>{activeInternalGap}</strong>.</p>
                    <button className="btn-secondary w-full py-2">Test</button>
                  </div>
                </div>

                {/* 05: Grid System */}
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h5 className="text-h5 text-[var(--color-text-primary)] flex items-center gap-3">
                      <span className="w-6 h-6 bg-[var(--color-text-primary)] text-[var(--color-text-primary-Reverted)] rounded-full flex items-center justify-center text-[0.625rem]">05</span>
                      Universal Grid System
                    </h5>
                    <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-1 rounded-xl w-fit shadow-elevation-1">
                      {['mobile', 'tablet', 'desktop'].map(opt => (
                        <button key={opt} onClick={() => setGridMode(opt)} className={`px-3 py-1 rounded-lg text-[0.625rem] font-bold uppercase transition-all ${gridMode === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-2' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-body-sm text-[var(--color-text-muted)] mb-2">
                    Clase maestra <code className="bg-[var(--color-surface-BG-2)] px-2 py-1 rounded text-[var(--color-brand-orange)] font-mono text-xs">.grid-layout</code>. Automáticamente divide en <strong className="text-[var(--color-text-primary)]">12 columnas</strong> (Desktop), <strong className="text-[var(--color-text-primary)]">8 columnas</strong> (Tablet), y <strong className="text-[var(--color-text-primary)]">6 columnas</strong> (Mobile).
                  </p>
                  
                  <div className={`w-full bg-[var(--color-surface-BG-1)]/50 border-[var(--color-border-Strokes-default)] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden relative min-h-[30rem] ${gridMode === 'desktop' ? 'p-0 border-y rounded-none' : 'p-4 md:p-8 border rounded-2xl'}`}>
                    
                    {/* Device Frame */}
                    <div 
                      className={`relative bg-[var(--color-surface-BG-base)] shadow-elevation-4 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${gridMode === 'mobile' ? 'w-[320px] h-[568px] border border-[var(--color-border-Strokes-strong)] rounded-2xl' : gridMode === 'tablet' ? 'w-[768px] h-[500px] border border-[var(--color-border-Strokes-strong)] rounded-2xl' : 'w-full h-[400px] rounded-none border-0'}`}
                    >
                      {/* Grid Overlay (Tall Red Columns) */}
                      <div 
                        className={`absolute inset-0 pointer-events-none z-10 ${gridMode === 'desktop' ? 'max-w-section-xl mx-auto px-0' : 'w-full px-gutter-sm'}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 8 : 12}, minmax(0, 1fr))`,
                          gap: 'var(--space-fluid-xs)'
                        }}
                      >
                         {[...Array(gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 8 : 12)].map((_, i) => (
                           <div key={i} className="h-full bg-[var(--color-brand-orange)]/[0.05] border-x border-[var(--color-brand-orange)]/20 flex justify-center">
                             <div className="bg-[var(--color-brand-orange)] text-[var(--color-surface-BG-base)] font-bold text-[0.5rem] px-1 py-0.5 rounded-b-sm h-fit opacity-50">{i+1}</div>
                           </div>
                         ))}
                      </div>

                      {/* Wireframe UI using the grid */}
                      <div className={`pt-8 relative z-0 flex-1 ${gridMode === 'desktop' ? 'max-w-section-xl mx-auto px-0 w-full' : 'w-full px-gutter-sm'}`}>
                         <div 
                           className="w-full"
                           style={{
                             display: 'grid',
                             gridTemplateColumns: `repeat(${gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 8 : 12}, minmax(0, 1fr))`,
                             gap: 'var(--space-fluid-xs)'
                           }}
                         >
                           {/* Hero */}
                           <div className={`h-32 bg-[var(--color-text-primary)]/5 border border-[var(--color-text-primary)]/10 animate-fade-up ${gridMode === 'desktop' ? 'rounded-none' : 'rounded-xl'}`} style={{ gridColumn: `span ${gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 8 : 12}` }} />
                           
                           {/* Cards */}
                           <div className={`h-24 rounded-xl bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20 mt-4 animate-fade-up`} style={{ animationDelay: '100ms', gridColumn: `span ${gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 4 : 4}` }} />
                           <div className={`h-24 rounded-xl bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20 mt-4 animate-fade-up`} style={{ animationDelay: '200ms', gridColumn: `span ${gridMode === 'mobile' ? 6 : gridMode === 'tablet' ? 4 : 4}` }} />
                           {gridMode === 'desktop' && (
                             <div className={`h-24 rounded-xl bg-[var(--color-brand-blue)]/10 border border-[var(--color-brand-blue)]/20 mt-4 animate-fade-up`} style={{ animationDelay: '300ms', gridColumn: 'span 4' }} />
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}