"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/lib/products"
import { CONFIG } from "@/CLIENT_CONFIG"

interface ProductClientProps {
  product: Product
  related: Product[]
}

export default function ProductClient({ product, related }: ProductClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<string | null>("details")
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      subtitle: product.subtitle,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const accordions = [
    {
      key: "details",
      label: "Détails & Composition",
      content: (
        <ul className="space-y-2">
          {product.ingredients.map((ing) => (
            <li key={ing} className="font-jost text-[14px] text-[#191716]/55 flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-[#8a7d6b] flex-shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "guide",
      label: "Guide des tailles",
      content: (
        <div className="space-y-3">
          <p className="font-jost text-[14px] text-[#191716]/55 leading-[1.8]">{product.usage}</p>
          <p className="font-jost text-[14px] text-[#191716]/55">{product.volume}</p>
        </div>
      ),
    },
    {
      key: "fabric",
      label: "Matière & toucher",
      content: (
        <p className="font-jost text-[14px] text-[#191716]/55 leading-[1.8]">{product.texture}</p>
      ),
    },
    {
      key: "certif",
      label: "Certifications",
      content: (
        <p className="font-jost text-[14px] text-[#191716]/55 leading-[1.8]">{product.certification}</p>
      ),
    },
  ]

  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-16">

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 pt-6 pb-2">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.15em] text-[#191716]/50">
          <Link href="/" className="hover:text-[#191716] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#191716] transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-[#191716]">{product.title}</span>
        </nav>
      </div>

      {/* Main product section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-8 lg:py-14">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16">

          {/* ── Images left ── */}
          <div className="flex gap-3 lg:gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 w-16">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[3/4] overflow-hidden transition-opacity ${
                      activeImage === i ? "opacity-100" : "opacity-40 hover:opacity-70"
                    }`}
                    aria-label={`Vue ${i + 1}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="relative aspect-[3/4] bg-[#ede9e3] overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={product.images[activeImage] ?? product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  {product.badge && (
                    <span className="absolute top-5 left-5 font-jost text-[11px] uppercase tracking-[0.2em] bg-[#f5f2ed] text-[#191716] px-3 py-1.5">
                      {product.badge}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Mobile thumbnails */}
              {product.images.length > 1 && (
                <div className="lg:hidden flex gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-12 aspect-[3/4] overflow-hidden transition-opacity ${
                        activeImage === i ? "opacity-100" : "opacity-40"
                      }`}
                      aria-label={`Vue ${i + 1}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Product info right ── */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="font-jost text-[13px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-4">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="font-cormorant italic text-4xl lg:text-5xl text-[#191716] leading-tight mb-2">
              {product.title}
            </h1>
            <p className="font-jost text-[15px] text-[#191716]/60 mb-6">{product.subtitle}</p>

            {/* Price */}
            <p className="font-cormorant text-4xl text-[#191716] mb-8">
              {product.price} €
            </p>

            {/* Description */}
            <p className="font-jost text-[15px] text-[#191716]/55 leading-[1.8] mb-8 max-w-[400px]">
              {product.longDescription}
            </p>

            {/* Stock indicator */}
            {product.stock <= 5 && product.stock > 0 && (
              <p className="font-jost text-[12px] uppercase tracking-[0.15em] text-[#8a7d6b] mb-5">
                Plus que {product.stock} disponible{product.stock > 1 ? "s" : ""}
              </p>
            )}
            {product.stock === 0 && (
              <p className="font-jost text-[12px] uppercase tracking-[0.15em] text-red-400 mb-5">
                Rupture de stock
              </p>
            )}

            {/* Add to cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 font-jost text-[12px] uppercase tracking-[0.3em] transition-colors min-h-[56px] mb-4 ${
                added
                  ? "bg-[#5a6e52] text-white"
                  : product.stock === 0
                  ? "bg-[#ede9e3] text-[#7a756e] cursor-not-allowed"
                  : "bg-[#191716] text-[#f5f2ed] hover:bg-[#8a7d6b]"
              }`}
              whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
            >
              {added ? "Ajouté au panier" : product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </motion.button>

            {/* Shipping note */}
            <p className="font-jost text-[12px] text-center text-[#191716]/40 mb-10">
              Livraison offerte dès {CONFIG.shop.freeShippingThreshold}€ · Retours gratuits 30 jours
            </p>

            {/* Divider */}
            <div className="divider-fade mb-8" />

            {/* Accordions */}
            <div className="space-y-0">
              {accordions.map((acc) => (
                <div key={acc.key} className="border-b border-[#191716]/10">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.key ? null : acc.key)}
                    className="w-full flex justify-between items-center py-4 text-left"
                    aria-expanded={openAccordion === acc.key}
                  >
                    <span className="font-jost text-[13px] uppercase tracking-[0.15em] text-[#191716]">
                      {acc.label}
                    </span>
                    <motion.span
                      animate={{ rotate: openAccordion === acc.key ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[#7a756e] text-lg leading-none"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === acc.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5">{acc.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <div className="border-t border-[#191716]/10 py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-14">
            <h2 className="font-cormorant italic text-3xl lg:text-4xl text-[#191716] mb-10">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#ede9e3] overflow-hidden product-img-wrap">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-baseline">
                    <p className="font-jost text-[13px] uppercase tracking-[0.12em] text-[#191716] truncate pr-2 group-hover:text-[#8a7d6b] transition-colors">
                      {p.title}
                    </p>
                    <p className="font-cormorant text-xl text-[#191716] flex-shrink-0">{p.price} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[900] bg-[#f5f2ed] border-t border-[#191716]/10 p-4 safe-area-bottom">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 font-jost text-[12px] uppercase tracking-[0.3em] transition-colors min-h-[52px] ${
            added
              ? "bg-[#5a6e52] text-white"
              : product.stock === 0
              ? "bg-[#ede9e3] text-[#7a756e] cursor-not-allowed"
              : "bg-[#191716] text-[#f5f2ed]"
          }`}
        >
          {added ? "Ajouté" : product.stock === 0 ? "Rupture de stock" : `Ajouter — ${product.price} €`}
        </button>
      </div>
    </main>
  )
}
