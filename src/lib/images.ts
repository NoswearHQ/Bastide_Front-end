// src/lib/images.ts
const ASSET_BASE = (import.meta as any).env.VITE_ASSET_BASE_URL || "";

/**
 * Retourne l'URL d'une image depuis le chemin en base.
 * - Si le chemin commence par "images/", on redirige vers /src/assets/
 * - Sinon, fallback sur /images/bastidelogo.png
 */
export function imageUrl(pathFromApi?: string | null): string {
  if (!pathFromApi) return "/images/bastidelogo.png";

  const normalized = pathFromApi.replace(/^\//, "");

  // ✅ redirige les images vers le dossier frontend "src/assets/"
  if (normalized.startsWith("images/")) {
    const localPath = normalized.replace(/^images\//, "");
    // si tu build avec Vite, le dossier src/assets est déjà exposé
    return new URL(`../assets/${localPath}`, import.meta.url).href;
  }

  // ✅ fallback : utilise le CDN si défini dans VITE_ASSET_BASE_URL
  if (ASSET_BASE) return `${ASSET_BASE.replace(/\/$/, "")}/${normalized}`;

  return `/${normalized}`;
}

/**
 * Parse le champ galerie_json en tableau d'URLs exploitables
 */
export function parseGallery(galerie_json?: string | string[] | null): string[] {
  if (!galerie_json) return [];

  try {
    const arr = Array.isArray(galerie_json)
      ? galerie_json
      : JSON.parse(galerie_json);

    return (arr || [])
      .filter((x: any) => typeof x === "string" && x.trim())
      .map((s: string) => s.replace(/^\//, ""));
  } catch {
    return [];
  }
}

/**
 * Retourne une image produit sécurisée
 */
export function safeProductImage(imagePath?: string | null): string {
  if (!imagePath) return "/images/bastidelogo.png";

  // ✅ si c'est déjà une URL absolue (http/https), un blob: ou un data:, on la renvoie telle quelle
  if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith("blob:") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  const normalized = imagePath.replace(/^\//, "");

  // ✅ si ça vient du back "images/...", on le sert depuis /public/images
  if (normalized.startsWith("images/")) {
    // encode les espaces/accents pour éviter les 404 silencieux
    const [dir, ...rest] = normalized.split("/");
    const encoded = [dir, encodeURI(rest.join("/"))].join("/");
    return `/${encoded}`;
  }

  // ✅ si tu reçois "src/assets/slug/file", résous via Vite
  if (normalized.startsWith("src/assets/")) {
    const localPath = normalized.replace(/^src\//, "");
    try {
      return new URL(`../${encodeURI(localPath)}`, import.meta.url).href;
    } catch {
      /* ignore */
    }
  }

  return "/images/bastidelogo.png";
}


