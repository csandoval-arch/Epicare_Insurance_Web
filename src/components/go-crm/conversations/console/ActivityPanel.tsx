"use client";

/**
 * @description Réplica 1:1 del panel "Activity" de GO CRM + su raíl de herramientas (587×1052 px del
 * fotograma): línea de tiempo con los eventos automáticos del contacto y las fuentes de atribución.
 */

import { useTranslations } from "next-intl";
import { Box, Icon, T, type IconName } from "./ui";
import { ACTIVITY } from "./data";

export const ACTIVITY_SIZE = { w: 587, h: 1052 } as const;

const W = ACTIVITY_SIZE.w;
const BORDER = "2px solid var(--ui-border)";

/** Etiqueta celeste de dato ("Source: …", "Campaign: …"). */
const Pill = ({ y, children }: { y: number; children: string }) => (
  <span
    className="absolute h-[28px] px-[8px] inline-flex items-center whitespace-nowrap rounded-[4px]"
    style={{ left: 83, top: y - 14, background: "var(--ui-source)", color: "var(--ui-source-text)", fontSize: 17, fontWeight: 500 }}
  >
    {children}
  </span>
);

interface EventProps {
  y: number;
  icon: IconName;
  circle: string;
  color: string;
  title: string;
  footer: string;
}

/** Evento de la línea de tiempo: icono en círculo, título, tarjeta con datos y "hace 2 horas". */
function Event({ y, icon, circle, color, title, footer }: EventProps) {
  const t = useTranslations("goCrm.conversations.ui");
  return (
    <>
      <Box x={24} y={y - 18} w={36} h={36} className="rounded-full" style={{ background: circle }} />
      <Icon name={icon} x={42} y={y} size={20} color={color} />
      <T x={72} y={y - 4} size={20} weight={500}>
        {title}
      </T>
      <Box x={72} y={y + 15} w={425} h={102} style={{ background: "var(--ui-card)", border: BORDER, borderRadius: 8 }} />
      <Pill y={y + 37}>{`${t("sourceLabel")} ${ACTIVITY.source}`}</Pill>
      <Pill y={y + 70}>{`${t("campaignLabel")} ${ACTIVITY.campaign}`}</Pill>
      <T x={82} y={y + 96} size={18} weight={500}>
        {footer}
      </T>
      <T x={W - 497} y={y + 137} size={18} color="var(--ui-text-3)" right>
        {t("ago")}
      </T>
    </>
  );
}

const RAIL: { name: IconName; y: number }[] = [
  { name: "nodes", y: 86 },
  { name: "scan", y: 143 },
  { name: "clipboard", y: 205 },
  { name: "pen", y: 263 },
  { name: "calendar", y: 326 },
  { name: "file", y: 386 },
  { name: "circleDollar", y: 445 },
];

export default function ActivityPanel() {
  const t = useTranslations("goCrm.conversations.ui");

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--ui-page)" }}>
      <Box x={0} y={1} w={521} h={1051} style={{ background: "var(--ui-panel)", borderRadius: 20 }} />

      {/* ── CABECERA ── */}
      <T x={24} y={37} size={22} weight={600} className="inline-flex items-baseline gap-[6px]">
        {t("activity")}
        <span style={{ fontSize: 17, fontWeight: 400, color: "var(--ui-text-3)" }}>(EDT)</span>
      </T>
      <Icon name="x" x={473} y={37} size={22} />
      <T x={24} y={75} size={18} weight={600} color="var(--ui-text-3)">
        {t("today")}
      </T>

      {/* ── LÍNEA DE TIEMPO ── */}
      <Box x={41} y={151} w={2} h={161} style={{ background: "var(--ui-timeline)" }} />
      <Event y={133} icon="user" circle="var(--ui-blue-circle)" color="var(--ui-blue)" title={t("created")} footer={`${t("fromLabel")} ${ACTIVITY.formName}`} />
      <Event y={330} icon="fileText" circle="var(--ui-green-circle)" color="var(--ui-green)" title={t("leadForm")} footer={ACTIVITY.formName} />

      {/* ── ATRIBUCIÓN ── */}
      <Box x={0} y={969} w={521} h={2} style={{ background: "var(--ui-border)" }} />
      <Box x={0} y={1012} w={521} h={2} style={{ background: "var(--ui-border)" }} />
      <T x={12} y={991} size={18} color="var(--ui-text-2)" className="inline-flex gap-[8px]">
        {t("firstAttr")}
        <span style={{ fontWeight: 500, color: "var(--ui-text)" }}>{ACTIVITY.source}</span>
      </T>
      <T x={12} y={1033} size={18} color="var(--ui-text-2)" className="inline-flex gap-[8px]">
        {t("lastAttr")}
        <span style={{ fontWeight: 500, color: "var(--ui-text)" }}>{ACTIVITY.source}</span>
      </T>

      {/* ── RAÍL DE HERRAMIENTAS ── */}
      <Box x={536} y={1} w={48} h={48} style={{ background: "var(--ui-card)", borderRadius: 10 }} />
      <Icon name="history" x={560} y={25} size={30} color="var(--ui-blue)" />
      {RAIL.map((item) => (
        <Icon key={item.name} name={item.name} x={560} y={item.y} size={30} color="var(--ui-text)" />
      ))}
      <Box x={536} y={994} w={48} h={48} style={{ background: "var(--ui-card)", borderRadius: 10 }} />
      <Icon name="keyboard" x={560} y={1018} size={28} />
    </div>
  );
}
