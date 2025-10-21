// src/lib/shop.ts
import type { Product } from "../lib/api";
import { imageUrl, parseGallery } from "../lib/images";

export type UiProduct = {
    reference: any;
    id: string;
    name: string;
    category: string;
    priceLabel: string;
    image: string;
    images: string[];
    inStock: boolean;
    description?: string | null; // 👈 ajouté
  };
  

  export function toUiProduct(p: Product): UiProduct {
    const price = p.prix ?? null;
    const devise = p.devise || "EUR";
    const priceLabel = price ? `${price}${devise === "EUR" ? "€" : ` ${devise}`}` : "—";
    const images = parseGallery(p.galerie_json);
  
    return {
      id: String(p.id),
      name: p.titre,
      category: "", // à enrichir plus tard (nom de catégorie)
      priceLabel,
      image: imageUrl(p.image_miniature),
      images,
      inStock: true, // pas exposé en index → true par défaut
      description: p.seo_description ?? null, // 👈 alimente la description
    };
  }
