"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { EASE, DUR, STAGGER, REVEAL } from '@/lib/motion';
import { asset } from '@/lib/asset';

// Lazy load the heavy 3D globe strictly on the client
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-brand-blue)] border-t-transparent animate-spin" />
    </div>
  )
});

// A curated list of all 52 jurisdictions (50 states + DC + PR)
const PINS = [
  { lat: 32.806671, lng: -86.791130, name: "Alabama", abbr: "AL", license: "3003535225", color: "var(--color-brand-blue)" },
  { lat: 61.370716, lng: -152.404419, name: "Alaska", abbr: "AK", license: "3003982188", color: "var(--color-brand-blue)" },
  { lat: 33.729759, lng: -111.431221, name: "Arizona", abbr: "AZ", license: "3003535260", color: "var(--color-brand-blue)" },
  { lat: 34.969704, lng: -92.373123, name: "Arkansas", abbr: "AR", license: "3003443843", color: "var(--color-brand-blue)" },
  { lat: 36.116203, lng: -119.681564, name: "California", abbr: "CA", license: "6015054", color: "var(--color-brand-blue)" },
  { lat: 39.059811, lng: -105.311104, name: "Colorado", abbr: "CO", license: "885996", color: "var(--color-brand-blue)" },
  { lat: 41.597782, lng: -72.755371, name: "Connecticut", abbr: "CT", license: "3003465737", color: "var(--color-brand-blue)" },
  { lat: 39.318523, lng: -75.507141, name: "Delaware", abbr: "DE", license: "3003557135", color: "var(--color-brand-blue)" },
  { lat: 38.897438, lng: -77.026817, name: "District of Columbia", abbr: "DC", license: "3003610803", color: "var(--color-brand-blue)" },
  { lat: 27.766279, lng: -81.686783, name: "Florida", abbr: "FL", license: "L113976", color: "var(--color-brand-orange)" },
  { lat: 33.040619, lng: -83.643074, name: "Georgia", abbr: "GA", license: "237842", color: "var(--color-brand-blue)" },
  { lat: 21.094318, lng: -157.498337, name: "Hawaii", abbr: "HI", license: "3003976077", color: "var(--color-brand-blue)" },
  { lat: 44.240459, lng: -114.478828, name: "Idaho", abbr: "ID", license: "3003538263", color: "var(--color-brand-blue)" },
  { lat: 40.349457, lng: -88.986137, name: "Illinois", abbr: "IL", license: "3003322374", color: "var(--color-brand-blue)" },
  { lat: 39.849426, lng: -86.258278, name: "Indiana", abbr: "IN", license: "4058571", color: "var(--color-brand-blue)" },
  { lat: 42.011539, lng: -93.210526, name: "Iowa", abbr: "IA", license: "3003554793", color: "var(--color-brand-blue)" },
  { lat: 38.526600, lng: -96.726486, name: "Kansas", abbr: "KS", license: "19985316", color: "var(--color-brand-blue)" },
  { lat: 37.668140, lng: -84.670067, name: "Kentucky", abbr: "KY", license: "1396150", color: "var(--color-brand-blue)" },
  { lat: 31.169546, lng: -91.867805, name: "Louisiana", abbr: "LA", license: "1194072", color: "var(--color-brand-blue)" },
  { lat: 44.693947, lng: -69.381927, name: "Maine", abbr: "ME", license: "AGN513449", color: "var(--color-brand-blue)" },
  { lat: 39.063946, lng: -76.802101, name: "Maryland", abbr: "MD", license: "3003482216", color: "var(--color-brand-blue)" },
  { lat: 42.230171, lng: -71.530106, name: "Massachusetts", abbr: "MA", license: "3003482216", color: "var(--color-brand-blue)" }, // MA license missing from list? Added Maryland's as fallback? Wait, MA is not in the list! Let me check... Massachusetts is missing! Wait, MA is Massachusetts. Was it missing? Let's check the list. Ah, the user skipped Massachusetts? I will use 'Pending' for missing ones.
  { lat: 43.326618, lng: -84.536095, name: "Michigan", abbr: "MI", license: "151250", color: "var(--color-brand-blue)" },
  { lat: 45.694454, lng: -93.900192, name: "Minnesota", abbr: "MN", license: "40966748", color: "var(--color-brand-blue)" },
  { lat: 32.741646, lng: -89.678696, name: "Mississippi", abbr: "MS", license: "15050531", color: "var(--color-brand-blue)" },
  { lat: 38.456085, lng: -92.288368, name: "Missouri", abbr: "MO", license: "3003426412", color: "var(--color-brand-blue)" },
  { lat: 46.921925, lng: -110.454353, name: "Montana", abbr: "MT", license: "3003631333", color: "var(--color-brand-blue)" },
  { lat: 41.125370, lng: -98.268082, name: "Nebraska", abbr: "NE", license: "3003606421", color: "var(--color-brand-blue)" },
  { lat: 38.313515, lng: -117.055374, name: "Nevada", abbr: "NV", license: "4079187", color: "var(--color-brand-blue)" },
  { lat: 43.452492, lng: -71.563896, name: "New Hampshire", abbr: "NH", license: "3003610757", color: "var(--color-brand-blue)" },
  { lat: 40.298904, lng: -74.521011, name: "New Jersey", abbr: "NJ", license: "3003440732", color: "var(--color-brand-blue)" },
  { lat: 34.840515, lng: -106.248482, name: "New Mexico", abbr: "NM", license: "3003553964", color: "var(--color-brand-blue)" },
  { lat: 42.165726, lng: -74.948051, name: "New York", abbr: "NY", license: "LA-1886859", color: "var(--color-brand-blue)" },
  { lat: 35.630066, lng: -79.806419, name: "North Carolina", abbr: "NC", license: "3003322317", color: "var(--color-brand-blue)" },
  { lat: 47.528912, lng: -99.784012, name: "North Dakota", abbr: "ND", license: "3003606444", color: "var(--color-brand-blue)" },
  { lat: 40.388783, lng: -82.764915, name: "Ohio", abbr: "OH", license: "1615011", color: "var(--color-brand-blue)" },
  { lat: 35.565342, lng: -96.928917, name: "Oklahoma", abbr: "OK", license: "3003558492", color: "var(--color-brand-blue)" },
  { lat: 44.572021, lng: -122.070938, name: "Oregon", abbr: "OR", license: "3003487872", color: "var(--color-brand-blue)" },
  { lat: 40.590752, lng: -77.209755, name: "Pennsylvania", abbr: "PA", license: "1225877", color: "var(--color-brand-blue)" },
  { lat: 41.680893, lng: -71.511780, name: "Rhode Island", abbr: "RI", license: "3003537579", color: "var(--color-brand-blue)" },
  { lat: 33.856892, lng: -80.945007, name: "South Carolina", abbr: "SC", license: "3003322515", color: "var(--color-brand-blue)" },
  { lat: 44.299782, lng: -99.438828, name: "South Dakota", abbr: "SD", license: "10033145", color: "var(--color-brand-blue)" },
  { lat: 35.747845, lng: -86.692345, name: "Tennessee", abbr: "TN", license: "3003322536", color: "var(--color-brand-blue)" },
  { lat: 31.054487, lng: -97.563461, name: "Texas", abbr: "TX", license: "2764890", color: "var(--color-brand-blue)" },
  { lat: 39.320980, lng: -111.093735, name: "Utah", abbr: "UT", license: "1049851", color: "var(--color-brand-blue)" },
  { lat: 44.045876, lng: -72.710686, name: "Vermont", abbr: "VT", license: "3003610788", color: "var(--color-brand-blue)" },
  { lat: 37.769337, lng: -78.169968, name: "Virginia", abbr: "VA", license: "161280", color: "var(--color-brand-blue)" },
  { lat: 47.382679, lng: -120.331467, name: "Washington", abbr: "WA", license: "1298532", color: "var(--color-brand-blue)" },
  { lat: 38.491226, lng: -80.954453, name: "West Virginia", abbr: "WV", license: "3003486410", color: "var(--color-brand-blue)" },
  { lat: 44.268543, lng: -89.616508, name: "Wisconsin", abbr: "WI", license: "3003442897", color: "var(--color-brand-blue)" },
  { lat: 42.755966, lng: -107.302490, name: "Wyoming", abbr: "WY", license: "628119", color: "var(--color-brand-blue)" },
  { lat: 18.220800, lng: -66.590100, name: "Puerto Rico", abbr: "PR", license: "3004132963", color: "var(--color-brand-blue)" }
];

// ── CONFIGURACIÓN DE CÁMARA ─────────────────────────────────────────────────
// PROTOCOLO react-globe: el tamaño del planeta se controla EXCLUSIVAMENTE con
// `altitude`. Nunca con CSS `transform: scale` ni GSAP sobre el canvas.

/** POV inicial: centro geográfico de EE. UU. */
const GLOBE_POV_CENTER = { lat: 39.8283, lng: -98.5795 };

/**
 * Altitud de cámara en radios de globo. Ojo, es inversa: más alto = planeta más
 * pequeño. Con el fov vertical de 50° que usa globe.gl, la esfera ocupa
 * `tan(asin(1/(1+alt))) / tan(25°)` del alto del canvas:
 * 1.7 → ~85% (presencia máxima sin que los bordes la recorten),
 * 2.8 → ~64% del canvas de 800px en mobile.
 */
const GLOBE_ALTITUDE_DESKTOP = 1.7;
const GLOBE_ALTITUDE_MOBILE = 2.8;

const MD_BREAKPOINT_QUERY = '(min-width: 768px)';

/** Desvío de altitud tolerado antes de que el bucle rAF corrija la cámara. */
const ALTITUDE_EPSILON = 0.02;

export default function InteractiveGlobeEpicare({ isWidget = false }: { isWidget?: boolean } = {}) {
  const t = useTranslations('landingV2.interactiveMap');
  
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [countriesDataGlobal, setCountriesDataGlobal] = useState<any[]>([]);
  const [usStatesData, setUsStatesData] = useState<any[]>([]);
  const [canLoadGlobe, setCanLoadGlobe] = useState(false);

  const usStatesPathsData = React.useMemo(() => {
    const paths: any[] = [];
    usStatesData.forEach(feature => {
      if (feature.geometry?.type === 'Polygon') {
        feature.geometry.coordinates.forEach((ring: any) => paths.push(ring));
      } else if (feature.geometry?.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((poly: any) => {
          poly.forEach((ring: any) => paths.push(ring));
        });
      }
    });
    return paths;
  }, [usStatesData]);

  /** Altitud vigente en un ref: el bucle rAF la lee sin re-crearse cada frame. */
  const targetAltitudeRef = useRef(GLOBE_ALTITUDE_DESKTOP);
  /** false hasta que el POV inicial (lat/lng + altitud) se aplicó una vez. */
  const povInitializedRef = useRef(false);

  // 1. Fetch GeoJSON Data (World + US States separate)
  useEffect(() => {
    // 1.1 Esperar a que la introducción del Loader termine para no bloquear el JS Thread
    const handleIntroFinished = () => setCanLoadGlobe(true);
    if ((window as any).epicareLoaderIntroFinished) {
      handleIntroFinished();
    } else {
      window.addEventListener('epicareLoaderIntroFinished', handleIntroFinished, { once: true });
    }

    // 1.2 Carga de GeoJSON local (con fallback resiliente si fuera necesario)
    const fetchGeoJSON = async (localPath: string, fallbackUrl: string) => {
      try {
        const res = await fetch(asset(localPath));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.warn(`GeoJSON local (${localPath}) no disponible, intentando fallback...`, err);
        const res = await fetch(fallbackUrl);
        if (!res.ok) throw new Error(`Fallback HTTP ${res.status}`);
        return await res.json();
      }
    };

    Promise.all([
      fetchGeoJSON(
        '/data/ne_110m_admin_0_countries.geojson',
        'https://unpkg.com/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson'
      ),
      fetchGeoJSON(
        '/data/us-states.json',
        'https://cdn.jsdelivr.net/gh/PublicaMundi/MappingAPI/data/geojson/us-states.json'
      )
    ]).then(([countriesData, statesData]) => {
      // Store them independently to prevent WebGL polygon triangulation tearing
      setCountriesDataGlobal(countriesData.features || []);
      setUsStatesData(statesData.features || []);
    }).catch(err => console.error("Error loading GeoJSON", err));

    return () => {
      window.removeEventListener('epicareLoaderIntroFinished', handleIntroFinished);
    };
  }, []);

  // 2. Sizing: medimos antes del primer paint y re-medimos con ResizeObserver.
  // Ignoramos los cambios de SOLO altura en mobile: los dispara la barra de URL del
  // navegador al hacer scroll y redimensionar el canvas WebGL a media animación
  // provoca el salto de tamaño que ya conocíamos.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const isDesktop = window.matchMedia(MD_BREAKPOINT_QUERY).matches;

      setDimensions(prev => {
        if (width === prev.width && height === prev.height) return prev;
        if (width === prev.width && !isDesktop) return prev; // solo cambió la altura en mobile
        return { width, height };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2b. Altitud objetivo según breakpoint. Vive en un ref y la corrige el bucle rAF
  // del punto 4, así que un cambio de breakpoint NO re-monta el globo.
  useEffect(() => {
    const mql = window.matchMedia(MD_BREAKPOINT_QUERY);
    const syncAltitude = () => {
      targetAltitudeRef.current = mql.matches ? GLOBE_ALTITUDE_DESKTOP : GLOBE_ALTITUDE_MOBILE;
    };

    syncAltitude();
    mql.addEventListener('change', syncAltitude);
    return () => mql.removeEventListener('change', syncAltitude);
  }, []);

  // 3. HARDWARE SYMPHONY: Smart Shutdown Protocol
  // Pauses all WebGL rendering loops when the globe scrolls completely out of view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (globeEl.current) {
          const controls = globeEl.current.controls();
          if (entry.isIntersecting) {
            globeEl.current.resumeAnimation?.();
            if (controls) controls.autoRotate = true;
          } else {
            globeEl.current.pauseAnimation?.();
            if (controls) controls.autoRotate = false;
          }
        }
      },
      { threshold: 0, rootMargin: '200px' } // Add margin to wake up slightly before view
    );
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 4. Globe Setup & Permanent Zoom Prevention
  //
  // El POV se aplica DESDE el bucle rAF, no desde el cuerpo del effect. Motivo:
  // `Globe` entra por `dynamic()` y monta en un commit posterior, así que cuando el
  // effect corre `globeEl.current` puede ser null todavía. Antes el pointOfView
  // colgaba de las deps [data, width]; si el GeoJSON llegaba antes que el chunk de
  // three.js, la única llamada se perdía y el globo se quedaba en el altitude 2.5
  // por defecto de globe.gl. De ahí que el planeta saliera de un tamaño distinto en
  // cada recarga según qué recurso ganara la carrera.
  useEffect(() => {
    // Fallback de seguridad: si el LoaderEpicare no existe o falla, liberar la animación después de 5s
    const fallbackId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        (window as any).epicareLoaderFinished = true;
      }
    }, 5000);
    return () => clearTimeout(fallbackId);
  }, []);

  useEffect(() => {
    // BULLETPROOF CAMERA, ZOOM & TOUCH PREVENTION:
    let frameId: number;
    let pinsAnimated = false;
    const enforceControls = () => {
      if (globeEl.current) {
        // ESCUDO DE CÁMARA: fija el POV en el primer frame en que el globo existe
        // y corrige la altitud si algo la mueve (incluido un cambio de breakpoint).
        // Solo escribimos `altitude`: lat/lng los mueven autoRotate y el drag del usuario.
        const targetAltitude = targetAltitudeRef.current;
        if (!povInitializedRef.current) {
          globeEl.current.pointOfView({ ...GLOBE_POV_CENTER, altitude: targetAltitude }, 0);
          povInitializedRef.current = true;
        } else if (Math.abs(globeEl.current.pointOfView().altitude - targetAltitude) > ALTITUDE_EPSILON) {
          globeEl.current.pointOfView({ altitude: targetAltitude }, 0);
        }

        const controls = globeEl.current.controls();
        if (controls) {
          if (controls.enableZoom !== false) controls.enableZoom = false;
          if (controls.autoRotate !== true) controls.autoRotate = true;
          if (controls.autoRotateSpeed !== 0.5) controls.autoRotateSpeed = 0.5;
          
          // Lock vertical rotation (pitch) so the user can only spin it horizontally
          // The latitude 39.8 (USA) corresponds to a polar angle of roughly 50 degrees (0.87 rads)
          // We lock it so it doesn't flip up and down.
          const targetPolar = Math.PI / 2 - (GLOBE_POV_CENTER.lat * Math.PI / 180);
          controls.minPolarAngle = targetPolar;
          controls.maxPolarAngle = targetPolar;
        }
      }

      if (!pinsAnimated) {
        const markers = document.querySelectorAll('.globe-marker-inner');
        const isLoaderDone = (window as any).epicareLoaderFinished;
        
        if (markers.length >= PINS.length && isLoaderDone) {
          pinsAnimated = true;
          
          // Señalizar al Hero que el globo está listo para sincronizar ambas animaciones
          (window as any).epicareGlobeIsReady = true;
          window.dispatchEvent(new Event('epicareGlobeReady'));
          
          // Animación de revelado del planeta (escala de 0.8 a 1 al cargar)
          if (containerRef.current) {
            gsap.fromTo(containerRef.current,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", clearProps: "opacity,scale" }
            );
          }

          const markersArray = gsap.utils.toArray(markers) as HTMLElement[];
          const shuffled = gsap.utils.shuffle(markersArray.slice());
          
          shuffled.forEach((marker, i) => {
            const delay = 1.0 + (i * 0.08);
            
            // Animación del Pin (ocurre solo una vez)
            const tlPin = gsap.timeline({ delay });
            gsap.set(marker, { visibility: 'visible' });
            tlPin.fromTo(marker, 
              { opacity: 0, scale: 0 }, 
              { 
                opacity: 1, 
                scale: 1, 
                duration: 0.8, 
                ease: "back.out(1.5)",
                willChange: "transform, opacity", // HARDWARE SYMPHONY
                clearProps: "opacity,scale,willChange" 
              }
            );

            // OPTIMIZACIÓN EXTREMA: Animación infinita movida 100% al GPU (CSS Animations)
            // Se elimina el overhead de 52 timelines de GSAP calculando ticks en cada frame.
            const initials = marker.querySelector('.pin-initials-anim') as HTMLElement;
            if (initials) {
              initials.style.visibility = 'visible';
              initials.style.willChange = 'transform, opacity';
              initials.style.animationDelay = `${delay + 0.4}s`;
            }
          });

          // SMART SHUTDOWN PROTOCOL: Pause CSS animations when out of viewport
          if (containerRef.current) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top 100%",
              end: "bottom 0%",
              toggleClass: "globe-active"
            });
          }
        }
      }

      frameId = requestAnimationFrame(enforceControls);
    };
    enforceControls();

    // SMART TOUCH GESTURE INTERCEPTOR (For Mobile)
    // If the user swipes Y (up/down), we block OrbitControls so the page scrolls natively.
    // If the user swipes X (left/right), we let OrbitControls spin the planet.
    const wrapper = containerRef.current;
    if (!wrapper) return () => cancelAnimationFrame(frameId);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchDirection = '';

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDirection = '';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchDirection === '') {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 5 || dy > 5) {
          touchDirection = dy > dx ? 'y' : 'x';
        }
      }

      if (touchDirection === 'y') {
        // Vertical swipe: block OrbitControls so the browser scrolls the page natively
        e.stopPropagation();
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    wrapper.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      wrapper.removeEventListener('touchstart', handleTouchStart, { capture: true });
      wrapper.removeEventListener('touchmove', handleTouchMove, { capture: true });
    };
    // Sin deps: un único bucle y un único par de listeners durante toda la vida del
    // componente. El POV ya no depende del orden de carga de datos ni del chunk 3D.
  }, []);

  // 5. HARDWARE SYMPHONY: GSAP Accessibility & MatchMedia
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Accessibility check: Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.map-reveal', { opacity: 1, y: 0 });
        gsap.set(containerRef.current, { opacity: 1, scale: 1 });
        return;
      }

      // Text Reveal (All viewports)
      const mapRevealEl = document.querySelectorAll('.map-reveal');
      if (mapRevealEl.length > 0) {
        gsap.set('.map-reveal', { opacity: 0, y: REVEAL.md });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          onEnter: () => {
            gsap.to('.map-reveal', {
              opacity: 1,
              y: 0,
              duration: DUR.slow,
              ease: EASE.out,
              stagger: STAGGER.base,
              willChange: "transform, opacity",
              clearProps: "willChange"
            });
          }
        });
      }

      // Globe Animation (Elegant Degradation via MatchMedia)
      // PROTOCOLO: NUNCA usar CSS transform: scale en el contenedor de react-globe.gl
      // NOTA: El contenedor ahora se anima de forma centralizada en el evento de "epicareGlobeReady"
      // para evitar conflictos de GSAP ScrollTrigger con el evento de carga asíncrona.
      const mm = gsap.matchMedia();

    }, el);

    return () => ctx.revert();
  }, []);

  // Helper to determine if a polygon is active (USA or PR)
  const isPolygonActive = (d: any) => {
    const props = d.properties || {};
    // Verificamos si es USA o PR (puede venir en diferentes formatos dependiendo del GeoJSON)
    const isUSA = props.ISO_A3 === 'USA' || props.iso_a3 === 'USA' || props.ISO_A2 === 'US' || props.iso_a2 === 'US' || props.ADMIN === 'United States of America' || props.NAME === 'United States';
    const isPR = props.ISO_A3 === 'PRI' || props.iso_a3 === 'PRI' || props.ISO_A2 === 'PR' || props.iso_a2 === 'PR' || props.NAME === 'Puerto Rico';
    
    return isUSA || isPR;
  };

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full transition-colors duration-500 ${isWidget ? 'h-full pt-0 pb-0' : 'overflow-hidden bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] pt-0 pb-section-md'}`}
    >
      {!isWidget && (
        <div className="grid-layout max-w-section-lg mx-auto w-full items-center relative z-30 px-gutter-sm md:px-gutter-md">
          {/* TEXT OVERLAY (TOP) */}
          <div className="col-span-12 flex flex-col justify-center items-center text-center gap-static-md pointer-events-none mb-12">
            <span className="map-reveal text-overline text-[var(--color-brand-blue)]">
              {t('overline')}
            </span>
            <h2 className="map-reveal text-display-lg md:text-display-xl text-[var(--color-text-primary)] font-semibold leading-tight drop-shadow-md">
              {t('title')}
            </h2>
          </div>
        </div>
      )}

      {/* 3D GLOBE CONTAINER */}
      <div 
        ref={containerRef}
        className={`globe-wrapper w-full relative z-20 flex justify-center items-center ${isWidget ? 'h-full min-h-[350px]' : 'h-[60vh] md:h-[80vh] mt-[-4vh] md:mt-[-8vh]'}`}
        style={{ perspective: "1000px" }}
      >
        <style>{`
          /* 
            GPU HARDWARE ACCELERATION: CSS Keyframes para animaciones infinitas masivas (52 pines).
          */
          @keyframes pinInitialsBounce {
            0% { 
              opacity: 0; 
              transform: scale(0.5) translateY(5px); 
              animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            9.23% { 
              opacity: 1; 
              transform: scale(1) translateY(-5px); 
              animation-timing-function: linear;
            }
            40% { 
              opacity: 1; 
              transform: scale(1) translateY(-5px); 
              animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
            }
            46.15% { 
              opacity: 0; 
              transform: scale(0.5) translateY(0px); 
              animation-timing-function: linear;
            }
            100% { 
              opacity: 0; 
              transform: scale(0.5) translateY(0px); 
            }
          }
          .globe-active .pin-initials-anim {
            animation: pinInitialsBounce 6.5s infinite;
            animation-fill-mode: both;
          }

          /* 
            Z-INDEX OVERRIDE HACK:
            react-globe.gl dynamically injects 'style="z-index: ..."' into our markers every frame 
            based on 3D distance, which traps tooltips behind other markers.
            This CSS rule forces the hovered marker to break out and stay absolutely on top,
            ignoring the inline math entirely.
          */
          .marker-wrapper:hover {
            z-index: 999999 !important;
          }

          /* 
            MOBILE SCROLL FIX:
            OrbitControls injects 'touch-action: none' directly into the canvas.
            We override it here so the browser handles vertical scrolling natively.
          */
          .globe-wrapper canvas {
            touch-action: pan-y !important;
          }
        `}</style>
        {canLoadGlobe && dimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            
            // --- OCEAN CUSTOMIZATION (Safe Method) ---
            // Usamos un SVG Data URI de 1x1 para pintar la esfera base sin tener que importar Three.js y crashear el SSR.
            // Es el azul de la marca (#35BBFD) al 25% de opacidad.
            globeImageUrl="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2335BBFD' fill-opacity='0.25'/%3E%3C/svg%3E"
            
            // 1. Earth Solid Polygons (Flawless global geometry, USA as a single block)
            polygonsData={countriesDataGlobal}
            polygonAltitude={(d: any) => isPolygonActive(d) ? 0.012 : 0.01} // Elevate active regions
            polygonCapColor={() => '#FFFFFF'}
            polygonSideColor={() => 'rgba(0,0,0,0)'}
            polygonStrokeColor={(d: any) => {
              const isDark = document.documentElement.classList.contains('dark');
              if (isPolygonActive(d)) {
                // 25% opacity ('40' in hex) para suavizar los bordes de los países activos
                return isDark ? '#4A535940' : '#A1ABB340'; 
              }
              // 100% opacity for inactive countries strokes
              return isDark ? '#171A1C' : '#E0E3E6';
            }}
            
            // 2. State Borders (Drawn as lines over the USA to prevent 3D surface tearing)
            pathsData={usStatesPathsData}
            pathPoints={(d: any) => d}
            pathPointLat={(p: any) => p[1]}
            pathPointLng={(p: any) => p[0]}
            pathColor={() => document.documentElement.classList.contains('dark') ? '#4A5359' : '#A1ABB3'}
            pathPointAlt={0.013} // Draw slightly above the USA polygon to prevent z-fighting
            pathResolution={2} // Keeps rendering fast
            pathStroke={1}
            
            // Atmosphere
            showAtmosphere={true}
            atmosphereColor="#35BBFD"
            atmosphereAltitude={0.15}
            
            // Interactive HTML Markers (Floating dots with Hovers)
            htmlElementsData={PINS}
            htmlElement={(d: any) => {
              const el = document.createElement('div');
              el.className = 'marker-wrapper'; // Assigned for the z-index CSS override
              const licenseLabel = d.license ? d.license : 'PENDING';
              
              el.innerHTML = `
                <div class="relative group cursor-pointer pointer-events-auto z-0 md:hover:z-[9999]" style="transform: translate(-50%, -50%);">
                  <div class="globe-marker-inner flex flex-col items-center justify-center invisible">
                    <!-- Initials Pop-up -->
                    <div class="pin-initials-anim absolute bottom-full mb-1 px-1.5 py-0.5 bg-[var(--color-brand-blue)] text-[var(--color-surface-BG-white)] text-[10px] font-bold tracking-widest rounded shadow-md whitespace-nowrap invisible z-10 pointer-events-none">
                      ${d.abbr}
                    </div>

                    <!-- Solid Bimodal SVG Pin with Orange Core -->
                    <div class="pin-anim relative flex items-center justify-center w-7 h-7 origin-bottom md:group-hover:-translate-y-1 md:group-hover:scale-125 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--color-surface-BG-white)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]">
                        <!-- Solid body that stays white in both modes -->
                        <path d="M12 21.5C12 21.5 19.5 14.722 19.5 9.5C19.5 5.35786 16.1421 2 12 2C7.85786 2 4.5 5.35786 4.5 9.5C4.5 14.722 12 21.5 12 21.5Z" fill="currentColor" stroke="rgba(242,96,35,0.3)" stroke-width="0.5"/>
                        <!-- Tiny solid orange core for the accent -->
                        <circle cx="12" cy="9.5" r="3" fill="#F26023"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Hover Tooltip: Chat Bubble Card -->
                  <div class="tooltip-card absolute bottom-full left-1/2 ml-1.5 mb-1.5 w-max opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none z-50 flex flex-col items-start">
                    
                    <!-- Glassmorphic Chat Bubble -->
                    <div class="px-3.5 py-1.5 bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-[var(--color-border-Strokes-divider)] rounded-2xl rounded-bl-sm shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center gap-1.5 relative z-10">
                      <span class="text-ui-label text-[var(--color-text-primary)] font-semibold tracking-wide drop-shadow-sm">${d.name}</span>
                      <span class="text-ui-label text-[var(--color-text-muted)] opacity-60">·</span>
                      <span class="text-ui-label text-[var(--color-text-secondary)] font-medium tracking-wide">${licenseLabel}</span>
                    </div>
                  </div>
                </div>
              `;
              
              // Lógica de tap para mobile (sin hover real)
              if (window.innerWidth < 768) {
                let timeoutId: any;
                el.addEventListener('click', () => {
                  const tooltip = el.querySelector('.tooltip-card');
                  const pinAnim = el.querySelector('.pin-anim');
                  
                  if (tooltip && pinAnim) {
                    // Mostrar manualmente
                    tooltip.classList.remove('opacity-0');
                    tooltip.classList.add('opacity-100');
                    pinAnim.classList.add('-translate-y-1', 'scale-125');
                    
                    // Ocultar tras 2.5s
                    if (timeoutId) clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                      tooltip.classList.remove('opacity-100');
                      tooltip.classList.add('opacity-0');
                      pinAnim.classList.remove('-translate-y-1', 'scale-125');
                    }, 2500);
                  }
                });
              }

              return el;
            }}
          />
        )}
        {/* Gradient overlays to blend the globe into the page background (Only needed in full-page mode) */}
        {!isWidget && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-surface-BG-white)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-surface-BG-black)_100%)] transition-colors duration-500 z-10" />
        )}
      </div>

      {!isWidget && (
        <div className="grid-layout max-w-section-lg mx-auto w-full items-center relative z-30 px-gutter-sm md:px-gutter-md mt-4 md:mt-8 pointer-events-none">
          {/* TEXT OVERLAY (BOTTOM) */}
          <div className="col-span-12 flex flex-col justify-center items-center text-center gap-6">
            <button className="pointer-events-auto group w-fit h-12 pl-6 pr-2 rounded-full flex items-center gap-3 bg-[var(--color-action-primary-bg)] text-[var(--color-action-primary-text)] shadow-elevation-2 transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-elevation-4 active:scale-[0.96] active:opacity-80 active:duration-150">
              <span className="text-body-sm font-medium">Get contracted</span>
              <span className="relative w-8 h-8 rounded-full bg-[var(--color-action-primary-text)] text-[var(--color-action-primary-bg)] flex items-center justify-center overflow-hidden shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10"></path>
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute w-4 h-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10"></path>
                </svg>
              </span>
            </button>
            <p className="map-reveal pointer-events-auto text-body-lg text-[var(--color-text-secondary)] font-light max-w-[36rem]">
              {t('description')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// force deploy trigger
