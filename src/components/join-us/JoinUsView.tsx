"use client";

/**
 * @file JoinUsView.tsx
 * @description /join-us — la página a la que lleva cada tarjeta del modal "Join Epicare". Una sola
 * arquitectura para las 4 versiones: el rol sale de `?role=` (textos en `joinUs.roles.<rol>`, formulario
 * y foto en `joinUsData`); sin rol válido, `agent-licensed`.
 * Secciones (contenido del usuario, 2026-10-11): 1 Hero (titular + Contact | panel azul con el formulario) ·
 * 3 Beneficios · 4 Formación (banda azul).
 */

import { useEffect, useRef, useState } from "react";
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
import FmoBenefits from "./FmoBenefits";
import FmoHowItWorks from "./FmoHowItWorks";
import FmoClosing from "./FmoClosing";
import TrademarkBenefits from "./TrademarkBenefits";
import TrademarkManifesto from "./TrademarkManifesto";
import TrademarkComparison from "./TrademarkComparison";

const isRole = (v: string | null): v is JoinPathKey => !!v && (ROLES as string[]).includes(v);

export default function JoinUsView() {
  const roles = useTranslations("joinUs.roles");
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  // Estado reactivo para asegurar actualización inmediata tanto en local como en static export
  const [activeRole, setActiveRole] = useState<JoinPathKey>(() => {
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      if (isRole(urlRole)) return urlRole;
    }
    return isRole(roleParam) ? roleParam : DEFAULT_ROLE;
  });

  // Sincronizar si searchParams de Next.js cambia (ej. navegación externa entre rutas)
  useEffect(() => {
    const roleFromSearch = searchParams.get("role");
    const target = isRole(roleFromSearch) ? roleFromSearch : DEFAULT_ROLE;
    setActiveRole((prev) => (prev !== target ? target : prev));
  }, [searchParams]);

  // Escuchar evento personalizado emitido desde JoinModal y popstate del navegador
  useEffect(() => {
    const onRoleChange = (e: Event) => {
      const detail = (e as CustomEvent<JoinPathKey>).detail;
      if (isRole(detail)) {
        setActiveRole(detail);
      }
    };

    const onPopState = () => {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      setActiveRole(isRole(urlRole) ? urlRole : DEFAULT_ROLE);
    };

    window.addEventListener("epicareJoinRoleChange", onRoleChange);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("epicareJoinRoleChange", onRoleChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const role: JoinPathKey = activeRole;
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
      ) : role === "agent-licensed" ? (
        <>
          <JoinUsBenefits role={role} />
          <JoinUsTraining />
        </>
      ) : role === "agency-fmo" ? (
        <>
          <FmoBenefits />
          <FmoHowItWorks />
          <FmoClosing />
        </>
      ) : role === "agency-trademark" ? (
        <>
          <TrademarkBenefits />
          <TrademarkManifesto />
          <TrademarkComparison />
        </>
      ) : null}
    </div>
  );
}
