"use client";

/**
 * @description Réplica 1:1 del panel "Conversations" de GO CRM (1085×1052 px del fotograma): hilo de
 * SMS con la tarjeta de presentación del agente y el compositor. La tarjeta es la única imagen
 * (`BUSINESS_CARD`, recorte del fotograma); todo lo demás es HTML/SVG.
 */

import { useTranslations } from "next-intl";
import { asset } from "@/lib/asset";
import { Box, Icon, InlineIcon, T, type IconName } from "./ui";
import { BUSINESS_CARD, CONTACT, MESSAGES, NUMBERS, STORY } from "./data";

export const THREAD_SIZE = { w: 1085, h: 1052 } as const;
/**
 * Cuánto sube el hilo en cada momento de la historia: el contrato enviado, el cliente escribiendo
 * y su respuesta. Cada valor deja la última línea del hilo donde estaba la última hora (y = 634).
 */
export const THREAD_SHIFTS = { sent: 169, typing: 245, reply: 343 } as const;

const W = THREAD_SIZE.w;
const LINE = "2px solid var(--ui-border)";
const BUBBLE = { background: "var(--ui-bubble)", borderRadius: 12 } as const;
const TIME = { size: 18, color: "var(--ui-text-3)" } as const;
const MSG = 20;

/** Hora + menú "⋮" alineados a la derecha del hilo. */
const Stamp = ({ y, time }: { y: number; time: string }) => (
  <>
    <T x={W - 959} y={y} {...TIME} right>
      {time}
    </T>
    <Icon name="more" x={973} y={y} size={20} color="var(--ui-text-3)" stroke={3} />
  </>
);

/** Avatar del agente (IA): círculo violeta con "play" + burbuja pequeña. */
const AgentBadge = ({ y }: { y: number }) => (
  <>
    <Box x={1000} y={y - 23} w={46} h={46} className="rounded-full" style={{ background: "var(--ui-purple-circle)" }} />
    <Icon name="play" x={1021} y={y} size={28} color="var(--ui-purple)" />
    <Box x={1034} y={y - 9} w={26} h={26} className="rounded-full" style={{ background: "var(--ui-card)" }} />
    <Icon name="message" x={1047} y={y + 4} size={20} color="var(--ui-blue)" />
  </>
);

/** Burbuja entrante (cliente): blanca con borde, a la izquierda. */
const IN_BUBBLE = { background: "var(--ui-card)", border: LINE, borderRadius: 12 } as const;

const ClientAvatar = ({ y }: { y: number }) => (
  <Box x={28} y={y - 20} w={40} h={40} className="rounded-full flex items-center justify-center" style={{ background: "var(--ui-avatar)", fontSize: 15, color: "var(--ui-text-3)" }}>
    {CONTACT.initials}
  </Box>
);

/** Adjunto dentro de una burbuja. */
const FileChip = ({ x, y, name, color }: { x: number; y: number; name: string; color: string }) => (
  <Box x={x} y={y} w={300} h={44} className="flex items-center gap-[10px] pl-[14px]" style={{ background: "var(--ui-card)", borderRadius: 8, border: LINE }}>
    <InlineIcon name="fileText" size={22} color={color} />
    <span style={{ fontSize: 18, fontWeight: 500 }}>{name}</span>
  </Box>
);

const TOOLBAR: { name: IconName; x: number; muted?: boolean }[] = [
  { name: "smile", x: 55 },
  { name: "clip", x: 103 },
  { name: "fileText", x: 150 },
  { name: "zap", x: 198, muted: true },
  { name: "tag", x: 246 },
  { name: "dollar", x: 295 },
  { name: "backspace", x: 343 },
];

export default function ThreadPanel() {
  const t = useTranslations("goCrm.conversations.ui");

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--ui-panel)" }}>
      {/* ── HILO (capa que se desplaza al llegar un mensaje nuevo) ── */}
      <div className="cx-thread absolute inset-0">
      <Box x={228} y={100} w={753} h={84} style={BUBBLE} />
      <T x={248} y={154} size={MSG}>
        {MESSAGES.stop}
      </T>
      <Stamp y={202} time={MESSAGES.times[0]} />

      <Box x={228} y={233} w={753} h={274} style={BUBBLE} />
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático: next/image no optimiza */}
      <img src={asset(BUSINESS_CARD)} alt="" loading="lazy" decoding="async" className="absolute rounded-[6px]" style={{ left: 248, top: 247, width: 300, height: 179 }} />
      <T x={248} y={444} size={MSG}>
        {MESSAGES.card[0]}
      </T>
      <T x={248} y={478} size={MSG}>
        {MESSAGES.card[1]}
      </T>
      <AgentBadge y={257} />
      <Stamp y={525} time={MESSAGES.times[1]} />

      <Box x={612} y={556} w={369} h={61} style={BUBBLE} />
      <T x={632} y={585} size={MSG}>
        {MESSAGES.confirm}
      </T>
      <AgentBadge y={582} />
      <Stamp y={634} time={MESSAGES.times[2]} />

      {/* ── MENSAJES DE LA HISTORIA: esperan bajo el compositor hasta que el hilo sube ── */}
      {/* Agente → contrato */}
      <div className="cx-msg-out absolute inset-0">
        <Box x={541} y={666} w={440} h={118} style={BUBBLE} />
        <T x={561} y={700} size={MSG}>
          {STORY.typed}
        </T>
        <FileChip x={561} y={720} name={STORY.file} color="var(--ui-blue)" />
        <AgentBadge y={692} />
        <Stamp y={634 + THREAD_SHIFTS.sent} time={STORY.time} />
      </div>

      {/* Cliente escribiendo… (tres puntos) */}
      <div className="cx-dots absolute inset-0 opacity-0">
        <ClientAvatar y={866} />
        <Box x={84} y={840} w={92} h={52} className="flex items-center justify-center gap-[8px]" style={IN_BUBBLE}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="cx-dot w-[10px] h-[10px] rounded-full" style={{ background: "var(--ui-text-3)" }} />
          ))}
        </Box>
      </div>

      {/* Cliente → contrato firmado */}
      <div className="cx-msg-in absolute inset-0 opacity-0">
        <ClientAvatar y={866} />
        <Box x={84} y={840} w={340} h={118} style={IN_BUBBLE} />
        <T x={104} y={874} size={MSG}>
          {STORY.reply}
        </T>
        <FileChip x={104} y={894} name={STORY.signedFile} color="var(--ui-green)" />
        <T x={84} y={634 + THREAD_SHIFTS.reply} {...TIME}>
          {STORY.replyTime}
        </T>
      </div>
      </div>

      <Box x={1074} y={392} w={10} h={255} className="cx-thumb" style={{ background: "var(--ui-scroll)", borderRadius: 5 }} />

      {/* ── COMPOSITOR ── */}
      <Box x={24} y={662} w={1037} h={355} className="overflow-hidden" style={{ background: "var(--ui-card)", border: "2px solid var(--ui-blue-line)", borderRadius: 8 }}>
        <div className="absolute inset-x-0 top-0 h-[58px]" style={{ background: "var(--ui-blue-soft)", borderBottom: LINE }} />
        <div className="absolute inset-x-0 top-[106px] h-0" style={{ borderTop: LINE }} />
        <div className="absolute inset-x-0 bottom-0 h-[60px]" style={{ background: "var(--ui-panel)", borderTop: LINE }} />
      </Box>
      <Box x={43} y={672} w={118} h={41} style={{ background: "var(--ui-card)", borderRadius: 6 }} />
      <Icon name="message" x={65} y={692} size={20} color="var(--ui-blue)" />
      <T x={85} y={692} size={19} weight={500} color="var(--ui-blue)">
        {t("sms")}
      </T>
      <Icon name="chevronDown" x={139} y={692} size={18} color="var(--ui-text-2)" />
      <Box x={177} y={679} w={2} h={26} style={{ background: "var(--ui-border-strong)" }} />
      <Icon name="eye" x={221} y={692} size={22} />
      <T x={239} y={692} size={19} color="var(--ui-text-2)">
        {t("internal")}
      </T>
      <Icon name="minus" x={992} y={692} size={22} />
      <Icon name="maximize" x={1032} y={692} size={20} />

      <T x={43} y={744} size={20} weight={500}>
        {t("from")}
      </T>
      <T x={137} y={744} size={19} color="var(--ui-text-2)">
        {NUMBERS.from}
      </T>
      <Icon name="chevronDown" x={280} y={744} size={18} />
      <Box x={358} y={731} w={2} h={27} style={{ background: "var(--ui-border-strong)" }} />
      <T x={387} y={744} size={20} weight={500}>
        {t("to")}
      </T>
      <T x={454} y={744} size={19} color="var(--ui-text-2)">
        {NUMBERS.to}
      </T>

      <T x={46} y={805} size={20} color="var(--ui-text-3)" className="cx-placeholder">
        {t("placeholder")}
      </T>
      {/* Tecleo: el texto está entero y una máscara del color del campo se retira por pasos */}
      <T x={46} y={805} size={20} className="cx-typed opacity-0">
        {STORY.typed}
      </T>
      <Box x={44} y={788} w={760} h={34} className="cx-cover opacity-0" style={{ background: "var(--ui-card)" }} />
      <Box x={42} y={791} w={2} h={28} className="cx-caret cx-caret-blink" style={{ background: "var(--ui-text)" }} />

      {TOOLBAR.map((tool) => (
        <Icon key={tool.name} name={tool.name} x={tool.x} y={987} size={24} color={tool.muted ? "var(--ui-scroll)" : "var(--ui-text-2)"} />
      ))}
      <Box x={961} y={957} w={2} h={60} style={{ background: "var(--ui-border)" }} />
      <Box x={975} y={970} w={73} h={34} style={{ background: "var(--ui-send)", borderRadius: 6 }} />
      <Box x={975} y={970} w={73} h={34} className="cx-send-on opacity-0" style={{ background: "var(--ui-blue)", borderRadius: 6 }} />
      <Icon name="send" x={997} y={987} size={20} color="var(--ui-card)" />
      <Box x={1021} y={975} w={2} h={24} style={{ background: "var(--ui-card)", opacity: 0.5 }} />
      <Icon name="chevronDown" x={1035} y={987} size={16} color="var(--ui-card)" />
      <T x={W - 1060} y={1028} size={15} color="var(--ui-text-3)" right>
        {t.rich("counter", {
          chars: (chunks) => <span className="cx-chars">{chunks}</span>,
          segs: (chunks) => <span className="cx-segs">{chunks}</span>,
        })}
      </T>

      {/* ── CABECERA DEL HILO (encima del contenido scrolleado) ── */}
      <Box x={0} y={0} w={W} h={64} style={{ background: "var(--ui-card)", borderBottom: LINE }} />
      <Icon name="message" x={47} y={32} size={24} color="var(--ui-blue)" />
      <T x={70} y={32} size={20} weight={500} color="var(--ui-blue)">
        {t("conversations")}
      </T>
      <Box x={12} y={60} w={215} h={4} style={{ background: "var(--ui-blue)" }} />

      <Box x={0} y={64} w={W} h={83} style={{ background: "var(--ui-panel)", borderBottom: LINE }} />
      <Box x={24} y={81} w={48} h={48} className="rounded-full flex items-center justify-center" style={{ background: "var(--ui-avatar)", fontSize: 17, color: "var(--ui-text-3)" }}>
        {CONTACT.initials}
      </Box>
      <T x={90} y={105} size={23} weight={500}>
        {CONTACT.thread}
      </T>
      <Icon name="message" x={792} y={105} size={34} />
      <Icon name="chevronDown" x={833} y={105} size={18} />
      <Icon name="phone" x={886} y={105} size={32} />
      <Icon name="chevronDown" x={928} y={105} size={18} />
      <Icon name="folderPlus" x={982} y={105} size={34} />
      <Icon name="mail" x={1042} y={105} size={34} />
    </div>
  );
}
