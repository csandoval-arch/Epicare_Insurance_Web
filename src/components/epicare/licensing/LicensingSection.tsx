'use client';

/**
 * @description Licensing section: full-width 3D globe hero + license table.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────────────────────────────┐
 *   │  HEADLINE + STATS (left 40%)  │  3D GLOBE (right 60%)│
 *   └──────────────────────────────────────────────────────┘
 *   ┌──────────────────────────────────────────────────────┐
 *   │         LICENSE TABLE (full width, 3 columns)        │
 *   └──────────────────────────────────────────────────────┘
 *
 * Mobile: globe is centered, full width, 55dvh tall. Table stacks to 1 col.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATE_LICENSES, StateLicense, TOTAL_LICENSES } from './licenseData';
import { EASE, DUR, STAGGER, TRIGGER } from '@/lib/motion';

// ── SSR-safe globe import ──
const EpicareGlobe = dynamic(() => import('./EpicareGlobe'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-label="Loading 3D globe"
    >
      <div
        className="rounded-full animate-pulse"
        style={{
          width:      'min(480px, 80vw)',
          aspectRatio: '1',
          background: 'radial-gradient(circle at 40% 35%, rgba(53,187,253,0.18) 0%, rgba(5,12,30,0.7) 55%, transparent 100%)',
        }}
      />
    </div>
  ),
});

// ── Regions for filter ──
const REGIONS: Record<string, string[]> = {
  all:         STATE_LICENSES.map((s) => s.abbr),
  northeast:   ['CT','DE','DC','ME','MD','MA','NH','NJ','NY','PA','RI','VT'],
  south:       ['AL','AR','FL','GA','KY','LA','MS','NC','OK','SC','TN','TX','VA','WV'],
  midwest:     ['IL','IN','IA','KS','MI','MN','MO','NE','ND','OH','SD','WI'],
  west:        ['AK','AZ','CA','CO','HI','ID','MT','NV','NM','OR','UT','WA','WY'],
  territories: ['PR'],
};
const REGION_LABELS: Record<string, string> = {
  all:'All', northeast:'Northeast', south:'South', midwest:'Midwest', west:'West', territories:'Territories',
};

export default function LicensingSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const [globeSize, setGlobeSize] = useState({ w: 600, h: 600 });
  const [activeRegion, setActiveRegion] = useState('all');
  const [activeState, setActiveState]   = useState<StateLicense | null>(null);

  // ── Measure globe container ──
  useEffect(() => {
    const measure = () => {
      if (!globeWrapRef.current) return;
      const { offsetWidth, offsetHeight } = globeWrapRef.current;
      setGlobeSize({ w: offsetWidth, h: Math.max(offsetHeight, 400) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (globeWrapRef.current) ro.observe(globeWrapRef.current);
    return () => ro.disconnect();
  }, []);

  // ── GSAP entrance ──
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.lgs-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: DUR.base, ease: EASE.out, stagger: STAGGER.base,
          scrollTrigger: { trigger: el, start: TRIGGER.late, once: true },
        }
      );
      gsap.fromTo('.lgs-globe-wrap',
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1,
          duration: DUR.cinematic, ease: EASE.dramatic,
          scrollTrigger: { trigger: el, start: TRIGGER.standard, once: true },
        }
      );
      gsap.fromTo('.lgs-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: DUR.fast, ease: EASE.out,
          stagger: { amount: 0.8 },
          scrollTrigger: { trigger: '.lgs-table', start: TRIGGER.standard, once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // ── Re-animate rows on filter change ──
  useEffect(() => {
    gsap.fromTo('.lgs-row',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: DUR.fast, ease: EASE.snap, stagger: { amount: 0.4 } }
    );
  }, [activeRegion]);

  const filteredStates = STATE_LICENSES.filter((s) =>
    REGIONS[activeRegion]?.includes(s.abbr)
  );

  return (
    <section
      ref={sectionRef}
      id="licensing-grid"
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-surface-BG-black)' }}
    >
      {/* ── GRID TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(53,187,253,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(53,187,253,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* ════════════════════════════════════
          HERO — headline left, globe right
      ════════════════════════════════════ */}
      <div
        className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]"
        style={{ minHeight: 'clamp(500px, 85dvh, 900px)' }}
      >
        {/* ── LEFT: Text ── */}
        <div className="flex flex-col justify-center px-gutter-md py-section-sm lg:py-section-md">
          <p className="lgs-reveal text-overline mb-static-lg" style={{ color: 'var(--color-brand-blue)' }}>
            REGULATORY COMPLIANCE
          </p>

          <h2 className="lgs-reveal text-display-sm md:text-display text-[var(--color-text-White-100)] leading-tight tracking-tight mb-static-xl">
            Licensed Across<br />
            <span style={{ color: 'var(--color-brand-blue)' }}>America</span>
          </h2>

          <p className="lgs-reveal text-body-lg text-[var(--color-text-secondary)] max-w-[36rem] leading-relaxed mb-static-2xl">
            Epicare Insurance holds active state licenses across{' '}
            <strong style={{ color: 'var(--color-text-White-100)' }}>
              {TOTAL_LICENSES} jurisdictions
            </strong>
            , including all 50 states, Washington D.C., and Puerto Rico.
          </p>

          {/* Stats */}
          <div className="lgs-reveal grid grid-cols-3 gap-fluid-xs mb-static-2xl">
            {[
              { v: `${TOTAL_LICENSES}`, l: 'Licenses'       },
              { v: '52',                l: 'Jurisdictions'  },
              { v: '100%',              l: 'Compliant'      },
            ].map(({ v, l }) => (
              <div
                key={l}
                className="text-center p-static-md rounded-[12px] border"
                style={{ borderColor: 'rgba(53,187,253,0.15)', background: 'rgba(53,187,253,0.04)' }}
              >
                <div className="text-display-sm" style={{ color: 'var(--color-brand-blue)' }}>{v}</div>
                <div className="text-ui-label text-[var(--color-text-muted)] mt-static-xs">{l}</div>
              </div>
            ))}
          </div>

          {/* Active state tooltip (desktop) */}
          {activeState && (
            <div
              className="lgs-reveal rounded-[14px] p-static-md"
              style={{
                border: '1px solid rgba(53,187,253,0.4)',
                background: 'rgba(10,22,45,0.9)',
                backdropFilter: 'blur(16px)',
                maxWidth: '320px',
              }}
            >
              <p className="text-meta text-[var(--color-brand-blue)] uppercase tracking-widest mb-static-xs">
                {activeState.abbr} — ACTIVE LICENSE
              </p>
              <p className="text-h5 text-[var(--color-text-White-100)] font-semibold">
                {activeState.name}
              </p>
              <p className="text-data" style={{ color: 'var(--color-brand-blue)' }}>
                {activeState.code}
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Globe ── */}
        <div
          ref={globeWrapRef}
          className="lgs-globe-wrap relative opacity-0"
          style={{
            minHeight: 'clamp(400px, 60dvh, 900px)',
            overflow: 'hidden',
          }}
          aria-label="Interactive 3D globe showing Epicare's licensed states"
        >
          <EpicareGlobe
            width={globeSize.w}
            height={globeSize.h}
            onStateClick={(s) => setActiveState((prev) => prev?.abbr === s.abbr ? null : s)}
          />
        </div>
      </div>

      {/* ════════════════════════════════════
          LICENSE TABLE
      ════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-section-xl mx-auto px-gutter-md pb-section-md">

        {/* Divider */}
        <div
          className="w-full h-px mb-section-xs"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(53,187,253,0.25), transparent)' }}
        />

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-fluid-xs mb-section-xs" role="group" aria-label="Filter licenses by region">
          {Object.keys(REGION_LABELS).map((r) => (
            <button
              key={r}
              id={`filter-${r}`}
              onClick={() => setActiveRegion(r)}
              aria-pressed={activeRegion === r}
              className="text-ui-label px-static-lg py-static-sm rounded-full border cursor-pointer transition-all duration-300"
              style={{
                borderColor: activeRegion === r ? 'var(--color-brand-blue)' : 'rgba(53,187,253,0.2)',
                background:  activeRegion === r ? 'rgba(53,187,253,0.15)' : 'rgba(255,255,255,0.03)',
                color:       activeRegion === r ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
              }}
            >
              {REGION_LABELS[r]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="lgs-table grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-xs">
          {filteredStates.map((st) => (
            <div
              key={st.abbr}
              className="lgs-row flex items-center justify-between p-static-md rounded-[10px] border transition-all duration-200 cursor-default group"
              style={{
                borderColor: activeState?.abbr === st.abbr ? 'rgba(53,187,253,0.5)' : 'rgba(53,187,253,0.1)',
                background:  activeState?.abbr === st.abbr ? 'rgba(53,187,253,0.08)' : 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={() => setActiveState(st)}
              onMouseLeave={() => setActiveState(null)}
            >
              <div className="flex items-center gap-static-md">
                <span
                  className="text-meta font-semibold w-7 text-center shrink-0"
                  style={{ color: 'var(--color-brand-blue)' }}
                >
                  {st.abbr}
                </span>
                <span
                  className="w-px h-4 shrink-0"
                  style={{ background: 'rgba(53,187,253,0.2)' }}
                  aria-hidden="true"
                />
                <span className="text-body-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-White-100)] transition-colors duration-200 truncate">
                  {st.name}
                </span>
              </div>
              <span className="text-data text-[var(--color-text-muted)] ml-static-md shrink-0 group-hover:text-[var(--color-text-accent-blue)] transition-colors duration-200">
                {st.code}
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-caption text-[var(--color-text-muted)] text-center mt-section-xs">
          License numbers are subject to change. Contact your state's Department of Insurance for current information.
        </p>
      </div>
    </section>
  );
}
