import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const TITLE = "Licensing & Carrier Appointments — 52-State Coverage";
const DESCRIPTION =
  "Get licensed and appointed across all 52 US jurisdictions with Epicare. Track carrier appointments, renewals, and state requirements from a single dashboard.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/licensing/" },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: TITLE,
    description: DESCRIPTION,
    url: "/licensing/",
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

export default function LicensingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
