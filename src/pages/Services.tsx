import { useEffect } from "react";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalButton } from "@/components/ui/medical-button";
import Seo from "@/components/Seo";
import ImageSlider from "@/components/ui/ImageSlider";

import { safeProductImage } from "@/lib/images";
import StoreLocations from "@/components/StoreLocations";

export default function Services() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Layout>
      <Seo
        title="Services Bastide Tunisie — Maintien à domicile, assistance"
        description="Installation à domicile, conseil par nos experts, astreinte 24/7, livraison rapide. Découvrez nos services Bastide en Tunisie."
        canonical="https://bastide.tn/services"
        image={safeProductImage("images/bastidelogo.png")}
      />
      {/* Hero Slider */}
      <section>
        <ImageSlider />
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="medical-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Les services Bastide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos principaux services pour vous accompagner au quotidien,
              que ce soit à domicile, en magasin ou à distance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-md">
              <img
                src={safeProductImage("images/s1.webp")}
                alt="Location de matériel médical"
                className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                width={480}
                height={320}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Location de matériel médical
                </h3>
                <Link
                  to="/location-materiel"
                  className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition"
                >
                  Découvrir
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-md">
              <img
                src={safeProductImage("images/s2.webp")}
                alt="Maintien à domicile"
                className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                width={433}
                height={320}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Nos experts du maintien à domicile vous accompagnent pour une prise en charge globale
                </h3>
                <Link
                  to="/contact"
                  className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition"
                >
                  Être rappelé
                </Link>
              </div>
            </div>

            {/* Service 3 - Removed, replaced by StoreLocations component below */}

            {/* Service 4 - Assistante respiratoire */}
            <div className="relative group rounded-2xl overflow-hidden shadow-md">
              <video
                src="/images/airoxyimage.webp"
                className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Assistante respiratoire
                </h3>
                <a
                  href="https://airoxy.tn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    // Track service click
                    try {
                      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/api/statistics/service-click`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ service_name: "Assistante respiratoire" }),
                      });
                    } catch (err) {
                      console.error("Failed to track service click:", err);
                    }
                  }}
                  className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition"
                >
                  Découvrir
                </a>
              </div>
            </div>

            {/* Service 5 */}
            <div className="relative group rounded-2xl overflow-hidden shadow-md">
              <img
                src={safeProductImage("images/s4.webp")}
                alt="Service client Bastide"
                className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                width={480}
                height={320}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Une question ? Appelez notre service client au <br />
                  <span className="font-bold">29 380 898</span>
                </h3>
                <a
                  href="tel:+21629380898"
                  className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition"
                >
                  29 380 898
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations Section */}
      <StoreLocations />

      {/* Emergency Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Service d'urgence
            </h2>
            <p className="text-xl text-gray-600">
              En cas d'urgence médicale, notre équipe reste disponible 24h/24
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Urgences 24h/24
              </h3>
              <p className="text-gray-600 mb-4">
                Service d'urgence médicale disponible en permanence
              </p>
              <div className="flex justify-center items-center space-x-2">
                <Phone className="h-5 w-5 text-medical-accent" />
                <span className="text-lg font-semibold text-medical-accent">
                  29 380 898
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg max-w-3xl mx-auto">
              <div className="flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Urgence vitale
                  </h3>
                  <p className="text-red-700">
                    En cas d'urgence vitale, composez le{" "}
                    <strong>190</strong> (Tunisie)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="medical-section bg-medical-primary text-white">
        <div className="medical-container text-center">
          <h2 className="text-4xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Notre équipe est à votre écoute pour toute question ou assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MedicalButton
              variant="accent"
              size="lg"
              className="bg-white text-medical-primary hover:bg-gray-100"
            >
              <Phone className="mr-2 h-5 w-5" />
              29 380 898
            </MedicalButton>
            <Link to="/contact">
              <MedicalButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-medical-primary"
              >
                Contactez-nous
              </MedicalButton>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
