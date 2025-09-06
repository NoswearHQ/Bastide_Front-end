import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalButton } from "@/components/ui/medical-button";

const contactInfo = {
  address: {
    street: "123 Avenue de la Santé",
    city: "75016 Paris",
    country: "France",
  },
  phone: "01 23 45 67 89",
  email: "contact@medicalcare.fr",
  emergency: "01 23 45 67 80",
  hours: {
    weekdays: "Lundi - Vendredi : 8h00 - 19h00",
    saturday: "Samedi : 9h00 - 17h00",
    sunday: "Dimanche : Urgences uniquement",
    emergency: "Urgences : 24h/24 - 7j/7",
  },
};

const departments = [
  "Cardiologie",
  "Neurologie", 
  "Ophtalmologie",
  "Pédiatrie",
  "Orthopédie",
  "Pneumologie",
  "Urgences",
  "Autre",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    message: "",
    urgent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        department: "",
        message: "",
        urgent: false,
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="medical-container">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Message envoyé avec succès !
              </h1>
              <p className="text-gray-600 mb-6">
                Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
              </p>
              <MedicalButton variant="primary">
                Retour à l'accueil
              </MedicalButton>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb 
            items={[
              { label: "Contact" }
            ]} 
          />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Notre équipe est à votre disposition pour répondre à vos questions 
              et vous accompagner dans vos démarches de santé.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="medical-section">
        <div className="medical-container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <label htmlFor="firstName" className="medical-form-label">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="medical-form-input"
                      required
                    />
                  </div>
                  <div className="medical-form-group">
                    <label htmlFor="lastName" className="medical-form-label">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="medical-form-input"
                      required
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <label htmlFor="email" className="medical-form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="medical-form-input"
                      required
                    />
                  </div>
                  <div className="medical-form-group">
                    <label htmlFor="phone" className="medical-form-label">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="medical-form-input"
                    />
                  </div>
                </div>

                {/* Subject and Department */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="medical-form-group">
                    <label htmlFor="subject" className="medical-form-label">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="medical-form-input"
                      placeholder="Objet de votre message"
                      required
                    />
                  </div>
                  <div className="medical-form-group">
                    <label htmlFor="department" className="medical-form-label">
                      Service concerné
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="medical-form-select"
                    >
                      <option value="">Sélectionner un service</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="medical-form-group">
                  <label htmlFor="message" className="medical-form-label">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="medical-form-textarea"
                    placeholder="Décrivez votre demande..."
                    required
                  />
                </div>

                {/* Urgent Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="urgent"
                    name="urgent"
                    checked={formData.urgent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-medical-primary border-gray-300 rounded focus:ring-medical-primary"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">
                    Demande urgente (réponse sous 24h)
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <MedicalButton type="submit" variant="primary" size="lg" className="w-full">
                    <Send className="mr-2 h-5 w-5" />
                    Envoyer le message
                  </MedicalButton>
                  <p className="text-sm text-gray-500 mt-2">
                    * Champs obligatoires
                  </p>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h2>

              {/* Address */}
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
                    <p className="text-gray-600">
                      {contactInfo.address.street}<br />
                      {contactInfo.address.city}<br />
                      {contactInfo.address.country}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                    <p className="text-gray-600">
                      Standard : {contactInfo.phone}<br />
                      Urgences : {contactInfo.emergency}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">{contactInfo.email}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-medical-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Horaires</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>{contactInfo.hours.weekdays}</p>
                      <p>{contactInfo.hours.saturday}</p>
                      <p>{contactInfo.hours.sunday}</p>
                      <p className="font-medium text-medical-accent">
                        {contactInfo.hours.emergency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan d'accès</h3>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Carte interactive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="medical-section bg-red-50 border-l-4 border-red-400">
        <div className="medical-container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-red-800 mb-4">
              Urgence médicale
            </h2>
            <p className="text-lg text-red-700 mb-6">
              En cas d'urgence vitale, ne passez pas par ce formulaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 mb-1">SAMU</p>
                <p className="text-2xl font-bold text-red-600">15</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 mb-1">Urgences européennes</p>
                <p className="text-2xl font-bold text-red-600">112</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 mb-1">Notre service d'urgence</p>
                <p className="text-2xl font-bold text-red-600">{contactInfo.emergency}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}