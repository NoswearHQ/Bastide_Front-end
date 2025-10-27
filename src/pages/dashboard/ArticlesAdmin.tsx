import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  User,
  FileText,
  MoreHorizontal
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { getArticles, updateArticle, deleteArticle, type Article } from "@/lib/api";
import { toast } from "sonner";

export default function ArticlesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"titre" | "publie_le" | "cree_le">("cree_le");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const queryClient = useQueryClient();
  const articlesPerPage = 10;

  // Fetch articles
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['articles', searchTerm, currentPage, sortBy, sortOrder],
    queryFn: () => getArticles({
      search: searchTerm || undefined,
      page: currentPage,
      limit: articlesPerPage
    }),
  });

  // Toggle article status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: string }) => 
      updateArticle(id, { statut }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success("Statut de l'article mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  // Delete article
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast.success("Article supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: "titre" | "publie_le" | "cree_le") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }, [sortBy, sortOrder]);

  const handleToggleStatus = (article: Article) => {
    const newStatus = article.statut === "publie" ? "brouillon" : "publie";
    toggleStatusMutation.mutate({ id: article.id, statut: newStatus });
  };

  const handleDelete = (article: Article) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${article.titre}" ?`)) {
      deleteMutation.mutate(article.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      publie: { label: "Publié", className: "bg-green-100 text-green-800" },
      brouillon: { label: "Brouillon", className: "bg-yellow-100 text-yellow-800" },
      archive: { label: "Archivé", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[statut as keyof typeof statusConfig] || statusConfig.brouillon;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">
              Impossible de charger les articles. Veuillez réessayer.
            </p>
            <MedicalButton variant="primary" onClick={() => window.location.reload()}>
              Réessayer
            </MedicalButton>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des articles</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos articles et leur publication
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <MedicalButton variant="primary" asChild>
              <Link to="/dashboard/articles/create">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel article
              </Link>
            </MedicalButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as "titre" | "publie_le" | "cree_le");
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-transparent"
              >
                <option value="cree_le-desc">Plus récent</option>
                <option value="cree_le-asc">Plus ancien</option>
                <option value="publie_le-desc">Publié récemment</option>
                <option value="publie_le-asc">Publié anciennement</option>
                <option value="titre-asc">Titre A-Z</option>
                <option value="titre-desc">Titre Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articlesData?.rows.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Aucun article ne correspond à votre recherche." : "Commencez par créer votre premier article."}
            </p>
            <MedicalButton variant="primary" asChild>
              <Link to="/dashboard/articles/create">
                <Plus className="h-4 w-4 mr-2" />
                Créer un article
              </Link>
            </MedicalButton>
          </div>
        ) : (
          <div className="space-y-4">
            {articlesData?.rows.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {article.titre}
                      </h3>
                      {getStatusBadge(article.statut)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {article.nom_auteur && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.nom_auteur}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {article.publie_le 
                            ? `Publié le ${formatDate(article.publie_le)}`
                            : `Créé le ${formatDate(article.cree_le)}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    {article.extrait && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {article.extrait}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>SEO: {article.seo_titre ? "✓" : "✗"}</span>
                      <span>•</span>
                      <span>Image: {article.image_miniature ? "✓" : "✗"}</span>
                      <span>•</span>
                      <span>Galerie: {article.galerie_json ? "✓" : "✗"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <MedicalButton
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/articles/${article.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </MedicalButton>
                    
                    <MedicalButton
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/dashboard/articles/edit/${article.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </MedicalButton>
                    
                    <MedicalButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(article)}
                      disabled={toggleStatusMutation.isPending}
                    >
                      {article.statut === "publie" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </MedicalButton>
                    
                    <MedicalButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </MedicalButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {articlesData && articlesData.total > articlesPerPage && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <MedicalButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </MedicalButton>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} sur {Math.ceil(articlesData.total / articlesPerPage)}
              </span>
              
              <MedicalButton
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(articlesData.total / articlesPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(articlesData.total / articlesPerPage)}
              >
                Suivant
              </MedicalButton>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
