import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Clock,
  Tag
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { getArticleBySlug, getArticles, type Article } from "@/lib/api";
import { parseGallery } from "@/lib/images";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  // Fetch main article
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug!),
    enabled: !!slug,
  });

  // Fetch related articles
  const { data: articlesData } = useQuery({
    queryKey: ['articles', 'related'],
    queryFn: () => getArticles({ limit: 3 }),
    enabled: !!article,
  });

  useEffect(() => {
    if (articlesData?.rows && article) {
      // Filter out current article and get related ones
      const related = articlesData.rows
        .filter(a => a.id !== article.id)
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [articlesData, article]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min de lecture`;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.titre || '';
    const text = article?.extrait || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-12">
          <div className="medical-container">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="h-64 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="py-12">
          <div className="medical-container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Article non trouvé
              </h1>
              <p className="text-gray-600 mb-6">
                L'article que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <MedicalButton variant="primary" asChild>
                <Link to="/actualites">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux actualités
                </Link>
              </MedicalButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const galleryImages = parseGallery(article.galerie_json);

  return (
    <Layout>
      {/* SEO Meta Tags */}
      <head>
        <title>{article.seo_titre || article.titre} | Bastide Le Confort Médical</title>
        <meta name="description" content={article.seo_description || article.extrait || ''} />
        <meta property="og:title" content={article.titre} />
        <meta property="og:description" content={article.extrait || ''} />
        <meta property="og:image" content={article.image_miniature || ''} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.titre} />
        <meta name="twitter:description" content={article.extrait || ''} />
        <meta name="twitter:image" content={article.image_miniature || ''} />
      </head>

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Actualités", href: "/actualites" },
              { label: article.titre }
            ]} 
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="medical-container">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <MedicalButton variant="outline" asChild>
                <Link to="/actualites">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux actualités
                </Link>
              </MedicalButton>
            </div>

            {/* Article Header */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Main Image */}
              {article.image_miniature && (
                <div className="aspect-video bg-gray-200">
                  <img
                    src={article.image_miniature}
                    alt={article.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
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
                        ? formatDate(article.publie_le)
                        : formatDate(article.cree_le)
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatReadingTime(article.contenu_html)}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {article.titre}
                </h1>

                {/* Article Excerpt */}
                {article.extrait && (
                  <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {article.extrait}
                  </div>
                )}

                {/* Share Buttons */}
                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Partager :</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Partager sur Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Partager sur Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Partager sur LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copier le lien"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-medical-primary prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: article.contenu_html }}
                />

                {/* Image Gallery */}
                {galleryImages.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Galerie d'images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Galerie ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles connexes</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <MedicalCard key={relatedArticle.id}>
                      {relatedArticle.image_miniature && (
                        <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
                          <img
                            src={relatedArticle.image_miniature}
                            alt={relatedArticle.titre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <MedicalCard.Content>
                        <MedicalCard.Meta>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {relatedArticle.publie_le 
                                  ? formatDate(relatedArticle.publie_le)
                                  : formatDate(relatedArticle.cree_le)
                                }
                              </span>
                            </div>
                          </div>
                        </MedicalCard.Meta>
                        
                        <MedicalCard.Title>
                          <Link 
                            to={`/articles/${relatedArticle.slug}`}
                            className="hover:text-medical-primary transition-colors"
                          >
                            {relatedArticle.titre}
                          </Link>
                        </MedicalCard.Title>
                        
                        {relatedArticle.extrait && (
                          <MedicalCard.Description>
                            {relatedArticle.extrait}
                          </MedicalCard.Description>
                        )}
                        
                        <div className="mt-4">
                          <MedicalButton variant="outline" size="sm" asChild>
                            <Link to={`/articles/${relatedArticle.slug}`}>
                              Lire la suite
                            </Link>
                          </MedicalButton>
                        </div>
                      </MedicalCard.Content>
                    </MedicalCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
