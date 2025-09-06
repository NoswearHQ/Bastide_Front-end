import { useState } from "react";
import { Search, Filter, Star, ShoppingCart, Info } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Pagination from "@/components/ui/Pagination";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";

// Mock data pour les produits
const products = [
  {
    id: 1,
    name: "Stéthoscope électronique premium",
    category: "Diagnostic",
    price: "299€",
    rating: 4.8,
    reviews: 127,
    image: "/placeholder-product-1.jpg",
    description: "Stéthoscope électronique de haute précision avec amplification numérique et réduction du bruit ambiant.",
    features: ["Amplification x40", "Bluetooth", "Enregistrement audio", "Batterie longue durée"],
    inStock: true,
    bestseller: true,
  },
  {
    id: 2,
    name: "Tensiomètre automatique professionnel",
    category: "Diagnostic",
    price: "189€",
    rating: 4.6,
    reviews: 89,
    image: "/placeholder-product-2.jpg",
    description: "Tensiomètre automatique avec brassard universel, validé cliniquement selon les standards internationaux.",
    features: ["Mesure automatique", "Mémoire 120 mesures", "Connectivité PC", "Brassard universel"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 3,
    name: "Défibrillateur semi-automatique",
    category: "Urgence",
    price: "1299€",
    rating: 4.9,
    reviews: 45,
    image: "/placeholder-product-3.jpg",
    description: "Défibrillateur semi-automatique compact avec guidage vocal et électrodes adulte/enfant incluses.",
    features: ["Guidage vocal", "Analyse automatique", "Électrodes incluses", "Maintenance simplifiée"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 4,
    name: "Thermomètre infrarouge sans contact",
    category: "Diagnostic",
    price: "79€",
    rating: 4.4,
    reviews: 203,
    image: "/placeholder-product-4.jpg",
    description: "Thermomètre infrarouge professionnel pour mesure sans contact, précision médicale ±0.2°C.",
    features: ["Sans contact", "Précision ±0.2°C", "Mémoire 32 mesures", "Écran LCD rétroéclairé"],
    inStock: false,
    bestseller: false,
  },
  {
    id: 5,
    name: "Otoscope LED professionnel",
    category: "Diagnostic",
    price: "159€",
    rating: 4.7,
    reviews: 76,
    image: "/placeholder-product-5.jpg",
    description: "Otoscope avec éclairage LED haute intensité et système optique de qualité supérieure.",
    features: ["Éclairage LED", "Optique haute qualité", "Spéculums inclus", "Poignée ergonomique"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 6,
    name: "Kit de suture complet",
    category: "Chirurgie",
    price: "89€",
    rating: 4.5,
    reviews: 134,
    image: "/placeholder-product-6.jpg",
    description: "Kit de suture professionnel avec instruments chirurgicaux stérilisés et fils de suture variés.",
    features: ["Instruments stérilisés", "Fils variés", "Aiguilles précision", "Plateau chirurgical"],
    inStock: true,
    bestseller: false,
  },
  {
    id: 7,
    name: "Saturomètre de pouls professionnel",
    category: "Diagnostic",
    price: "149€",
    rating: 4.8,
    reviews: 98,
    image: "/placeholder-product-7.jpg",
    description: "Saturomètre de pouls avec écran OLED et mesure précise de la saturation en oxygène.",
    features: ["Écran OLED", "Mesure précise", "Alarmes configurables", "Batterie rechargeable"],
    inStock: true,
    bestseller: true,
  },
  {
    id: 8,
    name: "Balance médicale électronique",
    category: "Diagnostic",
    price: "249€",
    rating: 4.3,
    reviews: 67,
    image: "/placeholder-product-8.jpg",
    description: "Balance médicale électronique avec calcul IMC automatique et mémoire patient.",
    features: ["Calcul IMC", "Mémoire patient", "Plateforme antidérapante", "Écran grand format"],
    inStock: true,
    bestseller: false,
  },
];

const categories = ["Tous", "Diagnostic", "Urgence", "Chirurgie", "Réanimation", "Imagerie"];
const sortOptions = [
  { value: "name", label: "Nom A-Z" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
  { value: "bestseller", label: "Meilleures ventes" },
];

export default function Produits() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 6;

  // Filtrer et trier les produits
  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tri des produits
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseInt(a.price) - parseInt(b.price);
      case "price-desc":
        return parseInt(b.price) - parseInt(a.price);
      case "rating":
        return b.rating - a.rating;
      case "bestseller":
        return b.bestseller ? 1 : -1;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Produits" }
            ]} 
          />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Produits médicaux
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez notre catalogue d'équipements médicaux professionnels, 
              sélectionnés pour leur qualité et leur fiabilité.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="medical-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="medical-form-input pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="medical-form-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="medical-form-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategory !== "Tous" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-medical-primary text-white">
                {selectedCategory}
                <button
                  onClick={() => handleCategoryChange("Tous")}
                  className="ml-2 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                "{searchTerm}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-2 hover:text-gray-500"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="medical-section">
        <div className="medical-container">
          {currentProducts.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-8">
                <p className="text-gray-600">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="medical-grid medical-grid--3">
                {currentProducts.map((product) => (
                  <MedicalCard key={product.id}>
                    <div className="relative">
                      <div className="aspect-square bg-gray-200 rounded-t-xl flex items-center justify-center">
                        <span className="text-gray-500">Produit {product.id}</span>
                      </div>
                      {product.bestseller && (
                        <div className="absolute top-4 left-4 bg-medical-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                          Bestseller
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Rupture
                        </div>
                      )}
                    </div>
                    
                    <MedicalCard.Content>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-medical-primary bg-medical-primary/10 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {product.price}
                        </span>
                      </div>
                      
                      <MedicalCard.Title>
                        {product.name}
                      </MedicalCard.Title>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-500">
                          ({product.reviews} avis)
                        </span>
                      </div>
                      
                      <MedicalCard.Description>
                        {product.description}
                      </MedicalCard.Description>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Caractéristiques :
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-medical-primary rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 flex gap-2">
                        <MedicalButton 
                          variant="primary" 
                          size="sm" 
                          className="flex-1"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {product.inStock ? "Commander" : "Indisponible"}
                        </MedicalButton>
                        <MedicalButton variant="outline" size="sm">
                          <Info className="h-4 w-4" />
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
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
              <MedicalButton 
                variant="primary"
                onClick={() => {
                  handleCategoryChange("Tous");
                  handleSearchChange("");
                }}
              >
                Réinitialiser les filtres
              </MedicalButton>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nos experts sont là pour vous conseiller et vous aider à trouver 
              l'équipement médical adapté à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MedicalButton variant="primary">
                Contacter un expert
              </MedicalButton>
              <MedicalButton variant="outline">
                Demander un devis
              </MedicalButton>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}