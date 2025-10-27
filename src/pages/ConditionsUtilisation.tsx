import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { FileCheck, AlertTriangle, Shield, Users, Phone, Mail, MapPin } from "lucide-react";

export default function ConditionsUtilisation() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Conditions d'utilisation" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center">
              <FileCheck className="mr-4 h-12 w-12" />
              Conditions d&apos;utilisation
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez les conditions d&apos;utilisation de notre site web et de nos services médicaux.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="medical-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              
              {/* Introduction */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-medical-primary" />
                  Introduction
                </h2>
                <p className="text-gray-700 mb-4">
                  Les présentes conditions d&apos;utilisation régissent l&apos;utilisation du site web 
                  bastideleconfortmedical.com et des services proposés par Bastide Le Confort Médical.
                </p>
                <p className="text-gray-700">
                  En accédant à notre site ou en utilisant nos services, vous acceptez d&apos;être lié 
                  par ces conditions d&apos;utilisation.
                </p>
              </div>

              {/* Définitions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Définitions</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">« Nous », « Notre », « Bastide »</h3>
                    <p className="text-gray-700">Désigne Bastide Le Confort Médical, société de services médicaux.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">« Vous », « Utilisateur »</h3>
                    <p className="text-gray-700">Désigne toute personne accédant au site ou utilisant nos services.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">« Site »</h3>
                    <p className="text-gray-700">Désigne le site web bastideleconfortmedical.com et toutes ses pages.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">« Services »</h3>
                    <p className="text-gray-700">Désigne l&apos;ensemble des services médicaux proposés par Bastide.</p>
                  </div>
                </div>
              </div>

              {/* Acceptation des conditions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptation des conditions</h2>
                <p className="text-gray-700 mb-4">
                  En utilisant notre site web ou nos services, vous déclarez et garantissez que :
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-medical-primary rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Vous avez lu et compris les présentes conditions d&apos;utilisation</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-medical-primary rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Vous acceptez d&apos;être lié par ces conditions</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-medical-primary rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Vous avez la capacité légale de contracter</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-medical-primary rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Vous utilisez le site conformément à la loi tunisienne</p>
                  </div>
                </div>
              </div>

              {/* Description des services */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description des services</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Services médicaux</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Consultations médicales</li>
                      <li>• Examens de diagnostic</li>
                      <li>• Suivi médical</li>
                      <li>• Urgences médicales</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Services en ligne</h3>
                    <ul className="text-green-800 space-y-1 text-sm">
                      <li>• Prise de rendez-vous</li>
                      <li>• Consultation de catalogue</li>
                      <li>• Informations médicales</li>
                      <li>• Contact et support</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Utilisation du site */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisation du site</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Utilisation autorisée</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Consultation des informations médicales</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Prise de rendez-vous en ligne</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Consultation du catalogue de produits</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Contact avec notre équipe</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Utilisation interdite</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Utilisation à des fins illégales ou non autorisées</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Tentative de piratage ou d&apos;intrusion</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Transmission de virus ou de codes malveillants</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                    <p className="text-gray-700">Collecte d&apos;informations sur d&apos;autres utilisateurs</p>
                  </div>
                </div>
              </div>

              {/* Propriété intellectuelle */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
                <p className="text-gray-700 mb-4">
                  Tous les contenus du site (textes, images, logos, vidéos, etc.) sont protégés par 
                  le droit d&apos;auteur et appartiennent à Bastide Le Confort Médical ou à ses partenaires.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800">Attention</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Toute reproduction, distribution ou modification sans autorisation expresse est interdite.
                  </p>
                </div>
              </div>

              {/* Responsabilité */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation de responsabilité</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Informations médicales</h3>
                    <p className="text-gray-700 text-sm">
                      Les informations présentes sur le site sont à titre informatif uniquement 
                      et ne remplacent pas une consultation médicale personnalisée.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Disponibilité du site</h3>
                    <p className="text-gray-700 text-sm">
                      Nous nous efforçons de maintenir le site accessible 24h/24, mais ne pouvons 
                      garantir une disponibilité continue.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Liens externes</h3>
                    <p className="text-gray-700 text-sm">
                      Nous ne sommes pas responsables du contenu des sites web vers lesquels 
                      nous pouvons rediriger.
                    </p>
                  </div>
                </div>
              </div>

              {/* Protection des données */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-medical-primary" />
                  Protection des données
                </h2>
                <p className="text-gray-700 mb-4">
                  La protection de vos données personnelles est une priorité. Nous nous engageons à :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Collecter uniquement les données nécessaires</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Protéger vos informations par des mesures de sécurité</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Respecter votre vie privée</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Ne pas partager vos données sans consentement</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Vous permettre d&apos;exercer vos droits</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700 text-sm">Conserver vos données selon la durée légale</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Obligations de l'utilisateur */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Obligations de l&apos;utilisateur</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Informations exactes</h3>
                    <p className="text-blue-800 text-sm">
                      Vous devez fournir des informations exactes et à jour lors de vos interactions avec nous.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Respect des autres</h3>
                    <p className="text-green-800 text-sm">
                      Vous vous engagez à respecter les autres utilisateurs et notre personnel.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Utilisation responsable</h3>
                    <p className="text-yellow-800 text-sm">
                      Vous vous engagez à utiliser le site de manière responsable et conforme à la loi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Suspension et résiliation */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Suspension et résiliation</h2>
                <p className="text-gray-700 mb-4">
                  Nous nous réservons le droit de suspendre ou de résilier votre accès au site 
                  en cas de violation de ces conditions d&apos;utilisation.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Cas de suspension</h3>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• Violation des conditions d&apos;utilisation</li>
                    <li>• Comportement inapproprié</li>
                    <li>• Utilisation frauduleuse</li>
                    <li>• Atteinte à la sécurité</li>
                  </ul>
                </div>
              </div>

              {/* Droit applicable */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable et juridiction</h2>
                <p className="text-gray-700 mb-4">
                  Les présentes conditions d&apos;utilisation sont régies par le droit tunisien. 
                  Tout litige sera soumis à la juridiction des tribunaux de Tunis.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-medical-primary/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant ces conditions d&apos;utilisation :
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email :</strong> contact@bastidemedical.tn
                  </p>
                  <p className="text-gray-700">
                    <strong>Téléphone :</strong> 29 38 08 98
                  </p>
                  <p className="text-gray-700">
                    <strong>Adresse :</strong> Centre Urbain Nord, Immeuble Express, Tunis, Tunisie 1082
                  </p>
                </div>
              </div>

              {/* Mise à jour */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Ces conditions d&apos;utilisation peuvent être modifiées. Nous vous informerons de tout changement important.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
