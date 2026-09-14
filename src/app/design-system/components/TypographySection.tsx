"use client";

import React from "react";
import TypeRow from "./TypeRow";

// ── FONT-ROLE LABELS ──
const DISPLAY = "Inter Display · opsz 32";
const BODY = "Inter Tight";
const MONO = "JetBrains Mono";

/**
 * @description Interactive typography inventory for the Design System page.
 * Renders every type token grouped by its font role (Display/Headings → Inter Display,
 * Body/UI → Inter Tight, Meta/Code → JetBrains Mono). Each row previews the token with
 * its real `@utility` styles applied.
 */
export default function TypographySection() {
  return (
    <>
      <section className="mb-32 relative">
        <div className="sticky top-0 z-40 bg-[var(--color-surface-BG-base)]/90 backdrop-blur-xl pt-6 pb-4 mb-10 border-b border-[var(--color-border-Strokes-default)] flex flex-col md:flex-row md:items-end justify-between gap-6 transition-colors duration-500">
          <div>
            <h2 className="text-h1 mb-2">3. Cognitive Typography</h2>
            <p className="text-body-sm text-[var(--color-text-muted)] max-w-lg">
              A three-role type system. Display &amp; headings, functional body/UI, and
              monospaced meta are each carried by a dedicated family.
            </p>
          </div>
        </div>

        {/* ── FAMILY LEGEND ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FontRoleCard
            role="Display · Headings"
            family="Inter Display"
            note="Variable grotesk at optical size 32. Titles, covers, manifestos. Never for body."
            weights="400 · 500 · 600 · 700"
            sample="Aa"
            sampleClass="text-display-sm"
          />
          <FontRoleCard
            role="Body · UI"
            family="Inter Tight"
            note="Disciplined grotesk. All functional reading and interface text."
            weights="300 · 400 · 500 · 600 · 700"
            sample="Aa"
            sampleClass="text-display-sm"
          />
          <FontRoleCard
            role="Meta · Code"
            family="JetBrains Mono"
            note="Monospaced. Numbers, hex, labels and metadata only."
            weights="400 · 500 · 600"
            sample="A0"
            sampleClass="text-display-sm text-data"
          />
        </div>

        <div className="organic-glass-panel p-8 md:p-12 flex flex-col gap-12">
          {/* ── DISPLAY + HEADINGS → Inter Display ── */}
          {[
            { token: ".text-display-3xl", name: "Display 3XL", text: "IMMENSE", details: `Size: clamp(6rem, 12vw, 12rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 0.95\nLetter-spacing: -0.02em` },
            { token: ".text-display-2xl", name: "Display 2XL", text: "GIANT", details: `Size: clamp(4.5rem, 8vw, 8rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1\nLetter-spacing: -0.01em` },
            { token: ".text-display-xl", name: "Display XL", text: "GO AMS Portal", details: `Size: clamp(3.5rem, 6vw, 6rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.1` },
            { token: ".text-display-lg", name: "Display LG", text: "Agent Dashboard", details: `Size: clamp(3rem, 5vw, 4.5rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.1` },
            { token: ".text-display", name: "Display", text: "Sales Performance", details: `Size: clamp(2.5rem, 4vw, 3.5rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.15` },
            { token: ".text-display-sm", name: "Display SM", text: "Client Portfolio", details: `Size: clamp(2rem, 3vw, 2.5rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.2` },
            { token: ".text-display-xs", name: "Display XS", text: "Premium Reading", details: `Size: clamp(1.375rem, 2vw, 1.75rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.2` },
            { token: ".text-h1", name: "H1 Section", text: "Commission Tracking", details: `Size: clamp(1.75rem, 2.5vw, 2.25rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.2` },
            { token: ".text-h2", name: "H2 Sub-section", text: "Active Policies", details: `Size: clamp(1.5rem, 2vw, 1.875rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.3` },
            { token: ".text-h3", name: "H3 Card", text: "Lead Generation", details: `Size: clamp(1.25rem, 1.5vw, 1.5rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.3` },
            { token: ".text-h4", name: "H4 Subtitle", text: "Monthly Targets", details: `Size: clamp(1.125rem, 1.25vw, 1.25rem)\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.4` },
            { token: ".text-h5", name: "H5 Small", text: "Approved", details: `Size: 1.125rem\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.5` },
            { token: ".text-h6", name: "H6 Micro", text: "Policy ID #4092", details: `Size: 1rem\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.5` },
            { token: ".text-h7", name: "H7 Nano", text: "Dropdown Menu Option", details: `Size: 0.875rem\nWeight: 700(Mob)/600(Desk)\nLine-height: 1.6` },
          ].map((item) => (
            <TypeRow key={item.token} {...item} font={DISPLAY} />
          ))}

          {/* ── BODY · UI → Inter Tight ── */}
          <TypeRow token=".text-subtitle" name="Subtitle" font={BODY} text="Manage your insurance portfolio, track daily sales metrics, and connect with your high-value clients." details={`Size: clamp(1.125rem, 2vw, 1.5rem)\nWeight: 300\nLine-height: 1.5`} />
          <TypeRow token=".text-body-2xl" name="Body 2XL" font={BODY} text="Your sales performance this quarter has exceeded targets by 15%, maintaining a strong retention rate across all premium insurance packages." details={`Size: 1.5rem\nWeight: 300\nLine-height: 1.5`} />
          <TypeRow token=".text-body-2xl-light" name="Body 2XL Light" font={BODY} text="Review the latest policy updates and ensure all client documentation is properly submitted for final underwriting approval." details={`Size: 1.5rem\nWeight: 300\nLine-height: 1.5`} />
          <TypeRow token=".text-body-xl" name="Body XL" font={BODY} text="Please review the attached life insurance policy details before sending the digital signature request to the client." details={`Size: 1.25rem\nWeight: 300\nLine-height: 1.5`} />
          <TypeRow token=".text-body-xl-light" name="Body XL Light" font={BODY} text="Agents can duplicate an existing quote to speed up recurring applications for returning clients." details={`Size: 1.25rem\nWeight: 300\nLine-height: 1.5`} />
          <TypeRow token=".text-body-lg" name="Body LG" font={BODY} text="The dashboard provides a real-time overview of your active health and auto policies, including pending renewals." details={`Size: 1.125rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-lg-light" name="Body LG Light" font={BODY} text="Agent commissions are automatically calculated at the end of each billing cycle based on successfully bound policies." details={`Size: 1.125rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-md" name="Body MD" font={BODY} text="Select a specific agent from the directory to view their historical conversion rates and overall client satisfaction scores." details={`Size: 1rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-md-light" name="Body MD Light" font={BODY} text="Filter the pipeline by policy type to focus on the segments closest to closing this month." details={`Size: 1rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body" name="Body" font={BODY} text="The GO AMS platform centralizes all lead management, allowing agents to instantly follow up on new quote requests and process applications." details={`Size: 1rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-light" name="Body Light" font={BODY} text="Ensure that the beneficiary information is accurate and fully verified before submitting the final contract." details={`Size: 1rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-sm" name="Body SM" font={BODY} text="By clicking submit, you agree to the terms of service and acknowledge that your data will be processed according to our privacy policy." details={`Size: 0.875rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-sm-light" name="Body SM Light" font={BODY} text="The premium calculation includes a standard multi-policy discount applied to the client’s home and auto bundle." details={`Size: 0.875rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-xs" name="Body XS" font={BODY} text="Required fields are marked with an asterisk (*). Please complete all fields before submitting your application." details={`Size: 0.75rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-body-xs-light" name="Body XS Light" font={BODY} text="Rates shown are estimates and subject to final underwriting review." details={`Size: 0.75rem\nWeight: 300\nLine-height: 1.6`} />
          <TypeRow token=".text-caption" name="Caption" font={BODY} text="Last updated today at 14:30 EST. Secured via 256-bit encryption." details={`Size: 0.75rem\nWeight: 400\nLine-height: 1.5`} />

          {/* ── META · CODE → JetBrains Mono ── */}
          <TypeRow token=".text-overline" name="Overline" font={MONO} text="AGENT OVERVIEW" details={`Size: 0.875rem\nWeight: 600\nTracking: 0.1em`} />
          <TypeRow token=".text-ui-label" name="UI Label" font={MONO} text="Generate Quote" details={`Size: 0.875rem\nWeight: 500\nTracking: 0.05em`} />
          <TypeRow token=".text-data" name="Data" font={MONO} text="$14,500.00 YTD" details={`Size: 1rem\nWeight: 600 (SemiBold)\nFamily: JetBrains Mono`} />
          <TypeRow token=".text-meta" name="Meta" font={MONO} text="0xA1F3 · id_4092 · v2.4.1" details={`Size: 0.75rem\nWeight: 500 (Medium)\nTracking: 0.01em`} />
        </div>
      </section>
    </>
  );
}

/**
 * @description Legend card summarizing one of the three font roles in the type system.
 */
function FontRoleCard({
  role,
  family,
  note,
  weights,
  sample,
  sampleClass,
}: {
  role: string;
  family: string;
  note: string;
  weights: string;
  sample: string;
  sampleClass: string;
}) {
  return (
    <div className="p-6 border border-[var(--color-border-Strokes-default)]/60 rounded-2xl bg-[var(--color-surface-BG-base)] flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-ui-label text-[var(--color-text-muted)]">{role}</span>
        <span className={`${sampleClass} leading-none text-[var(--color-text-primary)]`}>{sample}</span>
      </div>
      <p className="text-h4 text-[var(--color-text-primary)]">{family}</p>
      <p className="text-body-sm text-[var(--color-text-muted)] leading-relaxed">{note}</p>
      <p className="text-caption text-[var(--color-text-hint)] font-mono mt-auto pt-2 border-t border-[var(--color-border-Strokes-default)]/30">
        {weights}
      </p>
    </div>
  );
}
