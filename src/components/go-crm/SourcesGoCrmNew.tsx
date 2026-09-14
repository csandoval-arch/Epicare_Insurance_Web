"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SourcesGoCrmNew() {
  const [variant, setVariant] = useState<1 | 2 | 3>(1);

  // HARDCODED NEW COPY (Bust the JSON cache)
  const copy = {
    overline: "Omnichannel Architecture",
    h2: "Data in. Deals out.",
    p1: "Social signals, direct chat, or web forms. GO CRM intercepts every origin point and instantly structures the workflow.",
    sources: ["Social Intelligence", "Direct Messaging", "Web Capture", "Inbound Voice", "Manual Injection"],
    opportunity: "Structured Pipeline"
  };

  return (
    <section className="relative w-full overflow-hidden bg-white text-slate-900">
      
      {/* ── DEBUG PANEL ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 p-4 bg-white border border-slate-200 shadow-xl backdrop-blur-xl rounded-none">
        <div className="text-xs uppercase text-slate-400 mb-2 tracking-widest font-mono">No-Circle Phase (Cache Busted)</div>
        <button onClick={() => setVariant(1)} className={`px-4 py-2 text-sm text-left transition-colors rounded-none ${variant === 1 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          1. The Monolith Slices
        </button>
        <button onClick={() => setVariant(2)} className={`px-4 py-2 text-sm text-left transition-colors rounded-none ${variant === 2 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          2. The Sharp Bento Grid
        </button>
        <button onClick={() => setVariant(3)} className={`px-4 py-2 text-sm text-left transition-colors rounded-none ${variant === 3 ? 'bg-black text-white' : 'hover:bg-slate-100 text-slate-800'}`}>
          3. The Cascading Planes
        </button>
      </div>

      {variant === 1 && <Variant1 copy={copy} />}
      {variant === 2 && <Variant2 copy={copy} />}
      {variant === 3 && <Variant3 copy={copy} />}

    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 1: THE MONOLITH SLICES (Apple-style vertical breakup, zero circles)
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

      // The monolith breaks apart vertically
      const slices = gsap.utils.toArray(".monolith-slice") as HTMLElement[];
      slices.forEach((slice, i) => {
        const offset = (i - Math.floor(slices.length / 2)) * 120; // Spread out
        tl.to(slice, {
          y: offset,
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          borderColor: "#e2e8f0",
          backgroundColor: "#ffffff",
          duration: 1,
          ease: "power2.inOut"
        }, 0);

        // Text inside fades in
        tl.to(slice.querySelector(".slice-text"), {
          opacity: 1,
          duration: 0.5
        }, 0.5);
      });

      // The Opportunity Block drops in
      tl.fromTo(".opportunity-block", 
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1, ease: "power3.out" },
        0.5
      );

    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute top-16 w-full text-center z-30 px-6">
        <h2 className="text-display-md font-medium tracking-tight text-slate-900">{copy.h2}</h2>
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-slate-400 mt-4">{copy.overline}</p>
      </div>

      {/* The Monolith */}
      <div className="relative w-full max-w-2xl h-[400px] flex flex-col items-center justify-center mt-20 z-20">
        {copy.sources.map((src: string, i: number) => (
          <div key={i} className="monolith-slice absolute w-full h-[80px] bg-slate-900 border-b border-slate-800 flex items-center justify-center shadow-2xl overflow-hidden rounded-none">
            <span className="slice-text opacity-0 text-2xl font-medium tracking-tight text-slate-900">{src}</span>
          </div>
        ))}
      </div>

      <div className="opportunity-block absolute bottom-12 w-full max-w-2xl h-[100px] bg-[var(--color-brand-blue)] flex items-center justify-between px-12 z-10 origin-bottom rounded-none shadow-[0_20px_50px_rgba(53,187,253,0.3)]">
        <span className="text-white text-meta uppercase tracking-widest font-mono">Result</span>
        <span className="text-white text-3xl font-medium tracking-tight">{copy.opportunity}</span>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 2: THE SHARP BENTO GRID (Stripe/Vercel standard, zero circles)
// ─────────────────────────────────────────────────────────────────────────────
function Variant2({ copy }: { copy: any }) {
  const comp = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".sharp-bento", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: comp.current,
          start: "top 70%"
        }
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full min-h-screen bg-white relative py-40 flex flex-col items-center">
      
      <div className="max-w-4xl mx-auto text-center px-6 mb-24">
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-[var(--color-brand-blue)] mb-6">{copy.overline}</p>
        <h2 className="text-display-md lg:text-display-lg font-medium tracking-tight text-slate-900 leading-[1.1] mb-6">{copy.h2}</h2>
        <p className="text-body-lg text-slate-500 font-light max-w-2xl mx-auto">{copy.p1}</p>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {/* Using gap-1 with background color to create 1px borders instantly (Swiss/Vercel style) */}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-slate-200 p-[1px]">
          
          {copy.sources.map((src: string, i: number) => (
            <div key={i} className="sharp-bento bg-white p-12 flex flex-col justify-between aspect-square hover:bg-slate-50 transition-colors duration-500 rounded-none">
              <span className="text-sm font-mono text-slate-300">0{i + 1}</span>
              <h3 className="text-3xl font-medium tracking-tight text-slate-900">{src}</h3>
            </div>
          ))}

          {/* Final Opportunity Block spans remaining */}
          <div className="sharp-bento bg-[var(--color-brand-blue)] p-12 flex flex-col justify-between aspect-square lg:aspect-auto h-full rounded-none">
            <span className="text-sm font-mono text-white/50 uppercase tracking-widest">Output</span>
            <h3 className="text-4xl font-medium tracking-tight text-white">{copy.opportunity}</h3>
          </div>

        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT 3: THE CASCADING PLANES (Apple Depth, zero circles)
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
          end: "+=200%",
          scrub: 1
        }
      });

      const planes = gsap.utils.toArray(".cascade-plane") as HTMLElement[];
      
      // Initial positioning in 3D
      gsap.set(planes, {
        y: (i) => i * 150,
        z: (i) => -i * 500,
        opacity: (i) => 1 - (i * 0.15)
      });

      // Scrub animation: all planes move forward and up
      tl.to(planes, {
        y: (i) => (i - 2) * 200,
        z: (i) => (2 - i) * 300,
        opacity: 1,
        ease: "none",
        duration: 2
      }, 0);

      // The final plane lights up
      tl.to(planes[planes.length - 1], {
        backgroundColor: "var(--color-brand-blue)",
        color: "white",
        duration: 0.5
      }, 1.5);

    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="w-full h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col items-center justify-center" style={{ perspective: "1500px" }}>
      
      <div className="absolute top-12 left-12 z-30">
        <h2 className="text-5xl font-medium tracking-tight text-slate-900">{copy.h2}</h2>
        <p className="text-meta uppercase font-mono tracking-[0.2em] text-[var(--color-brand-blue)] mt-4">{copy.overline}</p>
      </div>

      <div className="relative w-full max-w-4xl h-[60vh] flex items-center justify-center mt-20" style={{ transformStyle: "preserve-3d" }}>
        
        {copy.sources.map((src: string, i: number) => (
          <div 
            key={i} 
            className="cascade-plane absolute w-full h-[120px] bg-white border border-slate-200 flex items-center px-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="text-xl font-mono text-slate-400 mr-8">0{i + 1}</span>
            <span className="text-4xl font-medium tracking-tight text-slate-900">{src}</span>
          </div>
        ))}

        {/* Opportunity Plane */}
        <div 
          className="cascade-plane absolute w-full h-[120px] bg-slate-900 border border-slate-800 flex items-center justify-between px-12 shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span className="text-xl font-mono text-slate-400 mr-8">RESULT</span>
          <span className="text-5xl font-medium tracking-tight text-white">{copy.opportunity}</span>
        </div>

      </div>

    </div>
  );
}
