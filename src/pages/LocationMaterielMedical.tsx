import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MessageCircle, Wrench, Lightbulb, Clock, Truck } from "lucide-react";
import { safeProductImage } from "@/lib/images";
import { useEffect } from "react";
const Magasin1Image = safeProductImage("images/s4.png");
const Magasin2Image = safeProductImage("images/boutique2.jpeg");
export default function LocationMateriel() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const magasins = [
    {
      name: "Bastide Centre Urbain Nord",
      address: "Centre Urbain Nord, Tunis",
      whatsapp: "21629380898",
      image: Magasin1Image,
    },
    {
      name: "Bastide L’Aouina",
      address: "Avenue de l’Aouina, Tunis",
      whatsapp: "21629380898",
      image: Magasin2Image,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Location de matériel médical" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Location de matériel médical
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Louez votre matériel médical avec Bastide le Confort Médical Tunisie.
            </p>
          </div>
        </div>
      </section>

      {/* Texte d’introduction */}
      <section className="py-20 bg-gray-50">
        <div className="medical-container grid md:grid-cols-2 gap-12 items-center">
          {/* Texte à gauche */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Louer votre matériel médical avec Bastide le Confort Médical
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Bastide Le Confort Médical vous propose un service complet de location de matériel médical :
              lit médicalisé, fauteuil roulant, matelas à air, verticalisateur ou encore lève-personne.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              Grâce à notre <strong>réseau de 2 magasins en Tunisie</strong>, la location de matériel
              médical est l’assurance d’un accompagnement personnalisé, avec
              <strong> installation rapide à domicile</strong> et suivi adapté à vos besoins.
            </p>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Nos conseillers sont à votre écoute pour vous aider à choisir le matériel adapté à vos besoins.
            </p>
          </div>

          {/* Image à droite */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={safeProductImage("images/LocationImage.jpg")}
              alt="Location de matériel médical"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🏪 Nouvelle section : Nos magasins */}
      <section className="py-20 bg-white border-t">
        <div className="medical-container">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos boutiques Bastide en Tunisie
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
  {magasins.map((magasin, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col"
    >
      {/* Image du magasin */}
      <div className="h-56 w-full overflow-hidden">
        <img
          src={magasin.image}
          alt={`Photo ${magasin.name}`}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col flex-grow p-6 justify-between">
        <div className="text-center sm:text-left mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {magasin.name}
          </h3>
          <p className="text-gray-600">{magasin.address}</p>
        </div>

        {/* Boutons d’action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/${magasin.whatsapp}?text=Bonjour,%20je%20souhaite%20avoir%20des%20informations%20sur%20la%20location%20de%20matériel%20médical.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-medical-primary text-white font-medium py-2 px-6 rounded-full hover:bg-medical-primary/90 transition"
          >
            <MessageCircle className="h-5 w-5" />
            Contacter
          </a>

          {/* Bouton Localiser */}
          <a
            href={
              index === 0
                ? "https://maps.app.goo.gl/QF2faGBzRSJk7nqg8"
                : "https://maps.app.goo.gl/Noj54UvC9Vx4iP6WA"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-medical-primary text-medical-primary font-medium py-2 px-6 rounded-full hover:bg-medical-primary hover:text-white transition"
          >
            📍 Localiser
          </a>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 border-t">
        <div className="medical-container">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos services dans la location de matériel médical :
          </h2>

          {/* Icônes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mb-16">
            <div>
              <div className="flex justify-center mb-3">
                <Wrench className="h-10 w-10 text-medical-primary" />
              </div>
              <h3 className="font-semibold text-medical-primary">
                Installation et formation
              </h3>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Lightbulb className="h-10 w-10 text-medical-primary" />
              </div>
              <h3 className="font-semibold text-medical-primary">
                Le conseil en magasin par nos experts
              </h3>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Clock className="h-10 w-10 text-medical-primary" />
              </div>
              <h3 className="font-semibold text-medical-primary">
                Une astreinte 24h/24 et 7j/7*
              </h3>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Truck className="h-10 w-10 text-medical-primary" />
              </div>
              <h3 className="font-semibold text-medical-primary">
                Une livraison à domicile dans les plus brefs délais
              </h3>
            </div>
          </div>

          {/* Texte + Image côte à côte */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texte à gauche */}
            <div className="text-gray-700 text-lg leading-relaxed space-y-5">
              <p>
                Avec plus de 40 ans de savoir-faire et fort d’un réseau de plus de 160 magasins physiques,
                bénéficiez du <strong>conseil en magasin</strong> pour votre besoin de location de matériel médical.
              </p>
              <p>
                À chaque location, nos agents d’installation vous forment, ainsi que vos proches si besoin,
                à <strong>l’utilisation du matériel loué</strong> conformément aux préconisations recommandées.
              </p>
              <p>
                Nos agents d’installation sont qualifiés et formés pour effectuer ce type de prestations.
                <strong> Ils vous assistent</strong> et vous aident durant <strong>la mise en service</strong> du matériel
                afin de vous permettre d’être autonome au quotidien.
              </p>
              <p>
                La location de matériel médical, c’est <strong>simple, rapide et économique.</strong>
              </p>
              <p>
                Pour répondre au mieux à votre demande de location, nous nous engageons à effectuer
                une <strong>livraison et mise en service à domicile</strong> dans les plus brefs délais.
              </p>
              <p>
                Pour toutes aides ou informations, il vous suffit de nous contacter au{" "}
                <strong>29 380 898</strong> ou de discuter directement avec nos équipes via WhatsApp.
              </p>
            </div>

            {/* Image à droite */}
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img
                src={safeProductImage("images/vieil-homme-dans-une-maison-de-soins-infirmiers-fist-bumping-infirmiere.jpg")}
                alt="Nos agents Bastide Tunisie"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-medical-primary text-white py-16 text-center">
        <div className="medical-container">
          <h2 className="text-4xl font-bold mb-4">
            Besoin d’un conseil ou d’une assistance ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Notre équipe est à votre écoute pour vous aider à choisir le matériel médical le plus adapté à vos besoins.
          </p>
          <a
            href="https://wa.me/21629380898?text=Bonjour,%20je%20souhaite%20avoir%20des%20renseignements%20sur%20la%20location%20de%20matériel%20médical."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-medical-primary font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition"
          >
            Discuter sur WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}
