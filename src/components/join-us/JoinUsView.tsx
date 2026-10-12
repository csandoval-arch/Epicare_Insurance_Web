"use client";

/**
 * @file JoinUsView.tsx
 * @description /join-us — la página a la que lleva cada tarjeta del modal "Join Epicare". Una sola
 * arquitectura para las 4 versiones: el rol sale de `?role=` (textos en `joinUs.roles.<rol>`, formulario
 * y foto en `joinUsData`); sin rol válido, `agent-licensed`.
 * Secciones (contenido del usuario, 2026-10-11): 1 Hero (titular + Contact | panel azul con el formulario) ·
 * 3 Beneficios · 4 Formación (banda azul).
 */

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JoinPathKey } from "@/components/join/joinData";
import { DEFAULT_ROLE, ROLES } from "./joinUsData";
import { useJoinMotion } from "./shared/useJoinMotion";
import JoinUsHero from "./JoinUsHero";
import JoinUsBenefits from "./JoinUsBenefits";
import JoinUsTraining from "./JoinUsTraining";
import UnlicensedBenefits from "./UnlicensedBenefits";
import UnlicensedRoadmap from "./UnlicensedRoadmap";

const isRole = (v: string | null): v is JoinPathKey => !!v && (ROLES as string[]).includes(v);

export default function JoinUsView() {
  const roles = useTranslations("joinUs.roles");
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: JoinPathKey = isRole(roleParam) ? roleParam : DEFAULT_ROLE;
  const rootRef = useRef<HTMLDivElement>(null);

  useJoinMotion(rootRef, role);

  // Al cambiar de rol (navegación vía JoinModal mientras ya estamos en /join-us):
  // 1. Scroll al inicio de la página inmediatamente para ver el nuevo Hero.
  // 2. Refrescar ScrollTrigger tras el cambio de altura/DOM.
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    try {
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      // Ignorar si el navegador no soporta ScrollToOptions
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [role]);

  const roleNs = `joinUs.roles.${roles.has(role) ? role : DEFAULT_ROLE}` as const;

  return (
    <div key={role} ref={rootRef} className="relative w-full bg-[var(--color-hero-ivory)] text-[var(--color-hero-ink)]">
      <JoinUsHero role={role} roleNs={roleNs} />
      {role === "agent-unlicensed" ? (
        <>
          <UnlicensedBenefits />
          <UnlicensedRoadmap />
        </>
      ) : (
        <>
          <JoinUsBenefits role={role} />
          <JoinUsTraining />
        </>
      )}
    </div>
  );
}
