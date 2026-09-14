import LoaderEpicare from "@/components/epicare/LoaderEpicare";
import LicensingHeroEpicare from "@/components/epicare/LicensingHeroEpicare";
import LicensingGridEpicare from "@/components/epicare/LicensingGridEpicare";
import FooterEpicare from "@/components/epicare/FooterEpicare";
import CTABannerEpicare from "@/components/epicare/CTABannerEpicare";
import { SITE_URL } from "../layout";

// Note: The rest of the sections (Corporate Info, Map, Grid) will be imported here as they are built.

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/licensing/#webpage`,
  "url": `${SITE_URL}/licensing`,
  "name": "Epicare Licensing",
  "description": "Epicare Insurance holds the necessary state licenses to conduct insurance business.",
  "inLanguage": "en-US"
};

export default function LicensingPage() {
  return (
    <main className="flex flex-col w-full min-h-screen overflow-x-hidden bg-[var(--color-surface-BG-white)] dark:bg-[var(--color-surface-BG-black)] transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* ── S00 · Loader ── */}
      <div className="w-full order-1"><LoaderEpicare /></div>
      
      {/* ── S01 · Licensing Hero ── */}
      <div className="w-full order-2"><LicensingHeroEpicare /></div>
      
      {/* ── S03 · Licensing Grid ── */}
      <div id="licensing-grid" className="w-full order-4 relative z-10"><LicensingGridEpicare /></div>
      
      {/* ── S03.5 · CTA Banner ── */}
      <div className="w-full order-[14] relative z-10"><CTABannerEpicare /></div>
      
      {/* ── S04 · Footer ── */}
      <div className="w-full order-[15]"><FooterEpicare /></div>
    </main>
  );
}
