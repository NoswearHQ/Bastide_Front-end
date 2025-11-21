import { useState } from "react";
import { ProduitsDetails } from "@/lib/api";

interface ProductDetailsFormProps {
  details: ProduitsDetails | null;
  onChange: (details: ProduitsDetails) => void;
}

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Non spécifié" },
  { value: "InStock", label: "En stock" },
  { value: "OutOfStock", label: "Rupture de stock" },
  { value: "PreOrder", label: "Précommande" },
  { value: "InStoreOnly", label: "En magasin uniquement" },
  { value: "OnlineOnly", label: "En ligne uniquement" },
  { value: "SoldOut", label: "Épuisé" },
  { value: "Discontinued", label: "Discontinué" },
];


export default function ProductDetailsForm({ details, onChange }: ProductDetailsFormProps) {
  const [formData, setFormData] = useState<ProduitsDetails>({
    brand: details?.brand || "",
    sku: null, // Removed - already the product's reference
    description_seo: null, // Removed - should be same as product description
    rating_value: null, // Removed
    rating_count: null, // Removed
    availability: "InStock", // Always set to "En stock"
    gtin: null, // Removed
    mpn: null, // Removed
    condition: null, // Removed
    price_valid_until: null, // Removed
    category_schema: null, // Removed - already the product's own category
  });

  const handleChange = (field: keyof ProduitsDetails, value: any) => {
    const updated = { ...formData, [field]: value, availability: "InStock" }; // Always ensure availability is "InStock"
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Détails SEO et Produit (Schema.org)
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Ces informations sont utilisées pour le référencement et les données structurées.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marque
          </label>
          <input
            type="text"
            value={formData.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value || null)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-medical-primary focus:border-medical-primary"
            placeholder="Ex: Philips, Siemens..."
          />
        </div>
      </div>
    </div>
  );
}

