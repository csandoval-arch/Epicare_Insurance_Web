"use client";

import React from "react";

const CallDonut = ({ value, label, trend, isGreen = false }: { value: string, label: string, trend?: string, isGreen?: boolean }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { color: "var(--color-brand-blue)", percent: 70 },
    { color: "#8ECAE6", percent: 30 },
  ];
  let currentOffset = 0;

  return (
    <div className="w-full flex items-center justify-between relative rounded-[2rem] border border-white/40 shadow-elevation-1 overflow-hidden p-6 group transform hover:-translate-y-1 transition-transform">
      <div className="absolute inset-0 -z-10 rounded-[2rem]">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[24px]" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px] saturate-[1.5]" />
      </div>

      <div className="flex flex-col w-1/3 relative z-10">
        <h3 className="text-ui-label text-[var(--color-text-muted)] mb-2 leading-tight">{label}</h3>
        <div className="text-display-xs font-black text-[var(--color-text-primary)] tracking-tighter mb-1">{value}</div>
        {trend && (
          <div className={`text-ui-label w-fit px-2 py-1 rounded-md border backdrop-blur-md ${isGreen ? 'text-green-700 bg-green-50/50 border-green-200' : 'text-red-500 bg-red-50/50 border-red-100'}`}>
            {isGreen ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div className="flex-1 flex justify-center relative z-10">
        <svg width="120" height="120" viewBox="0 0 160 160" className="-rotate-90 filter drop-shadow-sm">
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
          <span className="text-h5 font-bold text-[var(--color-text-primary)]">{value}</span>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-2 pl-4 border-l border-white/40 relative z-10">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <div className="text-meta text-[var(--color-text-muted)] truncate flex-1">Agent {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SlideOmnichannel() {
  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex flex-col relative rounded-[2.5rem] border border-white/30 shadow-2xl overflow-hidden font-sans scale-90 md:scale-100 origin-center transition-transform">
      
      {/* GLASSMORPHIC BACKGROUND */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem]">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[32px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-[20px] saturate-[1.2]" />
      </div>

      {/* HEADER */}
      <div className="w-full border-b border-white/40 p-gutter-sm flex justify-between items-center relative z-10">
        <div>
           <h2 className="text-display-xs font-bold text-[var(--color-text-primary)] tracking-tight leading-none">
             Calls & Messaging
           </h2>
        </div>
      </div>

      {/* BODY (Grid of Donuts) */}
      <div className="flex-1 w-full p-gutter-sm grid grid-cols-2 gap-fluid-xs overflow-y-auto relative z-10">
        
        <CallDonut value="567" label="Total llamadas recibidas" trend="31.85%" />
        <CallDonut value="10.67K" label="Total llamadas realizadas" trend="17.01%" />
        
        <CallDonut value="9h 15m" label="Duración total recibidas" trend="50.94%" />
        <CallDonut value="95h 23m" label="Duración total realizadas" trend="29.94%" />
        
        <CallDonut value="37s" label="Tiempo promedio recibidas" trend="29.15%" />
        <CallDonut value="57s" label="Tiempo promedio realizadas" trend="12.41%" isGreen />
        
        <CallDonut value="9.49K" label="SMS Enviados" />
        <CallDonut value="53" label="Message distribution" />

      </div>
    </div>
  );
}
