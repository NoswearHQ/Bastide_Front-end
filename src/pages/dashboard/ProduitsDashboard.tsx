import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getProducts,
  deleteProduct,
  patchProduct,
  getCategories,
  Product,
} from "@/lib/api";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { Link } from "react-router-dom";
import { ImageThumb } from "./ImageThumb"; // ou le chemin où tu l’as mis
import { imageUrl, safeProductImage, parseGallery } from "@/lib/images";

export default function ProduitsDashboard() {
  const [products, setProducts] = useState<
    (Product & {
      categorie_nom?: string | null;
      sous_categorie_nom?: string | null;
      est_actif?: boolean;
    })[]
  >([]);
  const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Recherche + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // 🧭 Charger les catégories au démarrage
  useEffect(() => {
    getCategories({ limit: 200 })
      .then((res) => setCategories(res.rows || []))
      .catch((err) => console.error("Erreur chargement catégories", err));
  }, []);

  // 🔁 Charger les produits
  async function loadProducts() {
    setLoading(true);
    try {
      const res = await getProducts({
        search,
        categoryId: selectedCategory || undefined,
        page,
        limit,
      });
      setProducts(res.rows || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [page, search, selectedCategory]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  }

  async function handleToggleStatus(id: string, currentStatus?: boolean) {
    try {
      const updated = !currentStatus;
      await patchProduct(id, { est_actif: updated });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, est_actif: updated } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut");
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Gérer les Produits
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* 🔍 Recherche texte */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-9 pr-3 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
            />
          </div>

          {/* 🔽 Filtre par catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-medical-primary focus:border-medical-primary"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>

          {/* ➕ Bouton Ajouter */}
          <Link to="/dashboard/produits/ajouter">
            <MedicalButton variant="primary">
              <Plus className="h-5 w-5 mr-2" /> Ajouter un produit
            </MedicalButton>
          </Link>
        </div>
      </div>

      {/* Tableau */}
      {loading && <p className="text-gray-600">Chargement des produits...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-6 py-3 border-b">#</th>
                <th className="px-6 py-3 border-b">Image</th>
                <th className="px-6 py-3 border-b">Titre</th>
                <th className="px-6 py-3 border-b">Prix</th>
                <th className="px-6 py-3 border-b">Catégorie</th>
                <th className="px-6 py-3 border-b">Sous-catégorie</th>
                <th className="px-6 py-3 border-b">Statut</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}

              {products.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b text-gray-600">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* 🖼️ Image miniature */}
                  <td className="px-6 py-3 border-b">
  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded overflow-hidden border">
    <img
      src={imageUrl(p.image_miniature)}
      
      className={`w-full h-full object-cover ${
        p.image_miniature?.includes("bastidelogo.png") ? "object-contain p-3" : ""
      }`}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = "/images/bastidelogo.png";
      }}
    />
  </div>
</td>


                  <td className="px-6 py-3 border-b font-medium text-gray-900">
                    {p.titre}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-600">
                    {p.prix ? `${p.prix} ${p.devise}` : "—"}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-600">
                    {p.categorie_nom || "—"}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-600">
                    {p.sous_categorie_nom || "—"}
                  </td>

                  {/* ✅ Statut avec bouton toggle */}
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={() => handleToggleStatus(p.id, p.est_actif)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        p.est_actif
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {p.est_actif ? "🟢 En ligne" : "🔴 Hors ligne"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 border-b">
                    <div className="flex gap-3">
                      
                      <Link to={`/dashboard/produits/modifier/${p.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Link>                      

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
