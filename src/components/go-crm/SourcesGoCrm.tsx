"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SourcesGoCrm() {
  const [variant, setVariant] = useState<1 | 2 | 3>(1);

  // HARDCODED COPY TO BYPASS NEXT-INTL CACHE
  const copy = {
    overline: "Omnichannel Architecture",
    h2: "Data in. Deals out.",
    p1: "Social signals, direct chat, or web forms. GO CRM intercepts every origin point and instantly structures the workflow.",
    sources: ["Social Intelligence", "Direct Messaging", "Web Capture", "Inbound Voice", "Manual Injection"],
    opportunity: "Structured Pipeline"
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFFFF] text-slate-900">
      
      {/* ── DEBUG PANEL ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 p-4 rounded-xl bg-white border border-slate-200 shadow-xl backdrop-blur-xl">
        <div className="text-xs uppercase text-slate-400 mb-2 tracking-widest font-mono">Apple Clean Phase</div>
        <button onClick={() => setVariant(1)} className={`px-4 py-2 text-sm text-left rounded-sm transition-colors ${variant === 1 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          1. The Apple Watch Rings (Radial)
        </button>
        <button onClick={() => setVariant(2)} className={`px-4 py-2 text-sm text-left rounded-sm transition-colors ${variant === 2 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          2. The Floating Widgets (Parallax)
        </button>
        <button onClick={() => setVariant(3)} className={`px-4 py-2 text-sm text-left rounded-sm transition-colors ${variant === 3 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          3. The Text-Birth Wipe (Massive Type)
        </button>
      </div>

      {variant === 1 && <Variant1 copy={copy} />}
      {variant === 2 && <Variant2 copy={copy} />}
      {variant === 3 && <Variant3 copy={copy} />}

    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 1: THE APPLE WATCH RINGS (Concentric Architecture)
// ─────────────────────────────────────────────────────────────────────────────
function Variant1({ copy }: { copy: any }) {
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: comp.current,
          pin: true,
          start: "top top",
          end: "+=150%",
          scrub: 1
        }
      });

      // Draw rings
      tl.fromTo(".ring-svg circle", 
        { strokeDasharray: "1000", strokeDashoffset: "1000" },
        { strokeDashoffset: "0", stagger: 0.1, duration: 1, ease: "power2.inOut" },
        0
      );

      // Fade in text labels
      tl.fromTo(".ring-label",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
        0.5
      );

      // Final core ignition
      tl.to(".core-orb", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, 1);

    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute top-12 lg:top-24 w-full text-center z-30 px-6">
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-[var(--color-brand-blue)] mb-4">{copy.overline}</p>
        <h2 className="text-display-sm lg:text-display-md font-medium tracking-tight text-slate-900">{copy.h2}</h2>
      </div>

      <div className="relative w-[600px] h-[600px] flex items-center justify-center mt-20">
        
        {/* Concentric Rings */}
        <svg className="ring-svg absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 600 600">
          {[280, 240, 200, 160, 120].map((r, i) => (
            <circle key={i} cx="300" cy="300" r={r} fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>

        {/* Labels for rings */}
        <div className="absolute inset-0 pointer-events-none">
          {copy.sources.map((src: string, i: number) => {
            const radii = [280, 240, 200, 160, 120];
            return (
              <div key={i} className="ring-label absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: 300 - radii[i] - 10 }}>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 bg-white px-2">{src}</span>
              </div>
            );
          })}
        </div>

        {/* Core Opportunity */}
        <div className="core-orb absolute w-40 h-40 bg-[var(--color-brand-blue)] rounded-full shadow-[0_20px_50px_rgba(53,187,253,0.3)] flex flex-col items-center justify-center text-white scale-0 opacity-0 z-20">
          <span className="text-xs uppercase tracking-widest font-mono opacity-80 mb-1">Target</span>
          <span className="text-lg font-medium text-center leading-tight">Pipeline<br/>Active</span>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 2: THE FLOATING WIDGETS (Apple Vision Pro Parallax)
// ─────────────────────────────────────────────────────────────────────────────
function Variant2({ copy }: { copy: any }) {
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Free floating parallax (no pin)
      gsap.to(".widget-fast", { y: -300, ease: "none", scrollTrigger: { trigger: comp.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".widget-slow", { y: -100, ease: "none", scrollTrigger: { trigger: comp.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".widget-med", { y: -200, ease: "none", scrollTrigger: { trigger: comp.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full min-h-screen bg-[#FBFBFD] relative py-40 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 mb-32 text-center">
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-[var(--color-brand-blue)] mb-6">{copy.overline}</p>
        <h2 className="text-display-md lg:text-display-lg font-medium tracking-tight text-slate-900 leading-[1.1]">{copy.h2}</h2>
        <p className="text-body-lg text-slate-500 font-light mt-6 max-w-2xl mx-auto">{copy.p1}</p>
      </div>

      <div className="w-full h-[80vh] relative max-w-7xl mx-auto">
        
        {/* Abstract widgets floating in space */}
        <div className="widget-fast absolute top-[10%] left-[10%] w-[300px] h-[200px] bg-white/80 backdrop-blur-3xl border border-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-8 flex flex-col justify-end">
          <div className="w-12 h-12 rounded-full bg-blue-50 mb-4 flex items-center justify-center text-blue-500">01</div>
          <h3 className="text-2xl font-medium tracking-tight text-slate-800">{copy.sources[0]}</h3>
        </div>

        <div className="widget-slow absolute top-[30%] right-[15%] w-[350px] h-[250px] bg-white/80 backdrop-blur-3xl border border-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-8 flex flex-col justify-end">
          <div className="w-12 h-12 rounded-full bg-blue-50 mb-4 flex items-center justify-center text-blue-500">02</div>
          <h3 className="text-2xl font-medium tracking-tight text-slate-800">{copy.sources[1]}</h3>
        </div>

        <div className="widget-med absolute bottom-[10%] left-[25%] w-[400px] h-[150px] bg-white/80 backdrop-blur-3xl border border-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-8 flex items-center justify-between">
          <h3 className="text-2xl font-medium tracking-tight text-slate-800">{copy.sources[2]}</h3>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">03</div>
        </div>

        {/* Opportunity Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[var(--color-brand-blue)] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white border border-slate-100 rounded-full shadow-[0_30px_60px_rgba(53,187,253,0.1)] flex flex-col items-center justify-center z-10">
          <span className="text-meta uppercase font-mono tracking-widest text-[var(--color-brand-blue)] mb-2">Result</span>
          <h3 className="text-h4 font-medium tracking-tight text-slate-900 text-center px-4">{copy.opportunity}</h3>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 3: THE TEXT-BIRTH WIPE (Massive Typography Scroll)
// ─────────────────────────────────────────────────────────────────────────────
function Variant3({ copy }: { copy: any }) {
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: comp.current,
          pin: true,
          start: "top top",
          end: "+=300%",
          scrub: 1
        }
      });

      const words = gsap.utils.toArray(".wipe-word") as HTMLElement[];
      words.forEach((word, i) => {
        // Word wipes in from below (clip-path reveal)
        tl.fromTo(word,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 50 },
          { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", y: 0, duration: 1, ease: "power3.inOut" }
        );
        // Word wipes out to the top
        if (i < words.length - 1) {
          tl.to(word,
            { clipPath: "polygon(0 0%, 100% 0%, 100% 0%, 0 0%)", y: -50, duration: 1, ease: "power3.inOut" }
          );
        }
      });

    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute top-12 w-full text-center z-30">
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-slate-400 mb-2">{copy.h2}</p>
      </div>

      <div className="relative w-full h-[300px] flex items-center justify-center">
        {[...copy.sources, copy.opportunity].map((text: string, i: number) => {
          const isLast = i === copy.sources.length;
          return (
            <div key={i} className="wipe-word absolute inset-0 flex items-center justify-center w-full h-full">
              <h3 className={`text-[6rem] lg:text-[10rem] font-medium tracking-tighter leading-none text-center ${isLast ? 'text-[var(--color-brand-blue)]' : 'text-slate-900'}`}>
                {text}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-12 w-full text-center z-30">
        <p className="text-meta font-mono tracking-widest text-slate-300">Scroll to process</p>
      </div>

    </div>
  );
}
