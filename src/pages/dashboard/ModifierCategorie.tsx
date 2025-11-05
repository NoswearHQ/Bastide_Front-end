import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MedicalButton } from "@/components/ui/medical-button";
import { getCategoryById, patchCategory, type CategoryFull } from "@/lib/api";
import { ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ModifierCategorie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger la catégorie
  useEffect(() => {
    if (!id) {
      setError("ID de catégorie manquant");
      setLoading(false);
      return;
    }

    async function loadCategory() {
      try {
        setLoading(true);
        const category = await getCategoryById(Number(id));
        setNom(category.nom || "");
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger la catégorie.");
        toast.error("Erreur lors du chargement de la catégorie");
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [id]);

  // Gérer la soumission du formulaire
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!nom || nom.trim() === "") {
      setError("Le nom de la catégorie est obligatoire");
      return;
    }

    if (!id) {
      setError("ID de catégorie manquant");
      return;
    }

    try {
      setSaving(true);
      await patchCategory(Number(id), { nom: nom.trim() });
      
      setSuccess(true);
      toast.success("Catégorie mise à jour avec succès");
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate("/dashboard/categories");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err?.message || "Erreur lors de la mise à jour de la catégorie";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la catégorie...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Modifier une catégorie</h1>
            <p className="text-gray-600 mt-1">
              Modifiez le nom de la catégorie
            </p>
          </div>
          <Link to="/dashboard/categories">
            <MedicalButton variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </MedicalButton>
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-4">
            <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="text-green-800 font-semibold">Catégorie mise à jour avec succès</h3>
              <p className="text-green-600 text-sm mt-1">Redirection en cours...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-4">
            <AlertCircle className="text-red-600 w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold">Erreur</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Formulaire */}
        {!success && (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl bg-white p-6 rounded-lg shadow space-y-6"
          >
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-medical-primary focus:border-medical-primary transition-colors"
                placeholder="Ex: Accessoires de lit"
                required
                disabled={saving}
              />
              <p className="text-sm text-gray-500 mt-1">
                Seul le nom (libellé) de la catégorie peut être modifié.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Link to="/dashboard/categories">
                <MedicalButton
                  type="button"
                  variant="outline"
                  disabled={saving}
                >
                  Annuler
                </MedicalButton>
              </Link>
              <MedicalButton
                type="submit"
                variant="primary"
                disabled={saving || !nom.trim()}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </MedicalButton>
            </div>
          </form>
        )}
      </section>
    </DashboardLayout>
  );
}

