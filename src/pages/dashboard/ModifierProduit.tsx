import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCategories, getProductById, fetchWithAuth, ProduitsDetails } from "@/lib/api";
import { imageUrl, safeProductImage, parseGallery } from "@/lib/images";
import { MedicalButton } from "@/components/ui/medical-button";
import { Save, X, ArrowLeft } from "lucide-react";
import ProductDetailsForm from "@/components/admin/ProductDetailsForm";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ModifierProduit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionCourte, setDescriptionCourte] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [prix, setPrix] = useState("");
  const [estActif, setEstActif] = useState(true);
  const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
  const [miniature, setMiniature] = useState<string | null>(null);
  const [newMiniature, setNewMiniature] = useState<File | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ProduitsDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Charger les catégories ---
  useEffect(() => {
    getCategories({ limit: 100 }).then((res) => setCategories(res.rows));
  }, []);

  // --- Charger les infos du produit ---
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setTitre(data.titre || "");
        setReference(data.reference || "");
        setDescription(data.description_html || "");
        setDescriptionCourte(data.description_courte || "");
        setCategorieId(String(data.categorie_id || ""));
        setPrix(data.prix || "");
        setEstActif(Boolean(data.est_actif));

        // Charger miniature
        if (data.image_miniature) setMiniature(data.image_miniature);

        // Charger galerie
        const parsed = parseGallery(data.galerie_json) || [];
        setGallery(Array.from(new Set(parsed)));

        // Charger ProduitsDetails
        if (data.details) {
          setDetails(data.details);
        } else {
          setDetails(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger le produit.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Supprimer une image de la galerie ---
  const removeImageFromGallery = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Ajouter des images locales ---
  const handleAddImages = (files: FileList | null) => {
    if (files) setNewImages(Array.from(files));
  };

  // --- Changer la miniature ---
  const handleMiniatureChange = (file: File | null) => {
    if (file) setNewMiniature(file);
  };

  // --- Reload product data ---
  const reloadProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getProductById(id);
      setTitre(data.titre || "");
      setReference(data.reference || "");
      setDescription(data.description_html || "");
      setDescriptionCourte(data.description_courte || "");
      setCategorieId(String(data.categorie_id || ""));
      setPrix(data.prix || "");
      setEstActif(Boolean(data.est_actif));

      if (data.image_miniature) setMiniature(data.image_miniature);
      const parsed = parseGallery(data.galerie_json) || [];
      setGallery(Array.from(new Set(parsed)));

      if (data.details) {
        setDetails(data.details);
      } else {
        setDetails(null);
      }
    } catch (err) {
      console.error("Error reloading product:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Soumission ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!titre || !categorieId) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("titre", titre);
    formData.append("reference", reference);
    formData.append("description_html", description);
    formData.append("description_courte", descriptionCourte);
    formData.append("categorie_id", categorieId);
    formData.append("prix", prix);
    formData.append("est_actif", estActif ? "true" : "false");
    formData.append("galerie_json", JSON.stringify(gallery));

    // Add ProduitsDetails fields
    // Only send fields that are still in the form (brand and availability)
    // Removed fields (SKU, description_seo, rating_value, rating_count, gtin, mpn, condition, price_valid_until, category_schema) are not sent
    if (details) {
      if (details.brand !== null && details.brand !== undefined) {
        formData.append("details_brand", details.brand);
      }
    }
    // Always set availability to "InStock"
    formData.append("details_availability", "InStock");

    if (newMiniature) formData.append("image_miniature", newMiniature);
    newImages.forEach((img) => formData.append("images[]", img));

    try {
      const result = await fetchWithAuth<{ ok: boolean }>(`/crud/products/${id}`, {
        method: "POST", // ← on envoie POST + _method=PATCH
        body: formData,
      });
      
      console.log("✅ Product updated successfully", result);
      
      // Show success toast
      toast.success("Produit mis à jour avec succès !", {
        description: "Les modifications ont été enregistrées.",
        duration: 3000,
      });
      
      // Reload product data to show updated values
      await reloadProduct();
      
      // Clear file inputs
      setNewMiniature(null);
      setNewImages([]);
      
    } catch (err: any) {
      console.error("❌ Error updating product:", err);
      const errorMessage: string =
        err?.message || "Erreur lors de la mise à jour du produit";

      setError(errorMessage);

      // If backend signals a unique constraint violation on reference/slug,
      // show a clear SweetAlert message explaining what to do.
      if (
        typeof errorMessage === "string" &&
        errorMessage.includes("Une valeur unique existe déjà")
      ) {
        await Swal.fire({
          icon: "error",
          title: "Référence déjà utilisée",
          text: "Deux produits ne peuvent pas contenir la même référence. Essayez d'ajouter un « - » avec un numéro (ex: Veinax-2) ou bien un suffixe comme Homme, Femme, etc.",
          confirmButtonColor: "#dc2626",
        });
      } else {
        toast.error("Erreur lors de la mise à jour", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading)
    return (
      <DashboardLayout>
        <p>Chargement du produit…</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <MedicalButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/produits")}
              type="button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </MedicalButton>
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier le produit
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

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

          {/* Référence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
            />
          </div>

          {/* Description courte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description courte
            </label>
            <textarea
              value={descriptionCourte}
              onChange={(e) => setDescriptionCourte(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
              placeholder="Description courte du produit"
            />
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

          {/* Miniature actuelle */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Miniature principale
  </label>
  <div className="flex items-center gap-4">
    {miniature && (
      <div className="relative w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={safeProductImage(imageUrl(miniature))}
          alt="Miniature"
          className={`w-full h-full ${
            miniature?.includes("bastidelogo.png")
              ? "object-contain p-6"
              : "object-cover"
          }`}
        />
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleMiniatureChange(e.target.files?.[0] || null)}
      className="border rounded-lg px-3 py-2"
    />
  </div>
</div>

          {/* Galerie actuelle */}
          {gallery.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Galerie actuelle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl(img)}
                      alt={`Image ${idx}`}
                      className={`w-full h-28 ${
                        img?.includes("bastidelogo.png")
                          ? "object-contain p-6"
                          : "object-cover"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageFromGallery(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nouvelles images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ajouter de nouvelles images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleAddImages(e.target.files)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {newImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {newImages.map((img, idx) => (
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

          {/* Product Details Form */}
          <ProductDetailsForm
            details={details}
            onChange={(updatedDetails) => setDetails(updatedDetails)}
          />

          {/* Bouton submit */}
          <div className="pt-4 flex gap-3">
            <MedicalButton 
              type="submit" 
              variant="primary" 
              size="lg"
              disabled={isSubmitting}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? "Mise à jour..." : "Mettre à jour le produit"}
            </MedicalButton>
            <MedicalButton 
              type="button"
              variant="outline" 
              size="lg"
              onClick={() => navigate("/dashboard/produits")}
            >
              Annuler
            </MedicalButton>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
