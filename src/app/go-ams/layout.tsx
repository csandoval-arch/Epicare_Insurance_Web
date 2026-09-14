import type { Metadata } from "next";
import { OG_IMAGE } from "../layout";

const DESCRIPTION =
  "GO AMS is the Epicare broker portal: manage contracts, clients, production and payouts for your insurance business in a single interface.";

export const metadata: Metadata = {
  title: "GO AMS — The broker portal",
  description: DESCRIPTION,
  alternates: { canonical: "/go-ams/" },
  openGraph: {
    type: "website",
    siteName: "Epicare",
    title: "GO AMS — The broker portal",
    description: DESCRIPTION,
    url: "/go-ams/",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
    title: "GO AMS — The broker portal",
    description: DESCRIPTION,
  },
};

export default function GoAmsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
