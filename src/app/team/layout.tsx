import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const TITLE = "The Crew — Every Case Has a Crew";
const DESCRIPTION =
  "The people behind every Epicare case: licensing, contracting, quoting and compliance working as one crew for the producer.";

/**
 * `/team` está DESHABILITADA en la navegación ("coming soon" en header y footer) mientras se
 * sustituye el elenco provisional por el equipo real (acción 154). Hasta entonces: fuera del
 * sitemap y `noindex` — la página sigue accesible por URL directa para revisarla.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/team/" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: TITLE,
    description: DESCRIPTION,
    url: "/team/",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
