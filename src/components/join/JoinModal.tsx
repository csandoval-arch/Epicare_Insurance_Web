"use client";

/**
 * @file JoinModal.tsx
 * @description Modal "Join Epicare" — el paso entre cualquier CTA de unirse y la página de formulario,
 * sobre la carcasa de vidrio líquido compartida (`GlassModal`).
 * Filtro doble en UNA sola vista (sin pantalla intermedia):
 *   Agente  → Soy agente · No soy agente
 *   Agencia → Únete como FMO Partner · Licencia de marca
 * Las dos ramas siempre a la vez (pregunta + sus 2 resultados): un solo clic, sin pestañas.
 * - Desktop: dos columnas con divisor vertical.
 * - Móvil: apiladas en scroll, 2 resultados por fila; `open("agency")` desplaza a esa rama.
 * Cada resultado lleva a la misma página de formulario en su versión (destinos en `joinData.ts`).
 * - Se abre desde cualquier sitio: `joinModalStore.open()` / `open("agency")`, o enlaces `#join`,
 *   `#join-agent`, `#join-agency`. Montado una vez en `app/layout.tsx`.
 */

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import GlassModal from "@/components/glass/GlassModal";
import { branchFromHash, joinModalStore, useJoinModal } from "@/lib/joinModalStore";
import { JOIN_BRANCHES, JOIN_PATHS } from "./joinData";
import { BRANCH_ICON, BranchHead, JoinTile, PATH_ICON } from "./JoinCards";

export default function JoinModal() {
  const t = useTranslations("join");
  const { isOpen, branch: initialBranch, close } = useJoinModal();

  // ── Abrir por hash desde cualquier enlace ──
  useEffect(() => {
    const fromHash = () => {
      const b = branchFromHash(window.location.hash);
      if (b === undefined) return;
      joinModalStore.open(b);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Apiladas en móvil: si se pidió una rama (`open("agency")`, `#join-agency`), la hoja arranca en ella
  const toBranch = (sheet: HTMLElement) => {
    const target = initialBranch && sheet.querySelector<HTMLElement>(`[data-branch="${initialBranch}"]`);
    if (target && window.matchMedia("(max-width: 1023px)").matches) target.scrollIntoView({ block: "start" });
  };

  return (
    <GlassModal open={isOpen} onClose={close} titleId="join-modal-title" title={t("eyebrow")} closeLabel={t("close")} onOpened={toBranch}>
      {/* Las dos ramas. Desktop: dos columnas que comparten filas (subgrid) → cabeceras y tiles alineados
          entre ramas aunque los textos midan distinto; divisor de vidrio centrado. Móvil: apiladas en scroll, sin
          divisor: las separa el espacio (xl). */}
      <div className="relative w-full grid lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-y-static-xl lg:gap-y-static-lg lg:gap-x-[var(--space-section-sm)]">
        <span aria-hidden="true" className="hidden lg:block absolute inset-y-0 left-1/2 w-px bg-[var(--glass-liquid-divider)]" />
        {JOIN_BRANCHES.map((b) => (
          <section
            key={b.key}
            data-branch={b.key}
            aria-label={t(`${b.key}.tag`)}
            className="gm-reveal scroll-mt-static-md flex flex-col gap-static-md lg:gap-static-lg lg:row-span-2 lg:grid lg:grid-rows-subgrid"
          >
            <BranchHead icon={BRANCH_ICON[b.key]} tag={t(`${b.key}.tag`)} title={t(`${b.key}.title`)} body={t(`${b.key}.body`)} />
            <div className="grid grid-cols-2 gap-static-sm lg:gap-static-md">
              {JOIN_PATHS[b.key].map((p) => (
                <JoinTile key={p.key} icon={PATH_ICON[p.key]} title={t(`paths.${p.key}.title`)} text={t(`paths.${p.key}.text`)} more={t("moreInfo")} href={p.href} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </GlassModal>
  );
}
