import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Actualités", href: "/actualites" },
  { name: "Engagements", href: "/engagements" },
  { name: "Produits", href: "/produits" },
  { name: "Catalogue", href: "/catalogue" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="medical-header">
      <div className="medical-container">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo/4fb979dc-acd1-4835-979f-7e6a108c6882.png" 
                alt="Bastide - Le confort médical" 
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-lg text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium px-4 py-3",
                  location.pathname === item.href && "text-medical-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu mobile"
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white py-4">
            <nav className="space-y-2" aria-label="Navigation mobile">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-4 py-4 text-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium",
                    location.pathname === item.href && "text-medical-primary bg-gray-50 font-semibold"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}