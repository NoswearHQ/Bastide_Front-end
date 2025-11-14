import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";

const stores = [
  {
    name: "Centre Urbain Nord",
    address: "Centre Urbain Nord, Tunis",
    phone: "71 947 353",
    hours_week: "De 8h à 18h",
    hours_saturday: "8h à 14h",
    googleMapsUrl: "https://maps.app.goo.gl/QF2faGBzRSJk7nqg8",
  },
  {
    name: "Aouina",
    address: "Aouina, Tunis",
    phone: "71 947 353",
    hours_week: "De 8h à 20h",
    hours_saturday: "8h à 20h",
    googleMapsUrl: "https://maps.app.goo.gl/Noj54UvC9Vx4iP6WA",
  },
];

export default function StoreLocations() {
  return (
    <section className="py-16 bg-white">
      <div className="medical-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Votre boutique de confiance en Tunisie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos 2 magasins à votre service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Store Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {store.name}
                </h3>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 text-medical-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base">{store.address}</p>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-6 space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-medical-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-medical-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <a
                      href={`tel:+216${store.phone.replace(/\s/g, "")}`}
                      className="text-lg font-semibold text-gray-900 hover:text-medical-primary transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-medical-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-medical-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Horaires</p>
                    <div className="text-gray-900">
                      <p className="font-medium">Lundi - Vendredi</p>
                      <p className="text-gray-700">{store.hours_week}</p>
                      <p className="font-medium mt-2">Samedi</p>
                      <p className="text-gray-700">{store.hours_saturday}</p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Button */}
                <div className="pt-4">
                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <MedicalButton
                      variant="outline"
                      className="w-full justify-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir sur Google Maps
                    </MedicalButton>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

