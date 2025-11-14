import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout } from "@/lib/api";
import { toast } from "sonner";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

// Global logout callback for use in non-React contexts (like API layer)
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void) => {
  globalLogoutCallback = callback;
};

export const getGlobalLogoutCallback = (): (() => void) | null => {
  return globalLogoutCallback;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // 🔍 Vérifie le token existant dès le chargement
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await apiLogin(email, password);
    setIsAuthenticated(true);
  };

  const logout = (showMessage = true) => {
    apiLogout();
    setIsAuthenticated(false);
    if (showMessage) {
      toast.error("Votre session a expiré, veuillez vous reconnecter.");
    }
    // Use window.location for redirect to ensure it works in all contexts
    window.location.href = "/login";
  };

  // Register global logout callback
  useEffect(() => {
    setGlobalLogoutCallback(() => {
      apiLogout();
      setIsAuthenticated(false);
      toast.error("Votre session a expiré, veuillez vous reconnecter.");
      window.location.href = "/login";
    });
  }, []);

  if (loading) {
    // Empêche les redirections pendant la vérification initiale
    return <div className="text-center mt-20 text-gray-600">Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
