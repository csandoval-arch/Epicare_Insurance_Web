"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { EASE, DUR, STAGGER } from "@/lib/motion";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const LicensePlateIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="6" width="20" height="12" rx="3" />
    <circle cx="6" cy="9" r="0.5" fill="currentColor" />
    <circle cx="18" cy="9" r="0.5" fill="currentColor" />
    <circle cx="6" cy="15" r="0.5" fill="currentColor" />
    <circle cx="18" cy="15" r="0.5" fill="currentColor" />
    <path d="M9 12h6" />
  </svg>
);

const LICENSE_DATA = [
  { state: "Alabama", license: "3003535225" },
  { state: "Alaska", license: "3003982188" },
  { state: "Arizona", license: "3003535260" },
  { state: "Arkansas", license: "3003443843" },
  { state: "California", license: "6015054" },
  { state: "Colorado", license: "885996" },
  { state: "Connecticut", license: "3003465737" },
  { state: "Delaware", license: "3003557135" },
  { state: "DC", license: "3003610803" },
  { state: "Florida", license: "L113976" },
  { state: "Georgia", license: "237842" },
  { state: "Hawaii", license: "3003976077" },
  { state: "Idaho", license: "3003538263" },
  { state: "Illinois", license: "3003322374" },
  { state: "Indiana", license: "4058571" },
  { state: "Iowa", license: "3003554793" },
  { state: "Kansas", license: "19985316" },
  { state: "Kentucky", license: "1396150" },
  { state: "Louisiana", license: "1194072" },
  { state: "Maine", license: "AGN513449" },
  { state: "Maryland", license: "3003482216" },
  { state: "Michigan", license: "151250" },
  { state: "Mississippi", license: "15050531" },
  { state: "Minnesota", license: "40966748" },
  { state: "Missouri", license: "3003426412" },
  { state: "Montana", license: "3003631333" },
  { state: "Nebraska", license: "3003606421" },
  { state: "Nevada", license: "4079187" },
  { state: "New Hampshire", license: "3003610757" },
  { state: "New Jersey", license: "3003440732" },
  { state: "New Mexico", license: "3003553964" },
  { state: "New York", license: "LA-1886859" },
  { state: "North Carolina", license: "3003322317" },
  { state: "North Dakota", license: "3003606444" },
  { state: "Ohio", license: "1615011" },
  { state: "Oklahoma", license: "3003558492" },
  { state: "Oregon", license: "3003487872" },
  { state: "Pennsylvania", license: "1225877" },
  { state: "Rhode Island", license: "3003537579" },
  { state: "South Carolina", license: "3003322515" },
  { state: "South Dakota", license: "10033145" },
  { state: "Tennessee", license: "3003322536" },
  { state: "Texas", license: "2764890" },
  { state: "Utah", license: "1049851" },
  { state: "Vermont", license: "3003610788" },
  { state: "Virginia", license: "161280" },
  { state: "Washington", license: "1298532" },
  { state: "West Virginia", license: "3003486410" },
  { state: "Wisconsin", license: "3003442897" },
  { state: "Wyoming", license: "628119" },
  { state: "Puerto Rico", license: "3004132963" }
];

export default function LicensingGridEpicare() {
  const t = useTranslations("landingV2.licensingGrid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLicense, setSelectedLicense] = useState<{ state: string; license: string } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredData = LICENSE_DATA.filter((item) =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animate items on mount and on search
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    
    const ctx = gsap.context(() => {
      // Layered Unveiling style animation for the grid items
      gsap.fromTo(
        ".license-card",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: DUR.slow,
          ease: EASE.dramatic,
          stagger: STAGGER.tight,
          clearProps: "all"
        }
      );
    }, el);

    return () => ctx.revert();
  }, [searchTerm]);

  // (Body scroll lock removed as we now use an in-place pop-out interaction instead of a full screen overlay)

  return (
    <section className="w-full pt-section-lg md:pt-[250px] pb-section-lg px-gutter-sm md:px-gutter-md relative z-10">
      {/* AWWWARDS MOTION STYLES */}
      <style>{`
        @keyframes smoothExpand { 
          0% { opacity: 0; transform: translate(-50%, -30%) scale(0.95); } 
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 
        }
        .animate-smooth-expand { animation: smoothExpand 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
      
      <div className="max-w-section-lg mx-auto w-full flex flex-col items-start gap-fluid-sm">
        
        {/* Minimalist Header & Search */}
        <div className="flex flex-col items-start justify-start text-left w-full gap-6">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-display-lg text-[var(--color-text-primary)] font-semibold tracking-tight">
              {t("title")}
            </h2>
          </div>

          <div className="relative w-full max-w-md group">
            {/* Minimalist 8px rounded search input with transparent background */}
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-[var(--color-text-hint)] group-focus-within:text-[var(--color-brand-blue)] transition-colors duration-300" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-4 bg-transparent border border-[var(--color-border-Strokes-default)] rounded-lg text-body-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-hint)] focus:outline-none focus:border-[var(--color-brand-blue)] focus:ring-1 focus:ring-[var(--color-brand-blue)]/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Minimalist Grid */}
        <div 
          ref={gridRef} 
          className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-[60] items-start"
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.state} className="relative w-full z-10">
                
                {/* STATIC CARD */}
                <div
                  className="license-card w-full relative border bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] border-[var(--color-border-Strokes-default)] shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 hover:border-[var(--color-brand-blue)]/50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-lg p-static-md flex flex-col items-start gap-2 overflow-hidden"
                >
                  <h3 className="text-body-lg font-medium text-[var(--color-text-primary)]">
                    {item.state}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <LicensePlateIcon className="w-5 h-5 text-[var(--color-brand-orange)] opacity-80" />
                    <span className="text-meta text-[var(--color-text-secondary)] font-mono tracking-wide">
                      {item.license}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-4">
              <SearchIcon className="w-6 h-6 text-[var(--color-text-hint)]" />
              <p className="text-body-lg text-[var(--color-text-secondary)]">
                {t("noResults")} "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
