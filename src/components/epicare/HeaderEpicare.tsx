"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "./I18nProviderClient";
import { asset } from "@/lib/asset";
import gsap from "gsap";
import { DUR, EASE, STAGGER, REVEAL } from "@/lib/motion";

interface HeaderEpicareProps {
  isHeaderPill?: boolean;
  isHeaderForcedDark?: boolean;
}

const ArrowUR = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default function HeaderEpicare({
  isHeaderPill = false,
  isHeaderForcedDark = false,
}: HeaderEpicareProps) {
  const t = useTranslations("landingV2.nav");
  const tHero = useTranslations("landingV2.hero");
  const { locale, setLocale } = useLocale();
  const [isDark, setIsDark] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const lastScrollDirection = useRef<'up'|'down'>('up');
  const scrollDistance = useRef(0);

  const isHeaderDark = isHeaderForcedDark || isDark;

  // Clases para dropdowns de navegación (estilo global reutilizado)
  const dropdownBgClass = isHeaderDark 
    ? "bg-white/5 border-white/10 backdrop-blur-md" 
    : "bg-white/50 dark:bg-white/5 border-black/10 dark:border-white/10 backdrop-blur-md";

  // Clases del contenedor del dropdown de lenguaje (mismo estilo que submenús)
  const dropdownContainerClass = `p-static-xs rounded-lg border shadow-elevation-2 backdrop-blur-md ${dropdownBgClass}`;

  // Clases del botón de opción seleccionado
  const optionActiveClass = isHeaderDark
    ? "bg-white/[0.08] text-white font-bold"
    : "bg-black/5 dark:bg-white/[0.08] text-[var(--color-text-Black-100)] dark:text-white font-bold";

  // Clases del botón de opción inactivo
  const optionInactiveClass = isHeaderDark
    ? "text-white/60 hover:text-white hover:bg-white/[0.08]"
    : "text-[var(--color-text-Black-100)]/60 dark:text-white/60 hover:text-[var(--color-text-Black-100)] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.08]";

  const handleMouseEnter = (key: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    // Cambia al instante para máxima reactividad sin delay
    setActiveMenu(key);
  };

  const handleMouseLeaveNav = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    // Solo 50ms para poder cruzar el espacio de 4px (mt-1) entre el botón y el panel
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 50);
  };

  const navItems = [
    {
      key: "about",
      label: t("about"),
      items: [
        { title: t("aboutCompany"), desc: t("aboutCompanyDesc"), href: "#" },
        { title: t("aboutTeam"), desc: t("aboutTeamDesc"), href: "#" },
        { title: t("aboutLicensing"), desc: t("aboutLicensingDesc"), href: "/licensing" },
      ]
    },
    {
      key: "gohub",
      label: t("gohub"),
      items: [
        { title: t("gohubCrm"), desc: t("gohubCrmDesc"), href: "/go-crm" },
        { title: t("gohubAms"), desc: t("gohubAmsDesc"), href: "/go-ams" },
        { title: t("gohubCalls"), desc: t("gohubCallsDesc"), href: "#" },
        { title: t("gohubAcademy"), desc: t("gohubAcademyDesc"), href: "#" },
      ]
    },
    {
      key: "solutions",
      label: t("solutions"),
      items: [
        { title: t("solMarketing"), desc: t("solMarketingDesc"), href: "#" },
        { title: t("solTech"), desc: t("solTechDesc"), href: "#" },
      ]
    }
  ];

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
  }, []);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tlRef.current = tl;

      if (prefersReducedMotion) {
        tl.to(el, { opacity: 1, duration: 0.1 });
        tl.to('.mobile-nav-item', { opacity: 1, duration: 0.1 }, "<");
        return;
      }

      tl.fromTo(el, 
        { clipPath: "circle(0% at 88% 40px)", opacity: 0 },
        {
          clipPath: "circle(150% at 88% 40px)",
          opacity: 1,
          duration: 0.8,
          ease: "power3.inOut"
        }
      );

      tl.fromTo('.mobile-nav-item',
        { y: REVEAL.md, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DUR.base,
          stagger: STAGGER.tight,
          ease: EASE.out,
          force3D: true
        },
        "-=0.4"
      );
    }, mobileMenuRef);

    return () => ctx.revert();
  }, []); // Creado una sola vez

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      tlRef.current?.timeScale(1).play();
    } else {
      document.body.style.overflow = '';
      tlRef.current?.timeScale(1.5).reverse();
      setTimeout(() => setOpenAccordion(null), 600);
    }
  }, [isMobileMenuOpen]);

  // El timeout de cierre del menú solo se limpiaba en el siguiente hover: si el
  // usuario sale del nav y navega, quedaba pendiente un setState sobre un
  // componente ya desmontado.
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const safeZone = window.innerHeight * 2.5;
      
      if (currentScrollY < safeZone) {
        setIsHidden(false);
        scrollDistance.current = 0;
      } else {
        const delta = currentScrollY - lastScrollY.current;
        
        if (delta > 0) {
          // Scrolling down
          if (lastScrollDirection.current !== 'down') {
            lastScrollDirection.current = 'down';
            scrollDistance.current = 0;
          }
          scrollDistance.current += delta;
          
          // Tolerancia brutal: 420px de scroll down antes de desaparecer
          if (scrollDistance.current > 420) {
            setIsHidden(true);
          }
        } else if (delta < 0) {
          // Scrolling up
          lastScrollDirection.current = 'up';
          scrollDistance.current = 0; // Reset for down-scroll
          setIsHidden(false); // Aparece inmediatamente
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLayoutClass = isHeaderPill
    ? "top-[6px] md:top-2 h-[72px]"
    : "top-4 md:top-6 h-[72px]";

  const navPositionClass = `fixed inset-x-0 mx-auto max-w-section-xl w-full transition-all duration-300 z-[999999] ${
    isHeaderPill 
      ? "w-[calc(100%-16px)] md:w-[calc(100%-2*var(--space-gutter-sm))] lg:w-[calc(100%-2*var(--space-gutter-md))]"
      : "w-full md:w-[calc(100%-2*var(--space-gutter-sm))] lg:w-[calc(100%-2*var(--space-gutter-md))]"
  }`;

  const navBgClass = isHeaderPill 
    ? (isHeaderForcedDark || isDark)
      ? "bg-white/5 border-white/10 backdrop-blur-md shadow-elevation-2 rounded-xl border" 
      : "bg-white/80 dark:bg-white/5 border-black/10 dark:border-white/10 backdrop-blur-md shadow-elevation-2 rounded-xl border"
    : "bg-transparent border-transparent shadow-none rounded-xl";



  const iconColorClass = (isHeaderForcedDark || isDark)
    ? "text-white hover:text-white/80"
    : "text-[var(--color-text-Black-100)] hover:opacity-80";

  const secondaryCtaClass = (isHeaderForcedDark || isDark)
    ? "bg-white/10 border-white/40 text-white hover:bg-white/20"
    : "bg-white/50 border-white text-[var(--color-text-primary)] hover:bg-white/80";

  const visibilityClass = isHidden ? "-translate-y-[150%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100";

  return (
    <>
      {/* Background Pill Layer */}
      <div 
        className={`${navPositionClass} ${visibilityClass} pointer-events-none ${navLayoutClass} ${navBgClass} z-[999998] max-w-full ${isMobileMenuOpen ? '!opacity-0 !backdrop-blur-none' : ''}`}
      />

      {/* Controls & Logo Layer */}
      <nav 
        className={`${navPositionClass} ${visibilityClass} flex justify-between items-center px-4 md:px-gutter-md z-[999999] pointer-events-auto max-w-full ${navLayoutClass}`}
      >
        {/* Logo y Switch de Lenguaje en el header */}
        <div 
          id="fixed-navbar-logo" 
          className="flex-shrink-0 flex items-center gap-static-sm"
        >
          <Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer block">
            <img 
              src={asset("/short_logo.svg")}
              alt="Epicare" 
              className="h-[36px] md:h-[44px] w-auto select-none"
            />
          </Link>
          
          {/* Switch de Lenguaje - Mini Dropdown Liquid Glass */}
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-1 text-[11px] font-semibold tracking-wider transition-opacity duration-200 hover:opacity-80 cursor-pointer select-none ${
                isHeaderForcedDark || isDark 
                  ? "text-white" 
                  : "text-[var(--color-text-Black-100)]"
              }`}
            >
              <span>{locale === "es" ? "ES" : "EN"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="8" 
                height="8" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`opacity-60 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Dropdown Menu con efecto Liquid Glass - Wrapper sin brecha de aire */}
            {isLangOpen && (
              <div className="absolute top-full left-0 pt-1.5 z-[999999]">
                <div 
                  className={`p-static-xs rounded-lg border flex flex-col gap-0.5 w-[95px] shadow-elevation-2 backdrop-blur-lg transition-all duration-200 ${dropdownContainerClass}`}
                >
                  <button 
                    onClick={() => { setLocale("es"); setIsLangOpen(false); }}
                    className={`px-2 py-1 rounded text-left text-body-xs font-semibold cursor-pointer transition-colors duration-150 ${
                      locale === "es" ? optionActiveClass : optionInactiveClass
                    }`}
                  >
                    Español
                  </button>
                  <button 
                    onClick={() => { setLocale("en"); setIsLangOpen(false); }}
                    className={`px-2 py-1 rounded text-left text-body-xs font-semibold cursor-pointer transition-colors duration-150 ${
                      locale === "en" ? optionActiveClass : optionInactiveClass
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation (Center) */}
        <div className="hidden md:flex items-center gap-fluid-sm absolute left-1/2 -translate-x-1/2 h-full">
          {navItems.map((item) => (
            <div 
              className="relative h-full flex items-center" 
              key={item.key}
              onMouseEnter={() => handleMouseEnter(item.key)}
              onMouseLeave={handleMouseLeaveNav}
            >
              <button className={`flex items-center h-full text-body-sm transition-colors duration-300 ${iconColorClass}`}>
                <div className="relative flex items-center gap-1.5">
                  {item.label}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`opacity-50 transition-transform duration-300 ${activeMenu === item.key ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {/* Animated Bottom Line - Anchored to text */}
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.2px] bg-current transition-all duration-300 ease-out ${activeMenu === item.key ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></span>
                </div>
              </button>
              
              {/* Dropdown Panel - Single Node for Blur Performance */}
              <div 
                className={`absolute top-[100%] left-1/2 -translate-x-1/2 mt-1 z-[1000000] p-static-xs rounded-lg shadow-elevation-2 border flex flex-col w-[340px] transform-gpu transition-[opacity,transform,visibility] duration-200 ease-out ${dropdownBgClass} ${activeMenu === item.key ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}
              >
                  {item.items.map((subItem, idx) => (
                    <Link href={subItem.href} key={idx} className={`flex flex-col gap-2 p-static-lg rounded-md transition-colors duration-150 ${isHeaderForcedDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/5 dark:hover:bg-white/[0.08]'}`}>
                      <div className="flex flex-col items-start gap-1">
                        <span className={`text-h7 transition-colors duration-200 ${isHeaderForcedDark || isDark ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
                          {subItem.title}
                        </span>
                      </div>
                      <span className={`text-body-xs leading-relaxed ${isHeaderForcedDark || isDark ? 'text-white/70' : 'text-[var(--color-text-Black-100)] opacity-80'}`}>
                        {subItem.desc}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de acción */}
        <div id="fixed-navbar-actions" className={`flex items-center gap-fluid-xs transition-colors duration-300 ${iconColorClass}`}>
          <button 
            id="header-theme-toggle"
            type="button" 
            onClick={toggleTheme} 
            className="w-10 h-10 flex items-center justify-center cursor-pointer relative z-50 transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
          <button 
            id="header-menu-button"
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer relative z-[1000000] transition-opacity hover:opacity-70"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </button>
          
          {/* Botón de Login */}
          <button className="group hidden md:flex h-[44px] pl-5 pr-1.5 rounded-full flex justify-between items-center gap-3 bg-[var(--color-brand-blue)] text-white text-body-sm font-semibold normal-case transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-elevation-1 hover:brightness-105 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 active:scale-95 cursor-pointer">
            <span>{t('login')}</span>
            <span className="relative w-8 h-8 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
              <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
              <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </button>
          
          {/* CTA Desktop Secundario */}
          <button className={`group hidden md:flex h-[44px] pl-5 pr-1.5 rounded-full flex justify-between items-center gap-3 border text-body-sm font-medium normal-case shadow-elevation-1 backdrop-blur-md transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-3 active:scale-95 ${secondaryCtaClass} cursor-pointer`}>
            <span>{t('moreFromEpicare')}</span>
            <span className={`relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
              isHeaderForcedDark || isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-[var(--color-text-primary)]'
            }`}>
              <ArrowUR className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
              <ArrowUR className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU --- */}
      <div 
        className={`fixed inset-0 w-full h-full overflow-hidden z-[999997] md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Full Bleed Mobile Menu Panel with Clip-Path Circular Reveal */}
        <div 
          ref={mobileMenuRef}
          className={`absolute inset-0 opacity-0 overflow-hidden flex flex-col pt-28 px-6 pb-8 ${
            isHeaderForcedDark || isDark
              ? 'bg-black/60 border-white/10 backdrop-blur-[40px]' 
              : 'bg-white/70 border-black/10 backdrop-blur-[40px]'
          }`}
          style={{ clipPath: "circle(0% at 88% 40px)" }}
        >
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-4" style={{ scrollbarWidth: 'none' }}>
            {navItems.map((item) => (
              <div key={item.key} className="mobile-nav-item flex flex-col gap-0 opacity-0 border-b border-[var(--color-border-border)]/10">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                  className={`w-full flex items-center justify-between py-6 text-left ${isHeaderForcedDark || isDark ? 'text-white' : 'text-[var(--color-text-primary)]'}`}
                >
                  <span className="text-display-sm">{item.label}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                    className={`transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${openAccordion === item.key ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ maxHeight: openAccordion === item.key ? '600px' : '0px', opacity: openAccordion === item.key ? 1 : 0 }}
                >
                  <div className="flex flex-col gap-5 pb-6 pt-2 pl-2">
                    {item.items.map((sub, j) => (
                      <Link 
                        key={j} 
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 text-body-xl transition-colors ${
                          isHeaderForcedDark || isDark ? 'text-white/80 hover:text-white' : 'text-[var(--color-text-Black-100)]/80 hover:text-[var(--color-text-Black-100)]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] opacity-80 shrink-0"></span>
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mobile-nav-item mt-auto flex flex-col gap-3 pt-6 opacity-0">
            <Link 
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group w-full flex items-center justify-between h-[56px] pl-8 pr-2 rounded-full bg-[var(--color-brand-blue)] text-white text-body-lg font-semibold transition-transform active:scale-95 shadow-elevation-2"
            >
              <span>{t('login')}</span>
              <span className="relative w-10 h-10 rounded-full bg-white text-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shrink-0">
                <ArrowUR className="absolute w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-6 group-hover:-translate-y-6" />
                <ArrowUR className="absolute w-5 h-5 -translate-x-6 translate-y-6 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </Link>
            <Link 
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group w-full flex items-center justify-between h-[56px] pl-8 pr-2 rounded-full border text-body-lg font-semibold transition-transform active:scale-95 shadow-elevation-1 ${
                isHeaderForcedDark || isDark ? 'bg-white/5 border-white/20 text-white' : 'bg-white/50 border-black/10 text-[var(--color-text-primary)]'
              }`}
            >
              <span>{t('moreFromEpicare')}</span>
              <span className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
                isHeaderForcedDark || isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-[var(--color-text-primary)]'
              }`}>
                <ArrowUR className="absolute w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-6 group-hover:-translate-y-6" />
                <ArrowUR className="absolute w-5 h-5 -translate-x-6 translate-y-6 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
