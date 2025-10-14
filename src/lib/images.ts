// src/lib/images.ts
const ASSET_BASE = (import.meta as any).env.VITE_ASSET_BASE_URL || "";

export function imageUrl(pathFromApi?: string | null): string {
  if (!pathFromApi) return "/images/bastidelogo.png"; // ✅ fallback global
  const normalized = pathFromApi.replace(/^\//, "");
  if (ASSET_BASE) return `${ASSET_BASE.replace(/\/$/, "")}/${normalized}`;
  return `/${normalized}`;
}

// src/lib/images.ts
export function parseGallery(
    galerie_json?: string | string[] | null
  ): string[] {
    if (!galerie_json) return [];
    try {
      const arr = Array.isArray(galerie_json)
        ? galerie_json
        : JSON.parse(galerie_json);
  
      // garde uniquement des strings non vides
      return (arr || [])
        .filter((x: any) => typeof x === "string" && x.trim())
        // normalise: enlève / initial si présent (imageUrl le remettra proprement)
        .map((s: string) => s.replace(/^\//, ""));
    } catch {
      return [];
    }
  }
  

/**
 * Retourne l’URL d’image produit, ou le logo Bastide si introuvable
 */
export function safeProductImage(imagePath?: string | null): string {
  if (!imagePath) return "/images/bastidelogo.png";
  const normalized = imagePath.replace(/^\//, "");
  // ✅ Vérifie si le chemin contient "images/"
  if (!normalized.startsWith("images/")) {
    return "/images/bastidelogo.png";
  }
  return `/${normalized}`;
}
