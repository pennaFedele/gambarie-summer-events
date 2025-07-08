import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminBootstrap = () => {
  const [email, setEmail] = useState('');
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  const handleAssignFirstAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci un indirizzo email valido.',
        variant: 'destructive',
      });
      return;
    }

    setAssigning(true);
    try {
      // First check if user exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email.trim())
        .maybeSingle();

      if (!profile) {
        throw new Error('Utente non trovato. L\'utente deve prima registrarsi.');
      }

      // Check if user is already admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('role', 'admin')
        .maybeSingle();

      if (existingRole) {
        toast({
          title: 'Utente già admin',
          description: 'Questo utente è già un amministratore.',
        });
        // Reload to check admin status
        window.location.reload();
        return;
      }

      const { data, error } = await supabase.rpc('assign_first_admin', {
        user_email: email.trim()
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Successo',
        description: 'Primo admin assegnato con successo.',
      });
      
      // Refresh the page to update admin status
      window.location.reload();
    } catch (error: any) {
      console.error('Error assigning first admin:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Errore durante l\'assegnazione del ruolo admin.',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-600" />
          Configurazione Iniziale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Nessun amministratore configurato. Assegna il primo ruolo admin per accedere al pannello di amministrazione.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email dell'amministratore</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={assigning}
          />
          <p className="text-xs text-muted-foreground">
            L'utente deve essere già registrato nell'applicazione.
          </p>
        </div>

        <Button
          onClick={handleAssignFirstAdmin}
          disabled={!email.trim() || assigning}
          className="w-full"
        >
          {assigning ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
              Assegnazione in corso...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Assegna Primo Admin
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};