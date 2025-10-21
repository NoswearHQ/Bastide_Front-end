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
import NotFound from "./pages/NotFound";
import Articles from "./pages/dashboard/ArticlesDashboard";
// 🔒 import des nouveaux éléments
import PrivateRoute from "@/components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import ProduitsDashboard from "./pages/dashboard/ProduitsDashboard";
import AjouterProduit from "./pages/dashboard/AjouterProduit";
import ModifierProduit from "./pages/dashboard/ModifierProduit";

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
      <Articles />
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
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
