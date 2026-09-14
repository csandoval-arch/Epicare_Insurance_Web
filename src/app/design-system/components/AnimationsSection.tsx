"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const TEXT_TOKENS = [
  { label: "Display 3XL", class: "text-display-3xl", type: "display" },
  { label: "Display XL", class: "text-display-xl", type: "display" },
  { label: "Header 1", class: "text-h1", type: "display" },
  { label: "Header 3", class: "text-h3", type: "display" },
  { label: "Body 2XL", class: "text-body-2xl", type: "body" },
  { label: "Body Large", class: "text-body-lg", type: "body" },
  { label: "Body Regular", class: "text-body", type: "body" },
  { label: "UI Label", class: "text-ui-label", type: "body" },
];

export default function AnimationsSection() {
  const [selectedToken, setSelectedToken] = useState(TEXT_TOKENS[2]);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const textElement = textRef.current;
    // We use a sample text to preview the font sizes and animation
    const text = "Designing the future of digital experiences.";
    
    textElement.innerHTML = "";
    const words = text.split(" ");
    
    words.forEach((word) => {
      const span = document.createElement("span");
      span.innerText = word + " ";
      span.style.display = "inline-block";
      span.style.opacity = "0"; // initial state before animation
      textElement.appendChild(span);
    });

    const ctx = gsap.context(() => {
      const spans = textElement.querySelectorAll("span");
      
      if (selectedToken.type === "display") {
        // Display & Headers: Cinematic 3D reveal
        gsap.fromTo(spans, 
          { y: 50, opacity: 0, rotateX: -40, rotateY: 10, transformOrigin: "0% 50% -50" }, 
          { 
            y: 0, 
            opacity: 1, 
            rotateX: 0, 
            rotateY: 0,
            duration: 1.2, 
            stagger: 0.05, 
            ease: "power4.out" 
          }
        );
      } else {
        // Body Texts: Smooth subtle slide
        gsap.fromTo(spans, 
          { y: 20, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.015, 
            ease: "power2.out" 
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedToken, key]);

  return (
    <section className="animate-fade-up py-section-md border-t border-[var(--color-border-Strokes-default)]">
      <div className="mb-12">
        <h2 className="text-h2 mb-4">Text Reveal Animations</h2>
        <p className="text-body text-[var(--color-text-muted)] max-w-3xl">
          Visual preview for entrance text animations. Display and Header tokens use a dramatic 3D stagger cinematic reveal, while Body and UI tokens use a faster, smoother fade-up for legibility.
        </p>
      </div>

      <div className="organic-glass-panel p-static-2xl rounded-2xl border border-[var(--color-border-Strokes-default)] overflow-hidden">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-16 items-center justify-between border-b border-[var(--color-border-Strokes-default)] pb-8">
          <div className="flex flex-wrap gap-2">
            {TEXT_TOKENS.map((token) => (
              <button
                key={token.class}
                onClick={() => setSelectedToken(token)}
                className={`px-4 py-2 rounded-full text-ui-label transition-colors ${
                  selectedToken.class === token.class
                    ? "bg-[var(--color-brand-orange)] text-white border-transparent"
                    : "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-Strokes-default)] hover:bg-[var(--color-surface-BG-1)]"
                }`}
              >
                {token.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setKey(k => k + 1)}
            className="px-6 py-2 rounded-full text-ui-label bg-[var(--color-text-primary)] text-[var(--color-surface-BG-1)] hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span>Replay</span>
            <span>↺</span>
          </button>
        </div>

        {/* Animation Canvas */}
        <div 
          ref={containerRef} 
          className="min-h-[300px] flex items-center justify-center relative"
          style={{ perspective: "1200px" }}
        >
          {/* Subtle grid background to contextualize the animation */}
          <div className="absolute inset-0 pointer-events-none" style={{ 
            backgroundImage: "linear-gradient(to right, var(--color-border-Strokes-default) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-Strokes-default) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.2
          }}></div>
          
          <div ref={textRef} className={`${selectedToken.class} text-center max-w-5xl relative z-10`}>
            {/* Populated dynamically by JS word-split */}
          </div>
        </div>
      </div>
    </section>
  );
}
