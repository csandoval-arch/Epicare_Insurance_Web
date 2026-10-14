import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const DESCRIPTION =
  "Agency Solutions by Epicare: Specialized marketing campaigns, high-converting funnels, and proprietary technology built for insurance agencies and top producers.";

export const metadata: Metadata = {
  title: "Agency Solutions — Marketing & Technology | Epicare",
  description: DESCRIPTION,
  alternates: { canonical: "/solutions/" },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: "Agency Solutions — Marketing & Technology | Epicare",
    description: DESCRIPTION,
    url: "/solutions/",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
    title: "Agency Solutions — Marketing & Technology | Epicare",
    description: DESCRIPTION,
  },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
