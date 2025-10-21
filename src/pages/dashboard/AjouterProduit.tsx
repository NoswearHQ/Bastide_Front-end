import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCategories } from "@/lib/api";
import { MedicalButton } from "@/components/ui/medical-button";
import { Upload, CheckCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export default function AjouterProduit() {
  const [titre, setTitre] = useState("");
  const [reference, setReference] = useState(""); // 🆕 nouveau champ
  const [description, setDescription] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [prix, setPrix] = useState("");
  const [estActif, setEstActif] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger la liste des catégories
    getCategories({ limit: 100 }).then((res) => setCategories(res.rows));
  }, []);

  // Slugify du titre
  function slugify(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!titre || !categorieId || !prix) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const slug = slugify(titre);
    const formData = new FormData();

    formData.append("titre", titre);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("categorie_id", categorieId);
    formData.append("prix", prix);
    formData.append("est_actif", String(estActif));

    // 🆕 Champ optionnel
    if (reference) formData.append("reference", reference);

    images.forEach((img) => formData.append("images[]", img));

    try {
      await fetchWithAuth("/crud/products/upload", {
        method: "POST",
        body: formData,
      });
      setSuccess(true);
      setTitre("");
      setReference("");
      setDescription("");
      setCategorieId("");
      setPrix("");
      setImages([]);
      setEstActif(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout du produit");
    }
  }

  return (
    <DashboardLayout>
      {success ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Produit ajouté avec succès !
          </h2>
          <p className="text-gray-600 mb-6">
            Vous pouvez le retrouver dans la liste des produits.
          </p>
          <MedicalButton onClick={() => setSuccess(false)}>
            Ajouter un autre
          </MedicalButton>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow space-y-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Ajouter un produit
          </h1>

          {error && <p className="text-red-600">{error}</p>}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
              required
            />
          </div>

          {/* 🆕 Référence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence (optionnelle)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex : PROD-2025-A12"
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour générer automatiquement une référence si besoin.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix
            </label>
            <input
              type="number"
              step="0.01"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (plusieurs possibles)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="w-full border rounded-lg px-3 py-2"
            />
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={estActif}
              onChange={() => setEstActif(!estActif)}
              className="w-4 h-4 text-medical-primary border-gray-300 rounded focus:ring-medical-primary"
            />
            <label className="text-gray-700">Produit visible (en ligne)</label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <MedicalButton type="submit" variant="primary" size="lg">
              <Upload className="w-5 h-5 mr-2" />
              Enregistrer le produit
            </MedicalButton>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}
