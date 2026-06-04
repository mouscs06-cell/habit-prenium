"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { useCart } from "@/context/CartContext"
import { CONFIG } from "@/CLIENT_CONFIG"

export default function CartSidebar() {
  const {
    items, removeItem, updateQuantity,
    totalItems, totalPrice, isOpen, setIsOpen,
    checkout, isCheckingOut,
  } = useCart()

  const drawerRef = useRef<HTMLDivElement>(null)
  const hasItems = items.length > 0
  const freeShipping = CONFIG.shop.freeShippingThreshold
  const remaining = Math.max(0, freeShipping - totalPrice)
  const progress = Math.min(1, totalPrice / freeShipping)

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return
    if (isOpen) {
      gsap.set(drawer, { display: "flex" })
      reducedMotion
        ? gsap.set(drawer, { x: "0%" })
        : gsap.fromTo(drawer, { x: "100%" }, { x: "0%", duration: 0.45, ease: "power3.out" })
    } else {
      reducedMotion
        ? gsap.set(drawer, { x: "100%", onComplete: () => gsap.set(drawer, { display: "none" }) })
        : gsap.to(drawer, { x: "100%", duration: 0.35, ease: "power3.in", onComplete: () => gsap.set(drawer, { display: "none" }) })
    }
  }, [isOpen, reducedMotion])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9400] bg-[#191716]/30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[9500] bg-[#f5f2ed] flex-col"
        style={{ transform: "translateX(100%)", display: "none" }}
        role="dialog"
        aria-modal="true"
        aria-label="Mon panier"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-[#191716]/10 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-cormorant italic text-2xl text-[#191716]">Mon Panier</h2>
            {totalItems > 0 && (
              <span className="w-6 h-6 rounded-full bg-[#8a7d6b] flex items-center justify-center font-jost text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-[#7a756e] hover:text-[#191716] transition-colors"
            aria-label="Fermer le panier"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        {hasItems ? (
          <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden shrink-0 bg-[#ede9e3]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-jost text-[12px] font-medium text-[#191716] truncate">
                    {item.title}
                  </p>
                  <p className="font-jost text-[10px] text-[#7a756e] truncate mb-2">
                    {item.subtitle}
                  </p>
                  <p className="font-cormorant text-xl text-[#191716]">{item.price} €</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-[#191716]/15 text-[#191716] hover:border-[#8a7d6b] transition-colors text-sm"
                    aria-label="Diminuer"
                  >
                    -
                  </button>
                  <span className="font-jost text-[12px] text-[#191716] w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-[#191716]/15 text-[#191716] hover:border-[#8a7d6b] transition-colors text-sm"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-1 w-8 h-8 flex items-center justify-center text-[#7a756e]/50 hover:text-red-400 transition-colors text-xs"
                    aria-label={`Supprimer ${item.title}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-7">
            <div className="w-14 h-14 rounded-full border border-[#191716]/15 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 3H13L15 8H5L7 3Z" stroke="#8a7d6b" strokeWidth="1"/>
                <path d="M5 8L6 17H14L15 8" stroke="#8a7d6b" strokeWidth="1"/>
              </svg>
            </div>
            <p className="font-cormorant italic text-2xl text-[#191716]">Votre panier est vide</p>
            <p className="font-jost text-[11px] text-[#7a756e] leading-relaxed">
              Découvrez nos pièces conçues pour durer.
            </p>
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="border border-[#191716] px-7 py-3 font-jost text-[10px] tracking-[0.2em] uppercase text-[#191716] hover:bg-[#191716] hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              Explorer les collections
            </Link>
          </div>
        )}

        {/* Footer */}
        {hasItems && (
          <div className="border-t border-[#191716]/10 px-7 py-6 shrink-0">
            {remaining > 0 && (
              <div className="mb-5">
                <p className="font-jost text-[10px] text-[#7a756e] mb-2">
                  Plus que{" "}
                  <span className="text-[#8a7d6b] font-medium">{remaining.toFixed(0)}€</span>
                  {" "}pour la livraison offerte
                </p>
                <div className="w-full h-px bg-[#ede9e3] overflow-hidden">
                  <div
                    className="h-full bg-[#8a7d6b] transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between items-baseline mb-5">
              <span className="font-jost text-[11px] text-[#7a756e] uppercase tracking-[0.1em]">Total</span>
              <span className="font-cormorant text-3xl text-[#191716]">{totalPrice.toFixed(0)} €</span>
            </div>
            <button
              onClick={checkout}
              disabled={isCheckingOut}
              className="w-full bg-[#191716] text-white py-4 font-jost text-[10px] tracking-[0.3em] uppercase hover:bg-[#8a7d6b] transition-colors min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Redirection..." : "Commander"}
            </button>
            <p className="font-jost text-[9px] text-center text-[#7a756e] mt-3">
              Livraison offerte dès {freeShipping}€
            </p>
          </div>
        )}
      </div>
    </>
  )
}
