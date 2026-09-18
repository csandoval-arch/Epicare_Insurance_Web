"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function CalendarGoCrm() {
  const t = useTranslations("goCrm.calendar");
  const container = useRef<HTMLElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
  if (!calendarRef.current) return;
    
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Text Reveal
      gsap.fromTo(
        ".reveal-text",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
          }
        }
      );

      // Calendar Card Float-in
      gsap.fromTo(
        calendarRef.current,
        { opacity: 0, y: 40, rotateX: 5 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: calendarRef.current,
            start: "top 80%",
          }
        }
      );

      // Cute Stagger for events
      const events = gsap.utils.toArray<HTMLElement>(".cal-event-block");
      gsap.fromTo(
        events,
        { opacity: 0, scale: 0.9, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.4)",
          delay: 0.4,
          scrollTrigger: {
            trigger: calendarRef.current,
            start: "top 60%",
          }
        }
      );

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={container} 
      className="relative w-full min-h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] border-t border-[var(--color-border-Strokes-default)] flex flex-col pt-24 lg:pt-32 pb-32 perspective-[1200px]"
    >
      {/* ─── HEADER ─── */}
      <div className="w-full max-w-7xl mx-auto px-gutter-md relative z-10 mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex flex-col">
          <div className="overflow-hidden mb-4">
            <p className="reveal-text text-meta font-mono text-[var(--color-text-accent-blue)] uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)]" />
              09 — {t("overline", { defaultMessage: "CALENDAR + APPOINTMENTS" })}
            </p>
          </div>
          
          <div className="overflow-hidden mb-5">
            <h2 className="reveal-text text-display-md lg:text-display-lg font-bold tracking-tight leading-tight">
              {t("headline", { defaultMessage: "Your pipeline meets your calendar." })}
            </h2>
          </div>
          
          <div className="overflow-hidden">
            <p className="reveal-text text-body-md lg:text-body-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {t("description", { defaultMessage: "Native two-way sync with the entire Google Calendar ecosystem. Appointments are part of the workflow, not isolated events." })}
            </p>
          </div>
        </div>
      </div>

      {/* ─── LIGHT MODE BEAUTIFUL PLANNER ─── */}
      <div className="w-full flex-1 relative px-4 lg:px-8 max-w-[1300px] mx-auto z-20">
        
        {/* The White Card */}
        <div 
          ref={calendarRef}
          className="w-full bg-white text-gray-900 rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Toolbar */}
          <div className="w-full h-20 border-b border-gray-100 flex items-center justify-between px-8 lg:px-10 bg-white">
             
             <div className="flex items-center gap-6">
               <h3 className="text-xl font-bold text-gray-900 tracking-tight">November 2026</h3>
               <div className="flex items-center gap-2">
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">&lt;</button>
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">&gt;</button>
               </div>
             </div>
             
             <div className="flex items-center gap-5">
               {/* Cute Google Sync Pill */}
               <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M21 12.0001C21 11.1678 20.9329 10.4206 20.7818 9.69824H12V13.8824H17.2023C16.892 15.4223 16.0368 16.7029 14.7362 17.5794V20.3541H17.7811C19.6105 18.6657 21 15.5866 21 12.0001Z" fill="#4285F4"/>
                   <path d="M12.0003 21C14.5323 21 16.6621 20.1582 18.2323 18.6183L15.1873 15.8436C14.3323 16.4258 13.2505 16.7905 12.0003 16.7905C9.57864 16.7905 7.52554 15.1507 6.78684 12.9234H3.63354V15.7725C5.17704 18.8471 8.35824 21 12.0003 21Z" fill="#34A853"/>
                   <path d="M6.7866 12.9231C6.5936 12.3409 6.4845 11.7161 6.4845 11.0829C6.4845 10.4497 6.5936 9.82496 6.7866 9.24276V6.39355H3.6333C3.0039 7.64965 2.6508 9.07176 2.6508 10.5829C2.6508 12.0941 3.0039 13.5162 3.6333 14.7723L6.7866 12.9231Z" fill="#FBBC05"/>
                   <path d="M12.0003 5.37521C13.3853 5.37521 14.6193 5.85241 15.5925 6.78521L18.3078 4.07C16.6536 2.5218 14.5238 1.5833 12.0003 1.5833C8.35824 1.5833 5.17704 3.73611 3.63354 6.81081L6.78684 9.65991C7.52554 7.43271 9.57864 5.37521 12.0003 5.37521Z" fill="#EA4335"/>
                 </svg>
                 <span className="text-xs font-bold text-gray-700">Synced</span>
               </div>
               
               <div className="flex bg-gray-100 rounded-lg p-1">
                 <button className="px-4 py-1.5 text-xs font-bold bg-white rounded-md text-gray-900 shadow-sm">Week</button>
                 <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">Month</button>
               </div>
             </div>
          </div>

          {/* Days Header */}
          <div className="w-full flex border-b border-gray-100 bg-[#FAFAFA]">
            <div className="w-16 lg:w-24 shrink-0" />
            <div className="flex-1 grid grid-cols-5">
              {[
                { day: "Mon", date: "12" },
                { day: "Tue", date: "13" },
                { day: "Wed", date: "14", isToday: true },
                { day: "Thu", date: "15" },
                { day: "Fri", date: "16" }
              ].map((col, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-4 relative">
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${col.isToday ? 'text-[var(--color-brand-blue)]' : 'text-gray-400'}`}>
                    {col.day}
                  </span>
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center text-xl font-medium ${col.isToday ? 'bg-[var(--color-brand-blue)] text-white shadow-[0_4px_12px_rgba(53,187,253,0.3)]' : 'text-gray-800'}`}>
                    {col.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Body */}
          <div className="w-full flex-1 flex relative bg-[#FAFAFA] min-h-[550px]">
            
            {/* Time Axis (Left) */}
            <div className="w-16 lg:w-24 shrink-0 flex flex-col border-r border-gray-100 bg-white relative z-20">
              {["09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM"].map((time, idx) => (
                <div key={idx} className="flex-1 relative flex items-start justify-center pt-2">
                  <span className="text-[10px] font-medium text-gray-400 -mt-2 bg-white px-2">{time}</span>
                </div>
              ))}
            </div>

            {/* Grid Area */}
            <div className="flex-1 relative bg-white overflow-hidden">
              
              {/* Horizontal Lines */}
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-1 relative w-full border-t border-gray-100" />
                ))}
              </div>
              
              {/* Vertical Lines */}
              <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative h-full border-r border-gray-100 last:border-r-0">
                     {i === 2 && <div className="absolute inset-0 bg-[#F0F9FF]/30" />} {/* Very soft blue tint for today */}
                  </div>
                ))}
              </div>

              {/* ── EVENTS (Beautiful Soft Design) ── */}
              <div className="absolute inset-0 grid grid-cols-5">
                
                {/* Column 1: MON */}
                <div className="relative h-full col-start-1">
                  <div className="cal-event-block absolute top-[12.5%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#EAF6FF] border border-[#B3DFFF] rounded-xl flex flex-col cursor-pointer hover:shadow-md transition-shadow z-20">
                    <span className="text-[12px] font-bold text-[#0066CC] leading-tight truncate">Onboarding Call</span>
                    <span className="text-[10px] font-medium text-[#0066CC]/70 mt-auto">10:00 AM</span>
                  </div>
                </div>

                {/* Column 2: TUE */}
                <div className="relative h-full col-start-2">
                  <div className="cal-event-block absolute top-[50%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#F3F4F6] border border-gray-200 rounded-xl flex flex-col cursor-pointer hover:shadow-md transition-shadow z-20">
                    <span className="text-[12px] font-bold text-gray-700 leading-tight truncate">Admin Block</span>
                    <span className="text-[10px] font-medium text-gray-500 mt-auto">01:00 PM</span>
                  </div>
                </div>

                {/* Column 3: WED (Primary Appointment - Cute & Crisp) */}
                <div className="relative h-full col-start-3">
                  <div className="cal-event-block absolute top-[31.25%] h-[22%] left-2 right-2 p-4 bg-[var(--color-brand-blue)] rounded-2xl shadow-[0_12px_24px_rgba(53,187,253,0.3)] flex flex-col cursor-pointer hover:-translate-y-1 transition-transform z-40">
                    <div className="flex items-center gap-1.5 opacity-90 mb-1">
                       <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                       <span className="text-[10px] text-white font-bold tracking-wider">11:30 AM</span>
                    </div>
                    <span className="text-sm font-bold text-white leading-tight">Sarah Jenkins</span>
                    <span className="text-xs text-white/80 font-medium mt-0.5 truncate">Auto Fleet Review</span>
                    
                    {/* Etiquetas (Meet & Sync) */}
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      
                      {/* Google Meet Badge (Official Colors) */}
                      <div className="flex items-center gap-1.5 bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-md px-2 py-1 w-fit">
                         <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                           <path fill="#EA4335" d="M24 10.618v2.764c0 .89-.96 1.435-1.711.96l-3.233-2.04v-2.204l3.233-2.04c.751-.475 1.711.07 1.711.96z"/>
                           <path fill="#4285F4" d="M2.5 18H7V6H2.5C1.12 6 0 7.12 0 8.5v7C0 16.88 1.12 18 2.5 18z"/>
                           <path fill="#34A853" d="M19.056 12.342V18h-5v-6h5z"/>
                           <path fill="#FBBC04" d="M14.056 6v6h5V6h-5z"/>
                         </svg>
                         <span className="text-[9px] font-bold text-gray-800 tracking-wide">Google Meet</span>
                      </div>
                      
                      {/* Pipeline Sync Badge */}
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 w-fit">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                         <span className="text-[9px] font-bold text-white uppercase tracking-wider">Synced</span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Column 4: THU */}
                <div className="relative h-full col-start-4">
                  <div className="cal-event-block absolute top-[62.5%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#EAF6FF] border border-[#B3DFFF] rounded-xl flex flex-col cursor-pointer hover:shadow-md transition-shadow z-20">
                    <span className="text-[12px] font-bold text-[#0066CC] leading-tight truncate">Follow-up Call</span>
                    <span className="text-[10px] font-medium text-[#0066CC]/70 mt-auto">02:00 PM</span>
                  </div>
                </div>

                {/* Column 5: FRI */}
                <div className="relative h-full col-start-5">
                  <div className="cal-event-block absolute top-[75%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#EAF6FF] border border-[#B3DFFF] rounded-xl flex flex-col cursor-pointer hover:shadow-md transition-shadow z-20">
                    <span className="text-[12px] font-bold text-[#0066CC] leading-tight truncate">Closing Call</span>
                    <span className="text-[10px] font-medium text-[#0066CC]/70 mt-auto">03:00 PM</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

