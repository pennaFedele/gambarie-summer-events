import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { initUmami } from './lib/analytics'

// Initialize Umami Analytics if configured
initUmami();

createRoot(document.getElementById("root")!).render(<App />);
