"use client";

import React, { useState, useEffect } from "react";

const KpiCard = ({ title, value, trend, trendUp, isAlert }: { title: string, value: string, trend?: string, trendUp?: boolean, isAlert?: boolean }) => (
  <div className={`flex flex-col justify-center border ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-[var(--color-border-Strokes-default)] bg-white'} rounded-xl p-4 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow`}>
    <span className="text-meta text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{title}</span>
    <div className="flex items-end justify-between">
      <span className={`text-h5 font-semibold tracking-tight ${isAlert ? 'text-red-600' : 'text-[var(--color-text-primary)]'}`}>{value}</span>
      {trend && (
        <span className={`text-meta font-medium px-1.5 py-0.5 rounded ${trendUp ? 'text-green-700 bg-green-100' : 'text-red-600 bg-red-100'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  </div>
);

const RealImpeccableWidget = ({ title, value, trend, trendDown = true, segments }: { title: string, value: string, trend: string, trendDown: boolean, segments: any[] }) => {
  let currentOffset = 0;
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white border border-[var(--color-border-Strokes-default)] rounded-xl p-3 shadow-elevation-1 flex flex-col justify-between h-full hover:shadow-elevation-2 transition-shadow">
      <div className="mb-1">
        <h3 className="text-ui-label text-[var(--color-text-primary)]">{title}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-h6 font-bold tracking-tight">{value}</span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${trendDown ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {trendDown ? '↓' : '↑'} {trend}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between flex-1 mt-1">
        {/* DONUT */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
             <path
               className="text-[var(--color-surface-BG-2)]"
               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
               fill="none"
               stroke="currentColor"
               strokeWidth="4"
             />
             {segments.map((seg, i) => {
                const dash = (seg.percent / 100) * circumference;
                const gap = circumference - dash;
                const offset = currentOffset;
                currentOffset -= dash;
                return (
                  <path
                    key={i}
                    style={{ color: seg.color }}
                    className="currentColor drop-shadow-sm"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={offset}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                )
             })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)]">
            {value}
          </div>
        </div>
        
        {/* LEGEND */}
        <div className="flex flex-col gap-1 w-[55%]">
           {segments.map((seg, i) => (
             <div key={i} className="flex justify-between items-center text-[10px]">
               <div className="flex items-center gap-1.5 truncate">
                 <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: seg.color}} />
                 <span className="truncate text-[var(--color-text-muted)]">{seg.name}</span>
               </div>
               <span className="font-medium text-[var(--color-text-primary)] ml-1">{seg.val}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export default function SlideVelocity() {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePage(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex flex-col font-sans relative bg-white border border-[var(--color-border-Strokes-default)] rounded-[2rem] shadow-elevation-2 overflow-hidden scale-90 md:scale-100 origin-center p-static-xl">
      
      {/* ── HEADER ── */}
      <div className="w-full flex justify-between items-end pb-static-sm border-b border-[var(--color-border-Strokes-default)] mb-static-md">
        <div>
           <h2 className="text-display-xs font-semibold text-[var(--color-text-primary)] tracking-tight mb-2">
             Velocity & Omnichannel
           </h2>
           <span className="text-meta text-[var(--color-text-muted)] uppercase tracking-widest">Estado y Comunicaciones (Tiempo Real)</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <div className="text-meta text-[var(--color-text-muted)] uppercase mb-1">Sales Velocity</div>
             <div className="text-ui-label font-bold text-[var(--color-text-primary)]">$48.95K/M</div>
           </div>
           <div className="text-right">
             <div className="text-meta text-[var(--color-text-muted)] uppercase mb-1">Avg Duration</div>
             <div className="text-ui-label font-bold text-[var(--color-text-primary)]">5D 2h</div>
           </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 flex gap-static-xl h-full min-h-0">
        
        {/* COLUMNA IZQ: Real Data Widgets (Impeccable) (65%) */}
        <div className="w-[65%] h-full flex flex-col gap-static-md">
           
           {/* Grid 3x2 para que encajen perfectos sin scroll */}
           <div className="grid grid-cols-3 gap-static-sm h-full">
             
             {/* 1: OPEN */}
             <RealImpeccableWidget 
               title="Oportunidades OPEN" 
               value="538" 
               trend="10.18%" 
               trendDown={true}
               segments={[
                 { color: "#3B82F6", name: "Aura Monast...", val: 133, percent: 35 },
                 { color: "#60A5FA", name: "Felipe Pala...", val: 130, percent: 30 },
                 { color: "#93C5FD", name: "Laura Vivia...", val: 59, percent: 15 },
                 { color: "#BFDBFE", name: "Erika Aleja...", val: 52, percent: 10 },
               ]}
             />

             {/* 2: CITAS */}
             <RealImpeccableWidget 
               title="Citas agendadas" 
               value="172" 
               trend="0.00%" 
               trendDown={false}
               segments={[
                 { color: "#10B981", name: "Felipe Pala...", val: 93, percent: 55 },
                 { color: "#34D399", name: "Aura Monast...", val: 55, percent: 25 },
                 { color: "#6EE7B7", name: "Erika Aleja...", val: 13, percent: 10 },
                 { color: "#A7F3D0", name: "Laura Vivia...", val: 4, percent: 5 },
               ]}
             />

             {/* 3: ABANDONED */}
             <RealImpeccableWidget 
               title="Oportunidades ABANDONED" 
               value="473" 
               trend="4.83%" 
               trendDown={true}
               segments={[
                 { color: "#94A3B8", name: "Aura Monast...", val: 117, percent: 35 },
                 { color: "#CBD5E1", name: "Felipe Pala...", val: 114, percent: 30 },
                 { color: "#E2E8F0", name: "Oswaldo Oje...", val: 67, percent: 15 },
                 { color: "#F1F5F9", name: "Alejo Ferna...", val: 53, percent: 10 },
               ]}
             />

             {/* 4: WON */}
             <RealImpeccableWidget 
               title="Oportunidades WON" 
               value="144" 
               trend="23.4%" 
               trendDown={true}
               segments={[
                 { color: "#F97316", name: "Aura Monast...", val: 38, percent: 30 },
                 { color: "#FB923C", name: "Felipe Pala...", val: 29, percent: 25 },
                 { color: "#FDBA74", name: "Alejo Ferna...", val: 24, percent: 15 },
                 { color: "#FED7AA", name: "Laura Vivia...", val: 13, percent: 10 },
               ]}
             />

             {/* 5: OUTBOUND CALLS */}
             <RealImpeccableWidget 
               title="Llamadas realizadas" 
               value="10.67K" 
               trend="17.01%" 
               trendDown={true}
               segments={[
                 { color: "#8B5CF6", name: "Felipe Pala...", val: "2.32K", percent: 35 },
                 { color: "#A78BFA", name: "Alejo Ferna...", val: "1.81K", percent: 25 },
                 { color: "#C4B5FD", name: "Laura Vivia...", val: "1.65K", percent: 20 },
                 { color: "#DDD6FE", name: "Valentina A...", val: "1.36K", percent: 15 },
               ]}
             />

             {/* 6: INBOUND CALLS */}
             <RealImpeccableWidget 
               title="Llamadas recibidas" 
               value="567" 
               trend="31.85%" 
               trendDown={true}
               segments={[
                 { color: "#EC4899", name: "Aura Monast...", val: 155, percent: 35 },
                 { color: "#F472B6", name: "Felipe Pala...", val: 104, percent: 30 },
                 { color: "#F9A8D4", name: "Paula Reyes...", val: 58, percent: 20 },
                 { color: "#FBCFE8", name: "Laura Vivia...", val: 56, percent: 10 },
               ]}
             />

           </div>
        </div>

        {/* COLUMNA DER: Key Metrics Stack (35%) */}
        <div className="w-[35%] flex flex-col h-full bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] rounded-[1.5rem] p-static-md overflow-hidden relative">
           
           <style dangerouslySetInnerHTML={{__html: `
             @keyframes shrinkDotRight {
               from { width: 100%; }
               to { width: 0%; }
             }
           `}} />

           <div className="flex justify-between items-center mb-6">
             <h3 className="text-ui-label text-[var(--color-text-muted)] uppercase tracking-wider">Resumen General</h3>
             
             {/* Pagination Dots */}
             <div className="flex gap-2">
               <div className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${activePage === 0 ? 'w-10 bg-[var(--color-text-primary)]/10' : 'w-1.5 bg-[var(--color-border-Strokes-strong)]'}`}>
                  {activePage === 0 && (
                    <div className="absolute top-0 left-0 h-full bg-[var(--color-text-primary)] rounded-full" style={{ animation: 'shrinkDotRight 5s linear forwards' }} />
                  )}
               </div>
               <div className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${activePage === 1 ? 'w-10 bg-[var(--color-text-primary)]/10' : 'w-1.5 bg-[var(--color-border-Strokes-strong)]'}`}>
                  {activePage === 1 && (
                    <div className="absolute top-0 left-0 h-full bg-[var(--color-text-primary)] rounded-full" style={{ animation: 'shrinkDotRight 5s linear forwards' }} />
                  )}
               </div>
             </div>
           </div>
           
           <div className="flex-1 relative">
             {/* PAGE 1 */}
             <div className={`absolute inset-0 flex flex-col gap-3 transition-all duration-700 ease-in-out ${activePage === 0 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
               <KpiCard title="Opportunities" value="761" />
               <KpiCard title="Won Opportunities" value="144" />
               <KpiCard title="Total chargebacks" value="0" />
             </div>

             {/* PAGE 2 */}
             <div className={`absolute inset-0 flex flex-col gap-3 transition-all duration-700 ease-in-out ${activePage === 1 ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
               <KpiCard title="Con error de pago" value="132" trend="4300%" trendUp isAlert />
               <KpiCard title="Leads with chargeback" value="0" />
               <KpiCard title="Churn" value="25%" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
