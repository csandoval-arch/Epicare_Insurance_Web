/**
 * @description Flecha diagonal arriba-derecha de las burbujas de los CTA. Decorativa.
 * `strokeWidth`: 2 por defecto (CTAs de producto); el hero editorial usa 2.5.
 */
export default function ArrowUR({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
