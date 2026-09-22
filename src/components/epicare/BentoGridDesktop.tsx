"use client";

import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { asset, posterFor } from "@/lib/asset";
import GoHubLogo from "./GoHubLogo";
import SmartVideo from "./SmartVideo";

// ----------------------------------------------------------------------
// LOGOS 
// ----------------------------------------------------------------------
function CrmLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 192 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M144.984 50.7739H142.714V54.8659H145.004C145.774 54.8659 146.344 54.6759 146.716 54.2979C147.088 53.9199 147.274 53.4159 147.274 52.7899C147.274 52.1639 147.092 51.6879 146.726 51.3219C146.36 50.9559 145.78 50.7739 144.984 50.7739Z" fill="currentColor"/>
      <path d="M166.592 43.738H124.83C122.552 53.58 115.744 61.698 106.724 65.774H172.314V49.46C172.314 46.3 169.752 43.738 166.592 43.738ZM129.07 57.812C129.37 58.498 129.804 59.026 130.372 59.398C130.94 59.77 131.622 59.956 132.418 59.956C133.28 59.956 133.97 59.77 134.492 59.398C135.014 59.026 135.36 58.508 135.53 57.842H138.544C138.282 59.264 137.618 60.384 136.548 61.2C135.478 62.016 134.114 62.424 132.458 62.424C131.088 62.424 129.906 62.128 128.914 61.534C127.922 60.94 127.158 60.112 126.624 59.048C126.088 57.984 125.822 56.754 125.822 55.358C125.822 53.962 126.09 52.728 126.624 51.658C127.158 50.588 127.922 49.752 128.914 49.152C129.906 48.552 131.086 48.252 132.458 48.252C134.116 48.252 135.478 48.67 136.548 49.504C137.618 50.34 138.284 51.514 138.544 53.028H135.53C135.374 52.296 135.03 51.732 134.502 51.334C133.974 50.936 133.278 50.736 132.418 50.736C131.622 50.736 130.94 50.922 130.372 51.294C129.804 51.666 129.37 52.198 129.07 52.89C128.77 53.582 128.62 54.404 128.62 55.356C128.62 56.308 128.77 57.128 129.07 57.812ZM147.058 62.186L144.578 56.862H142.712V62.186H139.972V48.484H145.16C146.268 48.484 147.186 48.674 147.91 49.052C148.634 49.43 149.176 49.936 149.534 50.57C149.892 51.202 150.072 51.91 150.072 52.694C150.072 53.426 149.898 54.11 149.554 54.75C149.208 55.39 148.67 55.902 147.938 56.286C147.77 56.374 147.59 56.45 147.4 56.518L150.188 62.188H147.056H147.058V62.186ZM166.358 62.186H163.618V53.122L160.074 60.266H157.902L154.34 53.122V62.186H151.6V48.484H154.888L159.018 56.92L163.09 48.484H166.36V62.186H166.358Z" fill="currentColor"/>
      <path d="M93.4722 7.02612C78.1922 7.02612 65.6362 18.6801 64.2002 33.5841H77.6382C78.9862 26.0581 85.5602 20.3461 93.4742 20.3461C102.362 20.3461 109.568 27.5521 109.568 36.4401C109.568 45.3281 102.362 52.5341 93.4742 52.5341C88.2002 52.5341 83.5222 49.9941 80.5882 46.0741V62.8801C84.4802 64.7821 88.8502 65.8541 93.4742 65.8541C109.718 65.8541 122.888 52.6861 122.888 36.4401C122.888 20.1941 109.718 7.02612 93.4722 7.02612Z" className="fill-[var(--color-text-Black-100)] dark:fill-[var(--color-text-White-100)] transition-colors duration-500" />
      <path d="M27.8141 20.8321C29.4501 24.6321 31.6981 28.0041 34.3881 30.6781C36.6981 24.6321 42.5501 20.3341 49.4101 20.3341C54.8261 20.3341 59.6141 23.0161 62.5281 27.1201C63.8801 22.6021 66.1901 18.4961 69.2221 15.0341C63.9601 10.0741 56.8741 7.02612 49.0721 7.02612C41.2701 7.02612 34.1321 10.0941 28.8641 15.0881C28.7381 15.2321 28.6041 15.3801 28.4561 15.5361C26.9941 17.0881 27.1901 19.0641 27.8141 20.8301V20.8321Z" fill="currentColor"/>
      <path d="M78.418 37.484H50.206V46.982H61.514C58.568 50.354 54.242 52.49 49.41 52.49C40.53 52.49 33.332 45.292 33.332 36.412C33.332 35.338 33.44 34.29 33.64 33.276C29.834 29.848 26.656 25.326 24.648 20.072C21.516 24.744 19.686 30.364 19.686 36.412C19.686 52.642 32.842 65.798 49.072 65.798C56.362 65.798 63.026 63.138 68.16 58.742L68.918 58.182V65.696H78.416V37.748C78.42 37.66 78.428 37.572 78.432 37.484H78.416H78.418Z" fill="currentColor"/>
      <path d="M130.372 51.294C130.94 50.922 131.622 50.736 132.418 50.736C133.28 50.736 133.974 50.936 134.502 51.334C135.03 51.732 135.374 52.296 135.53 53.028H138.544C138.282 51.514 137.618 50.34 136.548 49.504C135.478 48.67 134.114 48.252 132.458 48.252C131.088 48.252 129.906 48.552 128.914 49.152C127.922 49.752 127.158 50.5879 126.624 51.6579C126.088 52.728 125.822 53.9619 125.822 55.3579C125.822 56.754 126.09 57.984 126.624 59.048C127.158 60.112 127.922 60.94 128.914 61.534C129.906 62.128 131.086 62.424 132.458 62.424C134.116 62.424 135.478 62.016 136.548 61.2C137.618 60.384 138.284 59.266 138.544 57.842H135.53C135.36 58.508 135.014 59.026 134.492 59.398C133.97 59.77 133.278 59.956 132.418 59.956C131.622 59.956 130.94 59.77 130.372 59.398C129.804 59.026 129.37 58.498 129.07 57.812C128.77 57.126 128.62 56.308 128.62 55.356C128.62 54.404 128.77 53.582 129.07 52.89C129.37 52.198 129.804 51.666 130.372 51.294Z" className="fill-white transition-colors duration-500" />
      <path d="M147.94 56.2859C148.67 55.9019 149.208 55.3879 149.556 54.7499C149.902 54.1099 150.074 53.4259 150.074 52.6939C150.074 51.9119 149.894 51.2039 149.536 50.5699C149.176 49.9379 148.636 49.4319 147.912 49.0519C147.188 48.6739 146.27 48.4839 145.162 48.4839H139.974V62.1859H142.714V56.8619H144.58L147.06 62.1859H150.192L147.404 56.5159C147.592 56.4479 147.774 56.3719 147.942 56.2839H147.94V56.2859ZM142.714 50.7739H144.984C145.78 50.7739 146.36 50.9579 146.726 51.3219C147.092 51.6859 147.274 52.1759 147.274 52.7899C147.274 53.4039 147.088 53.9179 146.716 54.2979C146.344 54.6759 145.772 54.8659 145.004 54.8659H142.714V50.7739Z" className="fill-white transition-colors duration-500" />
      <path d="M163.09 48.4839L159.018 56.9219L154.888 48.4839H151.6V62.1859H154.34V53.1239L157.902 60.2679H160.074L163.618 53.1239V62.1859H166.358V48.4839H163.09Z" className="fill-white transition-colors duration-500" />
    </svg>
  );
}

function AmsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 192 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M130.622 56.9801H134.354L132.492 51.5981L130.622 56.9801Z" fill="currentColor"/>
      <path d="M166.592 43.738H124.83C122.552 53.58 115.744 61.698 106.724 65.774H172.314V49.46C172.314 46.3 169.752 43.738 166.592 43.738ZM136.154 62.188L135.092 59.114H129.882L128.814 62.188H125.956L130.948 48.486H134.06L139.052 62.188H136.154ZM154.788 62.188H152.048V53.124L148.504 60.268H146.332L142.77 53.124V62.188H140.03V48.486H143.318L147.448 56.922L151.52 48.486H154.79V62.188H154.788ZM165.73 60.358C165.352 60.978 164.804 61.476 164.086 61.856C163.368 62.234 162.48 62.424 161.424 62.424C160.432 62.424 159.548 62.254 158.772 61.916C157.996 61.576 157.378 61.08 156.922 60.428C156.466 59.776 156.23 58.986 156.218 58.06H159.114C159.128 58.452 159.228 58.804 159.418 59.116C159.608 59.43 159.872 59.678 160.21 59.86C160.548 60.044 160.948 60.134 161.404 60.134C161.808 60.134 162.158 60.068 162.452 59.938C162.746 59.808 162.974 59.624 163.138 59.39C163.302 59.156 163.382 58.868 163.382 58.528C163.382 58.162 163.288 57.85 163.098 57.588C162.908 57.328 162.65 57.106 162.324 56.922C161.998 56.74 161.622 56.574 161.198 56.422C160.774 56.272 160.32 56.118 159.838 55.962C158.754 55.61 157.93 55.14 157.362 54.552C156.794 53.964 156.51 53.182 156.51 52.202C156.51 51.368 156.708 50.656 157.106 50.068C157.504 49.48 158.058 49.03 158.77 48.718C159.482 48.404 160.286 48.248 161.188 48.248C162.09 48.248 162.93 48.408 163.634 48.728C164.338 49.048 164.896 49.508 165.308 50.108C165.718 50.708 165.938 51.42 165.964 52.242H163.028C163.014 51.942 162.93 51.664 162.774 51.41C162.618 51.156 162.402 50.95 162.128 50.794C161.854 50.638 161.528 50.56 161.15 50.56C160.824 50.548 160.526 50.596 160.26 50.706C159.992 50.816 159.78 50.98 159.624 51.196C159.468 51.412 159.39 51.682 159.39 52.008C159.39 52.334 159.468 52.606 159.624 52.82C159.78 53.036 159.998 53.222 160.28 53.378C160.56 53.534 160.89 53.682 161.268 53.818C161.646 53.954 162.058 54.096 162.502 54.238C163.194 54.472 163.826 54.75 164.4 55.07C164.974 55.39 165.434 55.804 165.78 56.312C166.126 56.82 166.298 57.494 166.298 58.328C166.298 59.06 166.108 59.734 165.73 60.354V60.358Z" fill="currentColor"/>
      <path d="M93.4722 7.02612C78.1922 7.02612 65.6362 18.6801 64.2002 33.5841H77.6382C78.9862 26.0581 85.5602 20.3461 93.4742 20.3461C102.362 20.3461 109.568 27.5521 109.568 36.4401C109.568 45.3281 102.362 52.5341 93.4742 52.5341C88.2002 52.5341 83.5222 49.9941 80.5882 46.0741V62.8801C84.4802 64.7821 88.8502 65.8541 93.4742 65.8541C109.718 65.8541 122.888 52.6861 122.888 36.4401C122.888 20.1941 109.718 7.02612 93.4722 7.02612Z" className="fill-[var(--color-text-Black-100)] dark:fill-[var(--color-text-White-100)] transition-colors duration-500" />
      <path d="M27.8141 20.8321C29.4501 24.6321 31.6981 28.0041 34.3881 30.6781C36.6981 24.6321 42.5501 20.3341 49.4101 20.3341C54.8261 20.3341 59.6141 23.0161 62.5281 27.1201C63.8801 22.6021 66.1901 18.4961 69.2221 15.0341C63.9601 10.0741 56.8741 7.02612 49.0721 7.02612C41.2701 7.02612 34.1321 10.0941 28.8641 15.0881C28.7381 15.2321 28.6041 15.3801 28.4561 15.5361C26.9941 17.0881 27.1901 19.0641 27.8141 20.8301V20.8321Z" fill="currentColor"/>
      <path d="M78.418 37.484H50.206V46.982H61.514C58.568 50.354 54.242 52.49 49.41 52.49C40.53 52.49 33.332 45.292 33.332 36.412C33.332 35.338 33.44 34.29 33.64 33.276C29.834 29.848 26.656 25.326 24.648 20.072C21.516 24.744 19.686 30.364 19.686 36.412C19.686 52.642 32.842 65.798 49.072 65.798C56.362 65.798 63.026 63.138 68.16 58.742L68.918 58.182V65.696H78.416V37.748C78.42 37.66 78.428 37.572 78.432 37.484H78.416H78.418Z" fill="currentColor"/>
      <path d="M130.946 48.478L125.954 62.18H128.812L129.88 59.106H135.09L136.152 62.18H139.05L134.058 48.478H130.946ZM130.622 56.972L132.492 51.588L134.352 56.972H130.62H130.622Z" className="fill-white transition-colors duration-500" />
      <path d="M147.448 56.914L143.318 48.478H140.03V62.18H142.77V53.116L146.332 60.262H148.504L152.048 53.116V62.18H154.788V48.478H151.52L147.448 56.914Z" className="fill-white transition-colors duration-500" />
      <path d="M165.78 56.3081C165.434 55.8001 164.974 55.3841 164.4 55.0661C163.826 54.7461 163.192 54.4681 162.502 54.2341C162.058 54.0901 161.648 53.9501 161.268 53.8141C160.89 53.6761 160.56 53.5301 160.28 53.3741C160 53.2181 159.78 53.0321 159.624 52.8161C159.468 52.6001 159.39 52.3301 159.39 52.0041C159.39 51.6781 159.468 51.4081 159.624 51.1921C159.78 50.9761 159.992 50.8141 160.26 50.7021C160.528 50.5921 160.824 50.5421 161.15 50.5561C161.528 50.5561 161.854 50.6341 162.128 50.7901C162.402 50.9461 162.618 51.1521 162.774 51.4061C162.93 51.6601 163.016 51.9381 163.028 52.2381H165.964C165.938 51.4161 165.72 50.7041 165.308 50.1041C164.896 49.5041 164.34 49.0441 163.634 48.7241C162.93 48.4041 162.114 48.2441 161.188 48.2441C160.262 48.2441 159.482 48.4001 158.77 48.7141C158.058 49.0281 157.504 49.4781 157.106 50.0641C156.708 50.6521 156.51 51.3641 156.51 52.1981C156.51 53.1761 156.794 53.9601 157.362 54.5481C157.93 55.1361 158.754 55.6041 159.838 55.9581C160.32 56.1141 160.774 56.2681 161.198 56.4181C161.622 56.5681 161.998 56.7341 162.324 56.9181C162.65 57.1021 162.908 57.3221 163.098 57.5841C163.288 57.8461 163.382 58.1581 163.382 58.5241C163.382 58.8641 163.3 59.1501 163.138 59.3861C162.974 59.6201 162.746 59.8041 162.452 59.9341C162.158 60.0641 161.81 60.1301 161.404 60.1301C160.946 60.1301 160.548 60.0381 160.21 59.8561C159.87 59.6741 159.606 59.4261 159.418 59.1121C159.228 58.7981 159.128 58.4461 159.114 58.0561H156.218C156.23 58.9821 156.466 59.7721 156.922 60.4241C157.378 61.0761 157.996 61.5721 158.772 61.9121C159.548 62.2501 160.432 62.4201 161.424 62.4201C162.48 62.4201 163.368 62.2301 164.086 61.8521C164.804 61.4741 165.352 60.9741 165.73 60.3541C166.108 59.7341 166.298 59.0581 166.298 58.3281C166.298 57.4941 166.124 56.8201 165.78 56.3121V56.3081Z" className="fill-white transition-colors duration-500" />
    </svg>
  );
}

const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
  >
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

// ----------------------------------------------------------------------
// CINEMATIC PANEL (Impeccable Glassmorphism - Hardware Symphony Optimized)
// ----------------------------------------------------------------------
function CinematicPanel({ 
  title, 
  desc, 
  Logo, 
  videoLight, 
  videoDark, 
  ctaText, 
  isAcademy,
  isAms,
  href = '#'
}: { 
  title: string;
  desc: string;
  Logo: React.ComponentType<{ className?: string }>;
  videoLight: string;
  videoDark: string;
  ctaText: string;
  isAcademy?: boolean;
  isAms?: boolean;
  href?: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    // Parallax calculation (range -1 to 1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setParallax({
      x: (x - centerX) / centerX,
      y: (y - centerY) / centerY,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
  };

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-[85vw] lg:w-[65vw] h-[75vh] shrink-0 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-elevation-4 hover:shadow-elevation-6 hover:border-[var(--color-brand-blue)]/50 dark:hover:border-[var(--color-brand-blue)]/50 overflow-hidden flex flex-col md:flex-row group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transform: isHovered 
          ? `perspective(1200px) rotateX(${parallax.y * -3}deg) rotateY(${parallax.x * 3}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }}
    >
      {/* STATIC BACKGROUND LAYER (Minimalist Texture & Ambient Glow) */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[var(--color-surface-BG-white)] dark:bg-[#0D0D0E] overflow-hidden">
        {/* Minimalist Micro-Texture Grid with Radial Fade */}
        <div 
          className="absolute inset-0 text-black dark:text-white opacity-[0.12] dark:opacity-[0.05] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.20] dark:group-hover:opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1.5px, transparent 0)`,
            backgroundSize: '24px 24px',
            maskImage: `radial-gradient(ellipse at top left, black 10%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(ellipse at top left, black 10%, transparent 70%)`
          }}
        />

        {/* Ambient Subtle Aura Glow (Mathematically safe for mix-blend-multiply in light & mix-blend-screen in dark) */}
        <div 
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(53,187,253,0.07)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(53,187,253,0.18)_0%,transparent_70%)] pointer-events-none blur-3xl transition-transform duration-700 ease-out group-hover:scale-110" 
        />
        <div 
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(242,96,35,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(242,96,35,0.09)_0%,transparent_70%)] pointer-events-none blur-3xl transition-transform duration-700 ease-out group-hover:scale-110" 
        />

        {/* Delicate Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/[0.04] dark:to-transparent pointer-events-none" />
      </div>

      {/* TEXT CONTENT (Left side) */}
      <div className="p-10 md:p-16 lg:p-20 w-full md:w-5/12 flex flex-col justify-center h-full relative z-10 bg-transparent pointer-events-none">
         <Logo 
           className={`${isAcademy ? 'h-[52px] lg:h-[68px]' : 'h-[40px] lg:h-[56px]'} w-auto self-start mr-auto mb-8 text-[var(--color-brand-blue)] dark:text-white origin-left transform group-hover:scale-105 transition-transform duration-700 ease-out`} 
         />
         <p className="text-body-lg text-black/60 dark:text-white/80 font-light max-w-sm mb-12 leading-relaxed">
           {desc}
         </p>
         
         {/* Premium Brand-Blue Action CTA with Dual Arrow Motion */}
         <div className="mt-auto md:mt-0 w-fit pointer-events-auto">
           <div className="group/btn h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-[var(--color-brand-blue)] text-white shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_10px_25px_rgba(53,187,253,0.4)] hover:scale-110 hover:shadow-[0_15px_35px_rgba(53,187,253,0.6)] active:scale-[0.96] overflow-hidden relative">
              
              {/* Liquid Wave Hover Background */}
              <div className="absolute inset-0 bg-white/20 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-y-0" />
              
              <span className="relative z-10 text-xs font-bold tracking-[0.15em] uppercase text-white select-none transition-transform duration-300 group-hover/btn:-translate-x-1">{ctaText}</span>
              <span className="relative z-10 w-8 h-8 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm transition-transform duration-500 group-hover/btn:rotate-45 group-hover/btn:scale-110">
                <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-5 group-hover/btn:-translate-y-5" />
                <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
              </span>
           </div>
         </div>
      </div>

      {/* MEDIA CONTENT (Right side) */}
      <div className="w-full md:w-7/12 h-full relative overflow-hidden bg-transparent flex items-center justify-end">
        {isAms ? (
          <div className="relative w-full h-[78%] rounded-l-xl md:rounded-l-[18px] border-l border-y border-black/10 dark:border-white/15 overflow-hidden shadow-elevation-3 bg-[var(--color-surface-BG-1)]">
            <SmartVideo 
              src={videoLight}
              poster={posterFor(videoLight)}
              className="w-full h-full object-cover object-left dark:hidden rounded-l-xl md:rounded-l-[18px]" 
            />
            <SmartVideo 
              src={videoDark}
              poster={posterFor(videoDark)}
              className="w-full h-full object-cover object-left hidden dark:block rounded-l-xl md:rounded-l-[18px]" 
            />
          </div>
        ) : (
          <>
            {/* Light Video - mix-blend-multiply makes white backgrounds completely transparent! */}
            <SmartVideo 
              src={videoLight}
              poster={posterFor(videoLight)}
              className={`absolute inset-0 w-full h-full transition-transform duration-[2s] ease-out mix-blend-multiply dark:hidden ${isAcademy ? 'object-contain scale-[0.85] group-hover:scale-95' : 'object-cover group-hover:scale-105'}`}
            />
            {/* Dark Video - mix-blend-screen makes black backgrounds completely transparent! */}
            <SmartVideo 
              src={videoDark}
              poster={posterFor(videoDark)}
              className={`absolute inset-0 w-full h-full transition-transform duration-[2s] ease-out mix-blend-screen hidden dark:block ${isAcademy ? 'object-contain scale-[0.85] group-hover:scale-95' : 'object-cover group-hover:scale-105'}`}
            />
          </>
        )}
      </div>

    </Link>
  );
}

// ----------------------------------------------------------------------
// MAIN SECTION (Concept A: True GSAP Horizontal Pin - Flawless Execution)
// ----------------------------------------------------------------------
export default function BentoGridDesktop() {
  const t = useTranslations('landingV2.bento');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let ctx: gsap.Context | undefined;
    const section = sectionRef.current;
    if (!section) return;

    // We use a slight delay so images/fonts load, preventing miscalculation of scrollWidth
    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        const track = trackRef.current;
        if (!track) return;

        // 1. Calculate precise horizontal distance to move the track
        const getHorizontalDist = () => track.scrollWidth - window.innerWidth;
        
        // 2. Calculate vertical scroll duration (How long the pin lasts)
        const getVerticalScrollDuration = () => getHorizontalDist() * 0.8;

        // TRUE GSAP PIN
        gsap.to(track, {
          x: () => -getHorizontalDist(),
          ease: "none",
          force3D: true, // HARDWARE SYMPHONY: Force hardware acceleration to prevent compositing lag
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getVerticalScrollDuration()}`,
            pin: true,
            scrub: true, // Syncs with OS native scroll momentum.
            invalidateOnRefresh: true,
          }
        });

        // Force ScrollTrigger to recalculate everything after this pin is created
        ScrollTrigger.refresh();
        
      }, section);
    }, 100);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, []);

  return (
    // OUTER WRAPPER: Protects the Next.js DOM tree from GSAP's pin-spacer height injection
    <div className="relative w-full z-10 bg-white dark:bg-black border-y border-black/5 dark:border-white/10 overflow-hidden">
      
      <section ref={sectionRef} className="h-screen w-full relative">
        
        {/* Immersive Brand Blue Background (Fixed inside sticky container) */}
        <div className="absolute inset-0 -z-20 bg-[var(--color-brand-blue)]">
          {/* Subtle light mesh for texture, without darkening the brand color */}
          <div className="absolute inset-0 bg-white/5" />
        </div>

        {/* The Horizontal Scrolling Track */}
        <div ref={trackRef} className="flex items-center h-full flex-nowrap pl-[15vw] gap-[5vw] lg:gap-[8vw] w-max will-change-transform">
           
           {/* INTRO TITLE PANEL */}
           <div className="w-[70vw] lg:w-[40vw] shrink-0 flex flex-col justify-center">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-elevation-2 transform transition-transform hover:scale-105">
                <GoHubLogo className="w-16 h-16 text-[var(--color-brand-blue)]" />
              </div>
              <h2 className="text-display-lg text-white mb-6 capitalize">
                {t('sectionTitle')}
              </h2>
              <p className="text-body-lg text-white/90 font-light max-w-md leading-relaxed">
                {t.rich('sectionDesc', {
                  b: (chunks) => <strong className="font-semibold text-white">{chunks}</strong>,
                })}
              </p>
           </div>

           {/* PANEL 1: CRM */}
           <CinematicPanel 
              title="GO CRM" 
              desc={t('card4Desc')} 
              Logo={CrmLogo} 
              videoLight={asset("/Files/Features/CRM_Light_Final.mp4")}
              videoDark={asset("/Files/Features/CRM_Dark_Final.mp4")} 
              ctaText={t('cardCta')} 
              href="/go-crm"
           />

           {/* PANEL 2: AMS */}
           <CinematicPanel 
              title="GO AMS" 
              desc={t('card1Desc')} 
              Logo={AmsLogo} 
              videoLight={asset("/Files/Go_AMS/hero/go-ams-hero.mp4")}
              videoDark={asset("/Files/Go_AMS/hero/go-ams-hero.mp4")} 
              ctaText={t('cardCta')} 
              href="/go-ams"
              isAms
           />

           {/* PANEL 3: ACADEMY */}
           <CinematicPanel 
              title="GO ACADEMY" 
              desc={t('card8Desc')} 
              Logo={({ className }: { className?: string }) => (
                <img src={asset('/academy-icon-knockout-blue 1.svg')} alt="GO Academy" className={className} />
              )}
              videoLight={asset("/Files/Features/Academy_V2_Light.mp4")}
              videoDark={asset("/Files/Features/Academy_Dark_Final.mp4")} 
              ctaText={t('cardCta')} 
              isAcademy
           />

           {/* SPACER DIV: Prevents the last card from getting cut off by collapsed padding */}
           <div className="w-[5vw] lg:w-[15vw] h-full shrink-0" />

        </div>
      </section>

    </div>
  );
}
