"use client";

/**
 * @file ContactVsOpportunity.tsx
 * @description Sección 3 de GO CRM — "Un contacto puede ser más de una oportunidad".
 * Acto 1: la ficha del contacto, partida en 3 franjas (clip-path). Con el pin, las franjas salen y
 * revelan el Acto 2: fondo azul + 3 tarjetas de oportunidad (Dental · Health · Vida) de cristal
 * con ilustraciones holográficas. Motion en `contact-vs-opp/useContactVsOppMotion.ts`.
 */

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import MobileContactVsOpp from "./contact-vs-opp/MobileContactVsOpp";
import OppCard, { type OppCopy } from "./contact-vs-opp/OppCard";
import ProfileCard from "./contact-vs-opp/ProfileCard";
import SecondaryCta from "./cta/SecondaryCta";
import { CONTACT_IMAGES, CONTACTS_LEFT, CONTACTS_RIGHT } from "./contact-vs-opp/data";
import { useContactVsOppMotion } from "./contact-vs-opp/useContactVsOppMotion";

/** Espaciadores verticales: arriba, entre título y tarjetas, y abajo miden lo mismo (simetría). */
const Spacer = () => <div className="flex-1 w-full min-h-[2vh] md:min-h-[4vh]" />;

/** Foto de fondo de una franja del Acto 1 (decorativa). */
const SliceImage = ({ src, opacityClass }: { src: string; opacityClass: string }) => (
  <>
    <img
      src={asset(src)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`w-full h-full object-cover ${opacityClass}`}
    />
    <div className="absolute inset-0 bg-[var(--color-brand-blue)]/15 mix-blend-color" />
  </>
);

export default function ContactVsOpportunity() {
  const t = useTranslations("goCrm.contactVsOpp");
  const opps = t.raw("opps") as OppCopy[];
  const comp = useRef<HTMLElement>(null);

  useContactVsOppMotion(comp);

  const italic = (chunks: ReactNode) => <span className="italic font-normal opacity-90">{chunks}</span>;

  return (
    <section
      ref={comp}
      className="w-full md:h-dvh relative md:overflow-hidden"
      style={{ background: "var(--color-brand-dark)" }}
    >
      {/* ── ACTO 2: FONDO AZUL + TARJETAS DE OPORTUNIDAD ── */}
      <div
        className="absolute inset-0 hidden md:flex flex-col items-center px-gutter-md lg:px-gutter-xl"
        style={{ background: "var(--color-brand-blue)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
        />

        <Spacer />

        <div className="a2-title relative z-10 flex flex-col items-center text-center gap-static-sm max-w-3xl shrink-0">
          <p className="a2-rise text-overline text-white/60 tracking-[0.2em] uppercase">{t("overline")}</p>
          <h2 className="text-display-sm md:text-display font-semibold text-[var(--color-text-White-100)]">
            <span className="block overflow-hidden pb-1">
              <span className="a2-birth block">{t.rich("headline", { i: italic })}</span>
            </span>
          </h2>
        </div>

        <Spacer />

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-fluid-sm shrink-0">
          {opps.map((opp, i) => (
            <OppCard key={opp.label} opp={opp} index={i} motionClass="a2-card" />
          ))}
        </div>

        <Spacer />
      </div>

      {/* ── ACTO 1 (≥md): LA FICHA DEL CONTACTO EN 3 FRANJAS ── */}
      <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
        {/* Franja izquierda */}
        <div className="slice-left absolute inset-0 bg-[var(--color-brand-dark)]" style={{ clipPath: "polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%)" }}>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] z-0">
            <SliceImage src={CONTACT_IMAGES.auto} opacityClass="opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end gap-fluid-lg">
            <ProfileCard contacts={CONTACTS_LEFT} rim className="a1-card" />
          </div>
        </div>

        {/* Franja central */}
        <div className="slice-center absolute inset-0 bg-[var(--color-surface-BG-black)]" style={{ clipPath: "polygon(33.33% 0, 66.66% 0, 66.66% 100%, 33.33% 100%)" }}>
          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] z-0 bg-[var(--color-brand-blue)] overflow-hidden">
            <img
              src={asset(CONTACT_IMAGES.blobs)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {/* Cristal ligero, para no apagar el azul */}
            <div className="absolute inset-0 bg-[var(--color-brand-dark)]/20 backdrop-blur-md saturate-125" />
            {/* Viñeteado solo arriba y abajo */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
          </div>

          <div className="absolute top-0 bottom-0 left-[33.33%] w-[33.33%] p-static-lg lg:p-static-xl flex flex-col justify-center items-start">
            <div className="relative z-10 w-full text-left">
              <p className="text-h1 md:text-display-sm lg:text-display font-bold text-[var(--color-text-primary-Reverted)] drop-shadow-md">
                <span className="block overflow-hidden pb-1">
                  <span className="a1-birth block">{t("convergeTitle")}</span>
                </span>
              </p>
              <div className="a1-rule w-24 md:w-32 h-1.5 bg-[var(--color-text-primary-Reverted)] opacity-80 my-static-md rounded-full origin-left"></div>
              <p className="text-h1 md:text-display-sm lg:text-display font-bold text-[var(--color-text-primary-Reverted)] drop-shadow-md">
                <span className="block overflow-hidden pb-1">
                  <span className="a1-birth block">{t("convergeBody")}</span>
                </span>
              </p>
              <SecondaryCta label={t("cta")} className="a1-cta mt-static-xl" />
            </div>
          </div>
        </div>

        {/* Franja derecha */}
        <div className="slice-right absolute inset-0 bg-[var(--color-brand-dark)]" style={{ clipPath: "polygon(66.66% 0, 100% 0, 100% 100%, 66.66% 100%)" }}>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] z-0">
            <SliceImage src={CONTACT_IMAGES.family} opacityClass="opacity-[0.65]" />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-[33.33%] p-static-xl md:p-static-2xl pb-static-xl md:pb-[3.25rem] flex flex-col justify-end items-center">
            <ProfileCard contacts={CONTACTS_RIGHT} offset className="a1-card" />
          </div>
        </div>
      </div>

      {/* ── MÓVIL (<md): ACTO 1 STICKY + HOJA DEL ACTO 2 CON SCROLL NATIVO ── */}
      <MobileContactVsOpp
        overline={t("overline")}
        headline={t.rich("headline", { i: italic })}
        convergeTitle={t("convergeTitle")}
        convergeBody={t("convergeBody")}
        cta={t("cta")}
        opps={opps}
      />
    </section>
  );
}
