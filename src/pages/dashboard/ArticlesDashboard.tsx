import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getArticles,
  deleteArticle,
  patchArticle,
  Article,
} from "@/lib/api";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { Link } from "react-router-dom";
import { safeProductImage } from "@/lib/images";

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Recherche + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // 🔁 Charger les articles
  async function loadArticles() {
    setLoading(true);
    try {
      const res = await getArticles({
        search,
        page,
        limit,
      });
      setArticles(res.rows || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  }

  async function handleToggleStatus(id: string, currentStatus?: string) {
    try {
      const updated = currentStatus === "publie" ? "brouillon" : "publie";
      await patchArticle(id, { statut: updated });
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, statut: updated } : a))
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
          Gérer les Articles
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* 🔍 Recherche texte */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-9 pr-3 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
            />
          </div>

          {/* ➕ Bouton Ajouter */}
          <Link to="/dashboard/articles/ajouter">
            <MedicalButton variant="primary">
              <Plus className="h-5 w-5 mr-2" /> Ajouter un article
            </MedicalButton>
          </Link>
        </div>
      </div>

      {/* Tableau */}
      {loading && <p className="text-gray-600">Chargement des articles...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-6 py-3 border-b">#</th>
                <th className="px-6 py-3 border-b">Image</th>
                <th className="px-6 py-3 border-b">Titre</th>
                <th className="px-6 py-3 border-b">Auteur</th>
                <th className="px-6 py-3 border-b">Statut</th>
                <th className="px-6 py-3 border-b">Date de création</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    Aucun article trouvé.
                  </td>
                </tr>
              )}

              {articles.map((a, index) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b text-gray-600">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* 🖼️ Image miniature */}
                  <td className="px-6 py-3 border-b">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded overflow-hidden border">
                      <img
                        src={safeProductImage(a.image_miniature)}
                        className={`w-full h-full object-cover ${
                          a.image_miniature?.includes("bastidelogo.png") ? "object-contain p-3" : ""
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
                    {a.titre}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-600">
                    {a.nom_auteur || "—"}
                  </td>

                  {/* ✅ Statut avec bouton toggle */}
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={() => handleToggleStatus(a.id, a.statut)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        a.statut === "publie"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : a.statut === "archive"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {a.statut === "publie" ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Publié
                        </>
                      ) : a.statut === "archive" ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Archivé
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Brouillon
                        </>
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-3 border-b text-gray-600">
                    {a.cree_le ? new Date(a.cree_le).toLocaleDateString('fr-FR') : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 border-b">
                    <div className="flex gap-3">
                      <Link to={`/dashboard/articles/modifier/${a.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                        <Edit className="h-4 w-4 mr-1" /> Modifier
                      </Link>                      

                      <button
                        onClick={() => handleDelete(a.id)}
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
