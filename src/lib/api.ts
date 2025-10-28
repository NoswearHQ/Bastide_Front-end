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

  const doFetch = (token?: string) => {
    const isFormData = options.body instanceof FormData;
  
    return fetchJson<T>(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };
  

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
  reference?: string | null; // 🆕 optionnel
  titre: string;
  slug: string;
  prix: string | null;
  devise: string;
  image_miniature: string | null;
  galerie_json: string[] | null;
  categorie_id: string;
  sous_categorie_id: string;
  est_actif: boolean;
  seo_description?: string | null;
  seo_titre?: string | null;
  description_courte?: string | null;
  description_html?: string | null;
};


export type Article = {
  id: string;
  titre: string;
  slug: string;
  nom_auteur?: string | null;
  image_miniature?: string | null;
  galerie_json?: string[] | null;
  extrait?: string | null;
  contenu_html: string;
  statut: string;
  publie_le?: string | null;
  seo_titre?: string | null;
  seo_description?: string | null;
  cree_le: string;
  modifie_le: string;
};

export type ArticleCreate = {
  titre: string;
  slug: string;
  nom_auteur?: string;
  image_miniature?: string;
  galerie_json?: string[];
  extrait?: string;
  contenu_html: string;
  statut: string;
  publie_le?: string;
  seo_titre?: string;
  seo_description?: string;
};

export type ArticleUpdate = Partial<ArticleCreate>;

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
    galerie_json?: string[] | null;
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
// ---------- Endpoints CRUD Catégories ----------

// ✅ Type complet aligné avec le contrôleur Symfony
export type CategoryFull = {
  id: number;
  nom: string;
  slug: string;
  position: number;
  est_active: boolean;
  parent_id?: number | null;
  cree_le: string;
  modifie_le: string;
};

// 🔹 Récupération paginée des catégories (publique)
export async function getCategoriesFull(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<CategoryFull>> {
  const p = new URLSearchParams();
  if (params?.search) p.set("search", params.search);
  if (params?.page) p.set("page", String(params.page));
  if (params?.limit) p.set("limit", String(params.limit));
  const qs = p.toString();
  return fetchPublic<Paginated<CategoryFull>>(`/crud/categories${qs ? `?${qs}` : ""}`);
}

// 🔹 Récupération d’une catégorie par ID (publique)
export async function getCategoryById(id: number): Promise<CategoryFull> {
  return fetchPublic<CategoryFull>(`/crud/categories/${id}`);
}

// 🔹 Création (protégée)
export async function createCategory(payload: {
  nom: string;
  slug: string;
  position?: number;
  est_active?: boolean;
  parent_id?: number | null;
}) {
  return fetchWithAuth<{ id: number }>(`/crud/categories`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔹 Mise à jour partielle (protégée)
export async function patchCategory(
  id: number,
  payload: Partial<Omit<CategoryFull, "id" | "cree_le" | "modifie_le">>
) {
  return fetchWithAuth<{ ok: true }>(`/crud/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// 🔹 Suppression (protégée)
export async function deleteCategory(id: number) {
  return fetchWithAuth<void>(`/crud/categories/${id}`, { method: "DELETE" });
}

// ---------- Endpoints CRUD Articles ----------

// 🔹 Récupération d'un article par ID (publique)
export async function getArticleById(id: string | number): Promise<Article> {
  return fetchPublic<Article>(`/crud/articles/${id}`);
}

// 🔹 Récupération d'un article par slug (publique)
export async function getArticleBySlug(slug: string): Promise<Article> {
  return fetchPublic<Article>(`/crud/articles/slug/${encodeURIComponent(slug)}`);
}

// 🔹 Création d'un article (protégée)
export async function createArticle(payload: ArticleCreate) {
  return fetchWithAuth<{ id: string }>(`/crud/articles`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔹 Mise à jour d'un article (protégée)
export async function updateArticle(id: string | number, payload: ArticleUpdate) {
  return fetchWithAuth<{ ok: true }>(`/crud/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// 🔹 Patch d'un article (protégée) - alias pour updateArticle
export async function patchArticle(id: string | number, payload: Partial<ArticleUpdate>) {
  return fetchWithAuth<{ ok: true }>(`/crud/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// 🔹 Suppression d'un article (protégée)
export async function deleteArticle(id: string | number) {
  return fetchWithAuth<void>(`/crud/articles/${id}`, { method: "DELETE" });
}
