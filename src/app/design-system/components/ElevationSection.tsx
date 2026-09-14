import React from 'react';

export function ElevationSection() {
  const elevations = [
    { name: 'Elevation 1', token: 'shadow-elevation-1', desc: 'Sutil. Para botones y cards pequeñas.' },
    { name: 'Elevation 2', token: 'shadow-elevation-2', desc: 'Dropdowns y cards estándar.' },
    { name: 'Elevation 3', token: 'shadow-elevation-3', desc: 'Hover states y pequeños modales.' },
    { name: 'Elevation 4', token: 'shadow-elevation-4', desc: 'Modales y diálogos principales.' },
    { name: 'Elevation 5', token: 'shadow-elevation-5', desc: 'Superficies flotantes y hero popups.' },
  ];

  return (
    <section className="w-full py-section-md px-gutter-md border-b border-[var(--color-border-Strokes-default)]">
      <div className="max-w-[var(--max-w-section-lg)] mx-auto flex flex-col gap-fluid-lg">
        
        {/* Header */}
        <div className="flex flex-col gap-fluid-xs">
          <h2 className="text-display-sm text-[var(--color-text-primary)]">Elevation & Shadows</h2>
          <p className="text-body-lg text-[var(--color-text-secondary)] max-w-[600px]">
            Sistema de sombras difusas profesionales. Inspirado en librerías top-tier para una estética limpia, multicapa y casi imperceptible.
          </p>
        </div>

        {/* Visualizer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-md">
          {elevations.map((elevation) => (
            <div 
              key={elevation.token}
              className={`bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] rounded-xl p-8 flex flex-col gap-4 ${elevation.token} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="text-h4 text-[var(--color-text-primary)]">{elevation.name}</span>
              </div>
              <div className="bg-[var(--color-surface-BG-base)] p-3 rounded-lg border border-[var(--color-border-Strokes-default)]">
                <code className="text-ui-label text-[var(--color-brand-blue)]">.{elevation.token}</code>
              </div>
              <p className="text-body-sm text-[var(--color-text-secondary)] mt-auto">
                {elevation.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
