export type Product = {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  price: number
  category: string
  image: string
  images: string[]
  badge: string
  ingredients: string[]
  usage: string
  texture: string
  volume: string
  certification: string
  stock: number
}

export const PRODUCTS: Product[] = [
  {
    id: "manteau-cachemire",
    title: "Le Manteau Cachemire",
    subtitle: "Cachemire italien · Double boutonnage",
    description: "L'élégance parisienne incarnée",
    longDescription:
      "Coupé dans un cachemire italien d'exception, ce manteau double boutonnage allie structure et douceur. Doublure en soie. Patronage parisien réalisé à la main par nos ateliers partenaires.",
    price: 485,
    category: "Femme",
    image: "/habit7.jpg",
    images: ["/habit7.jpg", "/habit27.jpg"],
    badge: "NOUVELLE SAISON",
    stock: 12,
    ingredients: ["Cachemire italien 100%", "Doublure soie", "Boutons corne naturelle"],
    usage: "Taille normalement. Prenez votre taille habituelle.",
    texture: "Cachemire doux au toucher, tombé fluide",
    volume: "Disponible du 34 au 44",
    certification: "OEKO-TEX Standard 100",
  },
  {
    id: "pull-merinos",
    title: "Le Pull Mérinos",
    subtitle: "Laine mérinos extra-fine · Col rond",
    description: "La douceur à l'état pur",
    longDescription:
      "Tricoté en laine mérinos extra-fine d'Australie, ce pull col rond est l'essentiel parfait. Finitions bord-côtes, coupe ajustée sans serrer.",
    price: 145,
    category: "Homme",
    image: "/habit8.jpg",
    images: ["/habit8.jpg", "/habit27.jpg"],
    badge: "BEST SELLER",
    stock: 28,
    ingredients: ["Laine mérinos extra-fine 100%"],
    usage: "Coupe ajustée. Si entre deux tailles, prenez la supérieure.",
    texture: "Ultra-doux, ne gratte pas, léger",
    volume: "Disponible du S au XXL",
    certification: "Mulesing-free · RWS Certified",
  },
  {
    id: "chemise-oxford",
    title: "La Chemise Oxford",
    subtitle: "Coton Oxford japonais · Col boutonné",
    description: "Le classique réinventé",
    longDescription:
      "Notre Oxford signature en coton japonais sélectionné pour sa texture unique. Col boutonné parfait, coupe légèrement oversize pour un porter décontracté-chic.",
    price: 125,
    category: "Homme",
    image: "/habit9.jpg",
    images: ["/habit9.jpg", "/habit27.jpg"],
    badge: "",
    stock: 35,
    ingredients: ["Coton Oxford japonais 100%", "Boutons nacre"],
    usage: "Coupe légèrement oversize. Votre taille habituelle.",
    texture: "Oxford texturé, souple, se patine avec le temps",
    volume: "Disponible du S au XXL",
    certification: "OEKO-TEX Standard 100",
  },
  {
    id: "pantalon-lin",
    title: "Le Pantalon Lin",
    subtitle: "Lin français · Coupe droite",
    description: "L'été en toute élégance",
    longDescription:
      "Taillé dans un lin français cultivé en Normandie. Coupe droite confortable, taille mi-haute, poche italienne. L'essentiel estival.",
    price: 165,
    category: "Homme",
    image: "/habit10.jpg",
    images: ["/habit10.jpg", "/habit27.jpg"],
    badge: "",
    stock: 20,
    ingredients: ["Lin français 100%"],
    usage: "Coupe droite décontractée. Taille normalement.",
    texture: "Lin naturel, léger froissé noble",
    volume: "Disponible du 38 au 48",
    certification: "European Flax · Cultivé en France",
  },
  {
    id: "robe-soie",
    title: "La Robe Soie",
    subtitle: "Soie lavée · Coupe fluide",
    description: "La grâce au quotidien",
    longDescription:
      "Une robe en soie lavée qui danse avec le mouvement. Coupe mi-longue, manches tombantes, ceinture ton sur ton. Du bureau au dîner.",
    price: 295,
    category: "Femme",
    image: "/habit11.jpg",
    images: ["/habit11.jpg", "/habit27.jpg"],
    badge: "ÉDITION LIMITÉE",
    stock: 8,
    ingredients: ["Soie lavée 100%", "Doublure coton bio"],
    usage: "Coupe fluide. Prenez votre taille habituelle.",
    texture: "Soie mate, toucher frais, tombé magnifique",
    volume: "Disponible du 34 au 44",
    certification: "OEKO-TEX Standard 100 · Teinture végétale",
  },
  {
    id: "veste-velours",
    title: "La Veste Velours",
    subtitle: "Velours côtelé · Coupe blazer",
    description: "L'audace discrète",
    longDescription:
      "Notre interprétation du blazer en velours côtelé 500 raies. Structure d'un blazer, douceur du velours. Poches plaquées, doublure imprimée signature.",
    price: 325,
    category: "Femme",
    image: "/habit12.jpg",
    images: ["/habit12.jpg", "/habit27.jpg"],
    badge: "",
    stock: 15,
    ingredients: ["Velours côtelé coton 98%, élasthanne 2%", "Doublure viscose imprimée"],
    usage: "Coupe ajustée. Prenez votre taille.",
    texture: "Velours 500 raies, souple et structuré",
    volume: "Disponible du 34 au 44",
    certification: "OEKO-TEX Standard 100",
  },
  {
    id: "tshirt-essentiel",
    title: "Le T-Shirt Essentiel",
    subtitle: "Coton bio pima · Col rond",
    description: "La perfection du basique",
    longDescription:
      "Le t-shirt parfait n'existe pas, sauf celui-ci. Coton bio Pima péruvien, 180g/m², col roulotté à la main. Le basique qui rend tout le reste inutile.",
    price: 55,
    category: "Unisexe",
    image: "/habit13.jpg",
    images: ["/habit13.jpg", "/habit27.jpg"],
    badge: "ESSENTIEL",
    stock: 60,
    ingredients: ["Coton bio Pima 100%"],
    usage: "Coupe droite classique. Votre taille habituelle.",
    texture: "Coton épais, doux, ne se déforme pas",
    volume: "Disponible du XS au XXL",
    certification: "GOTS Certified · Fair Trade",
  },
  {
    id: "echarpe-cachemire",
    title: "L'Écharpe Cachemire",
    subtitle: "Cachemire mongol · Tissage artisanal",
    description: "La douceur absolue",
    longDescription:
      "Tissée à la main par des artisans mongols à partir de cachemire brut sélectionné. 200cm x 70cm de pur réconfort. Chaque pièce est unique.",
    price: 195,
    category: "Accessoires",
    image: "/habit14.jpg",
    images: ["/habit14.jpg", "/habit27.jpg"],
    badge: "",
    stock: 18,
    ingredients: ["Cachemire mongol 100%"],
    usage: "Taille unique. 200cm x 70cm.",
    texture: "Ultra-doux, léger, chaud",
    volume: "Taille unique",
    certification: "Commerce équitable · Artisanat certifié",
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "Tout") return PRODUCTS
  return PRODUCTS.filter((p) => p.category === category)
}
