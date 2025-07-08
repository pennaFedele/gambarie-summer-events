import { Heart, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from "./LanguageToggle";

export const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-foreground">I</span>
            <Heart className="w-6 h-6 text-accent fill-current" />
            <span className="text-2xl font-bold text-foreground">Gambarie</span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm">
                {t('header.events')}
              </Button>
            </Link>
            <Link to="/activities">
              <Button variant={location.pathname === "/activities" ? "default" : "ghost"} size="sm">
                {t('header.activities')}
              </Button>
            </Link>
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};