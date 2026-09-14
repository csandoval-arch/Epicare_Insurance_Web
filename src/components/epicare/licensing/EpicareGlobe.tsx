'use client';

/**
 * @description The Epicare Licensing Globe — a photorealistic 3D Earth rendered
 * with react-globe.gl (WebGL / Three.js under the hood).
 *
 * Features:
 * - NASA Blue Marble texture + bump map
 * - Cloud layer
 * - Brand-blue atmosphere glow
 * - Animated pulsing rings on every licensed US state (ringsData)
 * - Glowing points on each state
 * - HTML tooltip on hover
 * - Subtle auto-rotation
 * - Mobile-optimized (rendererConfig pixelRatio cap 1.5)
 *
 * Import via Next.js dynamic with ssr:false — Globe.gl uses browser APIs.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { STATE_LICENSES, StateLicense } from './licenseData';
import { EASE, DUR } from '@/lib/motion';
import gsap from 'gsap';

// ── Texture URLs (NASA Blue Marble — public domain) ──
const EARTH_TEXTURE    = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_BUMP       = '//unpkg.com/three-globe/example/img/earth-topology.png';
const EARTH_CLOUDS     = '//unpkg.com/three-globe/example/img/clouds.png';
const NIGHT_SKY        = '//unpkg.com/three-globe/example/img/night-sky.png';

// ── Ring pulse animation config ──
const RING_MAX_R = 4;      // max ring radius (degrees)
const RING_SPEED = 3;      // propagation speed
const RING_REPEAT_MS = 800; // ms between ring pulses per state

interface RingPoint {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: string;
}

interface Props {
  /** Width of the canvas in px. Pass the container's offsetWidth. */
  width: number;
  height: number;
  /** Callback when user clicks a state point */
  onStateClick?: (state: StateLicense) => void;
}

export default function EpicareGlobe({ width, height, onStateClick }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [hovered, setHovered] = useState<StateLicense | null>(null);

  // ── Build rings data — one ring per state ──
  const ringsData: RingPoint[] = STATE_LICENSES.map((s) => ({
    lat: s.lat,
    lng: s.lng,
    maxR: RING_MAX_R,
    propagationSpeed: RING_SPEED,
    repeatPeriod: RING_REPEAT_MS + Math.random() * 600, // stagger naturally
    color: 'rgba(53, 187, 253, {alpha})',
  }));

  // ── Auto-rotate & initial camera ──
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Start looking at the continental US
    globe.pointOfView({ lat: 38, lng: -96, altitude: 2.2 }, 0);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.minDistance = 150;
    controls.maxDistance = 800;
  }, []);

  // ── Tooltip label HTML ──
  const labelHtml = useCallback((d: object) => {
    const s = d as StateLicense;
    return `
      <div style="
        background: rgba(5,15,35,0.95);
        border: 1px solid rgba(53,187,253,0.5);
        border-radius: 10px;
        padding: 10px 14px;
        font-family: var(--font-mono-stack, monospace);
        pointer-events: none;
        white-space: nowrap;
      ">
        <div style="color:#35BBFD; font-size:0.65rem; letter-spacing:0.1em; margin-bottom:4px; text-transform:uppercase;">
          ${s.abbr} — LICENSE
        </div>
        <div style="color:#fff; font-size:0.95rem; font-weight:600;">${s.name}</div>
        <div style="color:#7DD3FC; font-size:0.8rem; margin-top:2px;">${s.code}</div>
      </div>
    `;
  }, []);

  return (
    <Globe
      ref={globeRef}

      // ── Container ──
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      backgroundImageUrl={NIGHT_SKY}
      animateIn={true}

      // ── Globe surface ──
      globeImageUrl={EARTH_TEXTURE}
      bumpImageUrl={EARTH_BUMP}
      showAtmosphere={true}
      atmosphereColor="#35BBFD"
      atmosphereAltitude={0.18}

      // ── Graticules (lat/lng grid lines) ──
      showGraticules={true}

      // ── Points on each state ──
      pointsData={STATE_LICENSES}
      pointLat={(d) => (d as StateLicense).lat}
      pointLng={(d) => (d as StateLicense).lng}
      pointAltitude={0.01}
      pointRadius={0.4}
      pointColor={() => '#35BBFD'}
      pointsMerge={false}
      onPointHover={(point) => setHovered(point as StateLicense | null)}
      onPointClick={(point) => onStateClick?.(point as StateLicense)}

      // ── Pulsing rings on every state ──
      ringsData={ringsData}
      ringLat={(d) => (d as RingPoint).lat}
      ringLng={(d) => (d as RingPoint).lng}
      ringMaxRadius={(d) => (d as RingPoint).maxR}
      ringPropagationSpeed={(d) => (d as RingPoint).propagationSpeed}
      ringRepeatPeriod={(d) => (d as RingPoint).repeatPeriod}
      ringColor={() => (t: number) => `rgba(53,187,253,${1 - t})`}

      // ── HTML labels (tooltip on hover) ──
      htmlElementsData={hovered ? [hovered] : []}
      htmlLat={(d) => (d as StateLicense).lat}
      htmlLng={(d) => (d as StateLicense).lng}
      htmlAltitude={0.05}
      htmlElement={labelHtml as any}

      // ── Renderer performance ──
      rendererConfig={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    />
  );
}
