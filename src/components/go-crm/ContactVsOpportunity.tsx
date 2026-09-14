"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function ContactVsOpportunity() {
  const t = useTranslations("goCrm.contactVsOpp");
  const comp = useRef<HTMLElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(600);

  const opps = [
    {
      title: "Oportunidad: Dental",
      desc: "Flujo de trabajo independiente y siguientes pasos para el proceso Dental.",
      icon: "🦷",
      color: "text-blue-500"
    },
    {
      title: "Oportunidad: Auto",
      desc: "Motor de cotización y seguimiento totalmente separados para el proceso de Auto.",
      icon: "🚗",
      color: "text-[#35BBFD]"
    },
    {
      title: "Oportunidad: Vida",
      desc: "Pipeline de seguimiento a largo plazo configurado para la cobertura de Vida.",
      icon: "❤️",
      color: "text-rose-500"
    }
  ];

  useLayoutEffect(() => {
    let mm = gsap.matchMedia();
    
    // Original large dynamic radius
    const r = window.innerWidth < 768 ? window.innerWidth * 1.2 : window.innerWidth * 0.55;
    setRadius(r);
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      
      // 1. SCROLL TIMELINE: Only handles the slicing/opening of Act 1
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: comp.current,
          pin: true,
          start: "top top",
          end: "+=200%", // Pin briefly so user sees the opening and wheel
          scrub: 1,
        }
      });

      scrollTl.to(".slice-left", { yPercent: 100, ease: "power2.inOut", duration: 1 }, 0);
      scrollTl.to(".slice-center", { yPercent: -100, ease: "power2.inOut", duration: 1 }, 0.2);
      scrollTl.to(".slice-right", { yPercent: 100, ease: "power2.inOut", duration: 1 }, 0.4);
      
      // Reveal the background elements
      scrollTl.to(".slice-headline", { opacity: 1, y: 0, duration: 0.5 }, 0.8);
      scrollTl.to(".text-panel-group", { opacity: 1, y: 0, duration: 0.5 }, 1.0);
      scrollTl.from(".wheel-container", { opacity: 0, scale: 0.9, duration: 1 }, 0.8);

      // 2. AUTO-PLAYING FERRIS WHEEL TIMELINE (No scrub, independent)
      const angleStep = 45; 
      
      // Initial states for Nav Cards
      gsap.set(".nav-card", { opacity: 0.5, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.2)" });
      gsap.set(".nav-card-0", { opacity: 1, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.8)" });
      gsap.set(".nav-progress", { scaleX: 0, transformOrigin: "left center" });
      
      // Initial states for Diegetic Cards
      gsap.set(".card-inner", { opacity: 0.3, scale: 0.85 });
      gsap.set(".card-inner-0", { opacity: 1, scale: 1 });

      const wheelTl = gsap.timeline({ repeat: -1 });

      // =======================
      // PHASE 0
      // =======================
      // Fill progress bar for Card 0
      wheelTl.to(".nav-progress-0", { scaleX: 1, duration: 3.5, ease: "none" });

      // Transition Card 0 -> 1
      wheelTl.to(hubRef.current, { rotation: angleStep, ease: "power3.inOut", duration: 1.5 }, "t1");
      wheelTl.to(".card-inner", { rotation: `-=${angleStep}`, ease: "power3.inOut", duration: 1.5 }, "t1");
      
      // Nav Card states
      wheelTl.to(".nav-card-0", { opacity: 0.5, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.2)", duration: 0.5 }, "t1");
      wheelTl.to(".nav-progress-0", { opacity: 0, duration: 0.2 }, "t1");
      wheelTl.set(".nav-progress-0", { scaleX: 0, opacity: 1 }, "t1+=0.3"); // Reset for loop
      wheelTl.to(".nav-card-1", { opacity: 1, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.8)", duration: 0.5 }, "t1");
      
      wheelTl.to(".card-inner-0", { opacity: 0.3, scale: 0.85, duration: 1.5 }, "t1");
      wheelTl.to(".card-inner-1", { opacity: 1, scale: 1, duration: 1.5 }, "t1");

      // =======================
      // PHASE 1
      // =======================
      // Fill progress bar for Card 1
      wheelTl.to(".nav-progress-1", { scaleX: 1, duration: 3.5, ease: "none" });

      // Transition Card 1 -> 2
      wheelTl.to(hubRef.current, { rotation: angleStep * 2, ease: "power3.inOut", duration: 1.5 }, "t2");
      wheelTl.to(".card-inner", { rotation: `-=${angleStep}`, ease: "power3.inOut", duration: 1.5 }, "t2");
      
      // Nav Card states
      wheelTl.to(".nav-card-1", { opacity: 0.5, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.2)", duration: 0.5 }, "t2");
      wheelTl.to(".nav-progress-1", { opacity: 0, duration: 0.2 }, "t2");
      wheelTl.set(".nav-progress-1", { scaleX: 0, opacity: 1 }, "t2+=0.3"); // Reset for loop
      wheelTl.to(".nav-card-2", { opacity: 1, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.8)", duration: 0.5 }, "t2");
      
      wheelTl.to(".card-inner-1", { opacity: 0.3, scale: 0.85, duration: 1.5 }, "t2");
      wheelTl.to(".card-inner-2", { opacity: 1, scale: 1, duration: 1.5 }, "t2");

      // =======================
      // PHASE 2
      // =======================
      // Fill progress bar for Card 2
      wheelTl.to(".nav-progress-2", { scaleX: 1, duration: 3.5, ease: "none" });

      // Transition Card 2 -> 0 (Reverse back to 0 so it loops beautifully without a hard jump)
      wheelTl.to(hubRef.current, { rotation: 0, ease: "power3.inOut", duration: 1.5 }, "t3");
      wheelTl.to(".card-inner", { rotation: 0, ease: "power3.inOut", duration: 1.5 }, "t3");
      
      // Nav Card states
      wheelTl.to(".nav-card-2", { opacity: 0.5, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.2)", duration: 0.5 }, "t3");
      wheelTl.to(".nav-progress-2", { opacity: 0, duration: 0.2 }, "t3");
      wheelTl.set(".nav-progress-2", { scaleX: 0, opacity: 1 }, "t3+=0.3"); // Reset for loop
      wheelTl.to(".nav-card-0", { opacity: 1, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.8)", duration: 0.5 }, "t3");
      
      wheelTl.to(".card-inner-2", { opacity: 0.3, scale: 0.85, duration: 1.5 }, "t3");
      wheelTl.to(".card-inner-0", { opacity: 1, scale: 1, duration: 1.5 }, "t3");

      // Infinite Diegetic Animations (Breathing elements)
      gsap.to(".diegetic-pulse", {
        y: "-=6px", opacity: 0.7, duration: "random(2, 4)",
        repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2
      });

    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={comp} className="w-full h-screen relative bg-slate-900 overflow-hidden font-sans">
      
      {/* Background Layer: ACT 2 (Ferris Wheel & Unified Opportunities) */}
      <div className="absolute inset-0 bg-[#35BBFD] flex items-center px-6 lg:px-gutter-xl overflow-hidden">
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/10" />
        
        {/* LEFT COLUMN: Text Descriptions */}
        <div className="relative z-20 w-full lg:w-[45%] flex flex-col justify-center">
          <div className="slice-headline opacity-0 translate-y-8 w-full mb-10">
            <h2 className="text-display-md md:text-display-lg text-white font-semibold tracking-tight text-left max-w-4xl leading-[1.05] drop-shadow-md">
              Una persona puede significar más de una oportunidad.
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full text-panel-group opacity-0 translate-y-8">
            {opps.map((opp, i) => (
              <div 
                key={i} 
                className={`nav-card nav-card-${i} relative flex flex-col p-5 w-[140px] md:w-[150px] aspect-square rounded-2xl border bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-500`}
              >
                {/* Progress Bar Container (Top edge) */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10" />
                {/* Active Progress Fill */}
                <div className={`nav-progress nav-progress-${i} absolute top-0 left-0 h-1.5 bg-white w-full`} />
                
                <div className="flex flex-col gap-2 my-auto">
                  <h3 className="text-body-md font-semibold text-white tracking-tight leading-tight">{opp.title.replace('Oportunidad: ', '')}</h3>
                  <p className="text-xs text-white/80 leading-[1.45] line-clamp-3">
                    {opp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
          
        {/* RIGHT COLUMN: Ferris Wheel Hub */}
        <div className="wheel-container absolute top-[70%] lg:top-1/2 left-[50%] lg:left-[85%] w-0 h-0 z-10">
          <div ref={hubRef} className="absolute w-0 h-0">
            {opps.map((_, i) => (
              <div 
                key={i} 
                className="absolute top-0 left-0 w-0 h-0" 
                style={{ transform: `rotate(${-i * 45}deg)` }}
              >
                <div 
                  className={`card-inner card-inner-${i} absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center`}
                  style={{ transform: `translateX(-${radius}px) rotate(${i * 45}deg)` }}
                >
                  
                  {/* DIEGETIC UI SCENE: Liquid Glass Container */}
                  {/* Note: Kept the card large, but it only contains Diegetic elements (no text inside) */}
                  <div className="w-[280px] md:w-[360px] h-[340px] md:h-[420px] rounded-[2.5rem] bg-white/30 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white/40 p-6 md:p-8 flex flex-col gap-4 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                    <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] rounded-[2.5rem]" />
                    
                    {/* SCENE 0: Dental (Kanban/Workflow) */}
                    {i === 0 && (
                      <div className="relative z-10 w-full h-full flex flex-col gap-4">
                        <div className="flex gap-3 items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-700">🦷</div>
                          <div className="w-24 h-3 rounded-full bg-black/10"></div>
                        </div>
                        <div className="flex gap-3 flex-1">
                          <div className="flex-1 bg-white/40 rounded-xl p-3 flex flex-col gap-3 border border-white/30 shadow-sm">
                             <div className="diegetic-pulse w-full h-10 bg-white/70 rounded-lg"></div>
                             <div className="diegetic-pulse w-full h-10 bg-white/70 rounded-lg"></div>
                          </div>
                          <div className="flex-1 bg-white/40 rounded-xl p-3 flex flex-col gap-3 border border-white/30 shadow-sm">
                             <div className="diegetic-pulse w-full h-10 bg-[#35BBFD]/20 border border-[#35BBFD]/40 rounded-lg flex items-center justify-center">
                               <div className="w-4 h-1 rounded-full bg-[#35BBFD]"></div>
                             </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SCENE 1: Auto (Quoting Engine / Radar) */}
                    {i === 1 && (
                      <div className="relative z-10 w-full h-full flex flex-col gap-6 justify-center items-center">
                        <div className="relative w-32 h-32 rounded-full border-4 border-white/40 flex items-center justify-center shadow-inner">
                          <div className="absolute inset-0 border-4 border-[#35BBFD]/80 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
                          <div className="w-12 h-12 text-[#35BBFD] flex items-center justify-center text-3xl">🚗</div>
                        </div>
                        <div className="w-full flex flex-col gap-3 mt-4">
                          <div className="w-full h-4 bg-black/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[#35BBFD] w-[75%] rounded-full"></div>
                          </div>
                          <div className="flex justify-between px-2">
                             <div className="w-12 h-2 rounded-full bg-black/10"></div>
                             <div className="w-8 h-2 rounded-full bg-black/10"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SCENE 2: Vida (Long-term Pipeline) */}
                    {i === 2 && (
                      <div className="relative z-10 w-full h-full flex flex-col gap-6 pt-4">
                        <div className="flex gap-3 items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">❤️</div>
                          <div className="w-20 h-3 rounded-full bg-black/10"></div>
                        </div>
                        <div className="flex flex-col gap-0 px-4">
                          {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full ${step < 3 ? 'bg-[#35BBFD] shadow-[0_0_10px_#35BBFD]' : 'bg-white/50 border border-black/10'}`}></div>
                                {step !== 4 && <div className={`w-0.5 h-10 ${step < 2 ? 'bg-[#35BBFD]' : 'bg-white/40'}`}></div>}
                              </div>
                              <div className="pt-0.5 flex flex-col gap-2 w-full">
                                <div className="diegetic-pulse w-3/4 h-3 rounded-full bg-black/10"></div>
                                {step < 3 && <div className="diegetic-pulse w-1/2 h-2 rounded-full bg-black/5"></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreground Layer: ACT 1 The Contact (Sliced via clip-path) */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
        
        {/* Left Slice */}
        <div className="slice-left absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%)' }}>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] z-0">
             <img src="/client_auto.jpg" alt="Auto Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] p-static-xl md:p-static-2xl pt-static-xl md:pt-[3.25rem] flex flex-col gap-fluid-lg border-r border-slate-800">
            
            {/* The Realistic Profile Card (Ultra-Glassmorphic Minimalist) */}
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ER</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Elena Rojas</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">c.martinez@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Slice */}
        <div className="slice-center absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(33.33% 0, 66.66% 0, 66.66% 100%, 33.33% 100%)' }}>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] z-0">
             <img src="/client_business.jpg" alt="Business Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end items-center border-r border-slate-800">
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">DS</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">David Smith</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">david.smith@business.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Slice */}
        <div className="slice-right absolute inset-0 bg-slate-900" style={{ clipPath: 'polygon(66.66% 0, 100% 0, 100% 100%, 66.66% 100%)' }}>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] z-0">
             <img src="/client_family.jpg" alt="Family Client" className="w-full h-full object-cover opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] p-static-xl md:p-static-2xl pt-static-xl md:pt-[3.25rem] flex flex-col items-center border-l border-slate-800">
            <div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ML</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Maria Lopez</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">m.lopez@family.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Foreground Layer: Fallback */}
      <div className="slice-left absolute inset-0 pointer-events-none z-30 md:hidden bg-slate-900 flex flex-col items-center justify-center px-static-xl">
          <div className="absolute inset-0 z-0">
             <img src="/client_auto.jpg" alt="Auto Client" className="w-full h-full object-cover opacity-[0.45]" />
          </div>
          <div className="z-10 flex flex-col w-full p-static-xl pt-static-2xl max-w-sm mx-auto">
            <div className="relative z-10 w-full max-w-[320px] mx-auto rounded-2xl border border-white/50 shadow-elevation-4 overflow-hidden">
              <div className="absolute inset-0 -z-10 rounded-2xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[40px] saturate-[1.5]" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10" />
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="relative z-10 p-static-md flex flex-col gap-static-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-static-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-elevation-1 shrink-0">
                      <span className="text-body-sm font-medium text-white">ER</span>
                    </div>
                    <h3 className="text-h6 text-slate-900 font-semibold leading-tight">Elena Rojas</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pt-static-sm border-t border-slate-900/10">
                  <span className="text-body-xs text-slate-700 font-mono">c.martinez@email.com</span>
                </div>
              </div>
            </div>
          </div>
      </div>

    </section>
  );
}
