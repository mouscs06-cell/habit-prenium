import type { Metadata } from "next"
import { Suspense } from "react"
import { PRODUCTS } from "@/lib/products"
import CatalogClient from "@/components/CatalogClient"
import { CONFIG } from "@/CLIENT_CONFIG"

export const metadata: Metadata = {
  title: `Collections — ${CONFIG.brandName}`,
  description: CONFIG.seo.description,
}

function CatalogFallback() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-24 lg:pt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pt-10 lg:pt-16">
        <div className="h-16 w-64 bg-[#ede9e3] animate-pulse rounded mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#ede9e3] animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogClient products={PRODUCTS} />
    </Suspense>
  )
}
