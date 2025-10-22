import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Star, ShoppingCart, Info } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getProducts,
  type ProductQuery,
  getCategories,
  type Category,
  type Product,
  getProductById,       
  type ProductDetail,    
} from "@/lib/api";
import { toUiProduct, type UiProduct } from "@/types/shop";
import { imageUrl, safeProductImage, parseGallery } from "@/lib/images";
import { useSearchParams } from "react-router-dom";
// ---------- Helpers (décodage/stripping & fallback desc)
function htmlDecode(input: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = input;
  return txt.value;
}
const openProductDetails = async (id: string | number) => {
  // petit loader SweetAlert le temps de charger
  Swal.fire({
    title: "Chargement...",
    didOpen: () => Swal.showLoading(),
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    backdrop: true,
  });

  try {
    const data = await getProductById(id);

    await MySwal.fire({
      title: undefined,              // on gère le titre dans notre vue
      html: <ProductDetailsView product={data} />,
      width: "64rem",
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      backdrop: true,
      customClass: {
        popup: "rounded-2xl p-0",
        htmlContainer: "p-6",
        closeButton: "text-gray-500 hover:text-gray-700",
      },
    });
  } catch (e: any) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: e?.message ? String(e.message) : "Impossible de charger le produit.",
    });
  }
};

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
  if (p.prix && p.devise) out.push(`Prix : ${p.prix}${p.devise === "EUR" ? "€" : ` ${p.devise}`}`);
  return out;
}

const sortOptions = [
  { value: "name", label: "Nom A-Z" },        // back: titre:asc
  { value: "price-asc", label: "Prix croissant" }, // back: prix:asc
  { value: "price-desc", label: "Prix décroissant" }, // back: prix:desc
  { value: "rating", label: "Mieux notés" },  // visuel uniquement
  { value: "bestseller", label: "Meilleures ventes" }, // visuel uniquement
];
const MySwal = withReactContent(Swal);

type CatOption = { id: string; label: string };

export default function Produits() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [params, setParams] = useSearchParams();

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCatId, setSelectedCatId] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // API data
  const [rows, setRows] = useState<UiProduct[]>([]);
  const [rawById, setRawById] = useState<Record<string, Product>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Catégories dynamiques depuis le back
  const [catOptions, setCatOptions] = useState<CatOption[]>([]);
  const [catMap, setCatMap] = useState<Map<string, string>>(new Map());

  const productsPerPage = 6;

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

// ✅ Hydrater l’état depuis l’URL (TOP-LEVEL, pas imbriqué !)
useEffect(() => {
  const cat = params.get("categoryId") ?? "ALL";
  const sort = params.get("sort") ?? "name";
  const qParam = params.get("q") ?? "";
  const p = Number(params.get("page") || 1);

  setSelectedCatId((prev) => (prev !== cat ? cat : prev));
  setSortBy((prev) => (prev !== sort ? sort : prev));
  setSearchTerm((prev) => (prev !== qParam ? qParam : prev));
  setCurrentPage((prev) => (prev !== p ? p : prev));
}, [params]);

// Charger les produits selon critères
useEffect(() => {
  const query: ProductQuery = {
    search: searchTerm || undefined,
    page: currentPage,
    limit: productsPerPage,
    order: orderParam,
    categoryId: selectedCatId !== "ALL" ? selectedCatId : undefined,
  };

  setLoading(true);
  setError(null);

  getProducts(query)
    .then((res) => {
      const rawList = (res.rows as Product[]) || [];
      const ui = rawList.map((p) => {
        const base = toUiProduct(p);
        const desc = base.description ?? makeDescriptionFromRaw(p);
        return {
          ...base,
          category: catMap.get(String(p.categorie_id)) || base.category || "Catégorie",
          description: desc,
        } as UiProduct & { description?: string };
      });

      const idx: Record<string, Product> = {};
      rawList.forEach((p) => (idx[String(p.id)] = p));

      setRows(ui);
      setRawById(idx);
      setTotal(res.total);
    })
    .catch((e) => setError(String(e?.message || e)))
    .finally(() => setLoading(false));
}, [searchTerm, currentPage, orderParam, selectedCatId, catMap]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / productsPerPage)),
    [total, productsPerPage]
  );
// ✅ AJOUTE ICI LA MÉTHODE updateUrl
function updateUrl(partial: { categoryId?: string; sort?: string; q?: string; page?: number }) {
  const next = new URLSearchParams(params);

  if (partial.categoryId !== undefined) {
    partial.categoryId === "ALL"
      ? next.delete("categoryId")
      : next.set("categoryId", partial.categoryId);
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

const handleCategoryChange = (value: string) => {
  setSelectedCatId(value);
  setCurrentPage(1);
  updateUrl({ categoryId: value });
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
  window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Produits" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Produits médicaux</h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez notre catalogue d&apos;équipements médicaux professionnels,
              sélectionnés pour leur qualité et leur fiabilité.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="medical-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="medical-form-input pl-10"
                />
              </div>
            </div>

            {/* Category Filter (dynamique depuis le back) */}
            <div>
              <select
                value={selectedCatId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="medical-form-select"
              >
                {catOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
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

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCatId !== "ALL" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-medical-primary text-white">
                {catMap.get(selectedCatId) || "Catégorie"}
                <button onClick={() => handleCategoryChange("ALL")} className="ml-2 hover:text-gray-200">
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
          ) : rows.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600">
                  {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                </p>
              </div>

              <div className="medical-grid medical-grid--3">
              {rows.map((product) => {
  const description = product.description ?? "";       // safe

  return (
    <MedicalCard key={product.id} className="h-full flex flex-col">
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
    onClick={() => {
      const phone = "+21629785570";
      const message = encodeURIComponent(
        `Bonjour 👋, je souhaite commander le produit suivant :\n\n${product.name}\n\nMerci de me confirmer la disponibilité.`
      );
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
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
    onClick={() => openProductDetails(product.id)}
    title="Voir les détails du produit"
  >
    <Info className="h-4 w-4" />
  </MedicalButton>
</div>
    </div>
  </MedicalCard.Content>
</MedicalCard>

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
                  setSelectedCatId("ALL");
                  setSearchTerm("");
                }}
              >
                Réinitialiser les filtres
              </MedicalButton>
            </div>
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
      const phone = "+21629785570"; // 📞 numéro WhatsApp de Bastide Tunisie
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
      const phone = "+21629785570"; // même numéro WhatsApp
      const message = encodeURIComponent(
        "Bonjour 👋, je souhaite obtenir un devis pour du matériel médical Bastide Tunisie."
      );
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
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

  const priceLabel =
    product.prix != null
      ? `${product.prix}${product.devise === "EUR" ? "€" : product.devise ? ` ${product.devise}` : ""}`
      : "—";

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
          onClick={() => {
            const phone = "+21629785570";
            const message = encodeURIComponent(
              `Bonjour 👋, je souhaite commander le produit suivant :\n\n${product.titre}\n\nMerci de me confirmer la disponibilité.`
            );
            window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Commander
        </MedicalButton>
      </div>
    </div>
  );
}




