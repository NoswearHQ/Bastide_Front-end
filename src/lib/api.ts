// src/lib/api.ts
type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export type Paginated<T> = {
  page: number;
  limit: number;
  total: number;
  rows: T[];
};

type Tokens = { accessToken: string | null; refreshToken: string | null };

const tokenStore = {
  get(): Tokens {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },
  set(access: string, refresh?: string) {
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  // Si 204, pas de JSON à parser
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// --- Requête "publique" (GET) ---
// Utilise pour les GET qui n'exigent pas de token (ex: /crud/* GET)
export function fetchPublic<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  return fetchJson<T>(url, { ...options, headers });
}

// --- Requête protégée: tente un refresh si 401 ---
export async function fetchWithAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, refreshToken } = tokenStore.get();

  const doFetch = (token?: string) =>
    fetchJson<T>(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  try {
    return await doFetch(accessToken || undefined);
  } catch (err: any) {
    if (String(err.message).startsWith("HTTP 401") && refreshToken) {
      try {
        const data = await fetchJson<{ token: string }>(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        tokenStore.set(data.token);
        return await doFetch(data.token);
      } catch {
        tokenStore.clear();
        throw err;
      }
    }
    throw err;
  }
}

// ---- Types renvoyés par l'API ----
export type Category = {
  id: string;
  nom: string;
  slug: string;
  parent_id?: string | null;
};

export type Product = {
  id: string;
  titre: string;
  slug: string;

  prix: string | null;
  devise: string;

  image_miniature: string | null;   // "images/<slug>/<file>"
  galerie_json: string | null;      // JSON string: ["images/...","images/..."]

  categorie_id: string;
  sous_categorie_id: string;

  // champs supplémentaires possibles en show()
  seo_description?: string | null;
  seo_titre?: string | null;
  description_courte?: string | null;
  description_html?: string | null;
};

export type Article = {
  id: string;
  titre: string;
  slug: string;
  image_miniature?: string | null;
  extrait?: string | null;
  seo_titre?: string | null;
  seo_description?: string | null;
  publie_le?: string | null;
  contenu_html?: string | null;
};

export async function apiLogin(email: string, password: string) {
  const res = await fetchJson<{ token: string; refreshToken: string }>(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  tokenStore.set(res.token, res.refreshToken);
  return res;
}

export function apiLogout() {
  tokenStore.clear();
}

// ---------- Endpoints CRUD publics (GET) ----------
export type ProductQuery = {
  search?: string;
  categoryId?: string;
  subCategoryId?: string;
  page?: number;
  limit?: number; // (min 1, max 200) — aligné backend
  order?: string; // non géré côté back pour l’instant, ignoré
};

export async function getProducts(q: ProductQuery = {}): Promise<Paginated<Product>> {
  const params = new URLSearchParams();
  if (q.search) params.set("search", q.search);
  if (q.categoryId) params.set("categoryId", q.categoryId);
  if (q.subCategoryId) params.set("subCategoryId", q.subCategoryId);
  if (q.page) params.set("page", String(q.page));
  if (q.limit) params.set("limit", String(q.limit));
  if (q.order) params.set("order", q.order); // back l’ignore, ok

  const qs = params.toString();
  return fetchPublic<Paginated<Product>>(`/crud/products${qs ? `?${qs}` : ""}`);
}

export async function getCategories(params?: { search?: string; page?: number; limit?: number }): Promise<Paginated<Category>> {
  const p = new URLSearchParams();
  if (params?.search) p.set("search", params.search);
  if (params?.page) p.set("page", String(params.page));
  if (params?.limit) p.set("limit", String(params.limit));
  const qs = p.toString();
  return fetchPublic<Paginated<Category>>(`/crud/categories${qs ? `?${qs}` : ""}`);
}

export async function getArticles(params?: { search?: string; page?: number; limit?: number }): Promise<Paginated<Article>> {
  const p = new URLSearchParams();
  if (params?.search) p.set("search", params.search);
  if (params?.page) p.set("page", String(params.page));
  if (params?.limit) p.set("limit", String(params.limit));
  const qs = p.toString();
  return fetchPublic<Paginated<Article>>(`/crud/articles${qs ? `?${qs}` : ""}`);
}

// ---------- Endpoints CRUD protégés (admin) ----------
export async function createProduct(payload: Partial<Product> & { titre: string; slug: string; categorie_id: string; sous_categorie_id: string }) {
  return fetchWithAuth<{ id: string }>(`/crud/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function patchProduct(id: string | number, payload: Partial<Product>) {
  return fetchWithAuth<{ ok: true }>(`/crud/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string | number) {
  return fetchWithAuth<void>(`/crud/products/${id}`, { method: "DELETE" });
}

export type ProductDetail = Product & {
    image_miniature?: string | null;
    galerie_json?: string | string[] | null;
    description_courte?: string | null;
    description_html?: string | null;
    categorie_id?: number | null;
    sous_categorie_id?: number | null;
    // nouveaux champs renvoyés par le back
    categorie_nom?: string | null;
    sous_categorie_nom?: string | null;
  };
  
  // Adapte API_BASE à ta config (même base que getProducts)
  export async function getProductById(id: string | number): Promise<ProductDetail> {
    const res = await fetch(`${API_BASE}/crud/products/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
