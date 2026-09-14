import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const DESCRIPTION =
  "GO CRM is the Epicare insurance CRM: manage leads, pipelines, automated follow-up, and client communication seamlessly in your agency operation.";

export const metadata: Metadata = {
  title: "GO CRM — Intelligent Pipeline & Client Management",
  description: DESCRIPTION,
  alternates: { canonical: "/go-crm/" },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: "GO CRM — Intelligent Pipeline & Client Management",
    description: DESCRIPTION,
    url: "/go-crm/",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
    title: "GO CRM — Intelligent Pipeline & Client Management",
    description: DESCRIPTION,
  },
};

export default function GoCrmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
