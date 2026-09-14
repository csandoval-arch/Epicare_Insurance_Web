import React from "react";


export default function ColorCard({ name, variable, hex, colorClass, textWhite = false }: { name: string, variable: string, hex: string, colorClass: string, textWhite?: boolean }) {
  return (
    <div className="group cursor-pointer">
      <div className={`w-full aspect-square rounded-2xl mb-4 shadow-elevation-1 border border-[var(--color-border-Strokes-default)] transition-transform duration-300 group-hover:scale-105 ${colorClass}`} />
      <div>
        <p className="text-body font-medium">{name}</p>
        <p className="text-caption text-[var(--color-text-muted)] font-mono">{variable}</p>
        <p className="text-caption text-[var(--color-text-muted)] font-mono">{hex}</p>
      </div>
    </div>
  );
}