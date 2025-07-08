# Configurazione Cloudflare Turnstile

## ⚠️ Risoluzione Errore "invalid-input-response"

Se ottieni l'errore `captcha protection: request disallowed (invalid-input-response)`, significa che Supabase ha la protezione CAPTCHA abilitata ma non è configurata correttamente.

### Soluzioni:

#### Opzione A: Configurare CAPTCHA per il testing
**✅ CAPTCHA RIATTIVATO**
- Nel file `src/pages/Auth.tsx`, la variabile `CAPTCHA_ENABLED` è ora controllata da `VITE_CAPTCHA_ENABLED`
- Default: CAPTCHA abilitato per produzione
- I componenti Turnstile vengono renderizzati quando abilitato
- Token CAPTCHA viene inviato a Supabase solo quando disponibile

#### Opzione B: Disabilitare CAPTCHA in Supabase
1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Seleziona il tuo progetto
3. Vai su "Settings" > "Security" 
4. Trova "CAPTCHA Protection" e **disabilitala**
5. Salva le modifiche

#### Opzione C: Configurare correttamente Turnstile
1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Crea un nuovo sito Turnstile per `localhost` (sviluppo)
3. Usa il **Secret Key** reale in Supabase
4. Usa il **Site Key** reale nel file `.env.local`
5. Imposta `CAPTCHA_ENABLED = true` in `src/pages/Auth.tsx`

## Passi per configurare Turnstile

### 1. Configurazione Cloudflare
1. Vai su [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Seleziona "Turnstile" dal menu laterale
3. Clicca "Add Site"
4. Inserisci il tuo dominio (per sviluppo locale, usa `localhost`)
5. Copia il **Site Key** e il **Secret Key**

### 2. Configurazione delle Variabili d'Ambiente
1. Crea un file `.env.local` nella root del progetto
2. Aggiungi la seguente variabile:
```
VITE_TURNSTILE_SITE_KEY=your-actual-site-key-here
```

### 3. Configurazione Supabase
1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Seleziona il tuo progetto
3. Vai su "Settings" > "Security"
4. Trova la sezione "CAPTCHA Protection"
5. Abilita "Enable CAPTCHA protection"
6. Inserisci il **Secret Key** di Turnstile
7. Salva le modifiche

### 4. Chiavi di Test
Per testing e sviluppo, puoi usare queste chiavi:
- **Site Key (sempre passa)**: `1x00000000000000000000AA`
- **Site Key (sempre fallisce)**: `2x00000000000000000000AB`
- **Site Key (interattivo)**: `3x00000000000000000000FF`

### 5. Caratteristiche Implementate
- ✅ CAPTCHA su login
- ✅ CAPTCHA su registrazione
- ✅ Validazione lato client
- ✅ Gestione errori
- ✅ Reset automatico del token su errore
- ✅ Disabilitazione pulsanti finché CAPTCHA non è completato

### 6. Sicurezza
- Il token CAPTCHA viene validato sia lato client che lato server
- I token scadono automaticamente e richiedono nuova verifica
- In caso di errore, il token viene resettato per sicurezza
- Supabase valida il token con il secret key prima di processare l'autenticazione

### 7. Testing
1. Usa il site key di test per sviluppo
2. Testa sia il flusso di login che di registrazione
3. Verifica che i pulsanti siano disabilitati senza CAPTCHA
4. Testa la gestione degli errori