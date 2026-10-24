import type { Poly } from "./i18n";

export interface HoursEntry {
  weekday: number; // 0=Sun, 1=Mon, ... 6=Sat
  opens: string;   // "HH:MM"
  closes: string;  // "HH:MM"
}

export interface Place {
  id: string;
  name: string;
  type: string;
  cityId: string;
  district: string;
  lat: number;
  lng: number;
  distanceKm: number;
  price: number; // 1-4
  image: string;
  tags: string[];
  description: Poly;
  whyWeRecommend: Poly;
  hours: HoursEntry[];
  vegan: boolean;
  address: string;
  badge?: "LOCAL GEM" | "LOCAL TIP";
  isSample?: boolean;
  theme: "food" | "culture" | "nightlife" | "local" | "outdoor";
  moods: string[];
}

export interface Guide {
  id: string;
  title: Poly;
  intro: Poly;
  category: string;
  image: string;
  placeCount: number;
  placeIds: string[];
  cityId: string;
  theme: "food" | "culture" | "nightlife" | "local" | "outdoor";
  isSample?: boolean;
}

export interface City {
  id: string;
  name: Poly;
  tz: string;
  currency: string;
  pilotAreas: string[];
}

export const cities: City[] = [
  {
    id: "berlin",
    name: { en: "Berlin", de: "Berlin", es: "Berlín" },
    tz: "Europe/Berlin",
    currency: "EUR",
    pilotAreas: ["Neukölln", "Kreuzberg", "Prenzlauer Berg"],
  },
];

export const MOODS = ["Relaxed", "Romantic", "Local", "Creative", "Foodie", "Nightlife", "Nature", "Culture"];
export const OCCASIONS = ["Date", "Solo", "Friends", "Work", "Birthday", "Family"];

export const DIETARY = ["Vegan", "Vegetarian", "Gluten-free", "Halal"];
export const VIBES = ["Quiet", "Lively", "Cozy", "Trendy", "Romantic", "Local"];
export const EXTRAS = ["Outdoor seating", "Dog-friendly", "Kid-friendly", "Reservations"];

export const places: Place[] = [
  {
    id: "cafe-la-esquina",
    name: "Café La Esquina",
    type: "Café",
    cityId: "berlin",
    district: "Neukölln",
    lat: 52.4808,
    lng: 13.4449,
    distanceKm: 1.2,
    price: 2,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    tags: ["Coffee", "Local", "Relaxed"],
    description: {
      en: "A cozy neighborhood café with great coffee, fresh pastries and a relaxed atmosphere.",
      de: "Ein gemütliches Kiez-Café mit tollem Kaffee, frischen Backwaren und entspannter Atmosphäre.",
      es: "Una acogedora cafetería del barrio con gran café, pasteles frescos y ambiente relajado.",
    },
    whyWeRecommend: {
      en: "A small, independent café with a creative crowd and a calm atmosphere. Perfect for slow mornings.",
      de: "Ein kleines, unabhängiges Café mit kreativem Publikum und ruhiger Atmosphäre. Perfekt für langsame Morgen.",
      es: "Una pequeña cafetería independiente con un ambiente creativo y tranquilo. Perfecta para mañanas lentas.",
    },
    hours: [
      { weekday: 1, opens: "08:00", closes: "16:00" },
      { weekday: 2, opens: "08:00", closes: "16:00" },
      { weekday: 3, opens: "08:00", closes: "16:00" },
      { weekday: 4, opens: "08:00", closes: "16:00" },
      { weekday: 5, opens: "08:00", closes: "16:00" },
      { weekday: 6, opens: "09:00", closes: "17:00" },
      { weekday: 0, opens: "09:00", closes: "15:00" },
    ],
    vegan: true,
    address: "Weserstraße 42, 12045 Berlin",
    badge: "LOCAL GEM",
    isSample: true,
    theme: "food",
    moods: ["Relaxed", "Local", "Creative"],
  },
  {
    id: "bar-el-vecino",
    name: "Bar El Vecino",
    type: "Bar",
    cityId: "berlin",
    district: "Kreuzberg",
    lat: 52.4987,
    lng: 13.4196,
    distanceKm: 1.8,
    price: 2,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
    tags: ["Cocktails", "Nightlife", "Local"],
    description: {
      en: "A relaxed neighborhood bar with handcrafted cocktails and a warm atmosphere.",
      de: "Eine entspannte Kiez-Bar mit handgefertigten Cocktails und warmer Atmosphäre.",
      es: "Un bar de barrio relajado con cócteles artesanales y un ambiente cálido.",
    },
    whyWeRecommend: {
      en: "The best bar in the neighborhood for a spontaneous evening. No tourist crowds, real regulars.",
      de: "Die beste Bar im Kiez für einen spontanen Abend. Keine Touristen, echte Stammgäste.",
      es: "El mejor bar del barrio para una noche espontánea. Sin turistas, clientes habituales de verdad.",
    },
    hours: [
      { weekday: 1, opens: "18:00", closes: "02:00" },
      { weekday: 2, opens: "18:00", closes: "02:00" },
      { weekday: 3, opens: "18:00", closes: "02:00" },
      { weekday: 4, opens: "18:00", closes: "03:00" },
      { weekday: 5, opens: "18:00", closes: "04:00" },
      { weekday: 6, opens: "18:00", closes: "04:00" },
      { weekday: 0, opens: "18:00", closes: "02:00" },
    ],
    vegan: false,
    address: "Oranienstraße 15, 10999 Berlin",
    badge: "LOCAL TIP",
    isSample: true,
    theme: "nightlife",
    moods: ["Nightlife", "Local", "Romantic"],
  },
  {
    id: "taller-de-tacos",
    name: "Taller de Tacos",
    type: "Restaurant",
    cityId: "berlin",
    district: "Mitte",
    lat: 52.5265,
    lng: 13.4025,
    distanceKm: 2.4,
    price: 2,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    tags: ["Mexican", "Casual", "Foodie"],
    description: {
      en: "Authentic tacos and Mexican cuisine in a relaxed atmosphere.",
      de: "Authentische Tacos und mexikanische Küche in entspannter Atmosphäre.",
      es: "Tacos auténticos y cocina mexicana en un ambiente relajado.",
    },
    whyWeRecommend: {
      en: "Real Mexican food, no fusion compromises. The Al Pastor tacos are unbeatable.",
      de: "Echtes mexikanisches Essen, keine Fusion-Kompromisse. Die Al Pastor Tacos sind unschlagbar.",
      es: "Comida mexicana real, sin compromisos de fusión. Los tacos al pastor son insuperables.",
    },
    hours: [
      { weekday: 1, opens: "12:00", closes: "22:00" },
      { weekday: 2, opens: "12:00", closes: "22:00" },
      { weekday: 3, opens: "12:00", closes: "22:00" },
      { weekday: 4, opens: "12:00", closes: "23:00" },
      { weekday: 5, opens: "12:00", closes: "23:00" },
      { weekday: 6, opens: "12:00", closes: "23:00" },
      { weekday: 0, opens: "13:00", closes: "21:00" },
    ],
    vegan: true,
    address: "Torstraße 78, 10119 Berlin",
    isSample: true,
    theme: "food",
    moods: ["Foodie", "Relaxed", "Local"],
  },
  {
    id: "bonanza-coffee",
    name: "Bonanza Coffee",
    type: "Café",
    cityId: "berlin",
    district: "Prenzlauer Berg",
    lat: 52.5415,
    lng: 13.4124,
    distanceKm: 2.1,
    price: 2,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    tags: ["Coffee", "Specialty", "Relaxed"],
    description: {
      en: "One of Berlin's best specialty coffee shops with minimalist design.",
      de: "Einer von Berlins besten Specialty-Coffee-Shops mit minimalistischem Design.",
      es: "Una de las mejores cafeterías de especialidad de Berlín con diseño minimalista.",
    },
    whyWeRecommend: {
      en: "For true coffee lovers. The roasts are world-class, the baristas even better.",
      de: "Für echte Kaffeeliebhaber. Die Röstungen sind weltklasse, die Baristas noch besser.",
      es: "Para verdaderos amantes del café. Los tuestes son de clase mundial, los baristas aún mejores.",
    },
    hours: [
      { weekday: 1, opens: "08:30", closes: "17:00" },
      { weekday: 2, opens: "08:30", closes: "17:00" },
      { weekday: 3, opens: "08:30", closes: "17:00" },
      { weekday: 4, opens: "08:30", closes: "17:00" },
      { weekday: 5, opens: "08:30", closes: "17:00" },
      { weekday: 6, opens: "09:00", closes: "18:00" },
      { weekday: 0, opens: "09:00", closes: "17:00" },
    ],
    vegan: true,
    address: "Oderberger Straße 35, 10435 Berlin",
    badge: "LOCAL GEM",
    isSample: true,
    theme: "food",
    moods: ["Relaxed", "Creative", "Local"],
  },
  {
    id: "solar-kino",
    name: "Kino in der Kulturbrauerei",
    type: "Culture",
    cityId: "berlin",
    district: "Prenzlauer Berg",
    lat: 52.5397,
    lng: 13.4161,
    distanceKm: 3.0,
    price: 2,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    tags: ["Cinema", "Culture", "Evening"],
    description: {
      en: "Arthouse cinema in the historic industrial complex of Kulturbrauerei.",
      de: "Arthousekinoin dem historischen Industriekomplex der Kulturbrauerei.",
      es: "Cine de arte en el histórico complejo industrial de Kulturbrauerei.",
    },
    whyWeRecommend: {
      en: "Not just a cinema — an experience. A beer in the courtyard first, then a great film.",
      de: "Nicht nur ein Kino — ein Erlebnis. Erst ein Bier im Innenhof, dann ein toller Film.",
      es: "No solo un cine — una experiencia. Primero una cerveza en el patio, luego una gran película.",
    },
    hours: [
      { weekday: 2, opens: "16:00", closes: "23:00" },
      { weekday: 3, opens: "16:00", closes: "23:00" },
      { weekday: 4, opens: "16:00", closes: "23:00" },
      { weekday: 5, opens: "16:00", closes: "00:00" },
      { weekday: 6, opens: "14:00", closes: "00:00" },
      { weekday: 0, opens: "14:00", closes: "23:00" },
    ],
    vegan: false,
    address: "Schönhauser Allee 36, 10435 Berlin",
    isSample: true,
    theme: "culture",
    moods: ["Culture", "Creative", "Romantic"],
  },
  {
    id: "prince-charles",
    name: "Prince Charles",
    type: "Club",
    cityId: "berlin",
    district: "Kreuzberg",
    lat: 52.4975,
    lng: 13.4108,
    distanceKm: 1.5,
    price: 2,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    tags: ["Nightlife", "Techno", "Bar"],
    description: {
      en: "Club and bar in a former swimming pool — unique atmosphere among Berlin's clubs.",
      de: "Club und Bar in einem ehemaligen Schwimmbad — einzigartige Atmosphäre unter Berlins Clubs.",
      es: "Club y bar en una antigua piscina — atmósfera única entre los clubes de Berlín.",
    },
    whyWeRecommend: {
      en: "The setting is incomparable. A former swimming pool as a club — very Berlin.",
      de: "Das Ambiente ist unvergleichlich. Ein ehemaliges Schwimmbad als Club — sehr Berlin.",
      es: "El entorno es incomparable. Una antigua piscina como club — muy berlín.",
    },
    hours: [
      { weekday: 5, opens: "23:00", closes: "06:00" },
      { weekday: 6, opens: "23:00", closes: "06:00" },
    ],
    vegan: false,
    address: "Prinzenstraße 85F, 10969 Berlin",
    isSample: true,
    theme: "nightlife",
    moods: ["Nightlife", "Creative"],
  },
];

export const guides: Guide[] = [
  {
    id: "quiet-sunday",
    title: { en: "A Quiet Sunday", de: "Ein stiller Sonntag", es: "Un domingo tranquilo" },
    intro: {
      en: "The perfect spots for a slow Sunday morning in Berlin.",
      de: "Die perfekten Orte für einen langsamen Sonntagmorgen in Berlin.",
      es: "Los lugares perfectos para una mañana de domingo tranquila en Berlín.",
    },
    category: "FOOD & DRINKS",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    placeCount: 3,
    placeIds: ["cafe-la-esquina", "bonanza-coffee", "taller-de-tacos"],
    cityId: "berlin",
    theme: "food",
    isSample: true,
  },
  {
    id: "small-galleries",
    title: { en: "Small Galleries", de: "Kleine Galerien", es: "Pequeñas galerías" },
    intro: {
      en: "Hidden art spaces and independent galleries off the beaten path.",
      de: "Verborgene Kunsträume und unabhängige Galerien abseits der ausgetretenen Pfade.",
      es: "Espacios de arte ocultos y galerías independientes fuera de los caminos trillados.",
    },
    category: "LOCAL CULTURE",
    image: "https://images.unsplash.com/photo-1545178803-4056771d60a3?w=600&q=80",
    placeCount: 3,
    placeIds: ["solar-kino", "cafe-la-esquina", "bonanza-coffee"],
    cityId: "berlin",
    theme: "culture",
    isSample: true,
  },
  {
    id: "tacos-and-more",
    title: { en: "Tacos & More", de: "Tacos & Mehr", es: "Tacos y más" },
    intro: {
      en: "Berlin's best Mexican and Latin American cuisine.",
      de: "Berlins beste mexikanische und lateinamerikanische Küche.",
      es: "La mejor cocina mexicana y latinoamericana de Berlín.",
    },
    category: "FOOD & DRINKS",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    placeCount: 3,
    placeIds: ["taller-de-tacos", "bar-el-vecino", "cafe-la-esquina"],
    cityId: "berlin",
    theme: "food",
    isSample: true,
  },
  {
    id: "cocktails-after-dark",
    title: { en: "Cocktails After Dark", de: "Cocktails nach Einbruch der Dunkelheit", es: "Cócteles después del anochecer" },
    intro: {
      en: "The best bars for an unforgettable evening.",
      de: "Die besten Bars für einen unvergesslichen Abend.",
      es: "Los mejores bares para una noche inolvidable.",
    },
    category: "NIGHTLIFE",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    placeCount: 3,
    placeIds: ["bar-el-vecino", "prince-charles", "taller-de-tacos"],
    cityId: "berlin",
    theme: "nightlife",
    isSample: true,
  },
  {
    id: "day-in-neukoelln",
    title: { en: "A Day in Neukölln", de: "Ein Tag in Neukölln", es: "Un día en Neukölln" },
    intro: {
      en: "From cozy cafés to independent shops: the perfect day in one of Berlin's most creative neighborhoods.",
      de: "Von gemütlichen Cafés zu unabhängigen Läden: der perfekte Tag in einem der kreativsten Berliner Kieze.",
      es: "De acogedoras cafeterías a tiendas independientes: el día perfecto en uno de los barrios más creativos de Berlín.",
    },
    category: "LOCAL GUIDE",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    placeCount: 3,
    placeIds: ["cafe-la-esquina", "bar-el-vecino", "taller-de-tacos"],
    cityId: "berlin",
    theme: "local",
    isSample: true,
  },
];

export function getCity(id: string): City {
  return cities.find((c) => c.id === id) ?? cities[0]!;
}

export function getPlace(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}

export function getGuide(id: string): Guide | undefined {
  return guides.find((g) => g.id === id);
}
