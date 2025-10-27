import { BookOpen, ExternalLink, Download } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { MedicalButton } from "@/components/ui/medical-button";

export default function CatalogueCalameo() {
  const openCalameoFull = () => {
    window.open('https://www.calameo.com/books/00807232017c36e550159', '_blank');
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/Catalogue 2024 - 2025.pdf';
    link.download = 'Catalogue Bastide 2024-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="medical-container">
          <Breadcrumb items={[{ label: "Catalogue" }]} />
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 flex items-center">
              <BookOpen className="mr-4 h-12 w-12" />
              Catalogue Bastide 2024-2025
            </h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Découvrez notre catalogue complet d&apos;équipements médicaux professionnels.
              Feuilletez notre catalogue interactif en ligne.
            </p>
          </div>
        </div>
      </section>

      {/* Calameo Catalog Viewer */}
      <section className="py-12 bg-gray-50">
        <div className="medical-container">
          <div className="max-w-6xl mx-auto">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Catalogue interactif
                  </h3>
                  <span className="text-sm text-gray-500">
                    Utilisez les contrôles ci-dessous pour naviguer
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MedicalButton
                    variant="outline"
                    onClick={openCalameoFull}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir en plein écran
                  </MedicalButton>
                  
                  <MedicalButton
                    variant="primary"
                    onClick={downloadPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </MedicalButton>
                </div>
              </div>
            </div>

            {/* Calameo Embed */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Catalogue Bastide 2024-2025
                </h3>
                <p className="text-gray-600 text-sm">
                  Naviguez dans le catalogue en utilisant les contrôles intégrés
                </p>
              </div>
              
              <div className="relative">
                {/* Calameo Embed */}
                <div 
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div style={{ margin: '8px 0px 4px' }}>
                    <a 
                      href="https://www.calameo.com/books/00807232017c36e550159" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-medical-primary hover:text-medical-primary/80 font-medium"
                    >
                      Catalogue 2024 2025
                    </a>
                  </div>
                  
                  <iframe 
                    src="//v.calameo.com/?bkcode=00807232017c36e550159&mode=mini" 
                    width="100%" 
                    height="600" 
                    frameBorder="0" 
                    scrolling="no" 
                    allowTransparency 
                    allowFullScreen 
                    style={{ 
                      margin: '0 auto',
                      maxWidth: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    title="Catalogue Bastide 2024-2025"
                  />
                  
                  <div style={{ margin: '4px 0px 8px' }}>
                    <a 
                      href="http://www.calameo.com/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Lire plus de publications sur Calaméo
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Full Screen Option */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <ExternalLink className="h-6 w-6 text-blue-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Version plein écran
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Ouvrez le catalogue dans une fenêtre dédiée pour une expérience optimale.
                </p>
                <MedicalButton
                  variant="outline"
                  onClick={openCalameoFull}
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir sur Calaméo
                </MedicalButton>
              </div>

              {/* Download Option */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Download className="h-6 w-6 text-medical-primary mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Téléchargement
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Téléchargez le catalogue PDF pour une consultation hors ligne.
                </p>
                <MedicalButton
                  variant="primary"
                  onClick={downloadPDF}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le PDF
                </MedicalButton>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    À propos de notre catalogue
                  </h4>
                  <p className="text-blue-700 mb-3">
                    Notre catalogue 2024-2025 présente une sélection complète d&apos;équipements médicaux 
                    de haute qualité, conçus pour répondre aux besoins des professionnels de santé.
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Plus de 1000 références d&apos;équipements</li>
                    <li>• Descriptions détaillées et spécifications techniques</li>
                    <li>• Prix et conditions commerciales</li>
                    <li>• Guide d&apos;utilisation et maintenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
