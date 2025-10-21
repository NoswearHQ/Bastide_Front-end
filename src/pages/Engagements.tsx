import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function Engagements() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Engagements" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Nos engagements
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Prendre soin de nos semblables est la volonté du groupe Bastide Le
              Confort Médical. Depuis plus de 40 ans, nous agissons ensemble
              pour trouver des solutions qui améliorent le quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Engagements Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container max-w-5xl mx-auto leading-relaxed text-gray-700 text-lg">
          <p className="mb-6">
            Spécialiste des prestations de santé à domicile depuis 1977, Bastide
            Le Confort Médical fut parmi les premiers à œuvrer aux côtés de
            patients, de professionnels de santé et d’établissements de soins,
            afin de permettre l’accessibilité à un service de qualité et à des
            équipements performants.
          </p>

          <p className="mb-6">
            Depuis plus de 35 ans, un grand nombre de patients nous ont témoigné
            leur confiance. Grâce à celle-ci, nous avons pu créer une dynamique
            d’amélioration continue, en nous développant humainement,
            techniquement et économiquement.
          </p>

          <p className="italic text-medical-primary font-semibold mb-6">
            « Prendre soin de nos semblables »
          </p>

          <p className="mb-8">
            Cette mission, fondatrice de notre entreprise, implique des valeurs
            fortes et nous exigeons de chaque collaborateur le respect de celles-ci,
            d’autant que les patients que nous suivons sont souvent vulnérables.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ces valeurs se traduisent par :
          </h2>

          <ul className="list-disc list-inside space-y-3 mb-10">
            <li>L’écoute du prescripteur, du patient et de son entourage.</li>
            <li>Le sens du service et la chaleur humaine du contact direct.</li>
            <li>La qualité, la rapidité d’intervention et le conseil.</li>
            <li>Le sérieux et le respect absolu des engagements pris.</li>
            <li>L’honnêteté, qui est à la base de tous nos métiers.</li>
            <li>L’humilité, valeur universelle.</li>
          </ul>

          <p className="mb-6">
            Nous investissons beaucoup dans la formation de nos collaborateurs.
            Quotidiennement au contact des patients et de leurs proches, ils sont
            les garants de la qualité de leur prise en charge.
          </p>

          <p className="mb-6">
            Nous nous efforçons chaque jour de fournir la meilleure prestation
            et investissons dans l’innovation, en intégrant les nouvelles
            technologies pour améliorer le confort et la santé des patients.
          </p>

          <p className="font-semibold text-gray-800">
            Nous croyons fondamentalement dans ces valeurs et nous appliquons
            chaque jour à les respecter rigoureusement.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="medical-section bg-medical-primary text-white text-center">
        <div className="medical-container">
          <h2 className="text-4xl font-bold mb-4">
            Rejoignez notre mission
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Vous partagez notre vision de la santé, du service et de l’humain ?
            Rejoignez notre réseau et participez à notre engagement envers le
            bien-être de tous.
          </p>
          <Link
            to="/contact"
            className="bg-white text-medical-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </Layout>
  );
}
