"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, DUR, REVEAL, STAGGER } from "@/lib/motion";
import { asset } from "@/lib/asset";

export default function CierreGoCrm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(".cierre-monolith, .cierre-bg-img, .cierre-item", {
          opacity: 1, y: 0, scale: 1
        });
        return;
      }

      // 1. Contenedor Monolito (Scale up + Fade)
      gsap.fromTo(
        ".cierre-monolith",
        { opacity: 0, y: REVEAL.lg, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // 2. Fondo Parallax sutil / Zoom
      gsap.fromTo(
        ".cierre-bg-img",
        { scale: 1.1 },
        {
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // 3. Stagger del contenido
      gsap.fromTo(
        ".cierre-item",
        { opacity: 0, y: REVEAL.md },
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.base,
          delay: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // H2: Text-Birth
      gsap.fromTo(
        ".cierre-title-line",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.base,
          ease: EASE.dramatic,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      
      // Error micro-shake animation
      gsap.fromTo(
        formRef.current,
        { x: -8 },
        { x: 0, duration: DUR.microOut, ease: "elastic.out(2, 0.2)", clearProps: "x" }
      );
      return;
    }

    // Success transition
    setStatus("success");
    const tl = gsap.timeline();
    tl.to(".cierre-form-elements", {
      opacity: 0,
      y: -REVEAL.sm,
      duration: DUR.fast,
      ease: EASE.out,
    }).fromTo(
      ".cierre-success-msg",
      { opacity: 0, y: REVEAL.sm },
      { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out },
      "-=0.2"
    );
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[90dvh] flex items-center justify-center overflow-hidden z-10 px-3.5 sm:px-4 md:px-8 bg-[var(--color-surface-BG-base)] py-16"
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="cierre-monolith relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-elevation-4 border border-white/10">
          
          {/* Fondo de Imagen igual que GO AMS */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#060B12]">
            <img 
              src={asset("/Files/S14_cta_swiss_blue.webp")}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="cierre-bg-img absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Oscurecimiento para contraste óptimo */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 p-8 md:p-16 lg:px-24 flex flex-col items-center text-center">
            
            <div className="cierre-item mb-4">
              <span className="text-meta font-mono tracking-widest text-white/60 mb-4 uppercase border-b border-white/20 pb-1">
                Disponibilidad
              </span>
            </div>

            <div className="overflow-hidden mb-6 mt-4">
              <h2 className="text-display-lg font-display font-bold text-white m-0 pb-2 cierre-title-line origin-bottom leading-tight drop-shadow-sm">
                GO CRM está en construcción.
              </h2>
            </div>

            <p className="cierre-item text-body-lg text-white/90 max-w-lg text-balance mb-12">
              Se libera en go.epicare.com. Déjanos tu correo y te avisamos el día que abra.
            </p>

            {/* THE FORM */}
            <form 
              ref={formRef} 
              onSubmit={handleSubmit}
              className="cierre-item relative w-full max-w-md group"
            >
              <div className={`cierre-form-elements relative flex flex-col w-full ${status === 'success' ? 'pointer-events-none' : ''}`}>
                
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Tu correo"
                    className="w-full bg-transparent outline-none text-h3 text-white placeholder:text-white/40 py-4 pl-0 pr-32 transition-colors duration-300"
                    disabled={status === "success"}
                  />
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "success"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 text-body-lg font-medium text-white hover:text-epicare-cyan transition-colors duration-300 group/btn"
                  >
                    Avísame
                    <span className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/20 transition-all duration-300 ${isFocused ? 'bg-white text-[#0A0D14] border-transparent' : 'bg-transparent text-white group-hover/btn:border-white'}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Animated underline */}
                <div className="relative h-[2px] w-full bg-white/20 mt-1 overflow-hidden">
                  <div 
                    className={`absolute inset-0 bg-white origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isFocused ? 'scale-x-100' : 'scale-x-0'}`}
                  />
                </div>

                {/* Error Message */}
                <div className="h-8 mt-3 overflow-hidden text-left">
                  <p 
                    className={`text-body-sm text-[#F26023] transition-all duration-300 ${status === 'error' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                  >
                    Ese correo no parece válido. Revísalo e inténtalo otra vez.
                  </p>
                </div>
              </div>

              {/* Success Message overlay */}
              <div className="cierre-success-msg absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
                  <p className="text-h4 md:text-h3 text-white m-0 font-medium">
                    Listo. Te escribimos el día que abra.
                  </p>
                </div>
              </div>

            </form>

            <div className="cierre-item mt-12 opacity-50 text-body-sm text-white">
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
