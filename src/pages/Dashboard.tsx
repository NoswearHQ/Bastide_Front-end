import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Package, FolderTree } from "lucide-react"; // ✅ ajout de l’icône

export default function Dashboard() {
  return (
    <DashboardLayout>
      <section className="text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur le tableau de bord</h1>
        <p className="text-gray-600">Sélectionnez un module à gérer ci-dessous :</p>

        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto"> {/* ✅ 3 colonnes maintenant */}
          <Link
            to="/dashboard/articles"
            className="p-8 bg-white shadow rounded-xl hover:shadow-md transition flex flex-col items-center"
          >
            <FileText className="h-10 w-10 text-medical-primary mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Gérer les Articles</h2>
            <p className="text-gray-500 text-sm mt-2">
              Créer, modifier, supprimer ou afficher vos articles.
            </p>
          </Link>

          <Link
            to="/dashboard/produits"
            className="p-8 bg-white shadow rounded-xl hover:shadow-md transition flex flex-col items-center"
          >
            <Package className="h-10 w-10 text-medical-primary mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Gérer les Produits</h2>
            <p className="text-gray-500 text-sm mt-2">
              Ajouter, modifier, supprimer un produit ou gérer les catégories.
            </p>
          </Link>

          <Link
            to="/dashboard/categories" // ✅ nouvelle route
            className="p-8 bg-white shadow rounded-xl hover:shadow-md transition flex flex-col items-center"
          >
            <FolderTree className="h-10 w-10 text-medical-primary mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Gérer les Catégories</h2>
            <p className="text-gray-500 text-sm mt-2">
              Créer, renommer ou supprimer des catégories de produits.
            </p>
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
}
