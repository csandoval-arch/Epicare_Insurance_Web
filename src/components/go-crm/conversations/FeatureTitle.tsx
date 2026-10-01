/**
 * @description Título de una feature de "Conversaciones" con su icono (desktop y slider móvil).
 */

import { CONV_ICONS } from "./ConvIcons";
import type { ConvFeature } from "./convData";

export default function FeatureTitle({ card, index, className = "" }: { card: ConvFeature; index: number; className?: string }) {
  const Icon = CONV_ICONS[index];
  return (
    <h3 className={`flex items-start gap-static-sm text-h5 text-[var(--color-text-primary)] ${className}`}>
      <Icon className="w-4 h-4 shrink-0 mt-[0.3em] text-[var(--color-brand-blue)]" />
      {card.title}
    </h3>
  );
}
