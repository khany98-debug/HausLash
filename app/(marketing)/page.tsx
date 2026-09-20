export const metadata = {
  title: "Hauslash | The art of the natural lash lift",
  description:
    "Considered Korean lash lifts in Stoke-on-Trent. Explore real results and reserve your Hauslash appointment online.",
  keywords: "lash lift, Korean lash lift, lash tinting, Stoke-on-Trent, beauty",
  openGraph: {
    title: "HausLash - Premium Lash Lift Treatments",
    description: "Professional Korean lash lifts in Stoke-on-Trent",
    url: "/",
    images: [
      {
        url: "/images/hauslash-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Hauslash Korean lash lift studio in Stoke-on-Trent",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HausLash - Premium Lash Lift Treatments",
    description: "Professional Korean lash lifts in Stoke-on-Trent",
    images: ["/images/hauslash-social-preview.jpg"],
  },
};

import { EditorialHome } from "@/components/home/editorial-home";

export default function HomePage() {
  return <EditorialHome />;
}
