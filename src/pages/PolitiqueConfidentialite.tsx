import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Shield, Eye, Lock, Mail, Phone, MapPin, AlertCircle } from "lucide-react";

export default function PolitiqueConfidentialite() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Politique de confidentialité" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center">
              <Shield className="mr-4 h-12 w-12" />
              Politique de confidentialité
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez comment Bastide Le Confort Médical protège et utilise vos données personnelles.
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
                  Introduction
                </h2>
                <p className="text-gray-700 mb-4">
                  Bastide Le Confort Médical s&apos;engage à protéger la confidentialité et la sécurité 
                  de vos informations personnelles. Cette politique de confidentialité explique comment 
                  nous collectons, utilisons et protégeons vos données.
                </p>
                <p className="text-gray-700">
                  En utilisant notre site web, vous acceptez les pratiques décrites dans cette politique.
                </p>
              </div>

              {/* Responsable du traitement */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsable du traitement</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bastide Le Confort Médical</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-medical-primary mr-3" />
                      <span>Centre Urbain Nord, Immeuble Express, Tunis, Tunisie 1082</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-medical-primary mr-3" />
                      <span>29 38 08 98</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-medical-primary mr-3" />
                      <span>contact@bastidemedical.tn</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Données collectées */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Données personnelles collectées</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Informations de contact</h3>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Nom et prénom</li>
                      <li>• Adresse email</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Adresse postale</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Données de navigation</h3>
                    <ul className="text-green-800 space-y-1">
                      <li>• Adresse IP</li>
                      <li>• Type de navigateur</li>
                      <li>• Pages visitées</li>
                      <li>• Durée de visite</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Données médicales (si applicable)</h3>
                    <ul className="text-yellow-800 space-y-1">
                      <li>• Informations de santé (avec consentement explicite)</li>
                      <li>• Historique des services médicaux</li>
                      <li>• Préférences de traitement</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Finalités du traitement */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Finalités du traitement</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Services médicaux</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Prise de rendez-vous</li>
                      <li>• Suivi des traitements</li>
                      <li>• Communication médicale</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Réponses aux demandes</li>
                      <li>• Newsletter (avec consentement)</li>
                      <li>• Informations sur nos services</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Amélioration du service</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Statistiques de visite</li>
                      <li>• Analyse d&apos;utilisation</li>
                      <li>• Optimisation du site</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Obligations légales</h3>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Conservation des dossiers</li>
                      <li>• Déclarations réglementaires</li>
                      <li>• Contrôles sanitaires</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Base légale */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Base légale du traitement</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-medical-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Consentement</h3>
                      <p className="text-gray-700">Pour les communications marketing et l&apos;utilisation de cookies non essentiels</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-medical-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Exécution d&apos;un contrat</h3>
                      <p className="text-gray-700">Pour la fourniture de services médicaux et la gestion des rendez-vous</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-medical-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Intérêt légitime</h3>
                      <p className="text-gray-700">Pour l&apos;amélioration de nos services et la sécurité du site</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-medical-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Obligation légale</h3>
                      <p className="text-gray-700">Pour la conservation des dossiers médicaux et les déclarations réglementaires</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partage des données */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Partage des données</h2>
                <p className="text-gray-700 mb-4">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations 
                  uniquement dans les cas suivants :
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-medical-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Prestataires de services</h3>
                      <p className="text-gray-700">Prestataires liés par des accords de confidentialité stricts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-medical-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Autorités compétentes</h3>
                      <p className="text-gray-700">En cas d&apos;obligation légale ou de demande judiciaire</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 text-medical-primary mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Urgences médicales</h3>
                      <p className="text-gray-700">En cas d&apos;urgence vitale nécessitant le partage d&apos;informations médicales</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sécurité */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sécurité des données</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Mesures techniques</h3>
                    <ul className="text-green-800 space-y-1 text-sm">
                      <li>• Chiffrement SSL/TLS</li>
                      <li>• Serveurs sécurisés</li>
                      <li>• Sauvegardes régulières</li>
                      <li>• Contrôle d&apos;accès</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Mesures organisationnelles</h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Formation du personnel</li>
                      <li>• Accords de confidentialité</li>
                      <li>• Audit de sécurité</li>
                      <li>• Procédures d&apos;accès</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Droits des utilisateurs */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit d&apos;accès</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit de rectification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit d&apos;effacement</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit à la portabilité</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit d&apos;opposition</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit de limitation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit de retrait du consentement</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-medical-primary rounded-full mr-3"></div>
                      <span className="text-gray-700">Droit de plainte</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conservation */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conservation des données</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Dossiers médicaux</h3>
                    <p className="text-gray-700">Conservés selon les obligations légales (minimum 20 ans)</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Données de contact</h3>
                    <p className="text-gray-700">Conservées 3 ans après le dernier contact</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Données de navigation</h3>
                    <p className="text-gray-700">Conservées 13 mois maximum</p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies et technologies similaires</h2>
                <p className="text-gray-700 mb-4">
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                  Vous pouvez gérer vos préférences de cookies à tout moment.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800">Important</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Certains cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-medical-primary/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Exercer vos droits</h2>
                <p className="text-gray-700 mb-4">
                  Pour exercer vos droits ou pour toute question concernant cette politique de confidentialité :
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
                  Cette politique de confidentialité peut être mise à jour. Nous vous informerons de tout changement important.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
