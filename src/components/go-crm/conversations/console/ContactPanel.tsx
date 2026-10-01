"use client";

/**
 * @description Réplica 1:1 del panel "Contact Details" de GO CRM (478×1052 px del fotograma).
 * Coordenadas medidas sobre la captura; el texto de interfaz sale de `goCrm.conversations.ui`.
 */

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Box, Icon, InlineIcon, T } from "./ui";
import { AGENT, CONTACT, STORY, TAG_COUNT, TAG_ROWS } from "./data";

export const CONTACT_SIZE = { w: 478, h: 1052 } as const;

const BORDER = "2px solid var(--ui-border)";
const LABEL = { size: 19, color: "var(--ui-text-3)" } as const;
const VALUE = { size: 19, weight: 600 as const };
/** Icono "+" en círculo que acompaña a algunas etiquetas. */
const PLUS = <InlineIcon name="plus" size={20} color="var(--ui-blue)" stroke={1.6} />;
const CARET = <InlineIcon name="chevronDown" size={18} stroke={2.2} />;
const FLAG_STRIPES = [0, 2, 4, 6, 8, 10, 12];

/**
 * Bandera de EE. UU. circular (selector de prefijo). El id del recorte es único por instancia: el
 * panel se monta dos veces (desktop oculto + móvil) y un id repetido resolvería al oculto.
 */
function FlagUS({ x, y }: { x: number; y: number }) {
  const clipId = `cx-flag-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 30 30" className="absolute" style={{ left: x - 15, top: y - 15, width: 30, height: 30 }}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="15" cy="15" r="15" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="30" height="30" fill="var(--ui-card)" />
        {FLAG_STRIPES.map((i) => (
          <rect key={i} y={(i * 30) / 13} width="30" height={30 / 13} fill="var(--ui-flag-red)" />
        ))}
        <rect width="15" height={(30 / 13) * 7} fill="var(--ui-flag-blue)" />
      </g>
    </svg>
  );
}

function TagPill({ tag, className = "" }: { tag: string; className?: string }) {
  return (
    <span
      className={`h-[30px] pl-[11px] pr-[9px] rounded-full inline-flex items-center gap-[6px] whitespace-nowrap ${className}`}
      style={{ background: "var(--ui-pill)", fontSize: 18, color: "var(--ui-text-2)" }}
    >
      {tag}
      <InlineIcon name="x" size={15} color="var(--ui-text-3)" />
    </span>
  );
}

interface FieldProps {
  label: string;
  value?: string;
  labelY: number;
  plus?: boolean;
}

function Field({ label, value, labelY, plus }: FieldProps) {
  return (
    <>
      <T x={49} y={labelY} {...LABEL} className="inline-flex items-center gap-[8px]">
        {label}
        {plus && PLUS}
      </T>
      {value && (
        <T x={49} y={labelY + 37} {...VALUE}>
          {value}
        </T>
      )}
    </>
  );
}

export default function ContactPanel() {
  const t = useTranslations("goCrm.conversations.ui");

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--ui-panel)" }}>
      {/* ── TARJETA DE PROPIETARIO + ETIQUETAS (scrolleada bajo la cabecera) ── */}
      <Box x={24} y={-20} w={420} h={319} style={{ background: "var(--ui-card)", border: BORDER, borderRadius: 16 }} />
      <Box x={44} y={47} w={194} h={36} className="flex items-center gap-[8px] pl-[8px]" style={{ background: "var(--ui-card)", border: BORDER, borderRadius: 18 }}>
        <span className="w-[20px] h-[20px] rounded-full" style={{ background: "var(--ui-blue-circle)" }} />
        <span style={{ fontSize: 19, color: "var(--ui-text-2)" }}>{AGENT}</span>
      </Box>
      <Box x={258} y={47} w={72} h={36} style={{ background: "var(--ui-card)", border: BORDER, borderRadius: 18 }} />

      <T x={44} y={124} size={20} weight={500} color="var(--ui-text-2)" className="inline-flex items-center gap-[8px]">
        <span>
          {t("tags")} (<span className="cx-tag-count">{TAG_COUNT}</span>)
        </span>
        {PLUS}
      </T>
      {TAG_ROWS.map((row, r) => (
        <div key={r} className="absolute flex gap-[8px]" style={{ left: 44, top: 145 + r * 36 }}>
          {row.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {/* Etiquetas de la historia (las añade la automatización al enviar y al firmar) */}
          {r === TAG_ROWS.length - 1 && (
            <>
              <TagPill tag={STORY.tag} className="cx-tag-sent opacity-0" />
              <TagPill tag={STORY.signedTag} className="cx-tag-signed opacity-0" />
            </>
          )}
        </div>
      ))}
      <T x={44} y={265} size={18} weight={500} color="var(--ui-blue)" className="inline-flex items-center gap-[6px]">
        {t("more")}
        {CARET}
      </T>

      {/* ── PESTAÑAS ── */}
      <Box x={24} y={312} w={420} h={39} className="grid grid-cols-3 overflow-hidden" style={{ border: BORDER, borderRadius: 6 }}>
        {[t("allFields"), t("dnd"), t("actions")].map((label, i) => (
          <span
            key={label}
            className="flex items-center justify-center whitespace-nowrap"
            style={{ fontSize: 20, fontWeight: 500, background: i === 0 ? "var(--ui-tab-active)" : "var(--ui-card)", borderLeft: i > 0 ? BORDER : undefined }}
          >
            {label}
          </span>
        ))}
      </Box>

      {/* ── BUSCADOR ── */}
      <Box x={24} y={362} w={420} h={53} style={{ background: "var(--ui-card)", border: "2px solid var(--ui-border-strong)", borderRadius: 8 }} />
      <Icon name="search" x={48} y={389} size={22} />
      <T x={63} y={389} size={20} color="var(--ui-text-2)">
        {t("search")}
      </T>
      <Icon name="filter" x={421} y={389} size={22} color="var(--ui-text-3)" />

      {/* ── ACORDEÓN "CONTACT" ── */}
      <Box x={24} y={431} w={420} h={680} style={{ background: "var(--ui-card)", border: BORDER, borderRadius: 8 }} />
      <Box x={24} y={431} w={420} h={66} style={{ background: "var(--ui-section)", borderRadius: "8px 8px 0 0", border: BORDER }} />
      <T x={49} y={464} size={20} weight={600}>
        {t("contact")}
      </T>
      <Icon name="chevronUp" x={408} y={464} size={22} />

      <Field label={t("firstName")} value={CONTACT.first} labelY={534} />
      <Field label={t("lastName")} value={CONTACT.last} labelY={629} />
      <Field label={t("email")} value={CONTACT.email} labelY={722} plus />
      <Field label={t("phone")} labelY={817} plus />
      <FlagUS x={64} y={855} />
      <Icon name="chevronDown" x={96} y={855} size={18} color="var(--ui-text-3)" />
      <T x={112} y={855} size={20} weight={500}>
        {CONTACT.phone}
      </T>
      <T x={62} y={855} size={19} weight={500} color="var(--ui-text-2)" right className="inline-flex items-center gap-[6px]">
        {t("select")}
        {CARET}
      </T>
      <Field label={t("birth")} value="--" labelY={911} />
      <Field label={t("contactSource")} value={CONTACT.source} labelY={1008} />

      {/* ── CABECERA (encima del contenido scrolleado) ── */}
      <Box x={0} y={0} w={CONTACT_SIZE.w} h={67} style={{ background: "var(--ui-panel)" }} />
      <Icon name="arrowLeft" x={37} y={34} size={24} color="var(--ui-text)" />
      <T x={57} y={35} size={23} weight={600}>
        {t("contactDetails")}
      </T>
      <T x={303} y={35} size={20}>
        {CONTACT.index}
      </T>
      <Icon name="chevronLeft" x={398} y={35} size={22} color="var(--ui-text)" />
      <Icon name="chevronRight" x={430} y={35} size={22} color="var(--ui-text)" />

      {/* Barra de scroll */}
      <Box x={467} y={57} w={9} h={370} style={{ background: "var(--ui-scroll)", borderRadius: 5 }} />
    </div>
  );
}
