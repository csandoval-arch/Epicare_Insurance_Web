import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

/**
 * @description Resuelve los CLIs globales del Production Sweep Protocol (§3).
 * Se instalan en %USERPROFILE%\Tools y se añaden al PATH de usuario, pero una shell
 * abierta ANTES de la instalación no hereda ese PATH — de ahí el fallback explícito.
 * No hay dependencias npm: el repo no gana peso por optimizar assets.
 */
const CANDIDATES = {
  ffmpeg: [path.join(homedir(), "Tools", "ffmpeg", "bin", "ffmpeg.exe")],
  ffprobe: [path.join(homedir(), "Tools", "ffmpeg", "bin", "ffprobe.exe")],
  cwebp: [path.join(homedir(), "Tools", "libwebp", "bin", "cwebp.exe")],
  dwebp: [path.join(homedir(), "Tools", "libwebp", "bin", "dwebp.exe")],
};

const cache = new Map();

/** @description Devuelve la ruta ejecutable de una herramienta, o lanza con instrucciones. */
export function tool(name) {
  if (cache.has(name)) return cache.get(name);
  for (const c of CANDIDATES[name] ?? []) {
    if (existsSync(c)) {
      cache.set(name, c);
      return c;
    }
  }
  try {
    execFileSync(name, ["-version"], { stdio: "ignore" });
    cache.set(name, name);
    return name;
  } catch {
    throw new Error(
      `[tools] "${name}" no encontrado.\n` +
        `Instálalo según Production Sweep Protocol §3, o refresca el PATH:\n` +
        `  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`,
    );
  }
}

/** @description Ejecuta una herramienta y devuelve stdout. `null` si falla. */
export function run(name, args, { quiet = true } = {}) {
  try {
    return execFileSync(tool(name), args, {
      encoding: "utf8",
      stdio: quiet ? ["ignore", "pipe", "ignore"] : "inherit",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/**
 * @description Metadata del primer stream de vídeo/imagen vía ffprobe.
 * Sirve igual para .jpg que para .mp4 — ffprobe trata una imagen como 1 frame.
 */
export function probe(file) {
  const out = run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,codec_name,duration,bit_rate,r_frame_rate",
    "-of", "json",
    file,
  ]);
  if (!out) return null;
  try {
    const s = JSON.parse(out).streams?.[0];
    if (!s) return null;
    return {
      width: s.width ?? null,
      height: s.height ?? null,
      codec: s.codec_name ?? null,
      duration: s.duration ? Number(s.duration) : null,
      bitrate: s.bit_rate ? Number(s.bit_rate) : null,
      fps: s.r_frame_rate ?? null,
    };
  } catch {
    return null;
  }
}

/** @description true si el contenedor trae al menos una pista de audio. */
export function hasAudio(file) {
  const out = run("ffprobe", [
    "-v", "error",
    "-select_streams", "a",
    "-show_entries", "stream=codec_name",
    "-of", "csv=p=0",
    file,
  ]);
  return Boolean(out && out.trim());
}

/** @description Formatea bytes a una cadena legible y alineable. */
export function fmtBytes(n) {
  if (n >= 1048576) return `${(n / 1048576).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}
