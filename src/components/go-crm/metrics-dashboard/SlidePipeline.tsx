"use client";

import React, { useState, useEffect } from "react";

const ImpeccableDonut = ({ value, label, trend, isCurrency = false, isOrange = false, isActive = false }: { value: string, label: string, trend: string, isCurrency?: boolean, isOrange?: boolean, isActive?: boolean }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  
  const mainColor = isOrange ? "var(--color-brand-orange)" : "var(--color-brand-blue)";
  const segments = [
    { color: mainColor, percent: 55 },
    { color: "var(--color-text-primary)", percent: 25 },
    { color: "var(--color-border-Strokes-strong)", percent: 15 },
    { color: "var(--color-border-Strokes-default)", percent: 5 },
  ];

  let currentOffset = 0;

  return (
    <div className={`absolute inset-0 flex flex-col justify-between p-static-xl transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
      <div className="flex justify-between items-start mb-6 pr-8">
        <div>
          <h3 className="text-ui-label text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{label}</h3>
          <div className="text-display-sm font-medium text-[var(--color-text-primary)]">
            {value}
          </div>
        </div>
        <div className="text-meta font-medium text-[var(--color-status-red-text)] bg-[var(--color-status-red-bg)] px-2 py-1 rounded">
          ↓ {trend}
        </div>
      </div>

      <div className="flex items-center gap-static-lg mt-auto">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-surface-BG-2)" strokeWidth="6" />
            {segments.map((seg, i) => {
              const dash = (seg.percent / 100) * circumference;
              const gap = circumference - dash;
              const offset = currentOffset;
              currentOffset -= dash;
              return (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="6"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out origin-center"
                  style={{
                    strokeDasharray: isActive ? `${dash} ${gap}` : `0 ${circumference}`,
                    transitionDelay: isActive ? `${i * 100}ms` : '0ms'
                  }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-body-sm font-medium text-[var(--color-text-primary)]">{isCurrency ? 'Q3' : 'Total'}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {segments.slice(0, 3).map((seg, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="text-meta text-[var(--color-text-muted)]">Agente {i + 1}</span>
              </div>
              <span className="text-data text-[var(--color-text-primary)]">{isCurrency ? '$' : ''}{Math.floor(Math.random() * 200 + 50)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function SlidePipeline() {
  const [activeDonut, setActiveDonut] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDonut(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex flex-col font-sans relative bg-white border border-[var(--color-border-Strokes-default)] rounded-[2rem] shadow-elevation-2 overflow-hidden scale-90 md:scale-100 origin-center p-static-xl">
      
      {/* ── HEADER IMPECCABLE ── */}
      <div className="w-full flex justify-between items-end pb-static-md border-b border-[var(--color-border-Strokes-default)] mb-static-lg">
        <div>
           <h2 className="text-display-xs font-semibold text-[var(--color-text-primary)] mb-2">
             Leads & Revenue Pipeline
           </h2>
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[var(--color-status-green-text)] shadow-[0_0_8px_var(--color-status-green-text)] animate-pulse" />
             <span className="text-meta text-[var(--color-text-muted)] uppercase tracking-widest">Métricas actualizadas en tiempo real</span>
           </div>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] rounded-lg p-1">
           {['1W', '1M', '3M', 'YTD'].map((tab, i) => (
             <button key={tab} className={`px-4 py-1.5 rounded-md text-ui-label ${i === 1 ? 'bg-white shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* ── BODY ESTRUCTURADO ── */}
      <div className="flex-1 flex w-full gap-fluid-md h-full min-h-0">
        
        {/* COLUMNA IZQ: DONUT CAROUSEL */}
        <div className="w-[45%] h-full relative rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] bg-white shadow-sm overflow-hidden group">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes shrinkDot {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}} />

          {/* Pagination Dots */}
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            {/* Dot 1 */}
            <div className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${activeDonut === 0 ? 'w-12 bg-[var(--color-brand-blue)]/20' : 'w-1.5 bg-gray-300'}`}>
               {activeDonut === 0 && (
                 <div 
                   className="absolute top-0 left-0 h-full bg-[var(--color-brand-blue)] rounded-full" 
                   style={{ animation: 'shrinkDot 5s linear forwards' }} 
                 />
               )}
            </div>
            {/* Dot 2 */}
            <div className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${activeDonut === 1 ? 'w-12 bg-[var(--color-brand-orange)]/20' : 'w-1.5 bg-gray-300'}`}>
               {activeDonut === 1 && (
                 <div 
                   className="absolute top-0 left-0 h-full bg-[var(--color-brand-orange)] rounded-full" 
                   style={{ animation: 'shrinkDot 5s linear forwards' }} 
                 />
               )}
            </div>
          </div>

          <ImpeccableDonut 
            value="761" 
            label="Oportunidades Asignadas" 
            trend="24.95%" 
            isActive={activeDonut === 0} 
          />
          <ImpeccableDonut 
            value="$9.07K" 
            label="Monto Generado" 
            trend="25.17%" 
            isCurrency 
            isOrange 
            isActive={activeDonut === 1} 
          />
        </div>

        {/* COLUMNA DER: ÁREA CHART (Impeccable) */}
        <div className="w-[55%] flex flex-col h-full relative group">
           
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-ui-label text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Opened Opportunities</h3>
               <div className="flex items-baseline gap-2">
                 <div className="text-display font-medium text-[var(--color-text-primary)]">3,412</div>
                 <div className="text-body-sm text-[var(--color-text-muted)]">This period</div>
               </div>
             </div>
             <div className="text-meta text-[var(--color-text-primary)] bg-[var(--color-surface-BG-2)] px-3 py-1.5 rounded-md border border-[var(--color-border-Strokes-default)] flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Analyze
             </div>
           </div>
           
           <div className="flex-1 w-full relative mt-auto border-t border-l border-[var(--color-border-Strokes-default)]">
              {/* Impeccable Tooltip (Static demo) */}
              <div className="absolute top-[35%] left-[60%] -translate-x-1/2 -translate-y-[120%] bg-[var(--color-surface-BG-black)] text-[var(--color-surface-BG-base)] px-3 py-2 rounded-lg shadow-elevation-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none flex flex-col items-center">
                <span className="text-meta text-gray-400 mb-0.5">03 Sep</span>
                <span className="text-ui-label font-bold">42 Oportunidades</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-surface-BG-black)] rotate-45" />
              </div>
              <div className="absolute top-[35%] left-[60%] w-[1px] h-[65%] bg-[var(--color-text-primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 pointer-events-none dashed" />

              <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Ultra-soft Grid Lines (Dotted) */}
                {[50, 100, 150].map((y, i) => (
                  <g key={i}>
                    <line x1="0" y1={y} x2="500" y2={y} stroke="var(--color-border-Strokes-default)" strokeWidth="1" strokeDasharray="2 4" />
                    <text x="-10" y={y + 3} fontSize="0.65rem" fontFamily="JetBrains Mono" fill="var(--color-text-muted)" textAnchor="end">{40 - i * 10}</text>
                  </g>
                ))}
                
                <defs>
                  <linearGradient id="impeccableChartGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-blue)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-brand-blue)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Elegant Smooth Area */}
                <path 
                  d="M0,150 C40,115 60,110 100,100 C150,85 180,160 220,160 C260,160 280,100 300,70 C320,40 360,60 400,60 C440,60 470,120 500,120 L500,200 L0,200 Z" 
                  fill="url(#impeccableChartGrad)" 
                />
                
                {/* Sharp Chart Line */}
                <path 
                  d="M0,150 C40,115 60,110 100,100 C150,85 180,160 220,160 C260,160 280,100 300,70 C320,40 360,60 400,60 C440,60 470,120 500,120" 
                  fill="none" 
                  stroke="var(--color-brand-blue)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                
                {/* Clean Nodes */}
                <circle cx="100" cy="100" r="3" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="220" cy="160" r="3" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="300" cy="70" r="4" fill="var(--color-brand-blue)" stroke="var(--color-surface-BG-base)" strokeWidth="2" className="shadow-sm" />
                <circle cx="400" cy="60" r="3" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="500" cy="120" r="3" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
              </svg>

              {/* X Axis labels */}
              <div className="absolute -bottom-7 left-0 w-full flex justify-between text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                 <span>22 Aug</span>
                 <span>26 Aug</span>
                 <span>30 Aug</span>
                 <span>03 Sep</span>
                 <span>07 Sep</span>
                 <span>11 Sep</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
