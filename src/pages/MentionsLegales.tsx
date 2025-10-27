import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { FileText, Building, Phone, Mail, MapPin } from "lucide-react";

export default function MentionsLegales() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Mentions légales" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center">
              <FileText className="mr-4 h-12 w-12" />
              Mentions légales
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Informations légales concernant Bastide Le Confort Médical et l&apos;utilisation de notre site web.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="medical-container">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              
              {/* Éditeur du site */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="h-6 w-6 mr-3 text-medical-primary" />
                  Éditeur du site
                </h2>
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

              {/* Directeur de publication */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de publication</h2>
                <p className="text-gray-700">
                  Le directeur de la publication est le représentant légal de Bastide Le Confort Médical.
                </p>
              </div>

              {/* Hébergement */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
                <p className="text-gray-700">
                  Ce site est hébergé par un prestataire de services d&apos;hébergement professionnel 
                  conforme aux standards de sécurité et de performance.
                </p>
              </div>

              {/* Propriété intellectuelle */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
                <p className="text-gray-700 mb-4">
                  L&apos;ensemble de ce site relève de la législation tunisienne et internationale 
                  sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de 
                  reproduction sont réservés, y compris pour les documents téléchargeables et les 
                  représentations iconographiques et photographiques.
                </p>
                <p className="text-gray-700">
                  La reproduction de tout ou partie de ce site sur un support électronique quelconque 
                  est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
              </div>

              {/* Responsabilité */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilité</h2>
                <p className="text-gray-700 mb-4">
                  Les informations contenues sur ce site sont aussi précises que possible et le site 
                  remis à jour à différentes périodes de l&apos;année, mais peut toutefois contenir 
                  des inexactitudes ou des omissions.
                </p>
                <p className="text-gray-700 mb-4">
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
                  merci de bien vouloir le signaler par email, à l&apos;adresse contact@bastidemedical.tn, 
                  en décrivant le problème de la manière la plus précise possible.
                </p>
                <p className="text-gray-700">
                  Tout contenu téléchargé se fait aux risques et périls de l&apos;utilisateur et sous 
                  sa seule responsabilité.
                </p>
              </div>

              {/* Liens hypertextes */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
                <p className="text-gray-700 mb-4">
                  Des liens hypertextes peuvent être présents sur le site. L&apos;utilisateur est 
                  informé qu&apos;en cliquant sur ces liens, il sortira du site bastideleconfortmedical.com. 
                  Ce dernier n&apos;a pas de contrôle sur les pages web sur lesquelles aboutissent 
                  ces liens et ne saurait, en aucun cas, être responsable de leur contenu.
                </p>
              </div>

              {/* Collecte de données */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Collecte et traitement de données</h2>
                <p className="text-gray-700 mb-4">
                  Conformément à la loi organique n° 2004-63 du 27 juillet 2004 relative à la 
                  protection des données à caractère personnel, vous disposez d&apos;un droit d&apos;accès, 
                  de rectification et de suppression des données qui vous concernent.
                </p>
                <p className="text-gray-700">
                  Pour exercer ce droit, contactez-nous à l&apos;adresse : contact@bastidemedical.tn
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Le site bastideleconfortmedical.com peut être amené à vous demander l&apos;acceptation 
                  des cookies pour des besoins de statistiques et d&apos;affichage.
                </p>
                <p className="text-gray-700">
                  Un cookie est une information déposée sur votre disque dur par le serveur du site 
                  que vous visitez. Il contient plusieurs données qui sont stockées sur votre ordinateur 
                  dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations.
                </p>
              </div>

              {/* Droit applicable */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
                <p className="text-gray-700">
                  Tout litige en relation avec l&apos;utilisation du site bastideleconfortmedical.com 
                  est soumis au droit tunisien. Il est fait attribution exclusive de juridiction aux 
                  tribunaux compétents de Tunis.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-medical-primary/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
                <p className="text-gray-700 mb-4">
                  Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
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

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
