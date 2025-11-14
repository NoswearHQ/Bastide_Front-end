import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getProducts, patchProduct, Product } from "@/lib/api";
import { Search, Home, AlertCircle } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { safeProductImage } from "@/lib/images";
import { toast } from "sonner";

export default function HomepageFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);

  // Load all products
  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({
        search: search || undefined,
        limit: 200,
        showInactive: true, // Show all products including inactive ones
      });
      setProducts(res.rows || []);
      // Count selected products
      const count = (res.rows || []).filter((p) => p.is_landing_page).length;
      setSelectedCount(count);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [search]);

  // Toggle is_landing_page for a product
  async function handleToggleLandingPage(product: Product) {
    if (updating) return; // Prevent concurrent updates

    const newValue = !product.is_landing_page;

    // Validation: prevent selecting more than 6 products
    if (newValue && selectedCount >= 6) {
      toast.error("Vous ne pouvez sélectionner que 6 produits maximum pour la page d'accueil.");
      return;
    }

    setUpdating(product.id);
    try {
      await patchProduct(product.id, { is_landing_page: newValue });
      
      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_landing_page: newValue } : p
        )
      );
      
      // Update count
      setSelectedCount((prev) => (newValue ? prev + 1 : prev - 1));
      
      toast.success(
        newValue
          ? "Produit ajouté à la page d'accueil"
          : "Produit retiré de la page d'accueil"
      );
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.message || "Erreur lors de la mise à jour du produit";
      toast.error(errorMessage);
    } finally {
      setUpdating(null);
    }
  }

  const maxSelected = 6;
  const canSelectMore = selectedCount < maxSelected;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Home className="h-6 w-6" />
            Produits de la Page d'Accueil
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sélectionnez jusqu'à {maxSelected} produits à afficher sur la page d'accueil
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-medical-primary/10 rounded-lg">
            <span className="text-sm text-gray-600">Sélectionnés: </span>
            <span
              className={`text-lg font-bold ${
                selectedCount >= maxSelected
                  ? "text-red-600"
                  : "text-medical-primary"
              }`}
            >
              {selectedCount} / {maxSelected}
            </span>
          </div>
        </div>
      </div>

      {/* Alert if limit reached */}
      {selectedCount >= maxSelected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Limite atteinte
            </p>
            <p className="text-sm text-yellow-700">
              Vous avez atteint la limite de {maxSelected} produits. Désélectionnez un produit pour en ajouter un autre.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isSelected = product.is_landing_page || false;
            const isDisabled = !isSelected && !canSelectMore;
            const isUpdating = updating === product.id;

            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected
                    ? "border-medical-primary bg-medical-primary/5"
                    : "border-gray-200 bg-white"
                } ${isDisabled ? "opacity-60" : ""}`}
              >
                {/* Product Image */}
                <div className="mb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {product.image_miniature ? (
                      <img
                        src={safeProductImage(product.image_miniature)}
                        alt={product.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Pas d'image
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                    {product.titre}
                  </h3>
                  {product.reference && (
                    <p className="text-sm text-gray-600">
                      Réf: {product.reference}
                    </p>
                  )}
                  {product.prix && (
                    <p className="text-sm font-medium text-medical-primary mt-1">
                      {product.prix} {product.devise}
                    </p>
                  )}
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm font-medium ${
                      isSelected ? "text-medical-primary" : "text-gray-700"
                    }`}
                  >
                    {isSelected ? "Sur la page d'accueil" : "Non sélectionné"}
                  </label>
                  <button
                    onClick={() => handleToggleLandingPage(product)}
                    disabled={isDisabled || isUpdating}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 ${
                      isSelected
                        ? "bg-medical-primary"
                        : "bg-gray-300"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    title={
                      isDisabled
                        ? "Limite de 6 produits atteinte. Désélectionnez un produit pour en ajouter un autre."
                        : isSelected
                        ? "Retirer de la page d'accueil"
                        : "Ajouter à la page d'accueil"
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isSelected ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Status indicator */}
                {isSelected && (
                  <div className="mt-2 text-xs text-medical-primary font-medium">
                    ✓ Affiché sur la page d'accueil
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {search
              ? "Aucun produit trouvé pour cette recherche."
              : "Aucun produit disponible."}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}

