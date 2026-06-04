import type { Metadata } from "next"
import { CONFIG } from "@/CLIENT_CONFIG"
import { PRODUCTS } from "@/lib/products"
import HomeClient from "@/components/HomeClient"

export const metadata: Metadata = {
  title: CONFIG.seo.title,
  description: CONFIG.seo.description,
}

export default function Home() {
  return <HomeClient products={PRODUCTS} />
}
