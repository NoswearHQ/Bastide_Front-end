import { Heart, Leaf, Users, Shield, Award, Lightbulb, Globe, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalCard } from "@/components/ui/MedicalCard";

const engagements = [
  {
    icon: Heart,
    title: "Excellence des soins",
    description: "Nous nous engageons à fournir des soins de la plus haute qualité, en utilisant les dernières avancées médicales et en maintenant des standards d'excellence rigoureux.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Users,
    title: "Approche centrée patient",
    description: "Chaque patient est unique. Nous adaptons nos soins à vos besoins spécifiques avec empathie, respect et une écoute attentive de vos préoccupations.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Leaf,
    title: "Développement durable",
    description: "Nous intégrons des pratiques écoresponsables dans notre fonctionnement quotidien pour préserver l'environnement et la santé des générations futures.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Shield,
    title: "Sécurité et confidentialité",
    description: "La protection de vos données personnelles et la sécurité de vos soins sont nos priorités absolues, respectant les plus hauts standards de confidentialité.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Award,
    title: "Formation continue",
    description: "Nos équipes se forment constamment aux dernières techniques et technologies médicales pour vous offrir les meilleurs soins possibles.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Lightbulb,
    title: "Innovation médicale",
    description: "Nous investissons dans la recherche et l'innovation pour améliorer continuellement la qualité des soins et développer de nouvelles solutions thérapeutiques.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: Globe,
    title: "Accessibilité des soins",
    description: "Nous œuvrons pour rendre les soins médicaux accessibles à tous, indépendamment de l'origine sociale, économique ou géographique.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Handshake,
    title: "Partenariats éthiques",
    description: "Nous collaborons avec des partenaires qui partagent nos valeurs d'intégrité, de transparence et d'engagement envers la santé publique.",
    color: "bg-teal-100 text-teal-600",
  },
];

const values = [
  {
    title: "Intégrité",
    description: "Nous agissons avec honnêteté et transparence dans toutes nos interactions, respectant les plus hauts standards éthiques de la profession médicale.",
  },
  {
    title: "Bienveillance",
    description: "Nous traitons chaque patient avec compassion, empathie et respect, en reconnaissant la vulnérabilité de ceux qui nous confient leur santé.",
  },
  {
    title: "Excellence",
    description: "Nous nous efforçons d'atteindre l'excellence dans tous les aspects de notre pratique médicale, de la prévention au traitement.",
  },
  {
    title: "Innovation",
    description: "Nous embrassons l'innovation et les nouvelles technologies pour améliorer continuellement la qualité des soins que nous prodiguons.",
  },
];

const certifications = [
  {
    name: "HAS - Haute Autorité de Santé",
    description: "Certification qualité pour la sécurité des soins",
    year: "2024",
  },
  {
    name: "ISO 9001",
    description: "Système de management de la qualité",
    year: "2023",
  },
  {
    name: "COFRAC",
    description: "Accréditation pour les analyses médicales",
    year: "2024",
  },
  {
    name: "Eco-label santé",
    description: "Engagement environnemental certifié",
    year: "2023",
  },
];

export default function Engagements() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Engagements" }
            ]} 
          />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Nos engagements
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez nos valeurs fondamentales et les engagements qui guident 
              notre pratique médicale au quotidien pour votre bien-être.
            </p>
          </div>
        </div>
      </section>

      {/* Engagements Grid */}
      <section className="medical-section">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos 8 engagements fondamentaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ces engagements reflètent notre vision d'une médecine moderne, 
              humaine et responsable, au service de votre santé et de votre bien-être.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {engagements.map((engagement, index) => (
              <MedicalCard key={index} className="text-center">
                <MedicalCard.Content>
                  <div className={`w-16 h-16 rounded-full ${engagement.color} flex items-center justify-center mx-auto mb-4`}>
                    <engagement.icon className="h-8 w-8" />
                  </div>
                  <MedicalCard.Title className="text-center mb-3">
                    {engagement.title}
                  </MedicalCard.Title>
                  <MedicalCard.Description className="text-center">
                    {engagement.description}
                  </MedicalCard.Description>
                </MedicalCard.Content>
              </MedicalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les valeurs qui nous animent et qui définissent notre identité professionnelle
            </p>
          </div>

          <div className="medical-grid medical-grid--2">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="medical-section">
        <div className="medical-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Notre impact
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Grâce à nos engagements, nous contribuons activement à l'amélioration 
                du système de santé et au bien-être de notre communauté.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Formation des futurs soignants
                    </h3>
                    <p className="text-gray-600">
                      Nous participons à la formation des étudiants en médecine et accueillons 
                      régulièrement des stagiaires pour transmettre notre expertise.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Recherche clinique
                    </h3>
                    <p className="text-gray-600">
                      Nous contribuons à l'avancement de la médecine en participant 
                      à des études cliniques et en publiant nos résultats.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Actions humanitaires
                    </h3>
                    <p className="text-gray-600">
                      Nous soutenons des missions humanitaires et participons à des programmes 
                      d'aide médicale dans les régions défavorisées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-subtle p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Certifications & Accréditations
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                      <span className="text-sm font-medium text-medical-primary bg-medical-primary/10 px-2 py-1 rounded">
                        {cert.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="medical-section bg-medical-primary text-white">
        <div className="medical-container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Rejoignez notre vision
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Vous partagez nos valeurs ? Nous serions ravis de collaborer avec vous 
            pour construire l'avenir de la santé ensemble.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
  <button className="bg-white text-medical-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
    Nous rejoindre
  </button>
</Link>

          </div>
        </div>
      </section>
    </Layout>
  );
}