"use client";

import React from "react";

const DonutChart = ({ value, label, trend, hideTrend = false }: { value: string, label: string, trend?: string, hideTrend?: boolean }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { color: "var(--color-brand-blue)", percent: 60 },
    { color: "#8ECAE6", percent: 20 },
    { color: "var(--color-brand-orange)", percent: 20 },
  ];
  let currentOffset = 0;

  return (
    <div className="w-full flex items-center justify-between relative rounded-[2rem] border border-white/40 shadow-elevation-2 overflow-hidden p-6 group transform hover:-translate-y-1 transition-transform">
      <div className="absolute inset-0 -z-10 rounded-[2rem]">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[24px]" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] saturate-[1.5]" />
      </div>

      <div className="flex flex-col w-1/3 relative z-10">
        <h3 className="text-h7 font-bold text-[var(--color-text-primary)] mb-2 leading-tight">{label}</h3>
        <div className="text-display-xs font-bold text-[var(--color-text-primary)] tracking-tighter mb-1">{value}</div>
        {!hideTrend && trend && (
          <div className="text-ui-label text-red-500 bg-red-50/50 backdrop-blur-md w-fit px-2 py-1 rounded-md border border-red-100">↓ {trend} vs last 31 days</div>
        )}
      </div>

      <div className="flex-1 flex justify-center relative z-10">
        <svg width="140" height="140" viewBox="0 0 160 160" className="-rotate-90 filter drop-shadow-sm">
          {segments.map((seg, i) => {
            const dash = (seg.percent / 100) * circumference;
            const gap = circumference - dash;
            const offset = currentOffset;
            currentOffset -= dash;
            return (
              <circle key={i} cx="80" cy="80" r={radius} fill="none" stroke={seg.color} strokeWidth="16" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out opacity-90 group-hover:opacity-100 group-hover:scale-105 origin-center" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-h4 font-bold text-[var(--color-text-primary)]">{value}</span>
        </div>
      </div>

      <div className="w-1/3 flex flex-col gap-2 pl-4 border-l border-white/40 relative z-10">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <div className="text-meta text-[var(--color-text-muted)] truncate flex-1">Agent {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SlideVelocity() {
  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex gap-fluid-sm font-sans scale-90 md:scale-100 origin-center transition-transform">
      
      {/* LEFT COLUMN: Donuts & Sales Efficiency */}
      <div className="flex-1 flex flex-col gap-fluid-xs">
        <div className="grid grid-cols-2 gap-fluid-xs">
          <DonutChart value="538" label="Oportunidades OPEN" trend="10.18%" />
          <DonutChart value="172" label="Citas agendadas por usuario" hideTrend />
        </div>
        
        <div className="grid grid-cols-2 gap-fluid-xs">
          <DonutChart value="473" label="Oportunidades ABANDONED" trend="4.83%" />
          <DonutChart value="144" label="Oportunidades WON" trend="23.4%" />
        </div>

        {/* Sales Efficiency Block */}
        <div className="w-full relative rounded-[2rem] border border-white/40 shadow-elevation-2 overflow-hidden p-6 mt-auto">
          <div className="absolute inset-0 -z-10 rounded-[2rem]">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[24px]" />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] saturate-[1.5]" />
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-white/40 pb-4 relative z-10">
             <h3 className="text-h6 font-bold text-[var(--color-text-primary)]">Sales efficiency</h3>
             <div className="flex gap-2">
                <span className="text-ui-label text-[var(--color-text-primary)] bg-white/50 border border-white/50 px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white/80 transition-colors">All pipelines ▾</span>
                <span className="text-ui-label text-[var(--color-text-primary)] bg-white/50 border border-white/50 px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white/80 transition-colors">All users ▾</span>
             </div>
          </div>
          <div className="grid grid-cols-3 gap-6 relative z-10">
             <div>
               <div className="text-meta text-[var(--color-text-muted)] mb-1 uppercase">Average sales duration</div>
               <div className="text-display-xs font-bold text-[var(--color-text-primary)]">5D 2h</div>
             </div>
             <div>
               <div className="text-meta text-[var(--color-text-muted)] mb-1 uppercase">Total sale value</div>
               <div className="text-display-xs font-bold text-[var(--color-text-primary)]">$9.16K</div>
             </div>
             <div>
               <div className="text-meta text-[var(--color-text-muted)] mb-1 uppercase">Sales velocity</div>
               <div className="text-display-xs font-bold text-[var(--color-text-primary)]">$48.95K/M</div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: KPI Cards (Stack) */}
      <div className="w-72 flex flex-col gap-fluid-xs">
        {[
          { label: "Opportunities", val: "761" },
          { label: "Won Opportunities", val: "144" },
          { label: "Total chargebacks", val: "0" },
          { label: "Con error de pago", val: "132", sub: "↑ 4300%", subColor: "text-green-700 bg-green-100/50 border-green-200" },
          { label: "Leads with chargeback", val: "0" },
          { label: "Churn", val: "25%" },
        ].map((kpi, i) => (
          <div key={i} className="relative flex-1 rounded-[1.5rem] border border-white/40 shadow-elevation-1 overflow-hidden flex flex-col items-center justify-center text-center p-4 transform hover:scale-105 transition-transform group">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[24px] group-hover:bg-white/70 transition-colors" />
            </div>
            <span className="text-ui-label text-[var(--color-text-muted)] mb-1">{kpi.label}</span>
            <span className="text-h3 font-black text-[var(--color-text-primary)] tracking-tighter">{kpi.val}</span>
            {kpi.sub && (
               <span className={`text-ui-label mt-2 px-2 py-1 rounded-md border backdrop-blur-md ${kpi.subColor}`}>{kpi.sub}</span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
