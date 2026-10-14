import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const TITLE = "Join Epicare — Producer Application";
const DESCRIPTION =
  "Apply to contract with Epicare. Four paths: licensed agent, unlicensed agent, agency FMO and trademark agency — each with its own onboarding, benefits and support.";

/**
 * Formulario de alta: útil para quien llega por un enlace directo, pero no es una página
 * que deba competir en búsqueda. Se indexa el contenido de marketing, no el formulario.
 */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/join-us/" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: TITLE,
    description: DESCRIPTION,
    url: "/join-us/",
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

export default function JoinUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
