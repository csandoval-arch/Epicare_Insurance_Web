import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import HeroEpicare from "@/components/epicare/HeroEpicare";
import BrandsCarousel from "@/components/epicare/BrandsCarousel";
import MetricsEpicare from "@/components/epicare/MetricsEpicare";
import DarkGradientSection from "@/components/epicare/DarkGradientSection";
import BentoGridEpicare from "@/components/epicare/BentoGridEpicare";
import ProductSpotlightEpicare from "@/components/epicare/ProductSpotlightEpicare";
import PeopleRevealEpicare from "@/components/epicare/PeopleRevealEpicare";
import ProductLinesEpicare from "@/components/epicare/ProductLinesEpicare";
import Coverage52Epicare from "@/components/epicare/Coverage52Epicare";
import AgentAgencySection from "@/components/go-ams/AgentAgencySection";
import HowToJoinEpicare from "@/components/epicare/HowToJoinEpicare";
import FAQEpicare from "@/components/epicare/FAQEpicare";
import CTABannerEpicare from "@/components/epicare/CTABannerEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";

import en from "../../messages/en.json";
import { SITE_URL } from "./layout";

// ── STRUCTURED DATA ──
// page.tsx es server component, así que el JSON-LD se emite en el HTML estático.
// El FAQPage lee las mismas claves que renderiza FAQEpicare (que es client), así
// que no hay copia duplicada del copy: una sola fuente en messages/en.json.
const faq = en.landingV2.faq;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Epicare Insurance Corp",
      url: `${SITE_URL}/`,
      foundingDate: "2021",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Miami",
        addressRegion: "FL",
        addressCountry: "US",
      },
      // Identificadores públicos verificables (los mismos que declara el FAQ).
      taxID: "87-1093490",
      identifier: [
        { "@type": "PropertyValue", name: "NPN", value: "19985316" },
        { "@type": "PropertyValue", name: "USPTO Reg.", value: "8148738" },
      ],
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Epicare",
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: Array.from({ length: 7 }, (_, i) => ({
        "@type": "Question",
        name: faq[`q${i + 1}` as keyof typeof faq],
        acceptedAnswer: {
          "@type": "Answer",
          text: faq[`a${i + 1}` as keyof typeof faq],
        },
      })),
    },
  ],
};

export default function EpicareLandingPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* ── S00 · Loader ── */}
      <div className="w-full order-1"><LoaderEpicare /></div>
      {/* ── S01 · Hero (HOOK · pin 1) ── */}
      <div className="w-full order-2"><HeroEpicare /></div>
      {/* ── S02 · BrandsCarousel (credibilidad) — solape sobre Hero pineado ── */}
      <div className="w-full order-3 mt-[-100vh] relative z-20"><BrandsCarousel /></div>
      {/* ── S03 · DarkGradient / La Plataforma (solución inmediata) ── */}
      <div className="w-full order-4"><DarkGradientSection /></div>
      {/* ── S04 · Metrics (prueba dura) ── */}
      <div className="w-full order-5"><MetricsEpicare /></div>
      {/* ── S05 · BentoGrid / Ecosistema GO (PICO 2 · pin) ── */}
      <div className="w-full order-6 pb-section-lg"><BentoGridEpicare /></div>
      {/* ── S06a · Eppigo — producción (salió del bento a sección propia) ── */}
      <div className="relative z-10 w-full order-7 pb-16 md:pb-24"><ProductSpotlightEpicare variant="eppigo" /></div>
      {/* ── S06b · Agency Solutions — material de venta ── */}
      <div className="relative z-20 w-full order-7 pb-section-sm"><ProductSpotlightEpicare variant="solutions" /></div>
      {/* ── S07 · PeopleReveal (respiro humano) ── */}
      {/* <div className="w-full order-8 pb-section-lg"><PeopleRevealEpicare /></div> */}
      {/* ── S08 · AgentAgency (Audiencias y Rol) ── */}
      <div className="w-full order-9"><AgentAgencySection /></div>
      {/* ── S09 · ProductLines (portafolio) ── */}
      <div className="w-full order-10"><ProductLinesEpicare /></div>
      {/* ── S10 · Coverage52 (mini-pico visual) ── */}
      {/* <div className="w-full order-11"><Coverage52Epicare /></div> */}
      {/* ── S13 · HowToJoin (fricción cero) ── */}
      <div className="w-full order-[13]"><HowToJoinEpicare /></div>
      {/* ── S14 · FAQ (objeciones) ── */}
      <div className="w-full order-[14]"><FAQEpicare /></div>
      {/* ── S14.5 · CTA Banner ── */}
      <div className="w-full order-[15] relative z-10">
        <CTABannerEpicare 
          title={<>Your agency deserves <span className="text-[var(--color-brand-blue)]">premium</span> support.</>}
          description="Join Epicare and get access to our 52-state network, cutting-edge technology, and top-tier carrier contracts."
          buttonText="Join the Network"
        />
      </div>
      {/* ── S15 · Footer (RESOLUCIÓN) ── */}
      <div className="w-full order-[16]"><FooterEpicare /></div>
    </main>
  );
}
