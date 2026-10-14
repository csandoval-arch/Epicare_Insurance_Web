import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const TITLE = "The Company — Who We Are";
const DESCRIPTION =
  "Epicare Insurance Corp: a Miami-based agency built to operate for its producers. Our purpose, our history and the structure behind 130+ carrier appointments.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/company/" },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: TITLE,
    description: DESCRIPTION,
    url: "/company/",
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

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
