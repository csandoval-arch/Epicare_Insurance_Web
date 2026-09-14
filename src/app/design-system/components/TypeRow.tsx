import React from "react";


/**
 * @description Single row in the interactive Typography inventory. The preview text
 * renders with ONLY its token class applied, so the font-family declared by the
 * `@utility` (Inter Display / Inter Tight / JetBrains Mono) is what shows — no inline
 * override. `font` is a display-only label naming the family/role of the token.
 */
export default function TypeRow({ token, name, font, text, details }: { token: string, name: string, font: string, text: string, overrideFont?: string, details?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-[var(--color-border-Strokes-default)]/50 pb-8 last:border-0 last:pb-0">
      <div className="w-64 shrink-0">
        <p className="text-ui-label text-[var(--color-text-muted)] mb-1">{name}</p>
        <p className="text-caption font-mono bg-[var(--color-surface-BG-1)] px-2 py-1 rounded inline-block">{token}</p>
        <p className="text-caption text-[var(--color-text-muted)] mt-2 uppercase">{font}</p>
        {details && <p className="text-caption text-[var(--color-text-hint)] mt-2 whitespace-pre-line leading-relaxed border-t border-[var(--color-border-Strokes-default)]/30 pt-2">{details}</p>}
      </div>
      <div className="flex-1">
        <p className={token.replace(".", "")}>{text}</p>
      </div>
    </div>
  );
}