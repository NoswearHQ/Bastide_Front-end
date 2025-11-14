import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getProducts, patchProduct, getCategoriesFull, Product, CategoryFull } from "@/lib/api";
import { ArrowUp, ArrowDown, Save, FolderTree, AlertCircle } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { safeProductImage } from "@/lib/images";
import { toast } from "sonner";

type ProductWithPosition = Product & { position: number | null };

export default function CategoryProductOrder() {
  const [categories, setCategories] = useState<CategoryFull[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [products, setProducts] = useState<ProductWithPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategoriesFull({ limit: 200 });
        setCategories(res.rows || []);
      } catch (err) {
        toast.error("Erreur lors du chargement des catégories");
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Load products when category is selected
  useEffect(() => {
    if (!selectedCategoryId) {
      setProducts([]);
      return;
    }

    async function loadProducts() {
      setLoading(true);
      try {
        const res = await getProducts({
          categoryId: selectedCategoryId,
          limit: 500,
          showInactive: true,
        });
        
        // Sort by position (nulls last), then by ID
        const sorted = (res.rows || []).map(p => ({
          ...p,
          position: p.position ?? null,
        })).sort((a, b) => {
          if (a.position === null && b.position === null) return 0;
          if (a.position === null) return 1;
          if (b.position === null) return -1;
          return a.position - b.position;
        });
        
        setProducts(sorted);
        setHasChanges(false);
      } catch (err) {
        toast.error("Erreur lors du chargement des produits");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategoryId]);

  const moveProduct = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === products.length - 1) return;

    const newProducts = [...products];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Swap positions
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    
    // Update position values
    newProducts.forEach((p, i) => {
      p.position = i + 1;
    });
    
    setProducts(newProducts);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedCategoryId) return;

    setSaving(true);
    try {
      // Update all products with their new positions
      const updates = products.map((product, index) => 
        patchProduct(product.id, { position: index + 1 })
      );

      await Promise.all(updates);
      
      toast.success("Ordre des produits sauvegardé avec succès");
      setHasChanges(false);
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = categories.find(c => String(c.id) === selectedCategoryId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FolderTree className="h-8 w-8 text-medical-primary" />
            Ordre des produits par catégorie
          </h1>
        </div>

        {/* Category Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner une catégorie
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setHasChanges(false);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Products List */}
        {selectedCategoryId && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des produits...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucun produit trouvé dans cette catégorie
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Produits de la catégorie: {selectedCategory?.nom}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {products.length} produit{products.length > 1 ? "s" : ""} • 
                      Utilisez les flèches pour réorganiser
                    </p>
                  </div>
                  {hasChanges && (
                    <MedicalButton
                      variant="primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Sauvegarde..." : "Sauvegarder l'ordre"}
                    </MedicalButton>
                  )}
                </div>

                <div className="space-y-2">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Position Number */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-medical-primary/10 flex items-center justify-center text-medical-primary font-semibold">
                        {index + 1}
                      </div>

                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={safeProductImage(product.image_miniature || "")}
                          alt={product.titre || product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEwyNCAzMkw0MCAzMkMzMiAyNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {product.titre || product.name}
                        </h3>
                        {product.reference && (
                          <p className="text-sm text-gray-500">
                            Réf: {product.reference}
                          </p>
                        )}
                        {product.position !== null && (
                          <p className="text-xs text-gray-400 mt-1">
                            Position: {product.position}
                          </p>
                        )}
                      </div>

                      {/* Move Buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveProduct(index, "up")}
                          disabled={index === 0}
                          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Déplacer vers le haut"
                        >
                          <ArrowUp className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => moveProduct(index, "down")}
                          disabled={index === products.length - 1}
                          className="p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Déplacer vers le bas"
                        >
                          <ArrowDown className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {hasChanges && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Vous avez des modifications non sauvegardées. 
                      N'oubliez pas de cliquer sur "Sauvegarder l'ordre" pour enregistrer les changements.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Info Box */}
        {!selectedCategoryId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Comment utiliser cette page
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Sélectionnez une catégorie dans le menu déroulant</li>
              <li>Les produits de cette catégorie s'afficheront dans l'ordre actuel</li>
              <li>Utilisez les flèches ↑ ↓ pour réorganiser les produits</li>
              <li>Cliquez sur "Sauvegarder l'ordre" pour enregistrer les modifications</li>
              <li>L'ordre sera appliqué sur la page produits publique</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

