import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowLeft, Info, CheckCircle, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/Seo";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalButton } from "@/components/ui/medical-button";
import { getProductById, type ProductDetail } from "@/lib/api";
import { safeProductImage, parseGallery } from "@/lib/images";
import { handleSmartOrder } from "@/lib/contact";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract actual ID from URL (handle format: id-slug or just id)
  const productId = id?.split("-")[0] || id;

  // Fetch product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading product:", error);
    }
  }, [error]);

  // Disable browser scroll restoration for product detail pages
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top immediately when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [productId]);

  // Ensure scroll to top after product data is loaded (in case of delayed rendering)
  useEffect(() => {
    if (product && !isLoading) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }
  }, [product, isLoading]);

  const formatPrice = (price: string | null) => {
    if (!price) return "Prix sur demande";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "Prix sur demande";
    return `${numPrice.toFixed(2)} DT`;
  };

  const handleOrder = async () => {
    if (!product) return;
    await handleSmartOrder({
      productName: product.titre,
      productReference: product.reference || undefined,
      productPrice: product.prix ? formatPrice(product.prix) : undefined,
      productId: product.id, // Pass product ID for better tracking
    });
  };

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Produits", url: "/produits" },
    { label: product?.titre || "Produit", url: null },
  ];

  // Get all images (miniature + gallery)
  const allImages = product
    ? [
        product.image_miniature,
        ...(product.galerie_json && Array.isArray(product.galerie_json)
          ? product.galerie_json
          : []),
      ].filter(Boolean)
    : [];

  const mainImage = allImages[selectedImageIndex] || product?.image_miniature;

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-white min-h-screen">
          <div className="medical-container py-8">
            <Breadcrumb items={[{ label: "Produits", href: "/produits" }, { label: "Chargement..." }]} />
            <div className="mt-8 max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="h-96 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="bg-white min-h-screen">
          <div className="medical-container py-8">
            <Breadcrumb items={[{ label: "Produits", href: "/produits" }, { label: "Erreur" }]} />
            <div className="mt-8 max-w-7xl mx-auto text-center py-16">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
              <p className="text-gray-600 mb-8">
                Le produit que vous recherchez n'existe pas ou n'est plus disponible.
              </p>
              <MedicalButton variant="primary" onClick={() => navigate("/produits")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux produits
              </MedicalButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Generate SEO-friendly URL
  const seoSlug = product.slug || product.titre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const seoUrl = `/produit/${product.id}-${seoSlug}`;
  const productUrl = `https://bastide.tn${seoUrl}`;

  // Prepare all product images for JSON-LD
  const productImages = useMemo(() => {
    const images: string[] = [];
    if (product.image_miniature) {
      images.push(safeProductImage(product.image_miniature));
    }
    const gallery = parseGallery(product.galerie_json);
    gallery.forEach((img) => {
      const fullUrl = safeProductImage(img);
      if (!images.includes(fullUrl)) {
        images.push(fullUrl);
      }
    });
    return images.length > 0 ? images : [safeProductImage(null)]; // Fallback to placeholder
  }, [product]);

  // Generate JSON-LD structured data
  const jsonLd = useMemo(() => {
    // Get description (strip HTML tags and escape for JSON)
    const description = product.seo_description || 
                       product.description_courte || 
                       product.description_html?.replace(/<[^>]*>/g, '').trim() || 
                       `Découvrez ${product.titre} chez Bastide Tunisie.`;
    
    // Clean description for JSON (remove HTML, escape quotes)
    const cleanDescription = description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/"/g, '\\"') // Escape double quotes
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();

    // Format price (remove currency symbol, use dot separator, 3 decimal places)
    // Example: 129.000 (not 129,000 or 129.00)
    const formattedPrice = product.prix 
      ? parseFloat(product.prix).toFixed(3)
      : null;

    // Determine availability based on est_actif
    const availability = product.est_actif 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock';

    // Build JSON-LD object
    const jsonLdData: any = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.titre,
      "image": productImages,
      "description": cleanDescription,
      "sku": product.reference || product.id,
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "TND",
        "price": formattedPrice || undefined,
        "availability": availability,
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    // Add brand if available
    if (product.marque) {
      jsonLdData.brand = {
        "@type": "Brand",
        "name": product.marque
      };
    }

    // Remove price from offers if not available
    if (!formattedPrice) {
      delete jsonLdData.offers.price;
    }

    return jsonLdData;
  }, [product, productImages, productUrl]);

  // Inject JSON-LD into document head
  useEffect(() => {
    if (!product) return;

    // Remove existing product JSON-LD if any
    const existingScript = document.querySelector('script[type="application/ld+json"][data-product-jsonld]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-product-jsonld', 'true');
    script.textContent = JSON.stringify(jsonLd, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-product-jsonld]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [jsonLd, product]);

  return (
    <Layout>
      <Seo
        title={`${product.titre} - Bastide Tunisie`}
        description={product.seo_description || product.description_courte || `Découvrez ${product.titre} chez Bastide Tunisie. ${product.reference ? `Référence: ${product.reference}.` : ""} ${product.prix ? `Prix: ${formatPrice(product.prix)}.` : ""}`}
        canonical={productUrl}
        image={product.image_miniature ? safeProductImage(product.image_miniature) : undefined}
        type="product"
      />
      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white">
          <div className="medical-container py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Product Detail */}
        <div className="medical-container py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <MedicalButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/produits")}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </MedicalButton>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={safeProductImage(mainImage || "")}
                    alt={product.titre}
                    className="w-full h-full object-contain p-6"
                    loading="eager"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-medical-primary ring-2 ring-medical-primary/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={safeProductImage(img || "")}
                          alt={`${product.titre} - Vue ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {product.titre}
                  </h1>
                  {product.reference && (
                    <p className="text-lg text-gray-600">
                      <span className="font-medium">Référence:</span> {product.reference}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-medical-primary">
                    {formatPrice(product.prix)}
                  </span>
                  {product.est_actif ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      <XCircle className="h-4 w-4" />
                      Non disponible
                    </span>
                  )}
                </div>

                {/* Category */}
                {(product.categorie_nom || product.sous_categorie_nom) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.categorie_nom && (
                      <span className="px-3 py-1 bg-medical-primary/10 text-medical-primary rounded-full text-sm font-medium">
                        {product.categorie_nom}
                      </span>
                    )}
                    {product.sous_categorie_nom && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {product.sous_categorie_nom}
                      </span>
                    )}
                  </div>
                )}

                {/* Short Description */}
                {product.description_courte && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{product.description_courte}</p>
                  </div>
                )}

                {/* Order Button */}
                <div className="pt-4">
                  <MedicalButton
                    variant="primary"
                    size="lg"
                    onClick={handleOrder}
                    disabled={!product.est_actif}
                    className="w-full sm:w-auto"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.est_actif ? "Commander" : "Non disponible"}
                  </MedicalButton>
                  {!product.est_actif && (
                    <p className="text-sm text-gray-500 mt-2">
                      Ce produit n'est actuellement pas disponible à la commande.
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Full Description */}
            {product.description_html && (
              <div className="mt-12 border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Description du produit</h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description_html }}
                />
              </div>
            )}

            {/* SEO Description */}
            {product.seo_description && !product.description_html && (
              <div className="mt-12 border-t border-gray-200 pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.seo_description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

