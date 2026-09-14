"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import ProspectsComposition from "./sales-layer/ProspectsComposition";

export default function SalesLayerGoCrm() {
  const t = useTranslations("goCrm.salesLayer");
  const container = useRef<HTMLDivElement>(null);
  const pinWrapper = useRef<HTMLDivElement>(null);

  const items = [
    { 
      num: "01", titleKey: "feature1Title", descKey: "feature1Desc", 
      image: "/Files/Go_CRM/capa de venta/Prospects.jpeg"
    },
    { 
      num: "02", titleKey: "feature2Title", descKey: "feature2Desc", 
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      num: "03", titleKey: "feature3Title", descKey: "feature3Desc", 
      image: "https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=1000&auto=format&fit=crop"
    },
    { 
      num: "04", titleKey: "feature4Title", descKey: "feature4Desc", 
      image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop"
    },
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".spread-panel");
      
      panels.forEach((panel) => {
        const left = panel.querySelector(".half-left");
        const right = panel.querySelector(".half-right");
        gsap.set([left, right], { yPercent: 100 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper.current,
          start: "top top",
          end: () => "+=" + (window.innerHeight * 4), 
          pin: true,
          scrub: 1,
        }
      });

      panels.forEach((panel, i) => {
        const left = panel.querySelector(".half-left");
        const right = panel.querySelector(".half-right");
        const isRightFirst = (i % 2 === 0); 

        if (isRightFirst) {
          tl.to(right, { yPercent: 0, ease: "none", duration: 1 })
            .to(left, { yPercent: 0, ease: "none", duration: 1 }, "-=0.6");
        } else {
          tl.to(left, { yPercent: 0, ease: "none", duration: 1 })
            .to(right, { yPercent: 0, ease: "none", duration: 1 }, "-=0.6");
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  const renderImage = (item: typeof items[0]) => {
    if (item.num === "01") {
      return (
        <div className="relative w-full h-full min-h-[50vh] md:min-h-full">
          <ProspectsComposition />
        </div>
      );
    }
    return (
      <div className="relative w-full h-full min-h-[40vh]">
        <Image 
          src={item.image} 
          alt="Editorial visual"
          fill
          className="object-cover sepia-[0.2]"
        />
      </div>
    );
  };

  const renderText = (item: typeof items[0]) => {
    const rawText = t(item.descKey);
    const bullets = rawText.split('. ').filter(b => b.trim().length > 0);
    
    return (
      <div className="max-w-xl text-left w-full">
        <h3 className="text-display font-bold tracking-tight mb-8 md:mb-12 leading-tight uppercase break-words xl:break-normal">
          {t(item.titleKey)}
        </h3>
        <ul className="flex flex-col gap-4">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-2.5 shrink-0" />
              <p className="text-body-lg leading-relaxed text-[var(--color-text-secondary)]">
                {bullet}{!bullet.endsWith('.') && !bullet.endsWith('?') && !bullet.endsWith('!') ? '.' : ''}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section ref={container} className="w-full bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] relative">
      
      <div ref={pinWrapper} className="w-full h-screen relative overflow-hidden bg-[var(--color-surface-BG-base)]">
        
        {/* Base Layer: Intro Header stays pinned in the background */}
        <div className="absolute inset-0 flex flex-col justify-center max-w-section-xl mx-auto px-gutter-md md:px-gutter-xl z-0">
          <h2 className="text-h5 uppercase tracking-widest text-[var(--color-text-muted)] mb-6 md:mb-12">
            {t("overline")}
          </h2>
          <p className="text-display-lg md:text-display-xl font-medium tracking-tight leading-tight max-w-5xl">
            {t.rich("title", {
              blue: (chunks) => <span className="text-[var(--color-brand-blue)]">{chunks}</span>
            })}
          </p>
        </div>

        {/* The panels slide OVER the intro text */}
        {items.map((item, i) => (
          <div 
            key={i} 
            className="spread-panel absolute inset-0 w-full h-full flex flex-col md:flex-row"
            style={{ zIndex: i + 10 }}
          >
            {/* Physical Left Page (Text aligns right/center towards spine) */}
            <div className={`half-left w-full md:w-1/2 h-1/2 md:h-full bg-[var(--color-surface-BG-base)] flex items-center justify-center ${i % 2 !== 0 ? 'px-gutter-md py-section-sm md:justify-end md:pr-12 lg:pr-24' : ''} border-b border-[var(--color-border-Strokes-default)] md:border-b-0 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden`}>
              {i % 2 === 0 ? renderImage(item) : renderText(item)}
            </div>

            {/* Physical Right Page (Text aligns left/center towards spine) */}
            <div className={`half-right w-full md:w-1/2 h-1/2 md:h-full bg-[var(--color-surface-BG-base)] flex items-center justify-center ${i % 2 === 0 ? 'px-gutter-md py-section-sm md:justify-start md:pl-12 lg:pl-24' : ''} shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden`}>
              {i % 2 === 0 ? renderText(item) : renderImage(item)}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
