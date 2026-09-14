import React from "react";
import { ReactNode } from "react";

export default function SpacingCard({ 
  label, 
  token, 
  value, 
  usage, 
  visual, 
  options, 
  activeOption, 
  onOptionChange 
}: { 
  label: string, 
  token: string, 
  value: string, 
  usage: string, 
  visual: React.ReactNode,
  options?: string[],
  activeOption?: string,
  onOptionChange?: (opt: string) => void
}) {
  return (
    <div className="p-6 border border-[var(--color-border-Strokes-default)]/50 rounded-2xl bg-[var(--color-surface-BG-base)] flex flex-col justify-between min-h-[15.625rem]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-ui-label text-[var(--color-text-muted)]">{label}</span>
          {options && onOptionChange && (
            <div className="flex gap-1 bg-[var(--color-surface-BG-1)] p-0.5 rounded-lg">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onOptionChange(opt)}
                  className={`px-2 py-0.5 rounded-md text-[0.625rem] font-bold uppercase transition-all ${activeOption === opt ? 'bg-[var(--color-surface-BG-base)] text-[var(--color-text-primary)] shadow-elevation-1' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}`}
                >
                  {opt.replace('py-section-', '').replace('gap-fluid-', '').replace('gap-', '').replace('px-gutter-', '').replace('p-static-', '')}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-h5 text-[var(--color-text-primary)] mb-1">{token}</p>
        <p className="text-caption text-[var(--color-text-muted)] font-mono mb-4">{value}</p>
        <p className="text-caption text-[var(--color-text-muted)] italic mb-6 leading-relaxed">{usage}</p>
      </div>
      <div className="w-full flex items-center justify-center p-4 bg-[var(--color-surface-BG-1)]/30 rounded-xl overflow-hidden min-h-[6.25rem]">
        {visual}
      </div>
    </div>
  );
}