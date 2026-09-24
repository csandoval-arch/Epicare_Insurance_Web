"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderEpicare from "./HeaderEpicare";
import { asset } from "@/lib/asset";

export default function HeroEpicare() {
  const t = useTranslations("landingV2.hero");
  const containerRef = useRef<HTMLElement>(null);
  const [isHeaderPill, setIsHeaderPill] = useState(false);

  // Debugger States
  const [showDebug, setShowDebug] = useState(false);
  const [useVideo, setUseVideo] = useState(false);

  // Blue Field Polygon Points
  const [bTL, setBTL] = useState(55);
  const [bTR, setBTR] = useState(88);
  const [bBR, setBBR] = useState(58);
  const [bBL, setBBL] = useState(25);

  // Media Field Polygon Points
  const [iTL, setITL] = useState(75);
  const [iTR, setITR] = useState(100);
  const [iBR, setIBR] = useState(100);
  const [iBL, setIBL] = useState(35);

  // Media Transforms
  const [vScale, setVScale] = useState(1);
  const [vPosX, setVPosX] = useState(50);
  const [vPosY, setVPosY] = useState(30);

  // Blue Field Media States
  const [blueMedia, setBlueMedia] = useState<"color" | "image" | "video">("color");
  const [bVScale, setBVScale] = useState(1);
  const [bVPosX, setBVPosX] = useState(50);
  const [bVPosY, setBVPosY] = useState(50);
  const [bOverlay, setBOverlay] = useState(100);

  // Draggable Panel States
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });
  const panelOrigin = useRef({ x: 0, y: 0 });

  // CTA Positioning States
  const [c1Left, setC1Left] = useState(8.5);
  const [c1Bot, setC1Bot] = useState(8);
  const [c2Left, setC2Left] = useState(72.5);
  const [c2Bot, setC2Bot] = useState(8);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPanelOffset({
        x: panelOrigin.current.x + (e.clientX - dragOrigin.current.x),
        y: panelOrigin.current.y + (e.clientY - dragOrigin.current.y),
      });
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    panelOrigin.current = { ...panelOffset };
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "bottom top+=150",
        onEnter: () => setIsHeaderPill(true),
        onLeaveBack: () => setIsHeaderPill(false),
      });
    });
    return () => ctx.revert();
  }, []);

  // Shared typography block to ensure pixel-perfect overlap between the dark and white text layers
  const HeroText = ({ className = "" }: { className?: string }) => (
    <div className={`absolute left-[100px] md:left-[120px] top-[130px] md:top-[160px] flex flex-col items-start ${className}`}>
      <h1 className="text-[clamp(50px,8.5vw,135px)] font-bold uppercase tracking-tighter leading-[0.82] md:ml-[8.33vw]">
        CONSTRUIMOS
      </h1>
      <div className="mt-4 md:mt-6 flex flex-col items-start gap-0 pl-0 md:pl-[8.33vw]">
        <h2 className="text-[clamp(32px,4.5vw,75px)] font-normal tracking-[-0.03em] leading-[0.95]">
          el puente que nadie
        </h2>
        <h2 className="text-[clamp(32px,4.5vw,75px)] font-normal tracking-[-0.03em] leading-[0.95]">
          quiso construir, y
        </h2>
        <h2 className="text-[clamp(32px,4.5vw,75px)] font-normal tracking-[-0.03em] leading-[0.95]">
          seguimos
        </h2>
        <h2 className="text-[clamp(32px,4.5vw,75px)] font-normal tracking-[-0.03em] leading-[0.95]">
          construyendo.
        </h2>
      </div>
    </div>
  );

  return (
    <>
      <HeaderEpicare isHeaderPill={isHeaderPill} isHeaderForcedDark={false} scrollSafeZone={150} />
      
      <section 
        ref={containerRef} 
        className="relative w-full h-[100dvh] min-h-[800px] bg-[#F1EEE5] text-[#151617] overflow-hidden font-display"
      >
        {/* =========================================================
            LAYER 0: BASE TEXT (DARK)
            ========================================================= */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HeroText className="text-[#151617]" />
          
          {/* Left Rail: Vertical Texts */}
          <div className="absolute top-[160px] bottom-[100px] left-0 w-[80px] hidden md:flex flex-col justify-between items-center pointer-events-none text-[#151617]">
            {/* Vertical Brand Label */}
            <span 
              className="text-[16px] md:text-[18px] font-bold tracking-[0.2em] uppercase"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {t("brandLabel")}
            </span>

            {/* Vertical Supporting Copy */}
            <p 
              className="text-[10px] md:text-[11px] font-mono leading-relaxed opacity-90 max-h-[220px]"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {t("supportingCopy")}
            </p>
          </div>


        </div>

        {/* =========================================================
            LAYER 10: ARCHITECTURAL IMAGE / VIDEO
            ========================================================= */}
        <div 
          className="absolute inset-0 z-40 pointer-events-none"
          style={{ clipPath: `polygon(${iTL}% 0%, ${iTR}% 0%, ${iBR}% 100%, ${iBL}% 100%)` }}
        >
          {useVideo ? (
            <video
              autoPlay loop muted playsInline preload="metadata"
              poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")}
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 grayscale -z-10"
              style={{ objectPosition: `${vPosX}% ${vPosY}%`, transform: `scale(${vScale})` }}
            >
              <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={asset("/Files/Epicare_Landing/Hero/bridge.webp")} 
              alt="Structural Bridge"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 mix-blend-multiply -z-10" 
              style={{ objectPosition: `${vPosX}% ${vPosY}%`, transform: `scale(${vScale})` }}
            />
          )}

          {/* Duplicated text for exact pixel overlap inversion over the video */}
          <HeroText className="text-[#F1EEE5] relative z-10" />
        </div>



        {/* =========================================================
            LAYER 30: BLUE FIELD & INVERTED TEXT (WHITE)
            ========================================================= */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ clipPath: `polygon(${bTL}% 0%, ${bTR}% 0%, ${bBR}% 100%, ${bBL}% 100%)` }}
        >
          {/* Blue Media Layer */}
          {blueMedia === "video" && (
            <video
              autoPlay loop muted playsInline preload="metadata"
              poster={asset("/Files/Epicare_Landing/Hero/posters/Hero_02.webp")}
              className="absolute inset-0 w-full h-full object-cover -z-10"
              style={{ objectPosition: `${bVPosX}% ${bVPosY}%`, transform: `scale(${bVScale})` }}
            >
              <source src={asset("/Files/Epicare_Landing/Hero/Hero_02.mp4")} type="video/mp4" />
            </video>
          )}
          {blueMedia === "image" && (
            <img 
              src={asset("/Files/Epicare_Landing/Hero/bridge.webp")} 
              alt="Bridge"
              className="absolute inset-0 w-full h-full object-cover -z-10"
              style={{ objectPosition: `${bVPosX}% ${bVPosY}%`, transform: `scale(${bVScale})` }}
            />
          )}

          {/* Blue Tint Overlay (allows mixing color with media) */}
          <div className="absolute inset-0 bg-[#327BA5] -z-05" style={{ opacity: bOverlay / 100 }} />
          
          {/* Duplicated text for exact pixel overlap inversion */}
          <HeroText className="text-[#F1EEE5] relative z-10" />


        </div>

        {/* =========================================================
            LAYER 50: ARCHITECTURAL GRID LINES & MARKERS
            ========================================================= */}
        <div className="absolute inset-0 z-50 pointer-events-none mix-blend-difference opacity-30 text-[#F1EEE5]">
          {/* Horizontal Lines */}
          <div className="absolute top-[100px] left-0 right-0 border-t border-current" />
          <div className="absolute bottom-[100px] left-0 right-0 border-t border-current" />
          
          {/* Vertical Lines */}
          <div className="absolute top-0 bottom-0 left-[80px] border-l border-current hidden md:block" />
          <div className="absolute top-0 bottom-0 left-[32%] border-l border-current hidden md:block" />
          <div className="absolute top-0 bottom-0 left-[72%] border-l border-current hidden md:block" />

          {/* Corner / Intersection Markers */}
          <span className="absolute bottom-[105px] left-[85px] text-[10px] font-mono">R2</span>
          <span className="absolute bottom-[105px] left-[32.5%] text-[10px] font-mono">R2</span>
          <span className="absolute bottom-[105px] left-[72.5%] text-[10px] font-mono">R3</span>
        </div>

        {/* =========================================================
            LAYER 90: CTAs (Always on top)
            ========================================================= */}
        <div className="absolute inset-0 z-[90] pointer-events-none">
          {/* Primary CTA */}
          <div 
            className="absolute pointer-events-auto"
            style={{ left: `${c1Left}%`, bottom: `${c1Bot}%` }}
          >
            <Link 
              href="/contrato" 
              className="group inline-flex items-center justify-center px-8 py-3 md:py-4 border border-[#151617] text-[#151617] text-[13px] md:text-[15px] uppercase tracking-widest font-bold bg-[#F1EEE5]/40 backdrop-blur-md hover:bg-[#151617] hover:text-[#F1EEE5] transition-all duration-500 ease-out hover:-translate-y-1"
            >
              {t("ctaPrimary")}
            </Link>
          </div>

          {/* Secondary CTA */}
          <div 
            className="absolute pointer-events-auto"
            style={{ left: `${c2Left}%`, bottom: `${c2Bot}%` }}
          >
            <Link 
              href="/go-ams" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-3 md:py-4 border border-[#F1EEE5] text-[#F1EEE5] text-[13px] md:text-[15px] uppercase tracking-widest font-bold bg-[#151617]/20 backdrop-blur-md hover:bg-[#F1EEE5] hover:text-[#151617] transition-all duration-500 ease-out hover:-translate-y-1"
            >
              {t("ctaSecondary")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

      </section>

      {/* =========================================================
          DEBUG PANEL
          ========================================================= */}
      {showDebug && (
        <div 
          className="fixed z-[9999] bg-[#151617]/95 backdrop-blur-md text-[#F1EEE5] p-5 rounded-lg shadow-2xl w-[340px] font-mono text-[11px] flex flex-col gap-3 overflow-y-auto max-h-[85vh] border border-white/10"
          style={{
            right: '16px',
            top: '96px',
            transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)`
          }}
        >
          <div 
            className="flex justify-between items-center border-b border-white/10 pb-2 cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <h3 className="font-bold text-[14px]">Debugger (Drag Me) ✥</h3>
            <button onClick={() => setShowDebug(false)} className="text-red-400 hover:text-red-300 pointer-events-auto">Close</button>
          </div>

          <div className="flex flex-col gap-1 py-1">
            <span className="font-bold text-gray-300">Right Block Media</span>
            <button 
              onClick={() => setUseVideo(!useVideo)}
              className="bg-white/10 px-3 py-1 rounded text-white font-bold hover:bg-white/20 w-full"
            >
              {useVideo ? "Switch to IMAGE" : "Switch to VIDEO"}
            </button>
          </div>

          <hr className="border-white/10" />

          <div className="font-bold text-blue-300 mt-1">Blue Field Media</div>
          <div className="flex gap-2">
            <button onClick={() => setBlueMedia("color")} className={`flex-1 py-1 rounded ${blueMedia === 'color' ? 'bg-[#327BA5]' : 'bg-white/10'}`}>Solid</button>
            <button onClick={() => setBlueMedia("image")} className={`flex-1 py-1 rounded ${blueMedia === 'image' ? 'bg-[#327BA5]' : 'bg-white/10'}`}>Image</button>
            <button onClick={() => setBlueMedia("video")} className={`flex-1 py-1 rounded ${blueMedia === 'video' ? 'bg-[#327BA5]' : 'bg-white/10'}`}>Video</button>
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>Blue Tint Opacity</span> <span>{bOverlay}%</span></label>
            <input type="range" min="0" max="100" step="1" value={bOverlay} onChange={e => setBOverlay(Number(e.target.value))} className="w-full" />
          </div>

          {(blueMedia === 'image' || blueMedia === 'video') && (
            <div className="flex flex-col gap-1 bg-white/5 p-2 rounded">
              <div><label className="flex justify-between mb-1"><span>Scale</span> <span>{bVScale.toFixed(2)}</span></label><input type="range" min="0.5" max="3" step="0.05" value={bVScale} onChange={e => setBVScale(Number(e.target.value))} className="w-full" /></div>
              <div><label className="flex justify-between mb-1"><span>Pos X (%)</span> <span>{bVPosX}%</span></label><input type="range" min="0" max="100" step="1" value={bVPosX} onChange={e => setBVPosX(Number(e.target.value))} className="w-full" /></div>
              <div><label className="flex justify-between mb-1"><span>Pos Y (%)</span> <span>{bVPosY}%</span></label><input type="range" min="0" max="100" step="1" value={bVPosY} onChange={e => setBVPosY(Number(e.target.value))} className="w-full" /></div>
            </div>
          )}

          <hr className="border-white/10" />

          <div className="font-bold text-blue-300 mt-1">Blue Field Polygon</div>
          {[
            { l: "Top Left X (%)", v: bTL, s: setBTL },
            { l: "Top Right X (%)", v: bTR, s: setBTR },
            { l: "Bottom Right X (%)", v: bBR, s: setBBR },
            { l: "Bottom Left X (%)", v: bBL, s: setBBL }
          ].map((item, i) => (
            <div key={i}>
              <label className="flex justify-between mb-1"><span>{item.l}</span> <span>{item.v.toFixed(1)}%</span></label>
              <input type="range" min="-20" max="120" step="0.5" value={item.v} onChange={e => item.s(Number(e.target.value))} className="w-full" />
            </div>
          ))}

          <hr className="border-white/10 my-1" />

          <div className="font-bold text-gray-300">Right Block Polygon</div>
          {[
            { l: "Top Left X (%)", v: iTL, s: setITL },
            { l: "Top Right X (%)", v: iTR, s: setITR },
            { l: "Bottom Right X (%)", v: iBR, s: setIBR },
            { l: "Bottom Left X (%)", v: iBL, s: setIBL }
          ].map((item, i) => (
            <div key={i}>
              <label className="flex justify-between mb-1"><span>{item.l}</span> <span>{item.v.toFixed(1)}%</span></label>
              <input type="range" min="-20" max="120" step="0.5" value={item.v} onChange={e => item.s(Number(e.target.value))} className="w-full" />
            </div>
          ))}

          <hr className="border-white/10 my-1" />

          <div className="font-bold text-gray-300">Right Block Transform</div>
          <div>
            <label className="flex justify-between mb-1"><span>Scale</span> <span>{vScale.toFixed(2)}</span></label>
            <input type="range" min="0.5" max="3" step="0.05" value={vScale} onChange={e => setVScale(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>Object Pos X (%)</span> <span>{vPosX}%</span></label>
            <input type="range" min="0" max="100" step="1" value={vPosX} onChange={e => setVPosX(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>Object Pos Y (%)</span> <span>{vPosY}%</span></label>
            <input type="range" min="0" max="100" step="1" value={vPosY} onChange={e => setVPosY(Number(e.target.value))} className="w-full" />
          </div>

          <hr className="border-white/10 my-1" />

          <div className="font-bold text-green-300">CTA Positioning</div>
          <div>
            <label className="flex justify-between mb-1"><span>CTA 1 Left (%)</span> <span>{c1Left}%</span></label>
            <input type="range" min="0" max="100" step="0.5" value={c1Left} onChange={e => setC1Left(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>CTA 1 Bottom (%)</span> <span>{c1Bot}%</span></label>
            <input type="range" min="0" max="100" step="0.5" value={c1Bot} onChange={e => setC1Bot(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>CTA 2 Left (%)</span> <span>{c2Left}%</span></label>
            <input type="range" min="0" max="100" step="0.5" value={c2Left} onChange={e => setC2Left(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="flex justify-between mb-1"><span>CTA 2 Bottom (%)</span> <span>{c2Bot}%</span></label>
            <input type="range" min="0" max="100" step="0.5" value={c2Bot} onChange={e => setC2Bot(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
      {!showDebug && (
        <button 
          onClick={() => setShowDebug(true)} 
          className="fixed bottom-4 right-4 bg-[#151617] text-[#F1EEE5] px-4 py-2 rounded-full shadow-lg z-[9999] text-xs font-mono font-bold hover:bg-[#327BA5] transition-colors"
        >
          [+] Open Debugger
        </button>
      )}
    </>
  );
}
