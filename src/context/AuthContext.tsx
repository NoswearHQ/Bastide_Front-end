import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiLogout } from "@/lib/api";

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

  const logout = () => {
    apiLogout();
    setIsAuthenticated(false);
  };

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
