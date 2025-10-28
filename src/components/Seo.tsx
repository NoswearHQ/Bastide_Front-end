import { useEffect } from "react";

type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string; // website | article | product
};

const SITE_BASE = (import.meta as any).env.VITE_SITE_BASE_URL || "https://bastide.tn";

function upsertMeta(name: string, content: string, attr: "name" | "property" = "name") {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ title, description, canonical, image, type = "website" }: SeoProps) {
  useEffect(() => {
    const pageUrl = canonical || (typeof window !== "undefined" ? window.location.href : SITE_BASE);
    const finalTitle = title ? `${title}` : "Bastide - Le confort médical";
    const finalDesc = description || "Bastide Tunisie — spécialiste du matériel et confort médical. Vente et location, maintien à domicile, soins et équipements de santé.";
    const finalImage = image || `${SITE_BASE.replace(/\/$/, "")}/images/bastidelogo.png`;

    document.title = finalTitle;
    upsertMeta("description", finalDesc);
    upsertLink("canonical", pageUrl);

    // Open Graph
    upsertMeta("og:title", finalTitle, "property");
    upsertMeta("og:description", finalDesc, "property");
    upsertMeta("og:type", type, "property");
    upsertMeta("og:url", pageUrl, "property");
    upsertMeta("og:image", finalImage, "property");

    // Twitter
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", finalTitle);
    upsertMeta("twitter:description", finalDesc);
    upsertMeta("twitter:image", finalImage);
  }, [title, description, canonical, image, type]);

  return null;
}

export default Seo;


