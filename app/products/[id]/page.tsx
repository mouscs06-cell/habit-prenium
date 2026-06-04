import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById, PRODUCTS } from "@/lib/products"
import ProductClient from "@/components/ProductClient"
import { CONFIG } from "@/CLIENT_CONFIG"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return { title: "Produit introuvable" }
  return {
    title: `${product.title} — ${CONFIG.brandName}`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.category === "Unisexe")
  ).slice(0, 4)

  return <ProductClient product={product} related={related} />
}
