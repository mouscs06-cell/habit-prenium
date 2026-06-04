import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../lib/generated/prisma/client"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma  = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  const products = [
    { slug: "serum-eclat",    title: "Sérum Éclat",      subtitle: "Vitamine C + Acide Hyaluronique", description: "Éclat et hydratation intense",         price: 89, image: "/skin2.jpg", category: "Sérums",       badge: "BEST SELLER", stock: 150 },
    { slug: "creme-jour",     title: "Crème de Jour",     subtitle: "SPF 30 + Antioxydants",           description: "Protection et éclat quotidien",        price: 65, image: "/skin3.jpg", category: "Crèmes",       badge: "",            stock: 200 },
    { slug: "huile-nuit",     title: "Huile de Nuit",     subtitle: "Rétinol Doux + Rose Musquée",     description: "Régénération nocturne intensive",      price: 78, image: "/skin4.jpg", category: "Huiles",       badge: "NOUVEAU",     stock: 120 },
    { slug: "masque-eclat",   title: "Masque Éclat",      subtitle: "Argile Blanche + Vitamine C",     description: "Pureté et luminosité en 10 minutes",   price: 55, image: "/skin5.jpg", category: "Masques",      badge: "",            stock: 80  },
    { slug: "contour-yeux",   title: "Contour des Yeux",  subtitle: "Caféine + Peptides",              description: "Anti-poches et anti-cernes ciblé",     price: 72, image: "/skin6.jpg", category: "Soins Ciblés", badge: "",            stock: 100 },
    { slug: "eau-micellaire", title: "Eau Micellaire",    subtitle: "Micelles Douces + Aloe Vera",     description: "Démaquillage doux zéro résidu",        price: 32, image: "/skin7.jpg", category: "Nettoyants",   badge: "",            stock: 250 },
    { slug: "brume-fixante",  title: "Brume Fixante",     subtitle: "Eau Florale + Électrolytes",      description: "Fixe et hydrate en une brume",         price: 38, image: "/skin8.jpg", category: "Soins Ciblés", badge: "",            stock: 90  },
    { slug: "gommage-doux",   title: "Gommage Doux",      subtitle: "AHA 5% + Sucre de Canne",         description: "Exfoliation douce et renouvellement",  price: 48, image: "/skin9.jpg", category: "Nettoyants",   badge: "",            stock: 130 },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where:  { slug: product.slug },
      update: product,
      create: product,
    })
    console.log(`  ✅ ${product.title}`)
  }

  console.log(`\n✨ Seed terminé — ${products.length} produits insérés.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
