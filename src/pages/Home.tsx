import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import heroImage from "@/assets/hero-medical1.jpg";
import Service1Image from "@/assets/s1.jpg";
import Service2Image from "@/assets/s2.jpg";
import Service3Image from "@/assets/s4.jpg";
import Service4Image from "@/assets/s4.png";
import servicesImage from "@/assets/services-icons.jpg";
import productsImage from "@/assets/products-display.jpg";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib/api";
import CategoryPillarsDynamic from "@/components/catalog/CategoryPillarsDynamic";

const PillarCard = ({ title, categoryId }: { title: string; categoryId: string }) => (
  <Link
    to={`/produits?categoryId=${categoryId}`}
    className="block p-6 rounded-xl shadow-medical hover:shadow-medical-xl transition"
  >
    <div className="text-lg font-semibold mb-1">{title}</div>
    <div className="text-sm text-gray-600">Découvrir</div>
  </Link>
);
const services = [
  {
    icon: Shield,
    title: "Assistance respiratoire",
    description:
      "Apnée du sommeil (PPC/CPAP), oxygénothérapie et VNI : installation à domicile, formation et suivi personnalisé.",
  },
  {
    icon: Heart,
    title: "Location de matériel médical",
    description:
      "Lit médicalisé, fauteuil roulant, matelas à air, verticalisateur, lève-personne : livraison et installation rapides.",
  },
  {
    icon: Users,
    title: "Conseil & accompagnement",
    description:
      "Évaluation du besoin, choix du matériel, prise en charge, maintenance et support continu.",
  },
];


const features = [
  { title: "Installation & formation à domicile", description: "Par des techniciens spécialisés." },
  { title: "Astreinte 24/7 (Oxygénothérapie)", description: "Réponse aux urgences respiratoires." },
  { title: "Matériel certifié & récent", description: "Équipements conformes et performants." },
  { title: "Suivi et maintenance", description: "Entretien et support technique continus." },
  { title: "Depuis 1977", description: "Savoir-faire historique du Groupe Bastide." },
];

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Patiente",
    content: "Un service exceptionnel avec une équipe à l'écoute. Je recommande vivement cette structure médicale.",
    rating: 5,
  },
  {
    name: "Jean Martin", 
    role: "Patient",
    content: "Professionnalisme et bienveillance caractérisent cette équipe. Des soins de qualité dans un cadre moderne.",
    rating: 5,
  },
];

const stats = [
  { value: "10+", label: "Années d'expérience" },
  { value: "98%", label: "Satisfaction patient" },
];
const productPillars = [
  { title: "Fauteuils releveurs", href: "/produits/fauteuils-releveurs" },
  { title: "Incontinence", href: "/produits/incontinence" },
  { title: "Mobilité", href: "/produits/mobilite" },
  { title: "Matériel médical", href: "/produits/materiel-medical" },
];
export default function Home() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { rows } = await getCategories({ limit: 200 });
        setCats(rows);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  // On cible les 4 “piliers” par slug (ou par nom si tu préfères)
  const wantedSlugs = new Map<string, string>([
    ["fauteuils-releveurs", "Fauteuils releveurs"],
    ["incontinence", "Incontinence"],
    ["mobilite", "Mobilité"],
    ["materiel-medical", "Matériel médical"],
  ]);

  const pillars = cats
    .filter(c => wantedSlugs.has(c.slug))
    .map(c => ({ title: wantedSlugs.get(c.slug)!, id: c.id }));
  return (
    <Layout>
    <div>
      {/* Hero Section */}
      <section className="medical-hero">
  <div className="medical-container relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Bastide Le Confort Médical,{" "}
          <span className="text-gradient-primary">1er réseau de matériel médical en Tunisie</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Spécialisée dans la vente et la location de matériel médical, Bastide Le Confort Médical
          accompagne particuliers et professionnels pour favoriser l’autonomie, la mobilité et
          le bien-être au quotidien.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <MedicalButton variant="primary" size="lg" asChild>
            <Link to="/contact">
              Prendre rendez-vous
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </MedicalButton>
          <MedicalButton variant="outline" size="lg" asChild>
            <Link to="/services">Nos services</Link>
          </MedicalButton>
        </div>
      </div>

      <div className="relative">
        <img
          src={heroImage}
          alt="Établissement médical moderne avec équipe soignante"
          className="w-full h-[500px] object-cover rounded-2xl shadow-medical-xl"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </div>
  </div>
</section>

{/* Nouvelle section Bastide - Détails */}
<section className="py-20 bg-white">
  <div className="medical-container max-w-5xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-900 mb-8">
      Vente et location de matériel médical à domicile
    </h2>
    <p className="text-lg text-gray-700 leading-relaxed mb-6">
      Bastide Le Confort Médical propose plus de 2 000 références de matériel paramédical,
      orthopédique et d’équipement médical pour améliorer le confort, le bien-être et le maintien
      à domicile des personnes âgées, en situation de handicap ou en convalescence.
    </p>

    <div className="grid md:grid-cols-2 gap-10 text-left mt-10">
      <div>
        <h3 className="text-2xl font-semibold text-medical-primary mb-3">
          Guide pratique & conseils
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Découvrez nos astuces pour aménager efficacement le logement et améliorer
          le confort des personnes âgées ou à mobilité réduite. Nos fauteuils releveurs,
          solutions de mobilité et aménagements de salle de bain favorisent l’autonomie
          et la sécurité au quotidien.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-medical-primary mb-3">
          Solutions pour le handicap
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Qu’il s’agisse d’une perte d’autonomie temporaire ou durable, nos experts sélectionnent
          les aides techniques les plus adaptées. Prenez rendez-vous avec un conseiller Bastide
          proche de chez vous pour un accompagnement personnalisé.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-medical-primary mb-3">
          Incontinence : bien choisir sa protection
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Il existe différents types de protections adultes selon le degré d’autonomie.
          Découvrez nos conseils pour choisir la solution la plus adaptée à vos besoins.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-medical-primary mb-3">
          Espace professionnel
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Professionnels de santé ? Retrouvez tout le matériel nécessaire pour vos soins,
          diagnostics, hygiène et mobilier médical. Profitez de -10 % toute l’année sur
          notre matériel médical professionnel.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Section Stats existante */}
<section className="py-16 bg-gray-50">
  <div className="medical-container">
    <div className="medical-grid medical-grid--4">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl font-bold text-medical-primary mb-2">
            {stat.value}
          </div>
          <div className="text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
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
          src={Service1Image}
          alt="Location de matériel médical"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
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
          src={Service2Image}
          alt="Maintien à domicile"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
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

      {/* Service 3 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-md">
        <img
          src={Service4Image}
          alt="Réseau Bastide"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
        <h3 className="text-lg font-semibold mb-3">
          Votre boutique de confiance en Tunisie avec 2 magasins à votre service
        </h3>
        <Link
          to="/magasins"
          className="bg-white text-gray-900 font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition"
        >
          Trouver mon magasin
        </Link>
      </div>

      </div>

      {/* Service 4 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-md">
        <img
          src={Service3Image}
          alt="Service client Bastide"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center p-6 text-center text-white">
          <h3 className="text-lg font-semibold mb-3">
            Une question ? Appelez notre service client au <br />
            <span className="font-bold">29 380 898</span> <br />
            
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


      {/* Features Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={servicesImage}
                alt="Services médicaux et équipements modernes"
                className="w-full h-[400px] object-cover rounded-xl shadow-medical"
              />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pourquoi nous choisir ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre engagement envers l'excellence médicale se traduit par des soins de qualité
                supérieure et une attention particulière portée à chaque patient.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-medical-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
     
<section className="medical-section">
  <div className="medical-container">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Produits médicaux</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Découvrez notre sélection de matériel médical (vente et location).
      </p>
    </div>

    <CategoryPillarsDynamic limit={4} onlyTopLevel orderBy="desc" />

   
  </div>
</section>

      {/* Testimonials Section */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Témoignages patients
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les retours de nos patients sur leur expérience
            </p>
          </div>

          <div className="medical-grid medical-grid--2">
            {testimonials.map((testimonial, index) => (
              <MedicalCard key={index}>
                <MedicalCard.Content>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </MedicalCard.Content>
              </MedicalCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="medical-section bg-gradient-primary text-white">
        <div className="medical-container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous dès aujourd'hui pour prendre rendez-vous avec l'un de nos spécialistes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MedicalButton 
              variant="accent" 
              size="lg"
              className="bg-white text-medical-primary hover:bg-gray-100"
              asChild
            >
              <Link to="/contact">
                <Clock className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </Link>
            </MedicalButton>
            <MedicalButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-medical-primary"
              asChild
            >
              <Link to="/services">En savoir plus</Link>
            </MedicalButton>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
}