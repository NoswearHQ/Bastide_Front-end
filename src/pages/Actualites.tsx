import { useState } from "react";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";

// Mock data pour les articles
const articles = [
  {
    id: 1,
    title: "Nouveaux protocoles de prévention cardiovasculaire",
    excerpt: "Découvrez les dernières recommandations en matière de prévention des maladies cardiovasculaires et leur application en pratique clinique.",
    category: "Cardiologie",
    author: "Dr. Marie Dubois",
    date: "2024-03-15",
    image: "/placeholder-article-1.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "L'importance du dépistage précoce en oncologie",
    excerpt: "Un focus sur les nouvelles techniques de dépistage qui permettent une détection plus précoce des cancers et améliorent le pronostic.",
    category: "Oncologie",
    author: "Dr. Jean Martin",
    date: "2024-03-12",
    image: "/placeholder-article-2.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Innovations en chirurgie mini-invasive",
    excerpt: "Les avancées technologiques révolutionnent la chirurgie avec des techniques moins invasives et une récupération plus rapide.",
    category: "Chirurgie",
    author: "Dr. Sophie Laurent",
    date: "2024-03-10",
    image: "/placeholder-article-3.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Télémédecine : bilan et perspectives",
    excerpt: "Retour sur l'évolution de la télémédecine post-pandémie et les nouvelles opportunités qu'elle offre pour l'accès aux soins.",
    category: "Innovation",
    author: "Dr. Pierre Durand",
    date: "2024-03-08",
    image: "/placeholder-article-4.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Prise en charge de la douleur chronique",
    excerpt: "Approches multidisciplinaires et innovations thérapeutiques dans la gestion de la douleur chronique chez l'adulte.",
    category: "Algologie",
    author: "Dr. Anne Moreau",
    date: "2024-03-05",
    image: "/placeholder-article-5.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Médecine personnalisée et génomique",
    excerpt: "Comment la médecine personnalisée transforme les approches thérapeutiques grâce aux avancées en génomique.",
    category: "Génétique",
    author: "Dr. Thomas Bernard",
    date: "2024-03-01",
    image: "/placeholder-article-6.jpg",
    featured: false,
  },
];

const categories = ["Toutes", "Cardiologie", "Oncologie", "Chirurgie", "Innovation", "Algologie", "Génétique"];

export default function Actualites() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const articlesPerPage = 6;

  // Filtrer les articles par catégorie
  const filteredArticles = selectedCategory === "Toutes" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-medical-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="medical-section">
        <div className="medical-container">
          {currentArticles.length > 0 ? (
            <>
              <div className="medical-grid medical-grid--3">
                {currentArticles.map((article) => (
                  <MedicalCard key={article.id}>
                    <div className="relative">
                      <div className="aspect-video bg-gray-200 rounded-t-xl flex items-center justify-center">
                        <span className="text-gray-500">Image {article.id}</span>
                      </div>
                      {article.featured && (
                        <div className="absolute top-4 left-4 bg-medical-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                          À la une
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </div>
                    </div>
                    
                    <MedicalCard.Content>
                      <MedicalCard.Meta>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                          </div>
                        </div>
                      </MedicalCard.Meta>
                      
                      <MedicalCard.Title>
                        <Link 
                          to={`/actualites/${article.id}`}
                          className="hover:text-medical-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </MedicalCard.Title>
                      
                      <MedicalCard.Description>
                        {article.excerpt}
                      </MedicalCard.Description>
                      
                      <div className="mt-4">
                        <MedicalButton variant="outline" size="sm" asChild>
                          <Link to={`/actualites/${article.id}`}>
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
                Aucun article ne correspond à la catégorie sélectionnée.
              </p>
              <MedicalButton 
                variant="primary"
                onClick={() => handleCategoryChange("Toutes")}
              >
                Voir tous les articles
              </MedicalButton>
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