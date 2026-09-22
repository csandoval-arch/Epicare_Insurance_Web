/**
 * @description Datos de demo de los dashboards de "Métricas" (sección 6). Son cifras fijas: nada de
 * `Math.random()` en render, que rompía la hidratación (el servidor y el cliente pintaban números
 * distintos). Las etiquetas viven en `goCrm.metricsDash` (messages/*.json); los nombres de agentes
 * son datos de muestra y no se traducen.
 */

/** Tiempo que cada página de un carrusel automático queda visible (lo mide un keyframe CSS). */
export const ROTATE_MS = 5000;

/**
 * Paleta de un widget: un color de estado del DS en 4 intensidades (color-mix), así cambia sola
 * con el tema claro/oscuro en vez de fijar hex de Tailwind.
 */
const shades = (token: string) =>
  [100, 70, 45, 25].map((pct) => (pct === 100 ? `var(${token})` : `color-mix(in srgb, var(${token}) ${pct}%, transparent)`));

export interface Segment {
  name: string;
  val: string;
  percent: number;
  color: string;
}

export interface WidgetData {
  /** Clave de la etiqueta en `goCrm.metricsDash.velocity`. */
  key: "open" | "booked" | "abandoned" | "won" | "outbound" | "inbound";
  value: string;
  trend: string;
  trendDown: boolean;
  segments: Segment[];
}

const seg = (token: string, rows: [string, string, number][]): Segment[] => {
  const colors = shades(token);
  return rows.map(([name, val, percent], i) => ({ name, val, percent, color: colors[i] }));
};

export const VELOCITY_WIDGETS: WidgetData[] = [
  {
    key: "open", value: "538", trend: "10.18%", trendDown: true,
    segments: seg("--color-status-blue-main", [["Aura Monast...", "133", 35], ["Felipe Pala...", "130", 30], ["Laura Vivia...", "59", 15], ["Erika Aleja...", "52", 10]]),
  },
  {
    key: "booked", value: "172", trend: "0.00%", trendDown: false,
    segments: seg("--color-status-green-main", [["Felipe Pala...", "93", 55], ["Aura Monast...", "55", 25], ["Erika Aleja...", "13", 10], ["Laura Vivia...", "4", 5]]),
  },
  {
    key: "abandoned", value: "473", trend: "4.83%", trendDown: true,
    segments: seg("--color-text-muted", [["Aura Monast...", "117", 35], ["Felipe Pala...", "114", 30], ["Oswaldo Oje...", "67", 15], ["Alejo Ferna...", "53", 10]]),
  },
  {
    key: "won", value: "144", trend: "23.4%", trendDown: true,
    segments: seg("--color-brand-orange", [["Aura Monast...", "38", 30], ["Felipe Pala...", "29", 25], ["Alejo Ferna...", "24", 15], ["Laura Vivia...", "13", 10]]),
  },
  {
    key: "outbound", value: "10.67K", trend: "17.01%", trendDown: true,
    segments: seg("--color-status-purple-main", [["Felipe Pala...", "2.32K", 35], ["Alejo Ferna...", "1.81K", 25], ["Laura Vivia...", "1.65K", 20], ["Valentina A...", "1.36K", 15]]),
  },
  {
    key: "inbound", value: "567", trend: "31.85%", trendDown: true,
    segments: seg("--color-status-red-main", [["Aura Monast...", "155", 35], ["Felipe Pala...", "104", 30], ["Paula Reyes...", "58", 20], ["Laura Vivia...", "56", 10]]),
  },
];

/** Donuts del pipeline: 2 páginas que rotan (leads asignados / monto generado). */
export const PIPELINE_DONUTS = [
  { key: "assigned", value: "761", trend: "24.95%", accent: "var(--color-brand-blue)", agents: ["214", "187", "96"] },
  { key: "revenue", value: "$9.07K", trend: "25.17%", accent: "var(--color-brand-orange)", agents: ["$3.4K", "$2.9K", "$1.6K"] },
] as const;

export const CHART_X_LABELS = ["22 Aug", "26 Aug", "30 Aug", "03 Sep", "07 Sep", "11 Sep"] as const;

/**
 * Arcos de un donut: longitud de cada tramo y su desplazamiento acumulado sobre la circunferencia.
 * Función pura (sin mutar variables en el render).
 */
export const donutArcs = (percents: number[], circumference: number) =>
  percents.map((p, i) => ({
    dash: (p / 100) * circumference,
    offset: -percents.slice(0, i).reduce((sum, q) => sum + (q / 100) * circumference, 0),
  }));
