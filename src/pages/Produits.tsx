import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, Filter, Star, ShoppingCart, Info } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";
import {
  getProducts,
  type ProductQuery,
  getCategories,
  type Category,
  type Product,
  type ProductDetail,
} from "@/lib/api";
import { toUiProduct, type UiProduct } from "@/types/shop";
import { imageUrl, safeProductImage, parseGallery } from "@/lib/images";
import { handleSmartOrder } from "@/lib/contact";
import Seo from "@/components/Seo";
import ImageSlider from "@/components/ui/ImageSlider";
import { useSearchParams, useNavigate } from "react-router-dom";
import { consumeScrollPosition } from "@/lib/scroll";
// ---------- Helpers (décodage/stripping & fallback desc)
function htmlDecode(input: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = input;
  return txt.value;
}

// Helper function to generate product URL
function getProductUrl(id: string | number, slug?: string | null, titre?: string): string {
  const seoSlug = slug || (titre ? titre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "");
  return `/produit/${id}${seoSlug ? `-${seoSlug}` : ""}`;
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function makeDescriptionFromRaw(p?: Product): string | undefined {
  if (!p) return undefined;
  const src =
    p.description_courte ||
    p.seo_description ||
    (p.description_html ? stripHtml(htmlDecode(p.description_html)) : "");
  const text = src?.trim();
  return text ? text : undefined;
}
function buildFeatures(p?: Product): string[] {
  if (!p) return [];
  const out: string[] = [];
  if (p.prix) out.push(`Prix : ${p.prix} DT`);
  return out;
}

const sortOptions = [
  { value: "name", label: "Nom A-Z" },        // back: titre:asc
  { value: "price-asc", label: "Prix croissant" }, // back: prix:asc
  { value: "price-desc", label: "Prix décroissant" }, // back: prix:desc
  { value: "rating", label: "Mieux notés" },  // visuel uniquement
  { value: "bestseller", label: "Meilleures ventes" }, // visuel uniquement
];

type CatOption = { id: string; label: string };

export default function Produits() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = consumeScrollPosition("/produits");
    if (stored != null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: stored, behavior: "auto" });
      });
    }
  }, []);

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // API data
  const [rows, setRows] = useState<UiProduct[]>([]);

  // Auto-scroll to product list when category is selected
  useEffect(() => {
    if (selectedCatIds.length > 0 && rows.length > 0) {
      // Wait for DOM to update, then scroll
      setTimeout(() => {
        const productList = document.getElementById("product-list");
        if (productList) {
          productList.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [selectedCatIds, rows.length]);
  const [rawById, setRawById] = useState<Record<string, Product>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  // Single category selection only - removed multiSelect
  
  // Grouped products for display when no category selected
  const [groupedProducts, setGroupedProducts] = useState<Record<string, UiProduct[]>>({});
  
  // Cache for categories to avoid repeated API calls
  const [categoriesCache, setCategoriesCache] = useState<Record<string, UiProduct[]>>({});
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const [loadingMoreCategories, setLoadingMoreCategories] = useState(false);

  // Catégories dynamiques depuis le back
  const [catOptions, setCatOptions] = useState<CatOption[]>([]);
  const [catMap, setCatMap] = useState<Map<string, string>>(new Map());

  const productsPerPage = 6;

  // Debounced search to improve performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Show searching indicator when search term changes
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // tri UI -> param back
  const orderParam = useMemo(() => {
    switch (sortBy) {
      case "name":
        return "titre:asc";
      case "price-asc":
        return "prix:asc";
      case "price-desc":
        return "prix:desc";
      default:
        return undefined; // rating/bestseller non gérés côté back
    }
  }, [sortBy]);

  // Charger les catégories (dropdown + map id→nom)
  // Charger les catégories (dropdown + map id→nom)
useEffect(() => {
  getCategories()
    .then((res) => {
      const list = (res.rows as Category[]) || [];
      const options: CatOption[] = [{ id: "ALL", label: "Tous" }];
      const m = new Map<string, string>();
      for (const c of list) {
        options.push({ id: String(c.id), label: c.nom });
        m.set(String(c.id), c.nom);
      }
      const urlCat = params.get("categoryId");
      if (urlCat && urlCat !== "ALL" && !m.has(urlCat)) {
        options.push({ id: urlCat, label: "Catégorie" });
        m.set(urlCat, "Catégorie");
      }
      setCatOptions(options);
      setCatMap(m);
    })
    .catch(() => {
      setCatOptions([{ id: "ALL", label: "Tous" }]);
      setCatMap(new Map());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// ✅ Hydrater l'état depuis l'URL (TOP-LEVEL, pas imbriqué !)
useEffect(() => {
  const catParam = params.get("categoryId");
  // Single category selection: take only the first category if multiple provided
  const cats = catParam ? [catParam.split(',')[0]].filter(Boolean) : [];
  const sort = params.get("sort") ?? "name";
  const qParam = params.get("q") ?? "";
  const p = Number(params.get("page") || 1);

  setSelectedCatIds((prev) => (JSON.stringify(prev) !== JSON.stringify(cats) ? cats : prev));
  setSortBy((prev) => (prev !== sort ? sort : prev));
  setSearchTerm((prev) => (prev !== qParam ? qParam : prev));
  setCurrentPage((prev) => (prev !== p ? p : prev));
}, [params]);

// Charger les produits selon critères
useEffect(() => {
  setLoading(true);
  setError(null);

  if (selectedCatIds.length > 0) {
    // Single category selection only
    const query: ProductQuery = {
      search: debouncedSearchTerm || undefined,
      page: currentPage,
      limit: productsPerPage,
      order: orderParam,
      categoryId: selectedCatIds[0],
    };

    getProducts(query)
      .then((res) => {
        const rawList = ((res.rows as Product[]) || []);
        const ui = rawList.map((p) => {
          const base = toUiProduct(p);
          const desc = base.description ?? makeDescriptionFromRaw(p);
          return {
            ...base,
            category: catMap.get(String((p as any).categorie_id)) || base.category || "Catégorie",
            description: desc,
          } as UiProduct & { description?: string };
        });

        const idx: Record<string, Product> = {};
        rawList.forEach((p) => (idx[String(p.id)] = p));

        setRows(ui);
        setRawById(idx);
        setTotal(res.total);
        setGroupedProducts({});
      })
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false));
  } else {
    // Pas de catégorie sélectionnée
    if (debouncedSearchTerm) {
      // Recherche globale
      const query: ProductQuery = {
        search: debouncedSearchTerm,
        page: 1,
        limit: 50,
        order: orderParam,
      };

      getProducts(query)
        .then((res) => {
          const rawList = ((res.rows as Product[]) || []);
          const ui = rawList.map((p) => {
            const base = toUiProduct(p);
            const desc = base.description ?? makeDescriptionFromRaw(p);
            return {
              ...base,
              category: catMap.get(String((p as any).categorie_id)) || base.category || "Catégorie",
              description: desc,
            } as UiProduct & { description?: string };
          });

          const idx: Record<string, Product> = {};
          rawList.forEach((p) => (idx[String(p.id)] = p));

          setRows(ui);
          setRawById(idx);
          setTotal(res.total);
          setGroupedProducts({});
        })
        .catch((e) => setError(String(e?.message || e)))
        .finally(() => setLoading(false));
    } else {
      // Mode groupé normal (sans recherche)
      const loadGroupedProducts = async () => {
        try {
          const grouped: Record<string, UiProduct[]> = {};
          const allRaw: Record<string, Product> = {};

          const categoriesToLoad = catOptions
            .filter(opt => opt.id !== "ALL")
            .slice(0, 3);

          for (const catOption of categoriesToLoad) {
            if (categoriesCache[catOption.id]) {
              grouped[catOption.id] = categoriesCache[catOption.id];
              continue;
            }

            const query: ProductQuery = {
              page: 1,
              limit: 3,
              order: orderParam,
              categoryId: catOption.id,
            };

            const res = await getProducts(query);
            const rawList = ((res.rows as Product[]) || []);

            if (rawList.length > 0) {
              const ui = rawList.map((p) => {
                const base = toUiProduct(p);
                const desc = base.description ?? makeDescriptionFromRaw(p);
                allRaw[String(p.id)] = p;
                return {
                  ...base,
                  category: catMap.get(String((p as any).categorie_id)) || base.category || "Catégorie",
                  description: desc,
                } as UiProduct & { description?: string };
              });

              grouped[catOption.id] = ui;
              setCategoriesCache(prev => ({ ...prev, [catOption.id]: ui }));
              setLoadedCategories(prev => new Set([...prev, catOption.id]));
            }
          }

          setGroupedProducts(grouped);
          setRawById(allRaw);
          setRows([]);
          setTotal(Object.values(grouped).reduce((sum, products) => sum + products.length, 0));
        } catch (e) {
          setError(String(e?.message || e));
        } finally {
          setLoading(false);
        }
      };

      loadGroupedProducts();
    }
  }
}, [debouncedSearchTerm, currentPage, orderParam, selectedCatIds, catMap, catOptions]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / productsPerPage)),
    [total, productsPerPage]
  );
// ✅ AJOUTE ICI LA MÉTHODE updateUrl
function updateUrl(partial: { categoryIds?: string[]; sort?: string; q?: string; page?: number }) {
  const next = new URLSearchParams(params);

  if (partial.categoryIds !== undefined) {
    if (partial.categoryIds.length === 0) {
      next.delete("categoryId");
    } else {
      // Single category selection: only use the first category
      next.set("categoryId", partial.categoryIds[0]);
    }
    next.delete("page");
  }

  if (partial.sort !== undefined) {
    partial.sort === "name" ? next.delete("sort") : next.set("sort", partial.sort);
    next.delete("page");
  }

  if (partial.q !== undefined) {
    partial.q ? next.set("q", partial.q) : next.delete("q");
    next.delete("page");
  }

  if (partial.page !== undefined) {
    partial.page > 1 ? next.set("page", String(partial.page)) : next.delete("page");
  }

  setParams(next, { replace: true });
}

const handleCategoryToggle = (categoryId: string) => {
  // Single category selection: if clicking the same category, deselect it; otherwise, select only this one
  setSelectedCatIds(prev => {
    const newIds = prev.includes(categoryId) 
      ? [] // Deselect if already selected
      : [categoryId]; // Select only this category (single selection)
    setCurrentPage(1);
    updateUrl({ categoryIds: newIds });
    return newIds;
  });
};

const handleCategorySelect = (categoryId: string) => {
  // If empty string, deselect; otherwise select only this category
  const newIds = categoryId ? [categoryId] : [];
  setSelectedCatIds(newIds);
  setCurrentPage(1);
  updateUrl({ categoryIds: newIds });
};

const handleSortChange = (sort: string) => {
  setSortBy(sort);
  setCurrentPage(1);
  updateUrl({ sort });
};

const handleSearchChange = (search: string) => {
  setSearchTerm(search);
  setCurrentPage(1);
  updateUrl({ q: search });
};

const handlePageChange = (page: number) => {
  setCurrentPage(page);
  updateUrl({ page });
};

const loadMoreCategories = async () => {
  if (loadingMoreCategories) return;
  
  setLoadingMoreCategories(true);
  try {
    const remainingCategories = catOptions
      .filter(opt => opt.id !== "ALL" && !loadedCategories.has(opt.id))
      .slice(0, 3); // Charger 3 catégories supplémentaires
    
    const newGrouped: Record<string, UiProduct[]> = {};
    const allRaw: Record<string, Product> = {};
    
    for (const catOption of remainingCategories) {
      const query: ProductQuery = {
        page: 1,
        limit: 3,
        order: orderParam,
        categoryId: catOption.id,
      };

      const res = await getProducts(query);
      const rawList = (res.rows as Product[]) || [];
      
      if (rawList.length > 0) {
        const ui = rawList.map((p) => {
          const base = toUiProduct(p);
          const desc = base.description ?? makeDescriptionFromRaw(p);
          allRaw[String(p.id)] = p;
          return {
            ...base,
            category: catMap.get(String(p.categorie_id)) || base.category || "Catégorie",
            description: desc,
          } as UiProduct & { description?: string };
        });
        
        newGrouped[catOption.id] = ui;
        setCategoriesCache(prev => ({ ...prev, [catOption.id]: ui }));
        setLoadedCategories(prev => new Set([...prev, catOption.id]));
      }
    }
    
    // Mettre à jour les produits groupés - s'assurer que les nouvelles catégories sont ajoutées à la fin
    setGroupedProducts(prev => {
      const updated = { ...prev };
      // Ajouter les nouvelles catégories dans l'ordre des catOptions
      for (const catOption of remainingCategories) {
        if (newGrouped[catOption.id]) {
          updated[catOption.id] = newGrouped[catOption.id];
        }
      }
      return updated;
    });
    setRawById(prev => ({ ...prev, ...allRaw }));
    setTotal(prev => prev + Object.values(newGrouped).reduce((sum, products) => sum + products.length, 0));
  } catch (e) {
    setError(String(e?.message || e));
  } finally {
    setLoadingMoreCategories(false);
  }
};


  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));

  return (
    <Layout>
      <Seo
        title="Produits médicaux — Bastide Tunisie"
        description="Découvrez notre catalogue de matériel médical : mobilité, incontinence, confort et soins. Vente et location en Tunisie."
        canonical="https://bastide.tn/produits"
      />
      {/* Hero Slider */}
      <section>
        <ImageSlider />
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="medical-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${searching ? 'text-medical-primary animate-pulse' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Rechercher par titre, catégorie ou référence..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="medical-form-input pl-10"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-medical-primary"></div>
                  </div>
                )}
              </div>
              <div className="mt-1">
                <p className="text-xs text-gray-500">
                  Recherchez par nom de produit, catégorie ou référence
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-gray-400">Exemples:</span>
                  <span className="text-xs text-gray-400">"stéthoscope"</span>
                  <span className="text-xs text-gray-400">"chirurgie"</span>
                  <span className="text-xs text-gray-400">"REF-001"</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="medical-form-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {catOptions.filter(opt => opt.id !== "ALL").map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleCategorySelect(option.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCatIds.includes(option.id)
                      ? "bg-medical-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCatIds.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-medical-primary text-white">
                {catMap.get(selectedCatIds[0]) || "Catégorie"}
                <button 
                  onClick={() => handleCategorySelect("")} 
                  className="ml-2 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                "{searchTerm}"
                <button onClick={() => handleSearchChange("")} className="ml-2 hover:text-gray-500">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="medical-section">
        <div className="medical-container">
          {loading ? (
            <p className="text-gray-500">Chargement…</p>
          ) : error ? (
            <div className="text-red-600">Erreur : {error}</div>
          ) : selectedCatIds.length > 0 || (debouncedSearchTerm && rows.length > 0) ? (
            // Mode filtrage: affichage normal avec pagination
            rows.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-8">
                  <p className="text-gray-600">
                    {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                    {searchTerm && (
                      <span className="text-gray-500">
                        {" "}pour "{searchTerm}"
                      </span>
                    )}
                  </p>
                </div>

                <div id="product-list" className="medical-grid medical-grid--3">
              {rows.map((product) => {
  const description = product.description ?? "";       // safe
  const rawProduct = rawById[product.id];
  const productUrl = getProductUrl(product.id, rawProduct?.slug, rawProduct?.titre || product.name);

  return (
    <div
      key={product.id}
      className="h-full flex flex-col cursor-pointer"
      onClick={() => navigate(productUrl)}
      role="button"
      tabIndex={0}
    >
    <MedicalCard className="h-full flex flex-col">
 <div className="relative">
  <div className="aspect-square bg-gray-200 rounded-t-xl flex items-center justify-center overflow-hidden">
  <img
  src={safeProductImage(product.image ?? product.image)}
  alt={product.name}
  className={`w-full max-w-[300px] h-auto ${
    product.image?.includes("bastidelogo.png")
      ? "object-contain p-6"
      : "object-cover"
  }`}
  loading="lazy"
/>

  </div>
</div>


  {/* Contenu en grille: [meta] [titre+rating] [body variable en 1fr] [boutons] */}
  <MedicalCard.Content className="p-4">
    <div className="grid grid-rows-[auto_auto_1fr_auto] gap-2 h-full">

      {/* Row 1: méta (catégorie + prix) */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-medical-primary bg-medical-primary/10 px-2 py-1 rounded">
          {product.category || "Catégorie"}
        </span>
        <span className="text-lg font-bold text-gray-900">{product.priceLabel}</span>
      </div>

      {/* Row 2: titre (clamp 2 lignes) + rating */}
      <div>
        <div className="clamp-2 line-clamp-2">
        <MedicalCard.Title>{product.name}</MedicalCard.Title>
{product.reference && (
  <p className="text-sm text-gray-500 mt-1">Réf : {product.reference}</p>
)}

        </div>
        
      </div>

      {/* Row 3: zone variable poussée en 1fr (description + éventuelles features) */}
      <div className="min-h-0">
  {product.description && (
    <MedicalCard.Description className="clamp-5 line-clamp-5">
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </MedicalCard.Description>
  )}
</div>


      {/* Row 4: boutons — toujours alignés en bas grâce à la 1fr au-dessus */}
      <div className="mt-2 flex gap-2 items-center">
  {/* Bouton Commander */}
  <MedicalButton
    variant="primary"
    size="sm"
    className="flex-1"
    onClick={async (e) => {
      e.stopPropagation();
      const rawProduct = rawById[product.id];
      await handleSmartOrder({
        productName: product.name,
        productReference: product.reference || rawProduct?.reference || undefined,
        productPrice: product.priceLabel !== "—" ? product.priceLabel : undefined,
        productId: product.id, // Pass product ID for better tracking
      });
    }}
  >
    <ShoppingCart className="mr-2 h-4 w-4" />
    Commander
  </MedicalButton>

  {/* Bouton Info compact */}
  <MedicalButton
    variant="outline"
    size="sm"
    className="p-2 w-9 h-9 flex items-center justify-center"
    onClick={(e) => { 
      e.stopPropagation(); 
      const rawProduct = rawById[product.id];
      const productUrl = getProductUrl(product.id, rawProduct?.slug, rawProduct?.titre || product.name);
      navigate(productUrl);
    }}
    title="Voir les détails du produit"
  >
    <Info className="h-4 w-4" />
  </MedicalButton>
</div>
    </div>
  </MedicalCard.Content>
</MedicalCard>
</div>

  );
})}

              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche ou de filtrage.</p>
              <MedicalButton
                variant="primary"
                onClick={() => {
                  setSelectedCatIds([]);
                  setSearchTerm("");
                }}
              >
                Réinitialiser les filtres
              </MedicalButton>
            </div>
          )
          ) : (
            // Mode groupé: affichage par catégories
            Object.keys(groupedProducts).length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-8">
                  <p className="text-gray-600">
                    {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                    {searchTerm && (
                      <span className="text-gray-500">
                        {" "}pour "{searchTerm}"
                      </span>
                    )}
                  </p>
                </div>

                {/* Grouped Products by Category - Display in correct order */}
                {catOptions
                  .filter(opt => opt.id !== "ALL" && groupedProducts[opt.id])
                  .map((catOption) => {
                    const categoryId = catOption.id;
                    const products = groupedProducts[categoryId];
                    return (
                  <div key={categoryId} className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {catMap.get(categoryId) || "Catégorie"}
                      </h2>
                      <MedicalButton
                        variant="outline"
                        onClick={() => handleCategorySelect(categoryId)}
                      >
                        Voir plus
                      </MedicalButton>
                    </div>
                    
                    <div className="medical-grid medical-grid--3">
                      {products.map((product) => {
                        const description = product.description ?? "";
                        const rawProduct = rawById[product.id];
                        const productUrl = getProductUrl(product.id, rawProduct?.slug, rawProduct?.titre || product.name);

                        return (
                          <div
                            key={product.id}
                            className="h-full flex flex-col cursor-pointer"
                            onClick={() => navigate(productUrl)}
                            role="button"
                            tabIndex={0}
                          >
                          <MedicalCard className="h-full flex flex-col">
                            <div className="relative">
                              <div className="aspect-square bg-gray-200 rounded-t-xl flex items-center justify-center overflow-hidden">
                                <img
                                  src={safeProductImage(product.image ?? product.image)}
                                  alt={product.name}
                                  className={`w-full max-w-[300px] h-auto ${
                                    product.image?.includes("bastidelogo.png")
                                      ? "object-contain p-6"
                                      : "object-cover"
                                  }`}
                                  loading="lazy"
                                />
                              </div>
                            </div>

                            <MedicalCard.Content className="p-4">
                              <div className="grid grid-rows-[auto_auto_1fr_auto] gap-2 h-full">
                                {/* Row 1: méta (catégorie + prix) */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-medical-primary bg-medical-primary/10 px-2 py-1 rounded">
                                    {product.category || "Catégorie"}
                                  </span>
                                  <span className="text-lg font-bold text-gray-900">{product.priceLabel}</span>
                                </div>

                                {/* Row 2: titre (clamp 2 lignes) + rating */}
                                <div>
                                  <div className="clamp-2 line-clamp-2">
                                    <MedicalCard.Title>{product.name}</MedicalCard.Title>
                                    {product.reference && (
                                      <p className="text-sm text-gray-500 mt-1">Réf : {product.reference}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Row 3: zone variable poussée en 1fr (description + éventuelles features) */}
                                <div className="min-h-0">
                                  {product.description && (
                                    <MedicalCard.Description className="clamp-5 line-clamp-5">
                                      <div
                                        className="prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                      />
                                    </MedicalCard.Description>
                                  )}
                                </div>

                                {/* Row 4: boutons — toujours alignés en bas grâce à la 1fr au-dessus */}
                                <div className="mt-2 flex gap-2 items-center">
                                  {/* Bouton Commander */}
                                  <MedicalButton
                                    variant="primary"
                                    size="sm"
                                    className="flex-1"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const rawProduct = rawById[product.id];
                                      await handleSmartOrder({
                                        productName: product.name,
                                        productReference: product.reference || rawProduct?.reference || undefined,
                                        productPrice: product.priceLabel !== "—" ? product.priceLabel : undefined,
                                      });
                                    }}
                                  >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Commander
                                  </MedicalButton>

                                  {/* Bouton Info compact */}
                                  <MedicalButton
                                    variant="outline"
                                    size="sm"
                                    className="p-2 w-9 h-9 flex items-center justify-center"
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      const rawProduct = rawById[product.id];
                                      const productUrl = getProductUrl(product.id, rawProduct?.slug, rawProduct?.titre || product.name);
                                      navigate(productUrl);
                                    }}
                                    title="Voir les détails du produit"
                                  >
                                    <Info className="h-4 w-4" />
                                  </MedicalButton>
                                </div>
                              </div>
                            </MedicalCard.Content>
                          </MedicalCard>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                    );
                  })}
                
                {/* Load More Categories Button */}
                {Object.keys(groupedProducts).length > 0 && 
                 catOptions.filter(opt => opt.id !== "ALL").length > loadedCategories.size && (
                  <div className="text-center mt-8">
                    <MedicalButton
                      variant="outline"
                      onClick={loadMoreCategories}
                      disabled={loadingMoreCategories}
                    >
                      {loadingMoreCategories ? "Chargement..." : "Voir plus de catégories"}
                    </MedicalButton>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche ou de filtrage.</p>
                <MedicalButton
                  variant="primary"
                  onClick={() => {
                    setSelectedCatIds([]);
                    setSearchTerm("");
                  }}
                >
                  Réinitialiser les filtres
                </MedicalButton>
              </div>
            )
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Besoin d&apos;aide pour choisir ?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Nos experts sont là pour vous conseiller et vous aider à trouver
              l&apos;équipement médical adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
  {/* Bouton : Contacter un expert */}
  <MedicalButton
    variant="primary"
    onClick={() => {
      const phone = "+21629380898"; // 📞 numéro WhatsApp de Bastide Tunisie
      const message = encodeURIComponent(
        "Bonjour 👋, je souhaite être mis en contact avec un expert Bastide Tunisie pour plus d’informations."
      );
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
    }}
  >
    Contacter un expert
  </MedicalButton>

  {/* Bouton : Demander un devis */}
  <MedicalButton
    variant="outline"
    onClick={() => {
      openMailDevis({
        subject: "Demande de devis",
        body: "Bonjour, je souhaite obtenir un devis pour du matériel médical Bastide Tunisie.\n\nMerci.",
      });
    }}
  >
    Demander un devis
  </MedicalButton>
</div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
function ProductDetailsView({ product }: { product: ProductDetail }) {
  const gallery = useMemo(() => {
    const list: string[] = [];

    if (product.image_miniature) list.push(imageUrl(product.image_miniature));

    const fromJson = parseGallery(product.galerie_json) || [];
    for (const p of fromJson) list.push(imageUrl(p));

    if (list.length === 0) list.push(safeProductImage((product as any).image));
    return Array.from(new Set(list));
  }, [product]);

  const [active, setActive] = useState(0);

  const priceLabel = product.prix != null ? `${product.prix} DT` : "—";

  // 👉 garde le HTML tel quel
  const description = product.description_html || "";

  return (
    <div className="text-left">
      {/* Titre + prix */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold leading-snug">{product.titre}</h3>
        <div className="text-lg font-semibold whitespace-nowrap">{priceLabel}</div>
      </div>

      {/* Galerie */}
      <div className="mb-4">
        <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={gallery[active]}
            alt={product.titre}
            className={`w-full h-full ${gallery[active]?.includes("bastidelogo.png") ? "object-contain p-6" : "object-cover"}`}
          />
        </div>

        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {gallery.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`border rounded-md overflow-hidden h-20 focus:outline-none ${idx === active ? "ring-2 ring-medical-primary" : "border-gray-200"}`}
                title={`Image ${idx + 1}`}
              >
                <img
                  src={src}
                  alt={`Image ${idx + 1}`}
                  className={`w-full h-full ${src.includes("bastidelogo.png") ? "object-contain p-2" : "object-cover"}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Description avec HTML interprété */}
      {description && (
        <div
          className="text-gray-700 leading-relaxed mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Métadonnées rapides */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
        <div><span className="font-medium">Catégorie:</span> {product.categorie_nom ?? "—"}</div>
        <div><span className="font-medium">Sous-catégorie:</span> {product.sous_categorie_nom ?? "—"}</div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <MedicalButton
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={async () => {
            const priceLabel = product.prix != null ? `${parseFloat(product.prix).toFixed(2)} DT` : undefined;
            await handleSmartOrder({
              productName: product.titre,
              productReference: product.reference || undefined,
              productPrice: priceLabel,
              productId: product.id, // Pass product ID for better tracking
            });
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Commander
        </MedicalButton>
      </div>
    </div>
  );
}




