import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon,
  FileText,
  Calendar,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { 
  createArticle, 
  updateArticle, 
  getArticleById, 
  type ArticleCreate, 
  type ArticleUpdate 
} from "@/lib/api";
import { toast } from "sonner";

interface ArticleFormProps {
  articleId?: string;
  mode: "create" | "edit";
}

export default function ArticleForm({ articleId, mode }: ArticleFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ArticleCreate>({
    titre: "",
    slug: "",
    nom_auteur: "",
    image_miniature: "",
    galerie_json: "",
    extrait: "",
    contenu_html: "",
    statut: "brouillon",
    publie_le: "",
    seo_titre: "",
    seo_description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch article for edit mode
  const { data: existingArticle, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleById(articleId!),
    enabled: mode === "edit" && !!articleId,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.titre && !formData.slug) {
      const slug = formData.titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.titre, formData.slug]);

  // Load existing article data for edit
  useEffect(() => {
    if (existingArticle && mode === "edit") {
      setFormData({
        titre: existingArticle.titre,
        slug: existingArticle.slug,
        nom_auteur: existingArticle.nom_auteur || "",
        image_miniature: existingArticle.image_miniature || "",
        galerie_json: existingArticle.galerie_json || "",
        extrait: existingArticle.extrait || "",
        contenu_html: existingArticle.contenu_html,
        statut: existingArticle.statut,
        publie_le: existingArticle.publie_le || "",
        seo_titre: existingArticle.seo_titre || "",
        seo_description: existingArticle.seo_description || "",
      });

      if (existingArticle.image_miniature) {
        setImagePreview(existingArticle.image_miniature);
      }

      if (existingArticle.galerie_json) {
        try {
          const gallery = JSON.parse(existingArticle.galerie_json);
          setGalleryImages(Array.isArray(gallery) ? gallery : []);
        } catch {
          setGalleryImages([]);
        }
      }
    }
  }, [existingArticle, mode]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success("Article créé avec succès");
      navigate("/dashboard/articles");
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleUpdate }) => 
      updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
      toast.success("Article mis à jour avec succès");
      navigate("/dashboard/articles");
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    },
  });

  const handleInputChange = (field: keyof ArticleCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image_miniature: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        galerie_json: JSON.stringify(galleryImages),
        publie_le: formData.statut === "publie" && !formData.publie_le 
          ? new Date().toISOString() 
          : formData.publie_le || undefined,
      };

      if (mode === "create") {
        await createMutation.mutateAsync(submitData);
      } else {
        await updateMutation.mutateAsync({ id: articleId!, data: submitData });
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "edit" && isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <MedicalButton
            variant="outline"
            onClick={() => navigate("/dashboard/articles")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </MedicalButton>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === "create" ? "Nouvel article" : "Modifier l'article"}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === "create" 
                ? "Créez un nouvel article pour votre site" 
                : "Modifiez les informations de l'article"
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MedicalButton
            variant="outline"
            onClick={() => setFormData(prev => ({ 
              ...prev, 
              statut: prev.statut === "publie" ? "brouillon" : "publie" 
            }))}
          >
            {formData.statut === "publie" ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Dépublier
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publier
              </>
            )}
          </MedicalButton>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <MedicalCard>
          <MedicalCard.Header>
            <MedicalCard.Title>Informations générales</MedicalCard.Title>
          </MedicalCard.Header>
          <MedicalCard.Content className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange("titre", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  placeholder="Entrez le titre de l'article"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  placeholder="url-de-l-article"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /articles/{formData.slug}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur
                </label>
                <input
                  type="text"
                  value={formData.nom_auteur}
                  onChange={(e) => handleInputChange("nom_auteur", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  placeholder="Nom de l'auteur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleInputChange("statut", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extrait
              </label>
              <textarea
                value={formData.extrait}
                onChange={(e) => handleInputChange("extrait", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                placeholder="Résumé court de l'article (optionnel)"
              />
            </div>
          </MedicalCard.Content>
        </MedicalCard>

        {/* Content */}
        <MedicalCard>
          <MedicalCard.Header>
            <MedicalCard.Title>Contenu de l'article</MedicalCard.Title>
          </MedicalCard.Header>
          <MedicalCard.Content>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu HTML *
              </label>
              <textarea
                value={formData.contenu_html}
                onChange={(e) => handleInputChange("contenu_html", e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent font-mono text-sm"
                placeholder="Contenu HTML de l'article"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Vous pouvez utiliser du HTML pour formater votre contenu
              </p>
            </div>
          </MedicalCard.Content>
        </MedicalCard>

        {/* Images */}
        <MedicalCard>
          <MedicalCard.Header>
            <MedicalCard.Title>Images</MedicalCard.Title>
          </MedicalCard.Header>
          <MedicalCard.Content className="space-y-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image principale
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="main-image"
                />
                <label
                  htmlFor="main-image"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Choisir une image
                </label>
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image_miniature: "" }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Galerie d'images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                id="gallery-images"
              />
              <label
                htmlFor="gallery-images"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-fit"
              >
                <ImageIcon className="h-4 w-4" />
                Ajouter des images
              </label>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </MedicalCard.Content>
        </MedicalCard>

        {/* SEO */}
        <MedicalCard>
          <MedicalCard.Header>
            <MedicalCard.Title>Optimisation SEO</MedicalCard.Title>
          </MedicalCard.Header>
          <MedicalCard.Content className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre SEO
              </label>
              <input
                type="text"
                value={formData.seo_titre}
                onChange={(e) => handleInputChange("seo_titre", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                placeholder="Titre optimisé pour les moteurs de recherche"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description SEO
              </label>
              <textarea
                value={formData.seo_description}
                onChange={(e) => handleInputChange("seo_description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                placeholder="Description optimisée pour les moteurs de recherche"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.seo_description.length}/300 caractères
              </p>
            </div>
          </MedicalCard.Content>
        </MedicalCard>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <MedicalButton
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/articles")}
          >
            Annuler
          </MedicalButton>
          <MedicalButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </MedicalButton>
        </div>
      </form>
    </div>
  );
}
