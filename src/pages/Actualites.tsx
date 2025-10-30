import { useState, useEffect } from "react";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";
import { getArticles, type Article } from "@/lib/api";
import { safeProductImage } from "@/lib/images";

export default function Actualites() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const articlesPerPage = 6;

  // Fetch articles from API
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['articles', currentPage, selectedCategory],
    queryFn: () => getArticles({ 
      page: currentPage, 
      limit: articlesPerPage,
      search: selectedCategory !== "Toutes" ? selectedCategory : undefined
    }),
  });

  const articles = articlesData?.rows || [];
  const totalPages = Math.ceil((articlesData?.total || 0) / articlesPerPage);

  // Debug: Log articles data
  useEffect(() => {
    if (articles.length > 0) {
      console.log('🔍 Articles data debug:', articles.map(a => ({
        id: a.id,
        titre: a.titre,
        image_miniature: a.image_miniature,
        constructedUrl: a.image_miniature ? safeProductImage(a.image_miniature) : 'No image',
        galerie_json: a.galerie_json
      })));
    }
  }, [articles]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-12">
          <div className="medical-container">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-12">
          <div className="medical-container">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Erreur de chargement
              </h2>
              <p className="text-gray-600">
                Impossible de charger les articles. Veuillez réessayer plus tard.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Actualités" }
            ]} 
          />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Actualités médicales
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Restez informé des dernières avancées médicales, innovations technologiques 
              et actualités de notre établissement de santé.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="medical-container">
          <div className="flex flex-wrap gap-3">
            <span className="font-medium text-gray-700 self-center">Filtrer par catégorie :</span>
            <button
              onClick={() => handleCategoryChange("Toutes")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === "Toutes"
                  ? "bg-medical-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              Toutes
            </button>
          </div>
        </div>
      </section>

            {/* Articles Section */}
            <section className="medical-section">
              <div className="medical-container">
                

                {articles.length > 0 ? (
                  <>
                    <div className="medical-grid medical-grid--3">
                {articles.map((article) => (
                  <MedicalCard key={article.id}>
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
                        <img
                          src={article.image_miniature && article.image_miniature.trim() !== '' 
                            ? safeProductImage(article.image_miniature) 
                            : "https://api.bastide.com.tn/images/bastidelogo.png"}
                          alt={article.titre}
                          className="w-full h-full object-cover"
                            onError={(e) => {
                              // Prevent infinite loop by checking if already set to fallback
                              if (!e.currentTarget.src.includes('data:image')) {
                                // Use a simple data URI placeholder instead of external image
                                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K";
                              }
                            }}
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Article
                      </div>
                    </div>
                    
                    <MedicalCard.Content>
                      <MedicalCard.Meta>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {article.publie_le 
                                ? formatDate(article.publie_le)
                                : formatDate(article.cree_le)
                              }
                            </span>
                          </div>
                          {article.nom_auteur && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{article.nom_auteur}</span>
                            </div>
                          )}
                        </div>
                      </MedicalCard.Meta>
                      
                      <MedicalCard.Title>
                        <Link 
                          to={`/articles/${article.slug}`}
                          className="hover:text-medical-primary transition-colors"
                        >
                          {article.titre}
                        </Link>
                      </MedicalCard.Title>
                      
                      <MedicalCard.Description>
                        <span className="line-clamp-3 clamp-3">{article.extrait || "Aucun extrait disponible"}</span>
                      </MedicalCard.Description>
                      
                      <div className="mt-4">
                        <MedicalButton variant="outline" size="sm" asChild>
                          <Link to={`/articles/${article.slug}`}>
                            Lire la suite
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </MedicalButton>
                      </div>
                    </MedicalCard.Content>
                  </MedicalCard>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Aucun article publié pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Restez informé
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir les dernières actualités 
              médicales directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="medical-form-input flex-1"
              />
              <MedicalButton variant="primary">
                S'inscrire
              </MedicalButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}