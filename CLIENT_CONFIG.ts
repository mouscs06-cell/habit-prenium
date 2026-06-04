export const CONFIG = {
  // ── MARQUE ───────────────────────────────────────────────────────────────────
  brandName: "AURÈLE",
  tagline: "L'essentiel, simplement",
  description:
    "Vêtements premium pour hommes et femmes. Conçus à Paris avec des matières nobles et durables.",
  founded: "2021",
  city: "Paris",

  // ── COULEURS ─────────────────────────────────────────────────────────────────
  colors: {
    background: "#f5f2ed",
    backgroundDark: "#191716",
    accent: "#8a7d6b",
    accentDark: "#6b5f50",
    text: "#191716",
    textSecondary: "#7a756e",
    success: "#5a6e52",
  },

  // ── NAVIGATION ───────────────────────────────────────────────────────────────
  nav: {
    links: [
      { label: "FEMME", href: "/catalog?cat=femme" },
      { label: "HOMME", href: "/catalog?cat=homme" },
      { label: "COLLECTIONS", href: "/catalog" },
    ],
    cta: { label: "NOUVELLE COLLECTION", href: "/catalog" },
  },

  // ── E-COMMERCE ───────────────────────────────────────────────────────────────
  shop: {
    currency: "EUR",
    currencySymbol: "€",
    freeShippingThreshold: 150,
    shippingCost: 5.9,
    expressShippingCost: 12.9,
    allowedCountries: ["FR", "BE", "CH", "LU", "DE", "IT", "ES", "NL"] as string[],
    returnDays: 30,
  },

  // ── CONTACT ──────────────────────────────────────────────────────────────────
  contact: {
    email: "contact@aurele-paris.fr",
    phone: "01 42 33 78 90",
    hours: "Lun-Sam · 10h-19h",
    address: "24 Rue de Sévigné, 75003 Paris",
  },

  // ── SEO ──────────────────────────────────────────────────────────────────────
  seo: {
    title: "AURÈLE - L'Essentiel, Simplement",
    description:
      "Vêtements premium pour hommes et femmes. Conçus à Paris avec des matières nobles et durables.",
  },

  // ── RÉSEAUX SOCIAUX ───────────────────────────────────────────────────────────
  social: {
    instagram: "https://instagram.com/aurele_paris",
    tiktok: "",
    facebook: "",
  },

  // ── RÉASSURANCE ──────────────────────────────────────────────────────────────
  reassurance: [
    { icon: "ship", title: "Livraison offerte", description: "Dès 150€ d'achat" },
    { icon: "flag", title: "Conçu à Paris", description: "Design et patronage français" },
    { icon: "leaf", title: "Matières nobles", description: "Coton bio, lin, laine mérinos" },
    { icon: "return", title: "Retours gratuits", description: "30 jours pour changer d'avis" },
  ],

  // ── TÉMOIGNAGES ───────────────────────────────────────────────────────────────
  testimonials: [
    {
      name: "Mathilde R.",
      text: "La qualité des matières est exceptionnelle. Mon manteau AURÈLE est devenu mon indispensable.",
      rating: 5,
    },
    {
      name: "Thomas G.",
      text: "Enfin une marque qui fait du basique haut de gamme sans logo partout.",
      rating: 5,
    },
    {
      name: "Sophie M.",
      text: "Les coupes sont parfaites. J'ai remplacé toute ma garde-robe.",
      rating: 5,
    },
    {
      name: "Alexandre D.",
      text: "Le pull en mérinos est incroyable. Doux, chaud, et il vieillit magnifiquement.",
      rating: 5,
    },
    {
      name: "Claire B.",
      text: "Le pantalon en lin est une merveille. Confortable et élégant à la fois.",
      rating: 5,
    },
    {
      name: "Nicolas P.",
      text: "Service client impeccable. Livraison rapide et emballage soigné.",
      rating: 5,
    },
  ],
} as const
