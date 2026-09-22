"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function SlideCalendar() {
  const t = useTranslations("goCrm.calendar");

  return (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex flex-col relative z-10 scale-90 md:scale-100 origin-center bg-white rounded-[2rem] shadow-elevation-5 overflow-hidden border border-[var(--color-border-Strokes-default)]">
      {/* ── HEADER ── */}
      <div className="w-full px-8 pt-8 pb-6 bg-[#FAFAFA] border-b border-gray-100 flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar Sync</h3>
          <p className="text-gray-500 font-medium mt-1">Citas agendadas y eventos automáticos</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      {/* ── DAYS HEADER ── */}
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

      {/* ── TIMELINE BODY ── */}
      <div className="w-full flex-1 flex relative bg-[#FAFAFA] min-h-[450px]">
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
                  {i === 2 && <div className="absolute inset-0 bg-[#F0F9FF]/30" />}
              </div>
            ))}
          </div>

          {/* EVENTS */}
          <div className="absolute inset-0 grid grid-cols-5">
            <div className="relative h-full col-start-1">
              <div className="absolute top-[12.5%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#EAF6FF] border border-[#B3DFFF] rounded-xl flex flex-col z-20">
                <span className="text-[12px] font-bold text-[#0066CC] leading-tight truncate">Onboarding Call</span>
                <span className="text-[10px] font-medium text-[#0066CC]/70 mt-auto">10:00 AM</span>
              </div>
            </div>
            <div className="relative h-full col-start-2">
              <div className="absolute top-[50%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#F3F4F6] border border-gray-200 rounded-xl flex flex-col z-20">
                <span className="text-[12px] font-bold text-gray-700 leading-tight truncate">Admin Block</span>
                <span className="text-[10px] font-medium text-gray-500 mt-auto">01:00 PM</span>
              </div>
            </div>
            <div className="relative h-full col-start-3">
              <div className="absolute top-[31.25%] h-[22%] left-2 right-2 p-4 bg-[var(--color-brand-blue)] rounded-2xl shadow-[0_12px_24px_rgba(53,187,253,0.3)] flex flex-col z-40">
                <div className="flex items-center gap-1.5 opacity-90 mb-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] text-white font-bold tracking-wider">11:30 AM</span>
                </div>
                <span className="text-sm font-bold text-white leading-tight">Sarah Jenkins</span>
                <span className="text-xs text-white/80 font-medium mt-0.5 truncate">Auto Fleet Review</span>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white rounded-md px-2 py-1 w-fit">
                      <span className="text-[9px] font-bold text-gray-800 tracking-wide">Google Meet</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-full col-start-4">
              <div className="absolute top-[62.5%] h-[12.5%] left-2 right-2 px-3 py-2 bg-[#EAF6FF] border border-[#B3DFFF] rounded-xl flex flex-col z-20">
                <span className="text-[12px] font-bold text-[#0066CC] leading-tight truncate">Follow-up Call</span>
                <span className="text-[10px] font-medium text-[#0066CC]/70 mt-auto">02:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
