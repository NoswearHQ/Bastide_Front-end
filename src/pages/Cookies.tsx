import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Cookie, Settings, Shield, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";

export default function Cookies() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // In a real implementation, you would save these preferences to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Préférences de cookies sauvegardées !');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Politique des cookies" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center">
              <Cookie className="mr-4 h-12 w-12" />
              Politique des cookies
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez comment nous utilisons les cookies et gérez vos préférences de confidentialité.
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
                  <Eye className="h-6 w-6 mr-3 text-medical-primary" />
                  Qu&apos;est-ce qu&apos;un cookie ?
                </h2>
                <p className="text-gray-700 mb-4">
                  Un cookie est un petit fichier texte stocké sur votre ordinateur, tablette ou smartphone 
                  lorsque vous visitez notre site web. Les cookies nous permettent de reconnaître votre 
                  appareil et de mémoriser vos préférences.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Important</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Les cookies ne peuvent pas endommager votre ordinateur et ne contiennent aucun virus.
                  </p>
                </div>
              </div>

              {/* Types de cookies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types de cookies utilisés</h2>
                
                {/* Cookies essentiels */}
                <div className="mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Shield className="h-6 w-6 text-green-600 mr-3" />
                        <h3 className="text-lg font-semibold text-green-900">Cookies essentiels</h3>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Toujours actifs</span>
                      </div>
                    </div>
                    <p className="text-green-800 mb-4">
                      Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-700 text-sm">Maintien de la session utilisateur</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-700 text-sm">Sécurité et authentification</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-700 text-sm">Fonctionnalités de base du site</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Settings className="h-6 w-6 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-900">Cookies analytiques</h3>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.analytics}
                          onChange={() => handlePreferenceChange('analytics')}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                    <p className="text-blue-800 mb-4">
                      Ces cookies nous aident à comprendre comment vous utilisez notre site pour l&apos;améliorer.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-700 text-sm">Statistiques de visite</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-700 text-sm">Pages les plus consultées</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-700 text-sm">Temps passé sur le site</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="mb-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Cookie className="h-6 w-6 text-purple-600 mr-3" />
                        <h3 className="text-lg font-semibold text-purple-900">Cookies marketing</h3>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.marketing}
                          onChange={() => handlePreferenceChange('marketing')}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                    <p className="text-purple-800 mb-4">
                      Ces cookies permettent de personnaliser les publicités et le contenu.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-purple-700 text-sm">Publicités personnalisées</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-purple-700 text-sm">Suivi des campagnes</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-purple-700 text-sm">Réseaux sociaux</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies de préférences */}
                <div className="mb-8">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Settings className="h-6 w-6 text-yellow-600 mr-3" />
                        <h3 className="text-lg font-semibold text-yellow-900">Cookies de préférences</h3>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cookiePreferences.preferences}
                          onChange={() => handlePreferenceChange('preferences')}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookiePreferences.preferences ? 'bg-yellow-600' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookiePreferences.preferences ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </div>
                    <p className="text-yellow-800 mb-4">
                      Ces cookies mémorisent vos choix et préférences sur le site.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-yellow-700 text-sm">Langue préférée</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-yellow-700 text-sm">Paramètres d&apos;affichage</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-yellow-700 text-sm">Préférences de navigation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestion des cookies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion de vos préférences</h2>
                <p className="text-gray-700 mb-6">
                  Vous pouvez modifier vos préférences de cookies à tout moment en utilisant les contrôles ci-dessus.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions disponibles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <MedicalButton
                      variant="primary"
                      onClick={savePreferences}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Sauvegarder mes préférences
                    </MedicalButton>
                    
                    <MedicalButton
                      variant="outline"
                      onClick={() => {
                        setCookiePreferences({
                          essential: true,
                          analytics: false,
                          marketing: false,
                          preferences: false
                        });
                      }}
                      className="w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Refuser tous (sauf essentiels)
                    </MedicalButton>
                  </div>
                </div>
              </div>

              {/* Cookies tiers */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies de tiers</h2>
                <p className="text-gray-700 mb-4">
                  Notre site peut contenir des cookies provenant de services tiers. Voici les principaux :
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Service d&apos;analyse de trafic web fourni par Google.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Finalité :</strong> Analyse du comportement des visiteurs
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Calameo</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Service de visualisation de documents PDF.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Finalité :</strong> Affichage du catalogue interactif
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Réseaux sociaux</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      Boutons de partage et intégration de contenus sociaux.
                    </p>
                    <p className="text-gray-600 text-xs">
                      <strong>Finalité :</strong> Partage de contenu et intégration sociale
                    </p>
                  </div>
                </div>
              </div>

              {/* Durée de conservation */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Durée de conservation</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Cookies de session</h3>
                    <p className="text-blue-800 text-sm">
                      Supprimés automatiquement à la fermeture du navigateur
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Cookies persistants</h3>
                    <p className="text-green-800 text-sm">
                      Conservés selon leur durée de vie (1 mois à 2 ans maximum)
                    </p>
                  </div>
                </div>
              </div>

              {/* Droit applicable */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
                <p className="text-gray-700 mb-4">
                  Cette politique de cookies est régie par le droit tunisien et la loi organique 
                  n° 2004-63 du 27 juillet 2004 relative à la protection des données à caractère personnel.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-medical-primary/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Questions sur les cookies</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant notre utilisation des cookies :
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
                  Cette politique de cookies peut être mise à jour. Nous vous informerons de tout changement important.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
