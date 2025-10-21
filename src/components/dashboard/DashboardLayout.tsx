import { NavLink, Outlet } from "react-router-dom";
import { FileText, Package, FolderTree, LogOut } from "lucide-react"; // ✅ ajout de FolderTree
import { useAuth } from "@/context/AuthContext";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Espace Admin</h1>
        </div>

        <nav className="mt-6 flex flex-col space-y-1">
          <NavLink
            to="/dashboard/articles"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center space-x-2 hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Gérer Articles</span>
          </NavLink>

          <NavLink
            to="/dashboard/produits"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center space-x-2 hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <Package className="h-5 w-5 text-gray-600" />
            <span>Gérer Produits</span>
          </NavLink>

          {/* ✅ Nouveau lien pour les catégories */}
          <NavLink
            to="/dashboard/categories"
            className={({ isActive }) =>
              `px-6 py-3 flex items-center space-x-2 hover:bg-gray-100 ${
                isActive ? "bg-gray-200 font-semibold" : ""
              }`
            }
          >
            <FolderTree className="h-5 w-5 text-gray-600" />
            <span>Gérer Catégories</span>
          </NavLink>

          <button
            onClick={logout}
            className="mt-auto text-left px-6 py-3 flex items-center space-x-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
}
