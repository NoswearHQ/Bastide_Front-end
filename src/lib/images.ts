// src/lib/images.ts
const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "https://api.bastide.com.tn";
console.log('🔧 API_BASE in images.ts:', API_BASE);

/**
 * Construit une URL absolue vers le backend public /images à partir d'un chemin relatif
 * Stockage en base attendu: chemins relatifs type "images/slug/filename.jpg"
 */
export function imageUrl(pathFromApi?: string | null): string {
  if (!pathFromApi) return placeholder();

  const trimmed = String(pathFromApi).trim();
  // Déjà une URL absolue (http/https, blob:, data:)
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\//, "");
  
  // Si le chemin ne commence pas par "images/", l'ajouter
  const finalPath = normalized.startsWith('images/') ? normalized : `images/${normalized}`;
  
  const encoded = encodeImagePath(finalPath);
  const base = API_BASE.replace(/\/$/, "");
  return `${base}/${encoded}`;
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
 * Retourne une image produit sécurisée (toujours servie par le backend /images)
 */
export function safeProductImage(imagePath?: string | null): string {
  if (!imagePath) return placeholder();
  const result = imageUrl(imagePath);
  
  // Test if the image URL is accessible
  if (result.startsWith('http')) {
    fetch(result, { method: 'HEAD' })
      .then(response => {
        console.log(`🔍 Image accessibility test: ${result} - Status: ${response.status}`);
        if (!response.ok) {
          console.log(`❌ Image not accessible: ${result} - Status: ${response.status}`);
        }
      })
      .catch(error => {
        console.log(`❌ Image fetch error: ${result} - Error:`, error);
      });
  }
  
  return result;
}

function encodeImagePath(path: string): string {
  // Sépare pour encoder correctement chaque segment sans toucher aux '/'
  return path
    .split("/")
    .map((seg) => encodeURI(seg))
    .join("/");
}

function placeholder(): string {
  const base = API_BASE.replace(/\/$/, "");
  return `${base}/images/bastidelogo.png`;
}


