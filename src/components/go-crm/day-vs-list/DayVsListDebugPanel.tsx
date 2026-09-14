"use client";

import React from "react";
import { DayVsListConcept } from "./types";

interface Props {
  activeConcept: DayVsListConcept;
  setConcept: (concept: DayVsListConcept) => void;
}

export default function DayVsListDebugPanel({ activeConcept, setConcept }: Props) {
  const concepts: { id: DayVsListConcept; label: string; desc: string }[] = [
    { 
      id: "glass-canvas", 
      label: "A. Apple Bento Box", 
      desc: "Adiós al split-screen. Un grid tipo Bento hermoso y estático. Texto súper resumido."
    },
    { 
      id: "liquid-reveal", 
      label: "B. Locomotive Accordion", 
      desc: "Acordeón vertical fluido a pantalla completa. Layout muy limpio y editorial."
    },
    { 
      id: "diegetic-sandwich", 
      label: "C. The Stacking Cards", 
      desc: "Tarjetas gigantes (cada una es un mockup de UI) que se apilan unas sobre otras al scrollear."
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 max-w-sm font-sans text-black">
      <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">
        Cinematic Lab: S5
      </div>
      <div className="flex flex-col gap-2">
        {concepts.map((c) => (
          <button
            key={c.id}
            onClick={() => setConcept(c.id)}
            className={`text-left p-3 rounded-xl transition-all ${
              activeConcept === c.id 
                ? "bg-blue-50 border border-blue-200 shadow-sm" 
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            <div className={`font-semibold text-sm ${activeConcept === c.id ? "text-blue-600" : "text-gray-700"}`}>
              {c.label}
            </div>
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
              {c.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
