import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="medical-breadcrumb" aria-label="Fil d'Ariane">
      <Link to="/" className="flex items-center hover:text-medical-primary">
        <Home className="h-4 w-4" />
        <span className="sr-only">Accueil</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 separator mx-2" />
          {item.href && index < items.length - 1 ? (
            <Link to={item.href} className="hover:text-medical-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}