import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const footerNavigation = {
  services: [
    { name: "Consultations", href: "/services" },
    { name: "Examens médicaux", href: "/services" },
    { name: "Prévention", href: "/services" },
    { name: "Urgences", href: "/services" },
  ],
  produits: [
    { name: "Matériel médical", href: "/produits" },
    { name: "Équipements", href: "/produits" },
    { name: "Dispositifs", href: "/produits" },
    { name: "Consommables", href: "/produits" },
  ],
  legal: [
    { name: "Mentions légales", href: "#" },
    { name: "Politique de confidentialité", href: "#" },
    { name: "Conditions d'utilisation", href: "#" },
    { name: "Cookies", href: "#" },
  ],
};

const socialMedia = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/bastide.tn/?locale=fr_FR" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/bastide-le-confort-m%C3%A9dical-tunisie/about/" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/bastidetunisie/?hl=fr" },
];

export default function Footer() {
  return (
    <footer className="medical-footer">
      <div className="medical-container">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
  <div className="flex items-center space-x-2 mb-6">
    <img 
      src="/lovable-uploads/4fb979dc-acd1-4835-979f-7e6a108c6882.png" 
      alt="Bastide Tunisie - Le confort médical" 
      style={{ width: "110px", height: "55px" }}
    />
  </div>

  <div className="space-y-4 text-gray-300">
    {/* Adresse */}
    <div className="flex items-start space-x-3">
      <MapPin className="h-5 w-5 mt-0.5 text-medical-primary flex-shrink-0" />
      <div>
        <p>Centre Urbain Nord, Immeuble Express</p>
        <p>Tunis, Tunisie 1082</p>
      </div>
    </div>

    {/* Téléphone */}
    <div className="flex items-center space-x-3">
      <Phone className="h-5 w-5 text-medical-primary flex-shrink-0" />
      <span>71 947 353</span>
    </div>

    {/* Email */}
    <div className="flex items-center space-x-3">
      <Mail className="h-5 w-5 text-medical-primary flex-shrink-0" />
      <span>contact@bastidemedical.tn</span>
    </div>

    {/* Horaires */}
    <div className="flex items-start space-x-3">
      <Clock className="h-5 w-5 mt-0.5 text-medical-primary flex-shrink-0" />
      <div>
        <p>Lun - Ven : 8h30 - 18h30</p>
        <p>Samedi : 9h - 13h</p>
        <p>Urgences : 24h/24 - 7j/7</p>
      </div>
    </div>

   
  </div>
</div>


            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
              <ul className="space-y-3">
                {footerNavigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Produits */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Produits</h3>
              <ul className="space-y-3">
                {footerNavigation.produits.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Informations légales</h3>
              <ul className="space-y-3 mb-6">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              
              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Suivez-nous</h4>
                <div className="flex space-x-4">
                  {socialMedia.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-medical-primary transition-colors duration-300"
                      aria-label={item.name}
                    >
                      <item.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2024 MedicalCare. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Établissement de santé agréé • FINESS: 123456789
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}