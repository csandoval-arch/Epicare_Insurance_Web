"use client";

import React from "react";
import ColorCard from "./ColorCard";

export default function ColorsSection({ isDark }: { isDark: boolean }) {


  return (
    <>
      <section className="mb-32 animate-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-h1">1. Complete Color Palette</h2>
            <div className="h-[0.0625rem] flex-1 bg-[var(--color-border-Strokes-default)]" />
          </div>

          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Brand Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="brand-blue" variable="--color-brand-blue" hex={isDark ? "#35BBFD" : "#35BBFD"} colorClass="bg-[var(--color-brand-blue)]" textWhite={true} />
              <ColorCard name="brand-dark" variable="--color-brand-dark" hex={isDark ? "#2F3437" : "#2F3437"} colorClass="bg-[var(--color-brand-dark)]" textWhite={true} />
              <ColorCard name="brand-orange" variable="--color-brand-orange" hex={isDark ? "#F26023" : "#F26023"} colorClass="bg-[var(--color-brand-orange)]" textWhite={true} />
              <ColorCard name="brand-Logo-Main-color" variable="--color-brand-Logo-Main-color" hex={isDark ? "#FFFFFF" : "#626D72"} colorClass="bg-[var(--color-brand-Logo-Main-color)]" textWhite={true} />
              <ColorCard name="brand-Logo-Secondary-color" variable="--color-brand-Logo-Secondary-color" hex={isDark ? "#626D72" : "#626D72"} colorClass="bg-[var(--color-brand-Logo-Secondary-color)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Surface Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="surface-BG-black" variable="--color-surface-BG-black" hex={isDark ? "#050505" : "#050505"} colorClass="bg-[var(--color-surface-BG-black)]" textWhite={true} />
              <ColorCard name="surface-BG-white" variable="--color-surface-BG-white" hex={isDark ? "#FFFFFF" : "#FFFFFF"} colorClass="bg-[var(--color-surface-BG-white)]" textWhite={false} />
              <ColorCard name="surface-BG-1" variable="--color-surface-BG-1" hex={isDark ? "#202122" : "#F7F7F7"} colorClass="bg-[var(--color-surface-BG-1)]" textWhite={false} />
              <ColorCard name="surface-BG-2" variable="--color-surface-BG-2" hex={isDark ? "#28292A" : "#EBECEC"} colorClass="bg-[var(--color-surface-BG-2)]" textWhite={false} />
              <ColorCard name="surface-BG-3" variable="--color-surface-BG-3" hex={isDark ? "#3D3E3F" : "#E7E8E9"} colorClass="bg-[var(--color-surface-BG-3)]" textWhite={false} />
              <ColorCard name="surface-BG-4" variable="--color-surface-BG-4" hex={isDark ? "#4A4C4F" : "#D1D5DB"} colorClass="bg-[var(--color-surface-BG-4)]" textWhite={false} />
              <ColorCard name="surface-BG-base" variable="--color-surface-BG-base" hex={isDark ? "#191A1A" : "#F2F2F2"} colorClass="bg-[var(--color-surface-BG-base)]" textWhite={false} />
              <ColorCard name="surface-BG-base-Opacity" variable="--color-surface-BG-base-Opacity" hex={isDark ? "#1E1F1F" : "#F5F5F5"} colorClass="bg-[var(--color-surface-BG-base-Opacity)]" textWhite={false} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Text Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="text-disabled" variable="--color-text-disabled" hex={isDark ? "#363E46" : "#D1D5DB"} colorClass="bg-[var(--color-text-disabled)]" textWhite={true} />
              <ColorCard name="text-hint" variable="--color-text-hint" hex={isDark ? "#8D9CAB" : "#6A767C"} colorClass="bg-[var(--color-text-hint)]" textWhite={true} />
              <ColorCard name="text-primary" variable="--color-text-primary" hex={isDark ? "#E8ECEF" : "#1A1E21"} colorClass="bg-[var(--color-text-primary)]" textWhite={true} />
              <ColorCard name="text-secondary" variable="--color-text-secondary" hex={isDark ? "#A3A5A8" : "#60707C"} colorClass="bg-[var(--color-text-secondary)]" textWhite={true} />
              <ColorCard name="text-muted" variable="--color-text-muted" hex={isDark ? "#6B6E71" : "#9AA5B1"} colorClass="bg-[var(--color-text-muted)]" textWhite={true} />
              <ColorCard name="text-primary-Reverted" variable="--color-text-primary-Reverted" hex={isDark ? "#1A1E21" : "#E8ECEF"} colorClass="bg-[var(--color-text-primary-Reverted)]" textWhite={true} />
              <ColorCard name="text-Blue-Vivid" variable="--color-text-Blue-Vivid" hex={isDark ? "#7DD3FC" : "#0297E3"} colorClass="bg-[var(--color-text-Blue-Vivid)]" textWhite={true} />
              <ColorCard name="text-White-100" variable="--color-text-White-100" hex={isDark ? "#FFFFFF" : "#FFFFFF"} colorClass="bg-[var(--color-text-White-100)]" textWhite={true} />
              <ColorCard name="text-Black-100" variable="--color-text-Black-100" hex={isDark ? "#1A1E21" : "#1A1E21"} colorClass="bg-[var(--color-text-Black-100)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Border Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="border-Strokes-default" variable="--color-border-Strokes-default" hex={isDark ? "#383B3D" : "#E3E6E8"} colorClass="bg-[var(--color-border-Strokes-default)]" textWhite={true} />
              <ColorCard name="border-Strokes-Hover" variable="--color-border-Strokes-Hover" hex={isDark ? "#7D8C9B" : "#B5BDC5"} colorClass="bg-[var(--color-border-Strokes-Hover)]" textWhite={true} />
              <ColorCard name="border-Strokes-focus" variable="--color-border-Strokes-focus" hex={isDark ? "#35BBFD" : "#35BBFD"} colorClass="bg-[var(--color-border-Strokes-focus)]" textWhite={true} />
              <ColorCard name="border-Strokes-input" variable="--color-border-Strokes-input" hex={isDark ? "#383B3D" : "#D1D5DB"} colorClass="bg-[var(--color-border-Strokes-input)]" textWhite={true} />
              <ColorCard name="border-Strokes-input _ Hover" variable="--color-border-Strokes-input---Hover" hex={isDark ? "#5D6265" : "#A6AEBA"} colorClass="bg-[var(--color-border-Strokes-input---Hover)]" textWhite={true} />
              <ColorCard name="border-Strokes-strong" variable="--color-border-Strokes-strong" hex={isDark ? "#494C50" : "#AFB6C0"} colorClass="bg-[var(--color-border-Strokes-strong)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Action Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="action-destructive" variable="--color-action-destructive" hex={isDark ? "#EF4444" : "#EF4444"} colorClass="bg-[var(--color-action-destructive)]" textWhite={true} />
              <ColorCard name="action-destructive-hover" variable="--color-action-destructive-hover" hex={isDark ? "#F87171" : "#DC2626"} colorClass="bg-[var(--color-action-destructive-hover)]" textWhite={true} />
              <ColorCard name="action-destructive-text" variable="--color-action-destructive-text" hex={isDark ? "#FFFFFF" : "#FFFFFF"} colorClass="bg-[var(--color-action-destructive-text)]" textWhite={true} />
              <ColorCard name="action-focus-ring" variable="--color-action-focus-ring" hex={isDark ? "#38BDF8" : "#38BDF8"} colorClass="bg-[var(--color-action-focus-ring)]" textWhite={true} />
              <ColorCard name="action-link" variable="--color-action-link" hex={isDark ? "#38BDF8" : "#35BBFD"} colorClass="bg-[var(--color-action-link)]" textWhite={true} />
              <ColorCard name="action-link-hover" variable="--color-action-link-hover" hex={isDark ? "#7DD3FC" : "#0284C7"} colorClass="bg-[var(--color-action-link-hover)]" textWhite={true} />
              <ColorCard name="action-primary-bg" variable="--color-action-primary-bg" hex={isDark ? "#49B4E9" : "#49B4E9"} colorClass="bg-[var(--color-action-primary-bg)]" textWhite={false} />
              <ColorCard name="action-primary-hover" variable="--color-action-primary-hover" hex={isDark ? "#35BBFD" : "#35BBFD"} colorClass="bg-[var(--color-action-primary-hover)]" textWhite={true} />
              <ColorCard name="action-primary-subtle-hover" variable="--color-action-primary-subtle-hover" hex={isDark ? "#232324" : "#FCFCFD"} colorClass="bg-[var(--color-action-primary-subtle-hover)]" textWhite={true} />
              <ColorCard name="action-Primary-Medium-hover" variable="--color-action-Primary-Medium-hover" hex={isDark ? "#262627" : "#F2F2F2"} colorClass="bg-[var(--color-action-Primary-Medium-hover)]" textWhite={true} />
              <ColorCard name="action-Primary-Strong-hover" variable="--color-action-Primary-Strong-hover" hex={isDark ? "#2D2D2E" : "#EAEBEB"} colorClass="bg-[var(--color-action-Primary-Strong-hover)]" textWhite={true} />
              <ColorCard name="action-primary-subtle-active" variable="--color-action-primary-subtle-active" hex={isDark ? "#2D2D2F" : "#E9EBEC"} colorClass="bg-[var(--color-action-primary-subtle-active)]" textWhite={true} />
              <ColorCard name="action-primary-text" variable="--color-action-primary-text" hex={isDark ? "#1A1E21" : "#FFFFFF"} colorClass="bg-[var(--color-action-primary-text)]" textWhite={true} />
              <ColorCard name="action-secondary-bg" variable="--color-action-secondary-bg" hex={isDark ? "#C6C6C8" : "#686B6C"} colorClass="bg-[var(--color-action-secondary-bg)]" textWhite={false} />
              <ColorCard name="action-secondary-Strong" variable="--color-action-secondary-Strong" hex={isDark ? "#C6C6C8" : "#2D2D2E"} colorClass="bg-[var(--color-action-secondary-Strong)]" textWhite={true} />
              <ColorCard name="action-secondary-hover" variable="--color-action-secondary-hover" hex={isDark ? "#D0D0D2" : "#D8D8D8"} colorClass="bg-[var(--color-action-secondary-hover)]" textWhite={true} />
              <ColorCard name="action-secondary-text" variable="--color-action-secondary-text" hex={isDark ? "#1A1E21" : "#1A1E21"} colorClass="bg-[var(--color-action-secondary-text)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Accent Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="accent-border" variable="--color-accent-border" hex={isDark ? "#EA580C" : "#FB923C"} colorClass="bg-[var(--color-accent-border)]" textWhite={true} />
              <ColorCard name="accent-main" variable="--color-accent-main" hex={isDark ? "#F26023" : "#F26023"} colorClass="bg-[var(--color-accent-main)]" textWhite={true} />
              <ColorCard name="accent-surface-muted" variable="--color-accent-surface-muted" hex={isDark ? "#FB923C" : "#FB923C"} colorClass="bg-[var(--color-accent-surface-muted)]" textWhite={false} />
              <ColorCard name="accent-surface-strong" variable="--color-accent-surface-strong" hex={isDark ? "#FB923C" : "#FB923C"} colorClass="bg-[var(--color-accent-surface-strong)]" textWhite={false} />
              <ColorCard name="accent-surface-subtle" variable="--color-accent-surface-subtle" hex={isDark ? "#7C2D12" : "#FFF7ED"} colorClass="bg-[var(--color-accent-surface-subtle)]" textWhite={false} />
              <ColorCard name="accent-text-muted" variable="--color-accent-text-muted" hex={isDark ? "#F68950" : "#EA580C"} colorClass="bg-[var(--color-accent-text-muted)]" textWhite={true} />
              <ColorCard name="accent-text-strong" variable="--color-accent-text-strong" hex={isDark ? "#FFEDD5" : "#7C2D12"} colorClass="bg-[var(--color-accent-text-strong)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Status Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="status-amber-border" variable="--color-status-amber-border" hex={isDark ? "#F59E0B" : "#FBBF24"} colorClass="bg-[var(--color-status-amber-border)]" textWhite={true} />
              <ColorCard name="status-amber-main" variable="--color-status-amber-main" hex={isDark ? "#FBBF24" : "#FBBF24"} colorClass="bg-[var(--color-status-amber-main)]" textWhite={true} />
              <ColorCard name="status-amber-surface-muted" variable="--color-status-amber-surface-muted" hex={isDark ? "#FCD87B" : "#FDE095"} colorClass="bg-[var(--color-status-amber-surface-muted)]" textWhite={false} />
              <ColorCard name="status-amber-surface-strong" variable="--color-status-amber-surface-strong" hex={isDark ? "#FDE68A" : "#FDE68A"} colorClass="bg-[var(--color-status-amber-surface-strong)]" textWhite={false} />
              <ColorCard name="status-amber-surface-subtle" variable="--color-status-amber-surface-subtle" hex={isDark ? "#78350F" : "#FFFBEB"} colorClass="bg-[var(--color-status-amber-surface-subtle)]" textWhite={false} />
              <ColorCard name="status-amber-text-Medium" variable="--color-status-amber-text-Medium" hex={isDark ? "#FBBF24" : "#B48303"} colorClass="bg-[var(--color-status-amber-text-Medium)]" textWhite={true} />
              <ColorCard name="status-amber-text-strong" variable="--color-status-amber-text-strong" hex={isDark ? "#B45309" : "#B45309"} colorClass="bg-[var(--color-status-amber-text-strong)]" textWhite={true} />
              <ColorCard name="status-blue-border" variable="--color-status-blue-border" hex={isDark ? "#35BBFD" : "#38BDF8"} colorClass="bg-[var(--color-status-blue-border)]" textWhite={true} />
              <ColorCard name="status-blue-main" variable="--color-status-blue-main" hex={isDark ? "#38BDF8" : "#38BDF8"} colorClass="bg-[var(--color-status-blue-main)]" textWhite={true} />
              <ColorCard name="status-blue-surface-muted" variable="--color-status-blue-surface-muted" hex={isDark ? "#38BDF8" : "#38BDF8"} colorClass="bg-[var(--color-status-blue-surface-muted)]" textWhite={false} />
              <ColorCard name="status-blue-surface-strong" variable="--color-status-blue-surface-strong" hex={isDark ? "#0369A1" : "#B9E6FE"} colorClass="bg-[var(--color-status-blue-surface-strong)]" textWhite={false} />
              <ColorCard name="status-blue-surface-subtle" variable="--color-status-blue-surface-subtle" hex={isDark ? "#0C4A6E" : "#F0F9FF"} colorClass="bg-[var(--color-status-blue-surface-subtle)]" textWhite={false} />
              <ColorCard name="status-blue-text-Medium" variable="--color-status-blue-text-Medium" hex={isDark ? "#21B2FD" : "#0284C7"} colorClass="bg-[var(--color-status-blue-text-Medium)]" textWhite={true} />
              <ColorCard name="status-blue-text-strong" variable="--color-status-blue-text-strong" hex={isDark ? "#0C4A6E" : "#0C4A6E"} colorClass="bg-[var(--color-status-blue-text-strong)]" textWhite={true} />
              <ColorCard name="status-green-border" variable="--color-status-green-border" hex={isDark ? "#67E595" : "#4ADE80"} colorClass="bg-[var(--color-status-green-border)]" textWhite={true} />
              <ColorCard name="status-green-main" variable="--color-status-green-main" hex={isDark ? "#4ADE80" : "#4ADE80"} colorClass="bg-[var(--color-status-green-main)]" textWhite={true} />
              <ColorCard name="status-green-surface-muted" variable="--color-status-green-surface-muted" hex={isDark ? "#49DD7F" : "#4ADE80"} colorClass="bg-[var(--color-status-green-surface-muted)]" textWhite={false} />
              <ColorCard name="status-green-surface-strong" variable="--color-status-green-surface-strong" hex={isDark ? "#15803D" : "#BBF7D0"} colorClass="bg-[var(--color-status-green-surface-strong)]" textWhite={false} />
              <ColorCard name="status-green-surface-subtle" variable="--color-status-green-surface-subtle" hex={isDark ? "#14532D" : "#F0FDF4"} colorClass="bg-[var(--color-status-green-surface-subtle)]" textWhite={false} />
              <ColorCard name="status-green-text-Medium" variable="--color-status-green-text-Medium" hex={isDark ? "#39E478" : "#16A34A"} colorClass="bg-[var(--color-status-green-text-Medium)]" textWhite={true} />
              <ColorCard name="status-green-text-strong" variable="--color-status-green-text-strong" hex={isDark ? "#14532D" : "#14532D"} colorClass="bg-[var(--color-status-green-text-strong)]" textWhite={true} />
              <ColorCard name="status-purple-border" variable="--color-status-purple-border" hex={isDark ? "#8B5CF6" : "#A78BFA"} colorClass="bg-[var(--color-status-purple-border)]" textWhite={true} />
              <ColorCard name="status-purple-main" variable="--color-status-purple-main" hex={isDark ? "#A78BFA" : "#A78BFA"} colorClass="bg-[var(--color-status-purple-main)]" textWhite={true} />
              <ColorCard name="status-purple-surface-muted" variable="--color-status-purple-surface-muted" hex={isDark ? "#CBBBFC" : "#A78BFA"} colorClass="bg-[var(--color-status-purple-surface-muted)]" textWhite={false} />
              <ColorCard name="status-purple-surface-strong" variable="--color-status-purple-surface-strong" hex={isDark ? "#6D28D9" : "#DDD6FE"} colorClass="bg-[var(--color-status-purple-surface-strong)]" textWhite={false} />
              <ColorCard name="status-purple-surface-subtle" variable="--color-status-purple-surface-subtle" hex={isDark ? "#4C1D95" : "#F5F3FF"} colorClass="bg-[var(--color-status-purple-surface-subtle)]" textWhite={false} />
              <ColorCard name="status-purple-text-Medium" variable="--color-status-purple-text-Medium" hex={isDark ? "#A87CF3" : "#7C3AED"} colorClass="bg-[var(--color-status-purple-text-Medium)]" textWhite={true} />
              <ColorCard name="status-purple-text-strong" variable="--color-status-purple-text-strong" hex={isDark ? "#4C1D95" : "#4C1D95"} colorClass="bg-[var(--color-status-purple-text-strong)]" textWhite={true} />
              <ColorCard name="status-red-border" variable="--color-status-red-border" hex={isDark ? "#EF4444" : "#F87171"} colorClass="bg-[var(--color-status-red-border)]" textWhite={true} />
              <ColorCard name="status-red-main" variable="--color-status-red-main" hex={isDark ? "#F87171" : "#F87171"} colorClass="bg-[var(--color-status-red-main)]" textWhite={true} />
              <ColorCard name="status-red-surface-muted" variable="--color-status-red-surface-muted" hex={isDark ? "#FF4A4A" : "#F87171"} colorClass="bg-[var(--color-status-red-surface-muted)]" textWhite={false} />
              <ColorCard name="status-red-surface-strong" variable="--color-status-red-surface-strong" hex={isDark ? "#B91C1C" : "#FECACA"} colorClass="bg-[var(--color-status-red-surface-strong)]" textWhite={false} />
              <ColorCard name="status-red-surface-subtle" variable="--color-status-red-surface-subtle" hex={isDark ? "#7F1D1D" : "#FEF2F2"} colorClass="bg-[var(--color-status-red-surface-subtle)]" textWhite={false} />
              <ColorCard name="status-red-text-Medium" variable="--color-status-red-text-Medium" hex={isDark ? "#EF5D5D" : "#DC2626"} colorClass="bg-[var(--color-status-red-text-Medium)]" textWhite={true} />
              <ColorCard name="status-red-text-strong" variable="--color-status-red-text-strong" hex={isDark ? "#7F1D1D" : "#7F1D1D"} colorClass="bg-[var(--color-status-red-text-strong)]" textWhite={true} />
            </div>
          </div>
          <div className="mb-16">
            <h3 className="text-h3 text-[var(--color-text-primary)] mb-6">Overlay Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <ColorCard name="overlay-backdrop" variable="--color-overlay-backdrop" hex={isDark ? "#000000" : "#000000"} colorClass="bg-[var(--color-overlay-backdrop)]" textWhite={true} />
              <ColorCard name="overlay-tooltip-bg" variable="--color-overlay-tooltip-bg" hex={isDark ? "#434C56" : "#1A1E21"} colorClass="bg-[var(--color-overlay-tooltip-bg)]" textWhite={false} />
            </div>
          </div>

        </section>
    </>
  );
}