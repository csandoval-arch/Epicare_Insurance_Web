"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const promises = [
  { word: "Clarity.", outcome: "Oversight without noise", text: "Every metric, every operation, and every risk is visible. We don't hide behind complexity. Our platform brings immediate transparency to every layer of your business." },
  { word: "Control.", outcome: "Precision in execution", text: "You govern the platform, the platform doesn't govern you. We build systems that adapt to your protocols, ensuring your strategic decisions translate instantly into operational reality." },
  { word: "Confidence.", outcome: "Reliability at scale", text: "Trust holds because it can be verified. Our infrastructure guarantees 99.99% uptime, uncompromising security, and mathematical certainty in every transaction." }
];

export default function PromiseCompany() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // B1: 0 fade-ins planos (Curtain Reveal)
      gsap.utils.toArray(".swiss-reveal").forEach((item: any) => {
        gsap.fromTo(item, 
          { clipPath: "inset(100% 0% 0% 0%)", y: 30 },
          { 
            clipPath: "inset(0% 0% 0% 0%)", 
            y: 0, 
            duration: 1.4,
            ease: "power3.out", 
            scrollTrigger: { trigger: item, start: "top 85%" } 
          }
        );
      });

      // B2: Parallax en los números de agua
      gsap.to(".swiss-parallax", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });

      // B3: Vida Latente (Cruz giratoria)
      gsap.to(".swiss-latent", { rotation: 360, duration: 15, ease: "linear", repeat: -1 });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-[var(--color-brand-blue)] text-[var(--color-brand-dark)] min-h-screen z-30 pt-24 pb-32 overflow-hidden flex flex-col">
      
      {/* Header Arquitectónico */}
      <div className="w-full px-6 md:px-12 lg:px-24 mb-16">
        <div className="w-full grid grid-cols-12 pb-6">
          <div className="col-span-12 flex items-center justify-between">
            <h2 className="text-h6 uppercase tracking-widest flex items-center gap-4 swiss-reveal">
              <div className="w-2 h-2 border border-[var(--color-brand-dark)] flex items-center justify-center swiss-latent">
                 <div className="w-full h-[1px] bg-[var(--color-brand-dark)] absolute" />
                 <div className="h-full w-[1px] bg-[var(--color-brand-dark)] absolute" />
              </div>
              The Epicare Standard
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-6 md:px-12 lg:px-24 flex flex-col relative z-10">
        
        {/* ASYMMETRIC SWISS LEDGER (Z-Pattern) */}
        <div className="w-full flex flex-col border-t border-[var(--color-brand-dark)]">
          
          {/* Row 1: Left Heavy */}
          <div className="grid grid-cols-12 bg-[var(--color-brand-blue)] group border-b border-[var(--color-brand-dark)]">
            <div className="col-span-1 md:col-span-1 border-r border-[var(--color-brand-dark)] flex items-start justify-center p-6 swiss-reveal">
              <span className="text-meta opacity-50">01</span>
            </div>
            <div className="col-span-11 md:col-span-7 border-r border-[var(--color-brand-dark)] flex items-center p-12 swiss-reveal">
              <h3 className="text-display-2xl uppercase tracking-tighter leading-[0.85]">{promises[0].word}</h3>
            </div>
            <div className="col-span-12 md:col-span-4 p-12 flex flex-col justify-end relative overflow-hidden swiss-reveal">
              <span className="text-[12vw] leading-none absolute -right-4 -bottom-4 font-black opacity-5 swiss-parallax pointer-events-none">01</span>
              <h4 className="text-h5 mb-4 block">{promises[0].outcome}</h4>
              <p className="text-body-md font-medium max-w-[90%]">{promises[0].text}</p>
            </div>
          </div>

          {/* Row 2: Right Heavy (A1: Asimetría estructural) */}
          <div className="grid grid-cols-12 bg-[var(--color-brand-blue)] group border-b border-[var(--color-brand-dark)]">
            <div className="col-span-12 md:col-span-4 border-r border-[var(--color-brand-dark)] p-12 flex flex-col justify-end relative overflow-hidden swiss-reveal">
              <span className="text-[12vw] leading-none absolute -left-4 -bottom-4 font-black opacity-5 swiss-parallax pointer-events-none">02</span>
              <h4 className="text-h5 mb-4 block">{promises[1].outcome}</h4>
              <p className="text-body-md font-medium max-w-[90%]">{promises[1].text}</p>
            </div>
            <div className="col-span-11 md:col-span-7 border-r border-[var(--color-brand-dark)] flex items-center justify-end text-right p-12 swiss-reveal">
              <h3 className="text-display-2xl uppercase tracking-tighter leading-[0.85]">{promises[1].word}</h3>
            </div>
            <div className="col-span-1 md:col-span-1 flex items-start justify-center p-6 swiss-reveal">
              <span className="text-meta opacity-50">02</span>
            </div>
          </div>

          {/* Row 3: Left Heavy (Espejo perfecto de Row 1) */}
          <div className="grid grid-cols-12 bg-[var(--color-brand-blue)] group border-b border-[var(--color-brand-dark)]">
            <div className="col-span-1 md:col-span-1 border-r border-[var(--color-brand-dark)] flex items-start justify-center p-6 swiss-reveal">
              <span className="text-meta opacity-50">03</span>
            </div>
            <div className="col-span-11 md:col-span-7 border-r border-[var(--color-brand-dark)] flex items-center p-12 swiss-reveal">
              <h3 className="text-display-2xl uppercase tracking-tighter leading-[0.85]">{promises[2].word}</h3>
            </div>
            <div className="col-span-12 md:col-span-4 p-12 flex flex-col justify-end relative overflow-hidden swiss-reveal">
              <span className="text-[12vw] leading-none absolute -right-4 -bottom-4 font-black opacity-5 swiss-parallax pointer-events-none">03</span>
              <h4 className="text-h5 mb-4 block">{promises[2].outcome}</h4>
              <p className="text-body-md font-medium max-w-[90%]">{promises[2].text}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
