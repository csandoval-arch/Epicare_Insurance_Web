/**
 * @description Prefixes a public asset path with the deployment base path so
 * raw <img>/<video>/<source> references resolve correctly on GitHub Pages
 * (served under /Epicare). Next.js does NOT auto-prefix raw asset src attributes
 * with basePath — only next/image, next/link and the router — so use this helper
 * for any hardcoded "/..." asset reference.
 *
 * Local dev (no NEXT_PUBLIC_BASE_PATH) resolves to the original root path.
 *
 * @example asset('/short_logo.svg') // -> '/Epicare/short_logo.svg' in CI, '/short_logo.svg' locally
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

/**
 * @description Derives the poster URL of a video: same basename under a sibling
 * `posters/` folder, as .webp. Takes a URL that ALREADY went through asset(),
 * so it must not re-apply the base path.
 *
 * Videos render through <SmartVideo>, which sets preload="none" — without a
 * poster the slot stays empty until the first frame decodes.
 *
 * @example posterFor('/Epicare/Files/Features/CRM_Light_Final.mp4')
 *          // -> '/Epicare/Files/Features/posters/CRM_Light_Final.webp'
 */
export function posterFor(videoUrl: string): string {
  const slash = videoUrl.lastIndexOf("/");
  const dir = videoUrl.slice(0, slash);
  const file = videoUrl.slice(slash + 1).replace(/\.(mp4|webm|mov|m4v)$/i, ".webp");
  return `${dir}/posters/${file}`;
}
