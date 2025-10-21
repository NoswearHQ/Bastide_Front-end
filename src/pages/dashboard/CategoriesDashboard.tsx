import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MedicalButton } from "@/components/ui/medical-button";
import { Pencil, Trash2, Plus, Upload, CheckCircle } from "lucide-react";
import {
  getCategoriesFull,
  createCategory,
  patchCategory,
  deleteCategory,
  type CategoryFull,
} from "@/lib/api";

export default function CategoriesDashboard() {
  const [categories, setCategories] = useState<CategoryFull[]>([]);
  const [nom, setNom] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [estActive, setEstActive] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 🔹 Charger la liste au montage
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getCategoriesFull({ limit: 100 });
      setCategories(res.rows || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des catégories");
    }
  }

  // 🔹 Génère le slug à partir du nom
  function slugify(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  // 🔹 Ajouter une catégorie
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nom) {
      setError("Veuillez renseigner le nom de la catégorie");
      return;
    }

    const slug = slugify(nom);

    try {
      await createCategory({
        nom,
        slug,
        position,
        est_active: estActive,
      });

      setSuccess(true);
      setIsAdding(false);
      setNom("");
      setPosition(0);
      setEstActive(true);
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout de la catégorie");
    }
  }

  // 🔹 Supprimer une catégorie
  async function handleDelete(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  }

  // 🔹 Activer / Désactiver
  async function toggleActive(cat: CategoryFull) {
    try {
      const updated = { ...cat, est_active: !cat.est_active };
      await patchCategory(cat.id, { est_active: updated.est_active });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? updated : c))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardLayout>
      <section className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gérer les Catégories</h1>
            <p className="text-gray-600">
              Ajoutez, modifiez ou supprimez vos catégories de produits.
            </p>
          </div>

          {!isAdding && (
            <MedicalButton
              onClick={() => setIsAdding(true)}
              variant="primary"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter une catégorie
            </MedicalButton>
          )}
        </div>

        {/* ✅ FORMULAIRE D’AJOUT */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-5"
          >
            <h2 className="text-xl font-semibold text-gray-800">Nouvelle catégorie</h2>

            {error && <p className="text-red-600">{error}</p>}

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
                required
              />
            </div>

            {/* Position */}
            

            {/* Statut */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={estActive}
                onChange={() => setEstActive(!estActive)}
                className="w-4 h-4 text-medical-primary border-gray-300 rounded focus:ring-medical-primary"
              />
              <label className="text-gray-700">Catégorie visible (en ligne)</label>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <MedicalButton
                type="button"
                variant="outline"
                onClick={() => setIsAdding(false)}
              >
                Annuler
              </MedicalButton>

              <MedicalButton type="submit" variant="primary">
                <Upload className="w-5 h-5 mr-2" />
                Enregistrer
              </MedicalButton>
            </div>
          </form>
        )}

        {/* ✅ TABLEAU */}
        {!isAdding && (
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Nom</th>
                  <th className="py-3 px-4 text-center text-gray-600 font-medium">Statut</th>
                  <th className="py-3 px-4 text-center text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{cat.nom}</td>
                  
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(cat)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cat.est_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {cat.est_active ? "En ligne" : "Hors ligne"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => alert("Édition à venir")}
                        className="px-3 py-1 text-blue-600 hover:underline"
                      >
                        <Pencil className="inline-block h-4 w-4 mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1 text-red-600 hover:underline"
                      >
                        <Trash2 className="inline-block h-4 w-4 mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-500 py-6 italic"
                    >
                      Aucune catégorie trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Message de succès */}
        {success && (
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle className="text-green-500 w-12 h-12 mb-3" />
            <p className="text-gray-700">Catégorie ajoutée avec succès !</p>
            <MedicalButton onClick={() => setSuccess(false)} className="mt-4">
              OK
            </MedicalButton>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
