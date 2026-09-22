"use client";

import React from "react";

const DonutChart = ({ value, label, trend, isCurrency = false }: { value: string, label: string, trend: string, isCurrency?: boolean }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const segments = [
    { color: "var(--color-brand-blue)", percent: 45 },
    { color: "var(--color-brand-orange)", percent: 25 },
    { color: "var(--color-brand-dark)", percent: 15 },
    { color: "#8ECAE6", percent: 10 },
    { color: "#219EBC", percent: 5 },
  ];

  let currentOffset = 0;

  return (
    <div className="w-full flex-1 flex items-center justify-between bg-white rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-1 p-static-lg group transition-transform hover:-translate-y-1">
      <div className="flex flex-col w-1/3">
        <h3 className="text-ui-label text-[var(--color-text-primary)] mb-2 leading-tight uppercase">{label}</h3>
        <div className="text-display-xs font-bold text-[var(--color-text-primary)] tracking-tighter mb-2">
          {value}
        </div>
        <div className="text-[10px] font-bold text-[var(--color-status-red-text)] bg-[var(--color-status-red-bg)] w-fit px-2 py-1 rounded-md">
          ↓ {trend} vs 31d
        </div>
      </div>

      <div className="flex-1 flex justify-center relative">
        <svg width="130" height="130" viewBox="0 0 160 160" className="-rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--color-surface-BG-2)" strokeWidth="16" />
          
          {segments.map((seg, i) => {
            const dash = (seg.percent / 100) * circumference;
            const gap = circumference - dash;
            const offset = currentOffset;
            currentOffset -= dash;

            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out opacity-90 group-hover:opacity-100"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-h4 font-bold text-[var(--color-text-primary)]">{value}</span>
        </div>
      </div>

      <div className="w-1/3 flex flex-col gap-2 pl-static-md border-l border-[var(--color-border-Strokes-default)]">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: seg.color }} />
            <div className="text-meta text-[var(--color-text-muted)] truncate flex-1">Agente {i + 1}</div>
            <div className="text-data font-medium text-[var(--color-text-primary)]">{isCurrency ? '$' : ''}{Math.floor(Math.random() * 200)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SlidePipeline() {
  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex flex-col font-sans relative bg-white border border-[var(--color-border-Strokes-default)] rounded-[2rem] shadow-elevation-5 overflow-hidden scale-90 md:scale-100 origin-center p-static-xl">
      
      {/* HEADER REAL */}
      <div className="w-full mb-static-lg flex justify-between items-center">
        <div>
           <h2 className="text-h4 font-bold text-[var(--color-text-primary)] tracking-tight">
             LEADS & REVENUE
           </h2>
        </div>
        <div className="text-meta text-[var(--color-text-muted)] bg-[var(--color-surface-BG-1)] px-3 py-1.5 rounded-full border border-[var(--color-border-Strokes-default)] flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[var(--color-status-green-text)] animate-pulse" />
           Live Sync
        </div>
      </div>

      {/* BODY COMPLETAMENTE ESTRUCTURADO Y LEGIBLE */}
      <div className="flex-1 flex w-full gap-fluid-md h-full">
        
        {/* COLUMNA IZQUIERDA: 2 DONUTS APILADOS */}
        <div className="w-1/2 flex flex-col gap-fluid-sm h-full">
          <DonutChart value="761" label="Total oportunidades asignadas" trend="24.95%" />
          <DonutChart value="$9.07K" label="Monto generado" trend="25.17%" isCurrency />
        </div>

        {/* COLUMNA DERECHA: GRÁFICA DE ÁREA (PICOS) */}
        <div className="w-1/2 bg-[var(--color-surface-BG-base)] rounded-[1.5rem] border border-[var(--color-border-Strokes-default)] shadow-elevation-1 p-static-xl flex flex-col transition-transform hover:-translate-y-1 h-full">
           
           <div className="flex justify-between items-start mb-static-lg relative z-10">
             <div>
               <h3 className="text-ui-label text-[var(--color-text-primary)] uppercase mb-1">Opened Opportunities</h3>
               <div className="text-display-xs font-bold text-[var(--color-text-primary)]">3,412</div>
             </div>
           </div>
           
           <div className="flex-1 w-full relative mt-4">
              <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Soft Grid Lines */}
                {[0, 50, 100, 150, 200].map((y, i) => (
                  <g key={i}>
                    <path d={`M0,${y} L500,${y}`} stroke="var(--color-border-Strokes-default)" strokeWidth="1" fill="none" />
                    <text x="-15" y={y + 4} fontSize="10" fontFamily="JetBrains Mono" fill="var(--color-text-muted)" textAnchor="end">{40 - i * 10}</text>
                  </g>
                ))}
                
                {/* Gradient Fill */}
                <defs>
                  <linearGradient id="chartGradientReal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-blue)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-brand-blue)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Elegant Curved Area (Real Info representation) */}
                <path 
                  d="M0,150 C25,115 25,80 50,80 C75,80 75,100 100,100 C125,100 125,160 150,160 C175,160 175,140 200,140 C225,140 225,150 250,150 C275,150 275,110 300,110 C325,110 325,130 350,130 C375,130 375,60 400,60 C425,60 425,120 450,120 C475,120 475,40 500,40 L500,200 L0,200 Z" 
                  fill="url(#chartGradientReal)" 
                />
                <path 
                  d="M0,150 C25,115 25,80 50,80 C75,80 75,100 100,100 C125,100 125,160 150,160 C175,160 175,140 200,140 C225,140 225,150 250,150 C275,150 275,110 300,110 C325,110 325,130 350,130 C375,130 375,60 400,60 C425,60 425,120 450,120 C475,120 475,40 500,40" 
                  fill="none" 
                  stroke="var(--color-brand-blue)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                
                {/* Refined Nodes representing data points */}
                <circle cx="50" cy="80" r="4" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="150" cy="160" r="4" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="300" cy="110" r="4" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
                <circle cx="500" cy="40" r="4" fill="var(--color-surface-BG-base)" stroke="var(--color-brand-blue)" strokeWidth="2" />
              </svg>

              {/* X Axis labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-between text-meta text-[var(--color-text-muted)] uppercase">
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
