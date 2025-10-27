import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoriesDashboard from "./pages/dashboard/CategoriesDashboard";

import Home from "./pages/Home";
import Actualites from "./pages/Actualites";
import Engagements from "./pages/Engagements";
import Produits from "./pages/Produits";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import LocationMaterielMedical from "./pages/LocationMaterielMedical";
import CatalogueCalameo from "./pages/CatalogueCalameo";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ConditionsUtilisation from "./pages/ConditionsUtilisation";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import Articles from "./pages/dashboard/ArticlesDashboard";
// 🔒 import des nouveaux éléments
import PrivateRoute from "@/components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import ProduitsDashboard from "./pages/dashboard/ProduitsDashboard";
import AjouterProduit from "./pages/dashboard/AjouterProduit";
import ModifierProduit from "./pages/dashboard/ModifierProduit";
import ArticlesAdmin from "./pages/dashboard/ArticlesAdmin";
import ArticleCreate from "./pages/dashboard/ArticleCreate";
import ArticleEdit from "./pages/dashboard/ArticleEdit";
import ArticleDetail from "./pages/ArticleDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/engagements" element={<Engagements />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/location-materiel" element={<LocationMaterielMedical />} />
          <Route path="/catalogue" element={<CatalogueCalameo />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/dashboard/articles"
  element={
    <PrivateRoute>
      <ArticlesAdmin />
    </PrivateRoute>
  }
/>

<Route
  path="/dashboard/produits"
  element={
    <PrivateRoute>
      <ProduitsDashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard/produits/ajouter"
  element={
    <PrivateRoute>
      <AjouterProduit />
    </PrivateRoute>
  }
/>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Page protégée */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
<Route
  path="/dashboard/categories"
  element={
    <PrivateRoute>
      <CategoriesDashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard/produits/modifier/:id"
  element={
    <PrivateRoute>
      <ModifierProduit />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard/articles"
  element={
    <PrivateRoute>
      <ArticlesAdmin />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard/articles/create"
  element={
    <PrivateRoute>
      <ArticleCreate />
    </PrivateRoute>
  }
/>
<Route
  path="/dashboard/articles/edit/:id"
  element={
    <PrivateRoute>
      <ArticleEdit />
    </PrivateRoute>
  }
/>
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
