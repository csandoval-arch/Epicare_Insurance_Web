/**
 * @description Indicador de los sliders móviles de /team (MOBILE-PATTERN-LIBRARY §1): pista de n × 2rem
 * con el pulgar azul movido por `translate` (compositor) y, si `counter`, el contador 01/0n a la derecha.
 * Decorativo: el contenido real ya lo anuncian las tarjetas.
 */
export default function SlideIndicator({ n, active, counter = false }: { n: number; active: number; counter?: boolean }) {
  return (
    <div className="w-full px-gutter-sm flex items-center justify-between" aria-hidden="true">
      <div className="relative h-1.5 rounded-full bg-[var(--color-border-Strokes-default)] overflow-hidden" style={{ width: `${n * 2}rem` }}>
        <span className="absolute inset-y-0 left-0 w-static-xl rounded-full bg-[var(--color-brand-blue)] transition-[translate] duration-300 ease-out" style={{ translate: `${active * 100}% 0` }} />
      </div>
      {counter && (
        <span className="text-data text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-text-primary)]">{String(active + 1).padStart(2, "0")}</span>/{String(n).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
