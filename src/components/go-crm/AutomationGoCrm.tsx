"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function AutomationGoCrm() {
  const t = useTranslations("goCrm.automation");
  const container = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
  if (!container.current) return;
    
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      
      // Pin the entire split-screen container
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
        }
      });

      // 1. Slot machine scroll on the right
      tl.to(".v3-right-strip", { yPercent: -66.666, ease: "power2.inOut", duration: 3 });

      // textTl drives the stepper logic
      const textTl = tl;
      
      // Continuous scroll guide filling up
      textTl.to(".v3-stepper-progress", { width: "100%", ease: "none", duration: 3 }, 0);

      textTl
      // Segment 1 -> 2
        .to(".v3-text-1", { opacity: 0.3, duration: 0.5 }, 0.5)
        .to(".v3-text-2", { opacity: 1, duration: 0.5 }, 0.5)
      // Segment 2 -> 3
        .to(".v3-text-2", { opacity: 0.3, duration: 0.5 }, 2.0)
        .to(".v3-text-3", { opacity: 1, duration: 0.5 }, 2.0);


      // --- MICRO-INTERACTIONS WITHIN VISUALS (Independent of scroll, loopeable) ---

      // Case 1: Campaign Overlapping UI Animation
      const campTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      
      campTl.to(".new-opp-card", { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" })
            .to(".new-opp-card", { x: 50, opacity: 0, duration: 0.3, ease: "power2.in" })
            .to(".crm-foreground-card", { scale: 1.02, rotation: 0, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }, "-=0.2");

      // Case 2: Appointment Reminders (Cadence Conveyor Belt)
      const remTl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
      // Email
      remTl.fromTo(".cadence-1", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
           .to(".cadence-1", { y: 30, opacity: 0, duration: 0.4, ease: "power2.in" }, 2)
      // SMS
           .fromTo(".cadence-2", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.8)
           .to(".cadence-2", { y: 30, opacity: 0, duration: 0.4, ease: "power2.in" }, 2.8)
      // WhatsApp
           .fromTo(".cadence-3", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 1.6)
           .to(".cadence-3", { y: 30, opacity: 0, duration: 0.4, ease: "power2.in" }, 3.6);

      // Case 3: SmartTags Mutation (Massive Lead Card State Change)
      const tagTl = gsap.timeline({ repeat: -1, delay: 0.5 });
      
      // Set initial state
      gsap.set(".tag-new", { y: "0%" });
      gsap.set([".tag-expired", ".tag-active"], { y: "100%" });
      gsap.set(".trigger-time", { opacity: 1, y: 0 });
      gsap.set(".trigger-action", { opacity: 0, y: 30 });
      gsap.set(".lead-card", { borderColor: "var(--color-border-Strokes-strong)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" });
      
      tagTl
        // 1. Wait as New Lead
        .to({}, { duration: 1.5 })
        
        // 2. TRIGGER 1: TIME PASSES
        // The clock ticks and turns red
        .to(".trigger-time", { scale: 1.05, color: "#EF4444", duration: 0.3, yoyo: true, repeat: 1 })
        
        // 3. THE MUTATION (Time Expired)
        // Card shakes and glows red
        .to(".lead-card", { 
           borderColor: "rgba(239,68,68,0.5)", 
           boxShadow: "0 20px 50px -10px rgba(239,68,68,0.2)", 
           rotationX: 12, rotationY: -2,
           duration: 0.4, ease: "power2.out" 
        }, "+=0.2")
        // Tags swap like a slot machine
        .to(".tag-new", { y: "-100%", duration: 0.5, ease: "back.in(1.2)" }, "<")
        .to(".tag-expired", { y: "0%", duration: 0.5, ease: "back.out(1.2)" }, "<0.1")
        
        // 4. Wait as Expired
        .to({}, { duration: 2.0 })
        
        // 5. TRIGGER 2: CALL LOGGED
        // The time trigger disappears, the Action trigger flies in
        .to(".trigger-time", { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" })
        .to(".trigger-action", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "<0.2")
        
        // Action trigger pulses
        .to(".trigger-action", { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 }, "+=0.5")
        
        // 6. THE MUTATION (Action Logged)
        // Card shakes and glows green
        .to(".lead-card", { 
           borderColor: "rgba(34,197,94,0.5)", 
           boxShadow: "0 20px 50px -10px rgba(34,197,94,0.2)", 
           rotationX: 8, rotationY: -8,
           duration: 0.4, ease: "power2.out" 
        }, "+=0.2")
        // Tags swap
        .to(".tag-expired", { y: "-100%", duration: 0.5, ease: "back.in(1.2)" }, "<")
        .to(".tag-active", { y: "0%", duration: 0.5, ease: "back.out(1.2)" }, "<0.1")
        
        // 7. Wait as In Progress
        .to({}, { duration: 2.0 })
        
        // 8. Soft Reset
        .to(".trigger-action", { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" })
        .to(".lead-card", { 
           borderColor: "var(--color-border-Strokes-strong)", 
           boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)", 
           rotationX: 10, rotationY: -5,
           duration: 0.6, ease: "power2.out" 
        }, "<")
        .to(".tag-active", { y: "100%", opacity: 0, duration: 0.4 }, "<")
        .to(".tag-new", { y: "0%", opacity: 0, duration: 0 }, "<")
        .to(".tag-new", { opacity: 1, duration: 0.5 }, "+=0.1")
        
        // Instantly reset hidden elements for next loop
        .set(".tag-expired", { y: "100%", opacity: 1 })
        .set(".tag-active", { y: "100%", opacity: 1 })
        .set(".trigger-time", { opacity: 1, y: 0, scale: 1, color: "inherit" })
        .to({}, { duration: 0.5 });

    }, container);

    return () => ctx.revert();
  }, []);


  // VISUAL COMPONENT 1: Campaign to Opportunity (Radical Overlapping Redesign)
  const VisualCampaign = () => (
    <div className="relative w-full max-w-lg h-96 flex items-center justify-center perspective-[1200px]">
      
      {/* Background Ad Layer (The Source) */}
      <div className="absolute left-0 top-10 w-64 bg-[var(--color-surface-BG-2)] border border-[var(--color-border-Strokes-strong)] rounded-2xl shadow-elevation-2 overflow-hidden transform rotate-[-5deg] scale-90">
        <div className="flex items-center gap-2 p-3 border-b border-[var(--color-border-Strokes-default)]">
          <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0">
             <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/></svg>
          </div>
          <div className="flex flex-col">
            <div className="h-1.5 w-16 bg-[var(--color-text-primary)] opacity-80 rounded-full mb-1"></div>
            <div className="h-1 w-10 bg-[var(--color-text-primary)] opacity-30 rounded-full"></div>
          </div>
        </div>
        <div className="w-full h-32 bg-[var(--color-surface-BG-3)] flex flex-col items-center justify-center relative overflow-hidden">
          <svg className="w-8 h-8 text-[var(--color-brand-blue)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="p-4 flex justify-between items-center bg-[var(--color-surface-BG-1)]">
          <div className="h-2 w-20 bg-[var(--color-text-primary)] opacity-40 rounded-full"></div>
          <div className="px-3 py-1 bg-[var(--color-text-primary)] rounded text-[var(--color-surface-BG-base)] text-[8px] font-bold">GET QUOTE</div>
        </div>
      </div>

      {/* The Extraction Beam / Pulse */}
      <div className="absolute left-32 z-10 w-32 h-1 bg-gradient-to-r from-[#1877F2] to-[var(--color-brand-orange)] rounded-full opacity-0 scale-0 transform origin-left new-opp-card shadow-[0_0_20px_rgba(242,96,35,0.8)]"></div>

      {/* Foreground CRM Layer (The Destination) */}
      <div className="crm-foreground-card absolute right-0 bottom-10 w-72 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] p-5 transform rotate-[2deg] z-20 flex flex-col gap-5 backdrop-blur-xl">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[var(--color-surface-BG-3)] overflow-hidden shrink-0">
               <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" alt="Client" className="w-full h-full object-cover" />
             </div>
             <div>
               <p className="text-sm font-bold text-[var(--color-text-primary)]">Sarah Jenkins</p>
               <p className="text-[10px] font-mono text-[var(--color-brand-orange)] uppercase tracking-wider">New Opportunity</p>
             </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-[var(--color-border-Strokes-default)] flex items-center justify-center bg-[var(--color-surface-BG-2)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-surface-BG-2)] p-2.5 rounded-lg border border-[var(--color-border-Strokes-default)]">
            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-1">Source</p>
            <p className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1877F2]"></span> Facebook</p>
          </div>
          <div className="bg-[var(--color-surface-BG-2)] p-2.5 rounded-lg border border-[var(--color-border-Strokes-default)]">
            <p className="text-[9px] text-[var(--color-text-muted)] uppercase mb-1">Value Est.</p>
            <p className="text-xs font-bold text-[var(--color-text-primary)]">$18,400</p>
          </div>
        </div>

        <div className="w-full bg-[var(--color-text-primary)] text-[var(--color-surface-BG-base)] rounded-md py-2 text-center text-[10px] font-bold tracking-widest uppercase shadow-elevation-2">
          Pipeline Updated
        </div>
      </div>
    </div>
  );


  // VISUAL COMPONENT 2: Appointment Reminders (Awwwards Spatial / Contextual UI)
  const VisualAppointment = () => (
    <div className="relative w-full h-full min-h-[450px] flex items-center justify-center perspective-[1500px] p-8">
      
      {/* ISOMETRIC STAGE */}
      <div className="relative flex flex-col items-center gap-6 transform rotateX-[20deg] rotateY-[-15deg] translate-z-[50px] transform-style-3d w-full max-w-sm">
        
        {/* The Vertical Timeline Wire */}
        <div className="absolute top-12 bottom-6 left-10 w-1 bg-gradient-to-b from-[var(--color-brand-blue)]/50 via-[var(--color-brand-orange)]/50 to-green-500/50 rounded-full z-0 shadow-elevation-1"></div>

        {/* 1. Main Event: Calendar UI Node */}
        <div className="w-full pl-20 relative z-30">
          <div className="relative bg-[var(--color-surface-BG-1)]/90 backdrop-blur-xl border border-[var(--color-border-Strokes-strong)] shadow-elevation-4 rounded-2xl overflow-hidden group">
            <div className="absolute top-1/2 -left-10 w-10 h-px bg-[var(--color-border-Strokes-strong)]"></div>
            <div className="absolute top-1/2 -left-10 w-3 h-3 rounded-full bg-[var(--color-brand-blue)] transform -translate-y-1/2 -translate-x-1/2 shadow-elevation-2"></div>
            
            <div className="bg-[var(--color-brand-blue)]/10 px-4 py-2 border-b border-[var(--color-brand-blue)]/20 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--color-brand-blue)] uppercase tracking-widest">Meeting</span>
              <svg className="w-3 h-3 text-[var(--color-brand-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div className="p-4 flex flex-col gap-1 relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[var(--color-brand-blue)]/5 rounded-full blur-xl"></div>
               <p className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">Product Demo</p>
               <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">Oct 24, 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* 2. Floating Notification 1: Email */}
        <div className="cadence-1 w-full pl-20 relative z-20">
          <div className="bg-white border border-[var(--color-border-Strokes-default)] rounded-xl p-3 pr-5 shadow-elevation-2 flex items-center gap-3 relative w-fit">
            <div className="absolute top-1/2 -left-10 w-10 h-px bg-[var(--color-border-Strokes-strong)]"></div>
            <div className="absolute top-1/2 -left-10 w-2 h-2 rounded-full bg-[var(--color-brand-blue)] transform -translate-y-1/2 -translate-x-1/2 shadow-elevation-1"></div>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-blue)]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[var(--color-brand-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-0.5">
                 <svg className="w-2.5 h-2.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">Immediate</span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Sequence Email</span>
            </div>
          </div>
        </div>

        {/* 3. Floating Notification 2: SMS */}
        <div className="cadence-2 w-full pl-20 relative z-20">
          <div className="bg-white border border-[var(--color-border-Strokes-default)] rounded-xl p-3 pr-5 shadow-elevation-2 flex items-center gap-3 relative w-fit">
            <div className="absolute top-1/2 -left-10 w-10 h-px bg-[var(--color-border-Strokes-strong)]"></div>
            <div className="absolute top-1/2 -left-10 w-2 h-2 rounded-full bg-[var(--color-brand-orange)] transform -translate-y-1/2 -translate-x-1/2 shadow-elevation-1"></div>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[var(--color-brand-orange)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-0.5">
                 <svg className="w-2.5 h-2.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">-24 Hours</span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">SMS Reminder</span>
            </div>
          </div>
        </div>

        {/* 4. Floating Notification 3: WhatsApp */}
        <div className="cadence-3 w-full pl-20 relative z-20">
          <div className="bg-white border border-[var(--color-border-Strokes-default)] rounded-xl p-3 pr-5 shadow-elevation-2 flex items-center gap-3 relative w-fit">
            <div className="absolute top-1/2 -left-10 w-10 h-px bg-[var(--color-border-Strokes-strong)]"></div>
            <div className="absolute top-1/2 -left-10 w-2 h-2 rounded-full bg-green-500 transform -translate-y-1/2 -translate-x-1/2 shadow-elevation-1"></div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-0.5">
                 <svg className="w-2.5 h-2.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">-1 Hour</span>
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">WhatsApp Ping</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );


  // VISUAL COMPONENT 3: SmartTags Mutation (Massive Lead Card State Change)
  const VisualSmartTags = () => (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective-[2000px] p-8">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--color-brand-blue)]/5 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">

        {/* --- REALITY TRIGGER (The catalyst for change) --- */}
        <div className="h-10 px-5 bg-white border border-[var(--color-border-Strokes-default)] rounded-full shadow-elevation-2 flex items-center justify-center relative overflow-hidden min-w-[200px] z-30">
           
           {/* State 1: Time Expiring */}
           <div className="trigger-time absolute flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Time: 24h 00m</span>
           </div>
           
           {/* State 2: Action Logged */}
           <div className="trigger-action absolute flex items-center gap-2 opacity-0 translate-y-8">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-green-600">Action: Call Made</span>
           </div>

        </div>

        {/* --- THE LEAD CARD (The entity that mutates) --- */}
        <div className="lead-card w-full bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-2xl p-6 shadow-elevation-4 transition-all duration-300 relative z-20 overflow-hidden transform rotateX-[10deg] rotateY-[-5deg]">
          
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-Strokes-strong)] to-transparent pointer-events-none"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-[var(--color-surface-BG-3)] overflow-hidden shrink-0 shadow-inner">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
               </div>
               <div>
                 <h4 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">Carlos M.</h4>
                 <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-widest mt-1">Lead #8492</p>
               </div>
             </div>
          </div>

          {/* Body Lines */}
          <div className="space-y-3 mb-8">
             <div className="h-1.5 w-full bg-[var(--color-surface-BG-3)] rounded-full"></div>
             <div className="h-1.5 w-3/4 bg-[var(--color-surface-BG-3)] rounded-full"></div>
          </div>

          {/* THE STATUS TAG (The core visual mutation) */}
          <div className="w-full bg-[var(--color-surface-BG-base)] border border-[var(--color-border-Strokes-default)] rounded-xl p-4 flex flex-col gap-3 relative shadow-inner">
             <p className="text-[9px] font-mono text-[var(--color-text-muted)] uppercase tracking-widest">Live Status</p>
             
             {/* The viewport for the sliding tags */}
             <div className="relative h-12 w-full overflow-hidden rounded-lg">
                
                {/* TAG 1: NEW (Blue) */}
                <div className="tag-new absolute inset-0 bg-blue-500/10 border border-blue-500/20 flex items-center px-4 gap-3 rounded-lg">
                   <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                   <span className="text-sm font-bold text-blue-600 tracking-wider uppercase">New Lead</span>
                </div>
                
                {/* TAG 2: EXPIRED (Red) */}
                <div className="tag-expired absolute inset-0 bg-red-500/10 border border-red-500/20 flex items-center px-4 gap-3 rounded-lg translate-y-full">
                   <svg className="w-4 h-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   <span className="text-sm font-bold text-red-600 tracking-wider uppercase">No Call &gt; 24h</span>
                </div>

                {/* TAG 3: IN PROGRESS (Green) */}
                <div className="tag-active absolute inset-0 bg-green-500/10 border border-green-500/20 flex items-center px-4 gap-3 rounded-lg translate-y-full">
                   <svg className="w-4 h-4 text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   <span className="text-sm font-bold text-green-600 tracking-wider uppercase">In Progress</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );


  return (
    <section ref={container} className="relative w-full h-screen bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] overflow-hidden border-y border-[var(--color-border-Strokes-default)]">
      
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT PANEL: Sticky Typography */}
        <div className="h-full flex flex-col justify-center relative border-r border-[var(--color-border-Strokes-default)] z-20 bg-[var(--color-surface-BG-base)]">
          <div className="w-full max-w-2xl ml-auto px-gutter-md md:pl-gutter-lg md:pr-16">
            <p className="text-overline text-[var(--color-text-accent-blue)] uppercase tracking-widest mb-4">10 — AUTOMATION</p>
            <h2 className="text-display-lg font-bold text-[var(--color-text-primary)] mb-12 max-w-md">
              Set it once. Keep it moving.
            </h2>
            
            {/* 3 Square Cards (Horizontal Layout) */}
            <div className="w-full mt-8">
              <div className="flex gap-4 w-full">
                {/* Case 01 */}
                <div className="v3-text-1 aspect-square flex-1 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-2xl p-5 flex flex-col justify-between shadow-elevation-2">
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">01. Campaign → Opp</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">The CRM captures the ad click and instantly builds the Contact and Opportunity without data entry.</p>
                </div>
                
                {/* Case 02 */}
                <div className="v3-text-2 aspect-square flex-1 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-2xl p-5 flex flex-col justify-between opacity-30 shadow-elevation-2">
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">02. Appt → Reminder</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">Once scheduled, the cadence runs itself. Pre-meeting SMS and emails fire automatically based on timeline.</p>
                </div>
                
                {/* Case 03 */}
                <div className="v3-text-3 aspect-square flex-1 bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-strong)] rounded-2xl p-5 flex flex-col justify-between opacity-30 shadow-elevation-2">
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">03. SmartTags</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">The UI mutates based on reality. Tags expire over time or instantly update when an action is logged.</p>
                </div>
              </div>

              {/* Horizontal Scrollbar / Indicator */}
              <div className="w-full h-1 bg-[var(--color-border-Strokes-default)] rounded-full mt-6 relative overflow-hidden">
                <div className="v3-stepper-progress absolute left-0 top-0 bottom-0 w-0 bg-[var(--color-text-primary)] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Visual Demonstrations (Slot machine) */}
        <div className="h-full relative overflow-hidden bg-[var(--color-brand-blue)] border-l flex flex-col justify-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-blue)]/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* The scrolling strip */}
          <div className="v3-right-strip absolute top-0 w-full h-[300vh] flex flex-col">
            
            <div className="h-[100vh] flex items-center justify-center p-12 relative">
              <VisualCampaign />
            </div>
            
            <div className="h-[100vh] flex items-center justify-center p-12 bg-[var(--color-surface-BG-1)] relative">
              <VisualAppointment />
            </div>
            
            <div className="h-[100vh] flex items-center justify-center p-12 bg-[var(--color-brand-blue)] relative">
              <VisualSmartTags />
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

