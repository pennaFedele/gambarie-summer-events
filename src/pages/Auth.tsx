import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { AdminBootstrap } from '@/components/admin/AdminBootstrap';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [signInCaptchaToken, setSignInCaptchaToken] = useState<string | null>(null);
  const [signUpCaptchaToken, setSignUpCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAnyAdmin, loading: adminCheckLoading } = useAdminCheck();

  // Turnstile site key - replace with your actual site key
  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
  
  // Control CAPTCHA via environment variable or default to true for production
  const CAPTCHA_ENABLED = import.meta.env.VITE_CAPTCHA_ENABLED !== 'false';

  // Reset CAPTCHA tokens when switching tabs
  const handleTabChange = (value: string) => {
    if (value === 'login') {
      setSignUpCaptchaToken(null);
    } else if (value === 'signup') {
      setSignInCaptchaToken(null);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Show bootstrap only if user is authenticated and no admin exists
    if (!adminCheckLoading && hasAnyAdmin === false && user) {
      setShowBootstrap(true);
    } else if (user || adminCheckLoading) {
      setShowBootstrap(false);
    }
  }, [adminCheckLoading, hasAnyAdmin, user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if CAPTCHA is required but not completed
    if (CAPTCHA_ENABLED && !signInCaptchaToken) {
      toast({
        title: 'CAPTCHA richiesto',
        description: 'Per favore completa la verifica CAPTCHA prima di continuare.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const authOptions: {
        captchaToken?: string;
      } = {};
      
      // Include captchaToken if CAPTCHA is enabled and we have a valid token
      if (CAPTCHA_ENABLED && signInCaptchaToken && signInCaptchaToken.trim() !== '') {
        authOptions.captchaToken = signInCaptchaToken;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        ...(Object.keys(authOptions).length > 0 && { options: authOptions }),
      });

      if (error) throw error;
      
      navigate('/');
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Errore sconosciuto';
      toast({
        title: 'Errore di accesso',
        description: errorMessage,
        variant: 'destructive',
      });
      // Reset captcha token on error
      setSignInCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if CAPTCHA is required but not completed
    if (CAPTCHA_ENABLED && !signUpCaptchaToken) {
      toast({
        title: 'CAPTCHA richiesto',
        description: 'Per favore completa la verifica CAPTCHA prima di continuare.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Errore',
        description: 'Le password non corrispondono',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Errore',
        description: 'La password deve essere di almeno 6 caratteri',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const authOptions: {
        emailRedirectTo: string;
        data: {
          full_name: string;
        };
        captchaToken?: string;
      } = {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      };

      // Include captchaToken if CAPTCHA is enabled and we have a valid token
      if (CAPTCHA_ENABLED && signUpCaptchaToken && signUpCaptchaToken.trim() !== '') {
        authOptions.captchaToken = signUpCaptchaToken;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: authOptions,
      });

      if (error) throw error;

      toast({
        title: 'Registrazione completata',
        description: 'Controlla la tua email per confermare l\'account.',
      });
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Errore sconosciuto';
      toast({
        title: 'Errore di registrazione',
        description: errorMessage,
        variant: 'destructive',
      });
      // Reset captcha token on error
      setSignUpCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla home
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            I<Heart className="inline w-8 h-8 text-red-400 mx-1" />Gambarie
          </h1>
          <p className="text-white/80 text-lg">
            Benvenuto nel portale eventi estivi
          </p>
        </div>

        {showBootstrap ? (
          <AdminBootstrap />
        ) : (
          <Card className="w-full max-w-md backdrop-blur-sm bg-white/95 shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-gray-800">Accesso</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Accedi al tuo account per gestire gli eventi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Accedi</TabsTrigger>
                  <TabsTrigger value="signup">Registrati</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          placeholder="Password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          disabled={isLoading}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Turnstile CAPTCHA for Sign In */}
                    {CAPTCHA_ENABLED && (
                      <div className="flex justify-center">
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={(token) => setSignInCaptchaToken(token)}
                          onError={() => setSignInCaptchaToken(null)}
                          onExpire={() => setSignInCaptchaToken(null)}
                        />
                      </div>
                    )}
                    
                    <Button 
                      disabled={isLoading || (CAPTCHA_ENABLED && !signInCaptchaToken)} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? 'Accesso in corso...' : 'Accedi'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          placeholder="Mario Rossi"
                          type="text"
                          autoCapitalize="words"
                          autoComplete="name"
                          disabled={isLoading}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          placeholder="Password (min 6 caratteri)"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="new-password"
                          disabled={isLoading}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Conferma password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          placeholder="Conferma password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="new-password"
                          disabled={isLoading}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Turnstile CAPTCHA for Sign Up */}
                    {CAPTCHA_ENABLED && (
                      <div className="flex justify-center">
                        <Turnstile
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={(token) => setSignUpCaptchaToken(token)}
                          onError={() => setSignUpCaptchaToken(null)}
                          onExpire={() => setSignUpCaptchaToken(null)}
                        />
                      </div>
                    )}
                    
                    <Button 
                      disabled={isLoading || (CAPTCHA_ENABLED && !signUpCaptchaToken)} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? 'Registrazione in corso...' : 'Registrati'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}