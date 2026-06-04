"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/lib/products"

const FILTERS = ["Tout", "Femme", "Homme", "Unisexe", "Accessoires"] as const
type Filter = (typeof FILTERS)[number]

interface CatalogClientProps {
  products: Product[]
}

export default function CatalogClient({ products }: CatalogClientProps) {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<Filter>("Tout")
  const { addItem } = useCart()

  useEffect(() => {
    const cat = searchParams.get("cat")
    if (cat) {
      const matched = FILTERS.find(
        (f) => f.toLowerCase() === cat.toLowerCase()
      )
      if (matched) setActiveFilter(matched)
    }
  }, [searchParams])

  const filtered =
    activeFilter === "Tout"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === activeFilter.toLowerCase()
        )

  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-24 lg:pt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14">

        {/* ── Page header ── */}
        <div className="pt-10 lg:pt-16 pb-12 lg:pb-16 border-b border-[#191716]/10">
          <h1 className="font-cormorant italic text-5xl lg:text-7xl text-[#191716] mb-8">
            Collections
          </h1>

          {/* Filter tabs */}
          <div
            className="flex gap-6 lg:gap-10 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Filtrer par catégorie"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                className={`filter-tab font-jost text-[13px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                  activeFilter === f
                    ? "text-[#191716] active"
                    : "text-[#7a756e] hover:text-[#191716]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product count ── */}
        <p className="font-jost text-[12px] text-[#7a756e] uppercase tracking-[0.15em] py-6">
          {filtered.length} pièce{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5 pb-24 lg:pb-36">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-[#ede9e3] overflow-hidden product-img-wrap">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 font-jost text-[11px] uppercase tracking-[0.2em] bg-[#f5f2ed] text-[#191716] px-2.5 py-1">
                        {product.badge}
                      </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-4 right-4 font-jost text-[11px] uppercase tracking-[0.15em] bg-[#191716] text-[#f5f2ed] px-2 py-1">
                        {product.stock} restant{product.stock > 1 ? "s" : ""}
                      </span>
                    )}

                    {/* Quick add on hover */}
                    <motion.div
                      className="absolute inset-x-0 bottom-0 bg-[#f5f2ed] flex items-center justify-center py-3"
                      initial={{ y: "100%" }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          addItem({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                            subtitle: product.subtitle,
                          })
                        }}
                        className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#191716] hover:text-[#8a7d6b] transition-colors"
                      >
                        Ajouter au panier
                      </button>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="font-jost text-[13px] uppercase tracking-[0.12em] text-[#191716] truncate group-hover:text-[#8a7d6b] transition-colors">
                        {product.title}
                      </p>
                      <p className="font-cormorant text-xl text-[#191716] flex-shrink-0">
                        {product.price} €
                      </p>
                    </div>
                    <p className="font-jost text-[12px] text-[#7a756e] mt-0.5 truncate">
                      {product.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-cormorant italic text-3xl text-[#191716] mb-4">
              Aucune pièce dans cette catégorie
            </p>
            <button
              onClick={() => setActiveFilter("Tout")}
              className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#8a7d6b] underline underline-offset-4"
            >
              Voir toutes les collections
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
