import { useEffect, useState } from "react";
import { Heart, Brain, Eye, Baby, Bone, Activity, Plus, Minus, Clock, CheckCircle, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { MedicalButton } from "@/components/ui/medical-button";

const services = [
  {
    icon: Heart,
    title: "Cardiologie",
    description: "Consultation, échographie cardiaque, ECG, épreuve d'effort et suivi des pathologies cardiovasculaires.",
    duration: "45 min",
    price: "à partir de 80€",
    color: "bg-red-100 text-red-600",
    features: ["Consultation spécialisée", "Échographie Doppler", "ECG et Holter", "Épreuve d'effort"],
  },
  {
    icon: Brain,
    title: "Neurologie",
    description: "Diagnostic et traitement des troubles neurologiques, épilepsie, migraines et maladies neurodégénératives.",
    duration: "50 min",
    price: "à partir de 90€",
    color: "bg-purple-100 text-purple-600",
    features: ["Consultation neurologique", "EEG", "EMG", "Suivi post-AVC"],
  },
  {
    icon: Eye,
    title: "Ophtalmologie",
    description: "Examens de vue, dépistage glaucome, chirurgie de la cataracte et suivi des pathologies oculaires.",
    duration: "30 min",
    price: "à partir de 70€",
    color: "bg-blue-100 text-blue-600",
    features: ["Fond d'œil", "Tonométrie", "Champ visuel", "OCT rétinien"],
  },
  {
    icon: Baby,
    title: "Pédiatrie",
    description: "Suivi médical de l'enfant et de l'adolescent, vaccinations, bilan de santé et consultations spécialisées.",
    duration: "30 min",
    price: "à partir de 60€",
    color: "bg-green-100 text-green-600",
    features: ["Consultations pédiatriques", "Vaccinations", "Bilans de santé", "Urgences pédiatriques"],
  },
  {
    icon: Bone,
    title: "Orthopédie",
    description: "Traitement des pathologies osseuses, articulaires et musculaires, chirurgie orthopédique.",
    duration: "40 min",
    price: "à partir de 85€",
    color: "bg-orange-100 text-orange-600",
    features: ["Consultation orthopédique", "Infiltrations", "Chirurgie ambulatoire", "Rééducation"],
  },
  {
    icon: Activity,
    title: "Pneumologie",
    description: "Diagnostic et traitement des pathologies respiratoires, EFR, sevrage tabagique.",
    duration: "45 min",
    price: "à partir de 75€",
    color: "bg-teal-100 text-teal-600",
    features: ["Spirométrie", "Test allergie", "Sevrage tabagique", "Apnée du sommeil"],
  },
];

const faqs = [
  {
    question: "Comment prendre rendez-vous ?",
    answer: "Vous pouvez prendre rendez-vous en ligne via notre plateforme de réservation, par téléphone au 01 23 45 67 89, ou directement à l'accueil de notre établissement. Nous vous recommandons de réserver à l'avance pour garantir votre créneau préféré.",
  },
  {
    question: "Quels sont les délais de rendez-vous ?",
    answer: "Les délais varient selon la spécialité. Pour une consultation de médecine générale, comptez 2-3 jours. Pour les spécialités, les délais sont généralement de 1 à 3 semaines. En cas d'urgence, nous proposons des créneaux dédiés le jour même.",
  },
  {
    question: "Les consultations sont-elles remboursées ?",
    answer: "Oui, toutes nos consultations sont remboursées par la Sécurité Sociale selon les tarifs conventionnés. Nous pratiquons le tiers-payant pour les patients en ALD. Une mutuelle peut compléter le remboursement selon votre contrat.",
  },
  {
    question: "Que dois-je apporter lors de ma première consultation ?",
    answer: "Merci d'apporter votre carte Vitale, une pièce d'identité, votre carte de mutuelle, vos derniers examens médicaux et la liste de vos traitements en cours. Pour certaines spécialités, une lettre d'adressage de votre médecin traitant peut être nécessaire.",
  },
  {
    question: "Proposez-vous des consultations d'urgence ?",
    answer: "Oui, nous disposons d'un service d'urgence ouvert 24h/24 et 7j/7. Pour les urgences vitales, contactez le 15 (SAMU). Pour les urgences moins graves, vous pouvez nous appeler directement ou vous présenter à notre service d'accueil des urgences.",
  },
  {
    question: "Est-il possible d'annuler ou reporter un rendez-vous ?",
    answer: "Oui, vous pouvez annuler ou reporter votre rendez-vous jusqu'à 24h avant la consultation. Au-delà, des frais d'annulation peuvent s'appliquer. Vous pouvez gérer vos rendez-vous en ligne ou nous contacter directement.",
  },
];

const emergencyServices = [
  {
    title: "Urgences 24h/24",
    description: "Service d'urgence médicale disponible en permanence",
    phone: "01 23 45 67 89",
  },
  {
    title: "SOS Médecins",
    description: "Consultations à domicile en urgence",
    phone: "01 23 45 67 90",
  },
  {
    title: "Centre antipoison",
    description: "Conseils en cas d'intoxication",
    phone: "01 40 05 48 48",
  },
];

export default function Services() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Services" }
            ]} 
          />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Nos services médicaux
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Une gamme complète de spécialités médicales avec une équipe de praticiens 
              expérimentés pour prendre soin de votre santé à chaque étape de votre vie.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="medical-section">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Spécialités médicales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos équipes pluridisciplinaires vous accompagnent avec expertise et bienveillance
            </p>
          </div>

          <div className="medical-grid medical-grid--3">
            {services.map((service, index) => (
              <MedicalCard key={index}>
                <MedicalCard.Content>
                  <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  
                  <MedicalCard.Title>{service.title}</MedicalCard.Title>
                  
                  <MedicalCard.Description>
                    {service.description}
                  </MedicalCard.Description>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </span>
                      <span className="font-semibold text-medical-primary">
                        {service.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Prestations :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.features.slice(0, 2).map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-medical-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <MedicalButton variant="primary" className="w-full">
                      Prendre rendez-vous
                    </MedicalButton>
                  </div>
                </MedicalCard.Content>
              </MedicalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="medical-section bg-gray-50">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services d'urgence
            </h2>
            <p className="text-xl text-gray-600">
              En cas d'urgence médicale, nos équipes sont disponibles 24h/24
            </p>
          </div>

          <div className="medical-grid medical-grid--3">
            {emergencyServices.map((emergency, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {emergency.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {emergency.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-medical-accent" />
                  <span className="text-lg font-semibold text-medical-accent">
                    {emergency.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg max-w-3xl mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800">
                    Urgence vitale
                  </h3>
                  <p className="text-red-700">
                    En cas d'urgence vitale, composez le <strong>15 (SAMU)</strong> ou le <strong>112</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="medical-section">
        <div className="medical-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions les plus courantes
            </p>
          </div>

          <div className="medical-accordion max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="medical-accordion-item">
                <button
                  className="medical-accordion-trigger"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="medical-accordion-content">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="medical-section bg-medical-primary text-white">
        <div className="medical-container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Besoin d'un rendez-vous ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Notre équipe est à votre disposition pour vous orienter vers le spécialiste adapté
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MedicalButton 
              variant="accent" 
              size="lg"
              className="bg-white text-medical-primary hover:bg-gray-100"
            >
              <Phone className="mr-2 h-5 w-5" />
              01 23 45 67 89
            </MedicalButton>
            <MedicalButton 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-medical-primary"
            >
              Réserver en ligne
            </MedicalButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}