import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "English Loop — Input to Output English Learning",
    short_name: "English Loop",
    description: "Watch. Listen. Read. Speak. Grow.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f7f4",
    theme_color: "#181f1e",
    categories: ["education", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
