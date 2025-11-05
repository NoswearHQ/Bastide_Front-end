import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts, type Product } from "@/lib/api";
import { safeProductImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export default function ProductSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await getProducts({
          search: searchTerm,
          limit: 8,
          page: 1,
        });
        setResults(response.rows || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const formatPrice = (price: string | null, devise: string) => {
    if (!price) return "Prix sur demande";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "Prix sur demande";
    return `${numPrice.toFixed(2)} ${devise}`;
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Rechercher un produit, une catégorie ou une référence..."
          className="w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-transparent shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-medical-primary"></div>
              <p className="mt-2">Recherche en cours...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/produits?q=${encodeURIComponent(product.titre)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={safeProductImage(product.image_miniature)}
                      alt={product.titre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{product.titre}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {product.reference && (
                        <span className="text-sm text-gray-500">Réf: {product.reference}</span>
                      )}
                      {product.prix && (
                        <span className="text-sm font-medium text-medical-primary">
                          {formatPrice(product.prix, product.devise)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {searchTerm && (
                <Link
                  to={`/produits?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="block px-4 py-3 text-center text-medical-primary font-medium hover:bg-gray-50 transition-colors border-t border-gray-200"
                >
                  Voir tous les résultats pour "{searchTerm}"
                </Link>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

