// Mock data per eventi - sarà sostituito da Supabase

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  externalLink?: string;
  isPast?: boolean;
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Concerto sotto le stelle",
    description: "Una serata magica con musica dal vivo circondata dalle montagne di Gambarie. Artisti locali e nazionali si esibiranno in un'atmosfera unica.",
    organizer: "Associazione Musicale Gambarie",
    date: "2024-07-15",
    time: "21:00",
    location: "Piazza Centrale Gambarie",
    category: "musica",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
    externalLink: "https://gambarie-eventi.it/concerto"
  },
  {
    id: "2", 
    title: "Trekking al Monte Saccarello",
    description: "Escursione guidata al punto più alto della Liguria. Un'esperienza indimenticabile per gli amanti della natura e del trekking.",
    organizer: "Guide Alpine Gambarie",
    date: "2024-07-20",
    time: "08:30",
    location: "Rifugio Pian dei Corsi",
    category: "natura",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",
    externalLink: "https://gambarie-trekking.it"
  },
  {
    id: "3",
    title: "Festival Gastronomico della Focaccia",
    description: "Degustazione delle migliori focacce liguri preparate dai maestri panettieri locali. Un viaggio nei sapori autentici della tradizione.",
    organizer: "Pro Loco Gambarie",
    date: "2024-07-25",
    time: "18:00",
    location: "Via del Centro",
    category: "gastronomia",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Torneo di Beach Volley",
    description: "Competizione sportiva aperta a tutti. Registrazione squadre entro il 22 luglio. Premi per i primi tre classificati.",
    organizer: "ASD Gambarie Sport",
    date: "2024-07-28",
    time: "16:00",
    location: "Campo Sportivo Gambarie",
    category: "sport",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "Esposizione Arte Contemporanea Aspromonte",
    description: "Mostra collettiva di artisti calabresi che reinterpretano i paesaggi dell'Aspromonte attraverso l'arte contemporanea.",
    organizer: "Galleria d'Arte Regionale",
    date: "2024-07-30",
    time: "15:30",
    location: "Palazzo Comunale, Gambarie",
    category: "arte"
  },
  
  // Eventi passati per l'archivio
  {
    id: "6",
    title: "Mostra Fotografica - Gambarie d'Altri Tempi",
    description: "Retrospettiva fotografica sulla storia di Gambarie attraverso immagini d'epoca e testimonianze dei residenti.",
    organizer: "Circolo Fotografico Liguria",
    date: "2024-06-15",
    time: "10:00",
    location: "Palazzo Comunale",
    category: "cultura",
    isPast: true,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop"
  },
  {
    id: "7",
    title: "Visita Guidata Siti Storici Aspromonte",
    description: "Scoperta dei luoghi storici più significativi di Santo Stefano in Aspromonte e delle antiche tradizioni locali.",
    organizer: "Pro Loco Santo Stefano",
    date: "2024-06-24",
    time: "19:00",
    location: "Centro Storico, Gambarie",
    category: "storia",
    isPast: true
  },
  {
    id: "8",
    title: "Presentazione Libro - Storie di Montagna",
    description: "L'autore locale Marco Rossi presenta il suo nuovo romanzo ambientato tra le vette liguri.",
    organizer: "Libreria del Borgo",
    date: "2024-06-10",
    time: "17:30",
    location: "Biblioteca Comunale",
    category: "cultura",
    isPast: true
  }
];