import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MedicalButton } from "@/components/ui/medical-button";
import { MedicalCard } from "@/components/ui/MedicalCard";
import { safeProductImage } from "@/lib/images";
import Layout from "@/components/layout/Layout";
import { useEffect, useMemo, useState } from "react";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";
import CategoryPillarsDynamic from "@/components/catalog/CategoryPillarsDynamic";
import Seo from "@/components/Seo";
import ProductSearchBar from "@/components/search/ProductSearchBar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { rememberScrollPosition } from "@/lib/scroll";

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
    name: "Client",
    role: "Acheteur",
    content: "السلام عليكم وصلتني الcommande يعطيكم الف صحة وفررررحة ❤️ و livreur ياسر متربي ويرحم والديكم و و والديه très organisé en plus ponctuel  وأن شاء الله نزيد نتعامل معاكم وحكيت عليكم للfamille باش يدخلو",
    rating: 5,
  },
  {
    name: "Client",
    role: "Acheteur",
    content: "Bonjour Manel merci sincèrement pour votre professionnalisme. Merci encore",
    rating: 5,
  },
  {
    name: "Client",
    role: "Acheteur",
    content: "Merci beaucoup ❤️❤️❤️ pour votre gentillesse je vous souhaite une excellente journée ❤️❤️",
    rating: 5,
  },
  {
    name: "Client",
    role: "Acheteur",
    content: "je voulais vous remercier pour tout ce que vous avez fait . impeccable 👌",
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
  const [highlightProducts, setHighlightProducts] = useState<Product[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [highlightError, setHighlightError] = useState<string | null>(null);
  const [logoApi, setLogoApi] = useState<CarouselApi | null>(null);
  const [isLogoPaused, setIsLogoPaused] = useState(false);

  const partnerLogos = useMemo(
    () => [
      { src: "/logo/veinax.jpg", name: "Veinax" },
      { src: "/logo/logo-aircast.jpg", name: "Aircast" },
      { src: "/logo/logoclientdjoglobal.jpg", name: "DJO Global" },
      { src: "/logo/292.jpg", name: "292" },
      { src: "/logo/invacare.jpg", name: "Invacare" },
      { src: "/logo/herderegen.jpg", name: "Herder" },
      { src: "/logo/meditec.webp", name: "Meditec" },
      { src: "/logo/pharmaouest.png", name: "Pharmaouest" },
      { src: "/logo/dentites.png", name: "Dentites" },
      { src: "/logo/wincare.png", name: "Wincare" },
      { src: "/logo/dodo.svg", name: "Dodo" },
    ],
    [],
  );

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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { rows } = await getProducts({ limit: 36 });
        if (!isMounted) return;
        const list = (rows as Product[]) || [];
        const shuffled = [...list];
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setHighlightProducts(shuffled.slice(0, 6));
      } catch (error) {
        if (isMounted) {
          setHighlightError("Impossible de charger les produits pour le moment.");
        }
      } finally {
        if (isMounted) {
          setLoadingHighlights(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!logoApi) return undefined;

    const autoplay = window.setInterval(() => {
      if (!isLogoPaused) {
        logoApi.scrollNext();
      }
    }, 3500);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [logoApi, isLogoPaused]);

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
    <Seo
      title="Bastide Tunisie — Matériel & confort médical"
      description="Vente et location de matériel médical. Maintien à domicile, mobilité, incontinence, équipements de santé en Tunisie."
      canonical="https://bastide.tn/"
      image={safeProductImage("images/bastidelogo.png")}
      type="website"
    />
    <div>
      {/* Product Search Bar Section */}
      <section className="pt-12 pb-6 bg-white border-b border-gray-200">
        <div className="medical-container">
          <ProductSearchBar />
        </div>
      </section>

      {/* Hero Section - Bastide Le Confort Médical */}
      <section className="medical-hero bg-white">
  <div className="medical-container relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Bastide Le Confort Médical,{" "}
          <span className="text-gradient-primary">1er réseau de matériel médical en Tunisie</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Spécialisée dans la vente et la location de matériel médical, Bastide Le Confort Médical
          accompagne particuliers et professionnels pour favoriser l'autonomie, la mobilité et
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
        <picture>
          <source srcSet={safeProductImage("images/hero-medical1.webp")} type="image/webp" />
          <img
            src={safeProductImage("images/hero-medical1.jpg")}
            alt="Établissement médical moderne avec équipe soignante"
            width={752}
            height={500}
            className="w-full h-[500px] object-cover rounded-2xl shadow-medical-xl"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </div>
  </div>
</section>

      {/* Highlighted Products - Nos sélections du moment */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="medical-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="uppercase text-sm font-semibold tracking-wide text-medical-primary mb-3">
              Nos sélections du moment
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Découvrez nos produits phares</h2>
            <p className="text-lg text-gray-600">
              Une sélection renouvelée régulièrement pour vous inspirer et faciliter votre choix de matériel médical.
            </p>
          </div>

          {highlightError && (
            <div className="text-center text-red-600 font-medium mb-8">{highlightError}</div>
          )}

          {loadingHighlights ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="h-40 rounded-xl bg-gray-200 mb-6" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 mb-3" />
                  <div className="h-4 w-1/2 rounded bg-gray-200 mb-6" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-10 w-28 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : highlightProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlightProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex items-center justify-center bg-white p-6">
                    <img
                      src={safeProductImage(product.image_miniature)}
                      alt={product.titre}
                      loading="lazy"
                      className="h-48 w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-medical-primary/20" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.titre}</h3>
                      {product.reference && (
                        <p className="text-sm text-gray-500 mt-1">Réf : {product.reference}</p>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-medical-primary">
                        {product.prix ? `${product.prix} DT` : "Prix sur demande"}
                      </span>
                      <MedicalButton variant="outline" size="sm" asChild>
                        <Link
                          to={`/produit/${product.id}-${product.slug || product.titre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                        >
                          Découvrir
                        </Link>
                      </MedicalButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">Aucun produit à afficher pour le moment.</div>
          )}
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-white">
        <div className="medical-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="uppercase text-sm font-semibold tracking-wide text-medical-primary mb-2">
                Ils nous font confiance
              </p>
              <h2 className="text-3xl font-bold text-gray-900">Nos partenaires</h2>
            </div>
            <p className="text-gray-500 max-w-2xl">
              Des marques reconnues du secteur médical nous accompagnent pour garantir des solutions fiables et innovantes.
            </p>
          </div>
          <div
            onMouseEnter={() => setIsLogoPaused(true)}
            onMouseLeave={() => setIsLogoPaused(false)}
            className="relative"
          >
            <Carousel
              setApi={setLogoApi}
              opts={{ align: "start", loop: true, skipSnaps: false }}
              className="px-4"
            >
              <CarouselContent className="-ml-4">
                {partnerLogos.map((logo) => (
                  <CarouselItem
                    key={logo.src}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4"
                  >
                    <div className="group flex h-32 items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm transition duration-300 hover:shadow-lg">
                      <img
                        src={logo.src}
                        alt={logo.name}
                        loading="lazy"
                        className="max-h-16 w-full object-contain transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white" />
              <CarouselNext className="hidden md:flex -right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white" />
            </Carousel>
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
<section className="py-16 bg-white">
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
      <section className="py-20 bg-white">
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
          src={safeProductImage("images/s1.webp")}
          alt="Location de matériel médical"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
          width={480}
          height={320}
          loading="lazy"
          decoding="async"
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
          src={safeProductImage("images/s2.webp")}
          alt="Maintien à domicile"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
          width={433}
          height={320}
          loading="lazy"
          decoding="async"
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
          src={safeProductImage("images/s3.webp")}
          alt="Réseau Bastide"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
          width={569}
          height={320}
          loading="lazy"
          decoding="async"
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
          src={safeProductImage("images/s4.webp")}
          alt="Service client Bastide"
          className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
          width={480}
          height={320}
          loading="lazy"
          decoding="async"
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
      <section className="medical-section bg-white">
        <div className="medical-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={safeProductImage("images/services-icons.webp")}
                alt="Services médicaux et équipements modernes"
                className="w-full h-[400px] object-cover rounded-xl shadow-medical"
                width={533}
                height={400}
                loading="lazy"
                decoding="async"
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

      {/* Products Section 
     
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
*/}
      {/* Testimonials Section */}
      <section className="medical-section bg-white">
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