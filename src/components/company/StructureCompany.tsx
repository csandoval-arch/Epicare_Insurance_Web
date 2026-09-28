"use client";

import React from "react";
import { asset } from "@/lib/asset";

export default function StructureCompany() {
  
  // Renderizado dual para invertir el color del texto perfectamente sobre la imagen al 50%
  const TextContent = () => (
    <div className="w-full h-full flex flex-col pt-[12vh] pb-[8vh]">
      <div className="w-full px-[96px] grid grid-cols-12 gap-x-[24px]">
        
        {/* Main Text Block (Col 4, Span 6) */}
        <div className="col-start-4 col-end-10 flex flex-col w-full text-left">
          <div className="flex items-center gap-4 mb-6 opacity-80">
            <div className="w-2 h-2 bg-current rounded-full" />
            <span className="text-[13px] font-semibold tracking-[0.1em] uppercase">
              The Epicare standard behind every product.
            </span>
          </div>
          <h2 className="text-[clamp(1.5rem,2.2vw,3rem)] leading-[1.3] font-semibold tracking-tight">
            Epicare Insurance Corp is the parent company. Everything else is a product or platform it operates. Each has its own audience, but they all share the same DNA.
          </h2>
        </div>

      </div>
      
      {/* Bottom Tag */}
      <div className="w-full px-[96px] mt-auto grid grid-cols-12">
        <div className="col-start-4 col-end-10 flex justify-center opacity-50">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em]">
            Clarity · Control · Confidence
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full h-screen bg-[#F1EEE5] overflow-hidden z-20 flex flex-col">
      
      {/* 1. BASE LAYER: Dark text on light background */}
      <div className="absolute inset-0 w-full h-full z-0 text-[#111111]">
        <TextContent />
      </div>

      {/* 2. STATIC MASK LAYER: Image + Pure White Text */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ clipPath: "inset(50% 0% 0% 0%)" }}>
        
        <img 
          src={asset("/Files/company_structure_arch.jpg")} 
          alt="Epicare Structural Foundation" 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125"
        />
        
        <div className="absolute inset-0 w-full h-full z-20 text-white pointer-events-none">
          <TextContent />
        </div>

      </div>

    </section>
  );
}
