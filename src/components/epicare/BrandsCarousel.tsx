"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { asset } from "@/lib/asset";

const brands = [
  "68b074e0f62ece962b5d26cb_12.avif",
  "6924b5293a338aeb5544780c_Carriers-07.png",
  "6924b529602b1dc08277528a_Carriers-06.png",
  "6924b529870154589b85171e_Carriers-02.png",
  "6924b529ad93e22a034f7896_Carriers-03.png",
  "6924b529bdf06074e564bab8_Carriers-01.png",
  "6924b529de9cbd3ce5419ddd_Carriers-05.png",
  "6924b529dec6bcff21cf0180_Carriers-08.png",
  "6924b529f48d522301d4f678_Carriers-04.png",
  "6924b52b07df3dbb09496d62_Carriers-09.png",
  "6924b62f10c87c8220173143_Carriers-15.png",
  "6924b62fece2299037e45a6a_Carriers-10.png",
  "6924b6303794cef9459e4a43_Carriers-17.png",
  "6924b6304dd06c62ed8cc5ec_Carriers-16.png",
  "6924b6306a3bd757ac2d534c_Carriers-11.png",
  "6924b6309e1edf2d8c679001_Carriers-14.png"
];

export default function BrandsCarousel() {
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      let cleanupHover = () => {};

      if (carouselTrackRef.current) {
        // GSAP se ejecuta SOLO en Desktop. 
        // En móvil delegamos todo a CSS puro (GPU) para evitar que JS bloquee el hilo principal durante el scroll.
        if (!isMobile) {
          const marqueeTween = gsap.to(carouselTrackRef.current, {
            xPercent: -33.33333,
            ease: "none",
            duration: 45,
            repeat: -1,
            force3D: true
          });

          const track = carouselTrackRef.current;
          const onEnter = () => gsap.to(marqueeTween, { timeScale: 0.2, duration: 1.2, ease: "power2.out" });
          const onLeave = () => gsap.to(marqueeTween, { timeScale: 1, duration: 1.2, ease: "power2.inOut" });

          track.addEventListener('mouseenter', onEnter);
          track.addEventListener('mouseleave', onLeave);

          cleanupHover = () => {
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
          };
        }
      }

      // Scrub de parallax SOLO para Desktop.
      if (!isMobile && scrollWrapperRef.current) {
        gsap.to(scrollWrapperRef.current, {
          x: "-8vw", 
          ease: "none",
          scrollTrigger: {
            trigger: scrollWrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });
      }

      return cleanupHover;
    });

    return () => ctx.revert();
  }, []);

  const renderLogos = (arr: string[], keyPrefix: string) => (
    <>
      {[1, 2, 3].map((setIndex) => (
        <React.Fragment key={`${keyPrefix}-set${setIndex}`}>
          {arr.map((b, i) => (
            <img 
              key={`${keyPrefix}-set${setIndex}-${i}`} 
              src={asset(`/Files/Epicare_Landing/Brand_icons/${b}`)}
              alt="Carrier Logo" 
              loading="lazy"
              decoding="async"
              // Eliminada la clase transition-all. Las transformaciones constantes + transitions pesadas matan la GPU en iOS/Android.
              className="h-[60px] md:h-[70px] w-auto object-contain grayscale opacity-[0.86] md:hover:grayscale-0 md:hover:opacity-100 transition-[filter,opacity] duration-300 dark:invert gpu-layer"
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <section className="relative w-full rounded-t-[32px] overflow-hidden bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] text-[var(--color-text-Black-100)] dark:text-white z-20 flex flex-col justify-start pt-section-sm md:pt-[15vh] pb-section-sm md:pb-section-md transition-colors duration-500">
      
      <div className="w-full flex flex-col items-center px-4">
        
        <div className="relative w-full overflow-hidden flex carousel-mask">
          
          <div ref={scrollWrapperRef} className="flex flex-col will-change-transform">
            
            {/* En móvil, la clase mobile-marquee-anim toma el control vía CSS. En desktop, GSAP anima esto. */}
            <div ref={carouselTrackRef} className="flex w-max items-center gap-fluid-md px-4 md:px-8 py-4 will-change-transform mobile-marquee-anim">
              {renderLogos(brands, 'carousel')}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        /* Aislamiento estricto de GPU para las imágenes */
        .gpu-layer {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .carousel-mask {
          mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, black 25%, black 75%, rgba(0,0,0,0.2) 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, black 25%, black 75%, rgba(0,0,0,0.2) 90%, transparent 100%);
        }

        @media (max-width: 767px) {
          @keyframes marquee-mob {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.33333%, 0, 0); }
          }
          /* Animación 100% CSS en móvil. No bloquea el hilo principal de JS durante el scroll. */
          .mobile-marquee-anim {
            animation: marquee-mob 70s linear infinite;
          }
        }

        @media (min-width: 768px) {
          .mobile-marquee-anim {
            animation: none;
          }
          .carousel-mask {
            mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 15%, black 35%, black 65%, rgba(0,0,0,0.2) 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 15%, black 35%, black 65%, rgba(0,0,0,0.2) 85%, transparent 100%);
          }
        }
      `}</style>
    </section>
  );
}
