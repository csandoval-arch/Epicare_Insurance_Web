"use client";

import React from "react";
import Image from "next/image";
import { Shield, FileText, Phone, Circle, HandHeart, House, Car } from "@phosphor-icons/react";

export default function ProspectsComposition() {
  return (
    <div className="relative w-full h-full min-h-[900px] bg-[#0F1113] overflow-hidden font-display flex items-center justify-center">
      {/* Decorative Grid (Invisible, just for structure reference internally, but not rendered visibly as per prompt) */}
      
      {/* Connection: Maria to Juan (Rounded Corner via CSS) */}
      <div 
        className="absolute top-[25%] right-[calc(2%+140px)] bottom-[calc(25%+248px)] border-t border-r border-[var(--color-border-Strokes-Hover)] rounded-tr-[12px] z-0 pointer-events-none"
        style={{ left: "calc(90% - 100px)" }}
      />
      {/* Start Dot (Maria Right Edge + Gap) */}
      <div 
        className="absolute top-[25%] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[var(--color-border-Strokes-Hover)] z-20 pointer-events-none" 
        style={{ left: "calc(90% - 100px)" }}
      />
      {/* End Dot (Juan Top Edge + Gap - Blue) */}
      <div className="absolute bottom-[calc(25%+248px)] right-[calc(2%+140px)] w-1.5 h-1.5 -mr-[3px] -mb-[3px] rounded-full bg-[#49B4E9] shadow-[0_0_8px_rgba(73,180,233,0.8)] z-20 pointer-events-none" />

      {/* Connection: Carlos to Maria */}
      <div 
        className="absolute border-b border-r border-[var(--color-border-Strokes-Hover)] rounded-br-[12px] z-0 pointer-events-none"
        style={{
          left: "calc(35% + 192px)",
          right: "calc(10% + 237px)",
          bottom: "calc(10% + 181px)",
          top: "calc(8% + 382px)",
        }}
      />
      {/* Start Dot (Carlos Right Edge + Gap) */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-border-Strokes-Hover)] z-20 pointer-events-none"
        style={{
          left: "calc(35% + 192px - 3px)",
          bottom: "calc(10% + 181px - 3px)",
        }}
      />
      {/* End Dot (Maria Bottom Edge + Gap - Blue) */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full bg-[#49B4E9] shadow-[0_0_8px_rgba(73,180,233,0.8)] z-[60] pointer-events-none"
        style={{
          right: "calc(10% + 237px - 3px)",
          top: "calc(8% + 382px - 3px)",
        }}
      />

      {/* Connection: Maria to Andrea */}
      <div 
        className="absolute border-t border-l border-[var(--color-border-Strokes-Hover)] rounded-tl-[12px] z-0 pointer-events-none"
        style={{
          top: "calc(8% + 185px)",
          bottom: "calc(65% + 12px)",
          right: "calc(10% + 374px)",
          left: "calc(8% + 105px)",
        }}
      />
      {/* Start Dot (Maria Left Edge + Gap) */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-border-Strokes-Hover)] z-20 pointer-events-none"
        style={{
          top: "calc(8% + 185px - 3px)",
          right: "calc(10% + 374px - 3px)",
        }}
      />
      {/* End Dot (Andrea Top Edge + Gap - Blue) */}
      <div 
        className="absolute w-1.5 h-1.5 rounded-full bg-[#49B4E9] shadow-[0_0_8px_rgba(73,180,233,0.8)] z-20 pointer-events-none"
        style={{
          bottom: "calc(65% + 12px - 3px)",
          left: "calc(8% + 105px - 3px)",
        }}
      />

      {/* 1. Primary Prospect (Upper Center/Right) */}
      <div className="absolute top-[8%] right-[10%] mr-[112px] w-[250px] flex flex-col bg-[#202122] border border-[#2D2D2E] rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden z-50 transition-transform hover:-translate-y-1 duration-500">
        <div className="relative w-full h-[190px]">
          <div className="absolute top-3 left-3 bg-[#1A1E21]/80 backdrop-blur-md border border-white/10 rounded-md px-2.5 py-1 z-10 shadow-lg">
            <p className="text-[#49B4E9] text-xs font-bold">$2,850 <span className="text-[#A3A5A8] text-[10px] font-normal">/ año</span></p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
            alt="María López"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[#E8ECEF] text-lg font-medium tracking-tight">María López</h4>
            <HandHeart size={18} weight="fill" className="text-[#49B4E9]" />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[#A3A5A8] text-xs">
            <Shield size={12} weight="regular" />
            <span>Seguro de vida</span>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#2D2D2E]/50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Circle size={6} weight="fill" className="text-[#49B4E9]" />
              <span className="text-[#49B4E9] text-[10px] uppercase tracking-wider font-medium">Cotizado</span>
            </div>
            <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[#E8ECEF] text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-lg py-2 transition-colors cursor-pointer">
              <FileText size={14} weight="regular" />
              <span>Enviar documentos</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Secondary Prospect (Left, partially entering) */}
      <div className="absolute top-[35%] left-[8%] w-[210px] flex flex-col bg-[#262627] border border-[#2D2D2E] rounded-[12px] shadow-[0_15px_30px_rgba(0,0,0,0.3)] overflow-hidden z-10 transition-transform hover:-translate-y-1 duration-500">
        <div className="relative w-full h-[150px]">
          <div className="absolute top-2.5 left-2.5 bg-[#1A1E21]/80 backdrop-blur-md border border-white/10 rounded-md px-2 py-0.5 z-10 shadow-md">
            <p className="text-[#E8ECEF] text-[11px] font-bold">$1,680 <span className="text-[#A3A5A8] text-[9px] font-normal">/ año</span></p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
            alt="Andrea Torres"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[#E8ECEF] text-base font-medium tracking-tight">Andrea Torres</h4>
            <House size={16} weight="fill" className="text-[#49B4E9]" />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[#A3A5A8] text-[11px]">
            <Shield size={12} weight="regular" />
            <span>Seguro de hogar</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[#2D2D2E]/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Circle size={6} weight="fill" className="text-[#49B4E9]" />
              <span className="text-[#49B4E9] text-[9px] uppercase tracking-wider font-medium">Solicitud enviada</span>
            </div>
            <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[#E8ECEF] text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-md py-1.5 transition-colors cursor-pointer">
              <FileText size={12} weight="regular" />
              <span>Revisar solicitud</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Secondary Prospect (Lower Center) */}
      <div className="absolute bottom-[calc(10%+52px)] left-[35%] w-[180px] flex flex-col bg-[#202122] border border-[#2D2D2E] rounded-[12px] shadow-[0_10px_25px_rgba(0,0,0,0.3)] overflow-hidden z-20 transition-transform hover:-translate-y-1 duration-500">
        <div className="relative w-full h-[120px]">
          <div className="absolute top-2 left-2 bg-[#1A1E21]/80 backdrop-blur-md border border-white/10 rounded-[4px] px-1.5 py-0.5 z-10 shadow-sm">
            <p className="text-[#E8ECEF] text-[10px] font-bold">$1,240 <span className="text-[#A3A5A8] text-[8px] font-normal">/ año</span></p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
            alt="Carlos Ramírez"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="p-3.5 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[#E8ECEF] text-sm font-medium tracking-tight">Carlos Ramírez</h4>
            <Car size={14} weight="fill" className="text-[#49B4E9]" />
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[#A3A5A8] text-[10px]">
            <Shield size={10} weight="regular" />
            <span>Seguro de auto</span>
          </div>
          
          <div className="mt-2.5 pt-2.5 border-t border-[#2D2D2E]/50">
            <div className="flex items-center gap-1 mb-1">
              <Circle size={6} weight="fill" className="text-[#34D399]" />
              <span className="text-[#34D399] text-[9px] uppercase tracking-wider font-medium">En contacto</span>
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-1.5 text-[#E8ECEF] text-[10px] font-medium bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-md py-1.5 transition-colors cursor-pointer">
              <Phone size={12} weight="regular" />
              <span>Llamar al cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Secondary Prospect (Lower Right Vertical) */}
      <div className="absolute bottom-[25%] right-[2%] mr-[60px] w-[160px] flex flex-col bg-[#262627] border border-[#2D2D2E] rounded-[12px] shadow-[0_15px_30px_rgba(0,0,0,0.4)] overflow-hidden z-10 transition-transform hover:-translate-y-1 duration-500">
        <div className="relative w-full h-[110px]">
          <div className="absolute top-2 left-2 bg-[#1A1E21]/80 backdrop-blur-md border border-white/10 rounded-[4px] px-1.5 py-0.5 z-10 shadow-sm">
            <p className="text-[#E8ECEF] text-[9px] font-bold">$2,430 <span className="text-[#A3A5A8] text-[7px] font-normal">/ año</span></p>
          </div>
          <Image 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
            alt="Juan Martínez"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="p-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[#E8ECEF] text-xs font-medium tracking-tight">Juan Martínez</h4>
            <div className="flex gap-0.5">
              <Car size={12} weight="fill" className="text-[#49B4E9]" />
              <House size={12} weight="fill" className="text-[#49B4E9]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[#A3A5A8] text-[9px]">
            <Shield size={10} weight="regular" />
            <span>Auto + hogar</span>
          </div>
          
          <div className="mt-2.5 pt-2.5 border-t border-[#2D2D2E]/50">
            <div className="flex items-center gap-1 mb-1">
              <Circle size={6} weight="fill" className="text-[#FB923C]" />
              <span className="text-[#FB923C] text-[7px] uppercase tracking-wider leading-tight font-medium">Esperando doc.</span>
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-1 text-[#E8ECEF] text-[9px] font-medium bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-md py-1.5 transition-colors cursor-pointer">
              <FileText size={10} weight="regular" />
              <span>Solicitar doc.</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
