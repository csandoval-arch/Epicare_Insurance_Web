'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTitle({ children, className = "" }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = containerRef.current;
    if (!el) return;
    
    const ctx = gsap.context(() => {
      // Target elements inside this container safely
      const lines = gsap.utils.toArray(".title-fill-line", el);
      
      gsap.to(lines, {
        backgroundPosition: "0% 0%",
        duration: 1, // 1 second per segment
        stagger: 1,  // Wait exactly 1 second before starting the next segment
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 20%", // Massively expanded scroll distance to naturally slow down the scrub speed
          scrub: 1
        }
      });
    }, el);

    return () => ctx.revert();
  }, [children]);

  return (
    <h2 ref={containerRef} className={className}>
      {children}
    </h2>
  );
}

// True inline wrapper: Zero forced line breaks, sequential background-clip text fill
export function AnimatedTitleLine({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span 
      className={`title-fill-line ${className}`}
      style={{
        // Hard 50/50 edge for maximum sharpness
        backgroundImage: "linear-gradient(to right, currentColor 50%, rgba(128, 128, 128, 0.4) 50%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "100% 0%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        transform: "translateZ(0)" // Critical fix for WebKit compositor bug where text-clip disappears
      } as React.CSSProperties}
    >
      {children}{' '}
    </span>
  );
}
