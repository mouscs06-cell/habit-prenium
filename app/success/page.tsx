"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { CONFIG } from "@/CLIENT_CONFIG"
import { useCart } from "@/context/CartContext"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id") ?? ""
  const shortId = sessionId.slice(-8).toUpperCase()
  const { clearCart } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<SVGSVGElement>(null)

  // Clear cart once on success
  useEffect(() => {
    clearCart()
  }, [clearCart])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline()
      tl.fromTo(".success-circle", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" })
      tl.fromTo(".success-check", { strokeDashoffset: 40 }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, "-=0.1")
      tl.fromTo(".success-title .word", { y: "110%" }, { y: "0%", stagger: 0.06, duration: 0.7, ease: "power4.out" }, "-=0.1")
      tl.fromTo(".success-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2")
      tl.fromTo(".success-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.2")
      tl.fromTo(".success-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.1")
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f7f5f0] flex flex-col items-center justify-center px-6 py-20">

      {/* Animated check circle */}
      <div className="success-circle w-20 h-20 rounded-full border-2 border-[#c4a97d] flex items-center justify-center mb-8">
        <svg
          ref={checkRef}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="#c4a97d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="success-check"
          style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
        >
          <polyline points="6 16 13 23 26 10" />
        </svg>
      </div>

      {/* Title */}
      <div className="success-title overflow-hidden mb-4 text-center">
        <h1 className="font-cormorant italic text-4xl md:text-6xl text-[#1a1714] flex flex-wrap justify-center gap-x-4">
          {["Merci", "pour", "votre", "commande"].map((w) => (
            <span key={w} className="word inline-block overflow-hidden">
              <span className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="success-sub font-inter text-[14px] text-[#6b6560] text-center max-w-sm leading-[1.8] opacity-0">
        Votre commande a bien été enregistrée. Vous recevrez un email de confirmation sous peu.
      </p>

      {/* Order ID */}
      {shortId && (
        <p className="success-sub font-inter text-[11px] tracking-[0.3em] uppercase text-[#c4a97d] mt-3 opacity-0">
          Commande #{shortId}
        </p>
      )}

      {/* Confirmation card */}
      <div className="success-card bg-white rounded-2xl p-8 max-w-lg w-full mx-auto mt-10 shadow-sm border border-[#1a1714]/[0.05] opacity-0">
        <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#c4a97d] mb-5">RÉCAPITULATIF</p>
        {[
          { icon: "✓", text: "Paiement confirmé et sécurisé" },
          { icon: "✓", text: "Email de confirmation envoyé" },
          { icon: "✓", text: "Livraison sous 1–3 jours ouvrés" },
          { icon: "✓", text: `Retours gratuits sous ${CONFIG.shop.returnDays} jours` },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-4 py-3 border-b border-[#1a1714]/[0.05] last:border-0">
            <span className="text-[#c4a97d] font-inter text-sm font-medium w-5 shrink-0">{item.icon}</span>
            <span className="font-inter text-[13px] text-[#1a1714]">{item.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
        <Link
          href="/catalog"
          className="success-cta opacity-0 bg-[#1a1714] text-white rounded-full px-8 py-3.5 font-inter text-[10px] tracking-[0.3em] uppercase hover:bg-[#c4a97d] transition-colors duration-300 min-h-[48px] flex items-center"
        >
          Continuer mes achats →
        </Link>
        <Link
          href="/"
          className="success-cta opacity-0 font-inter text-[10px] tracking-[0.2em] uppercase text-[#6b6560] hover:text-[#1a1714] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Brand signature */}
      <p className="mt-16 font-cormorant italic text-[#c4a97d]/40 text-xl tracking-[0.1em]">
        {CONFIG.brandName}
      </p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
