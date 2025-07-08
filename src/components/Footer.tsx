import { Button } from "@/components/ui/button";
import { Heart, LogIn, LogOut, User, Shield, MapPin, Mail, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Informazioni di base */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-foreground">I</span>
                <Heart className="w-5 h-5 text-accent fill-current" />
                <span className="text-xl font-bold text-foreground">Gambarie</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t('footer.location')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span><a href="mailto:info@operatorigambarie.it" className="text-primary hover:underline transition-colors">info@operatorigambarie.it</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span><a href="tel:+3909651816900" className="text-primary hover:underline transition-colors">+39 0965 1816900</a></span>
              </div>
            </div>
          </div>

          {/* Crediti */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.credits')}</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                {t('footer.creditsText')}{" "}
                <a 
                  href="https://www.linkedin.com/in/fedele-penna/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-primary transition-colors underline"
                >
                  Fedele
                </a>
                .
              </p>
              <p>
                {t('footer.contributionText')}
              </p>
              <p className="mt-3">
                {t('footer.supportText')}
              </p>
              <div className="mt-2">
                <Link to="https://www.buymeacoffee.com/fedele">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Buy me a coffee
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Area Auth */}
          <div className="space-y-4">
          <h3 className="font-semibold text-foreground">{t('footer.otherLinks')}</h3>
          <div className="flex flex-col gap-3">
            <Link to="/archive">
              <Button variant="outline" size="sm" className="w-full justify-start">
                {t('footer.archive')}
              </Button>
            </Link>
          </div>
            <h3 className="font-semibold text-foreground">{t('footer.access')}</h3>
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        {t('footer.adminDashboard')}
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('footer.logout')}
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('footer.loginAsAdmin')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 mt-8 text-center text-sm text-muted-foreground">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};