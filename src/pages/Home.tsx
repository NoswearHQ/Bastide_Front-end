import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import heroImage from "@/assets/hero-medical.jpg";
import servicesImage from "@/assets/services-icons.jpg";
import productsImage from "@/assets/products-display.jpg";
import Layout from "@/components/layout/Layout";

const services = [
  {
    icon: Heart,
    title: "Consultations médicales",
    description: "Consultations spécialisées avec nos praticiens expérimentés pour un suivi personnalisé de votre santé.",
  },
  {
    icon: Shield,
    title: "Médecine préventive",
    description: "Programmes de dépistage et de prévention pour anticiper et prévenir les problèmes de santé.",
  },
  {
    icon: Users,
    title: "Soins d'équipe",
    description: "Approche pluridisciplinaire avec coordination entre spécialistes pour une prise en charge optimale.",
  },
];

const features = [
  {
    title: "Équipe médicale experte",
    description: "Praticiens diplômés et spécialisés",
  },
  {
    title: "Technologie de pointe", 
    description: "Équipements médicaux dernière génération",
  },
  {
    title: "Suivi personnalisé",
    description: "Accompagnement adapté à chaque patient",
  },
  {
    title: "Disponibilité 24/7",
    description: "Service d'urgence disponible en permanence",
  },
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

export default function Home() {
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Produits médicaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de produits et équipements médicaux
              de qualité professionnelle.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Équipements de pointe
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Nous utilisons et proposons les dernières innovations en matière
                d'équipements médicaux pour garantir des soins optimaux.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-medical-primary" />
                  <span>Matériel certifié CE et FDA</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-medical-primary" />
                  <span>Maintenance et support technique</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-medical-primary" />
                  <span>Formation à l'utilisation</span>
                </li>
              </ul>
              <MedicalButton variant="primary" asChild>
                <Link to="/produits">
                  Voir nos produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </MedicalButton>
            </div>
            
            <div>
              <img
                src={productsImage}
                alt="Produits et équipements médicaux professionnels"
                className="w-full h-[400px] object-cover rounded-xl shadow-medical"
              />
            </div>
          </div>
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