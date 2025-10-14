import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import heroImage from "@/assets/hero-medical.jpg";
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
  { value: "5000+", label: "Patients suivis" },
  { value: "15", label: "Spécialistes" },
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
                Votre santé,{" "}
                <span className="text-gradient-primary">notre priorité</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Découvrez une approche moderne et humaine de la médecine avec notre équipe
                de spécialistes dédiés à votre bien-être et votre santé.
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

      {/* Stats Section */}
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
      <section className="medical-section">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos services médicaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une gamme complète de services médicaux pour répondre à tous vos besoins de santé,
              avec une approche personnalisée et bienveillante.
            </p>
          </div>

          <div className="medical-grid medical-grid--3 mb-12">
            {services.map((service, index) => (
              <MedicalCard key={index}>
                <MedicalCard.Content>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <MedicalCard.Title>{service.title}</MedicalCard.Title>
                  <MedicalCard.Description>{service.description}</MedicalCard.Description>
                </MedicalCard.Content>
              </MedicalCard>
            ))}
          </div>

          <div className="text-center">
            <MedicalButton variant="primary" asChild>
              <Link to="/services">
                Découvrir tous nos services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </MedicalButton>
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