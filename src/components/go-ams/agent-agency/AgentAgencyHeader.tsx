"use client";

import React from "react";
import { User, Buildings } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { AgentAgencyHeaderProps } from "./types";

export function AgentAgencyHeader({
  activeRole,
  onRoleChange,
}: AgentAgencyHeaderProps) {
  const t = useTranslations('goAms.agentAgency');
  const isAgent = activeRole === "agent";

  return (
    <div className="grid-layout items-end gap-y-6 lg:gap-y-fluid-md">
      {/* Título y Subtítulo Principal (Izquierda, Cols 1-7) */}
      <div className="col-span-6 md:col-span-8 lg:col-span-7 flex flex-col gap-3">
        <h2 className="text-display-lg font-semibold text-[var(--color-text-primary)]">
          <span className="block overflow-hidden pb-1">
            <span className="aa-title-line block">{t('title1')}</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="aa-title-line block text-[var(--color-text-accent-blue)]">
              {t('title2')}
            </span>
          </span>
        </h2>

        <p className="aa-header-elem text-body-lg text-[var(--color-text-secondary)] max-w-section-xs">
          {t.rich('subtitle', {
            bold: (chunks) => <strong className="font-semibold text-[var(--color-text-primary)]">{chunks}</strong>
          })}
        </p>
      </div>

      {/* Selector de Pestañas Interactivo (Derecha, Cols 8-12) */}
      <div className="aa-header-elem col-span-6 md:col-span-8 lg:col-span-5 flex lg:justify-end">
        <div className="p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-[var(--color-surface-BG-1)] border border-[var(--color-border-Strokes-default)] flex items-center gap-1 sm:gap-1.5 shadow-elevation-1 w-full sm:w-auto">
          {/* Botón Agente */}
          <button
            onClick={() => onRoleChange("agent")}
            aria-pressed={isAgent}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-caption sm:text-ui-label transition-all duration-300 cursor-pointer ${
              isAgent
                ? "bg-[var(--color-brand-blue)] text-white shadow-elevation-2 font-semibold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-BG-2)]"
            }`}
          >
            <User weight={isAgent ? "fill" : "bold"} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>{t('tabAgent')}</span>
          </button>

          {/* Botón Agencia */}
          <button
            onClick={() => onRoleChange("agency")}
            aria-pressed={!isAgent}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-caption sm:text-ui-label transition-all duration-300 cursor-pointer ${
              !isAgent
                ? "bg-[var(--color-brand-blue)] text-white shadow-elevation-2 font-semibold"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-BG-2)]"
            }`}
          >
            <Buildings weight={!isAgent ? "fill" : "bold"} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>{t('tabAgency')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
