"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { CONFIG } from "@/CLIENT_CONFIG"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()
  const prevScrollY = useRef(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      if (y > 100) {
        setHidden(y > prevScrollY.current && y > 200)
      }
      prevScrollY.current = y
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      {/* ── Main header bar ─────────────────────────────────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9200] transition-all duration-500",
          scrolled
            ? "bg-[#f5f2ed]/97 backdrop-blur-[20px] border-b border-[#191716]/[0.08]"
            : "bg-[#f5f2ed]/98"
        )}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="font-cormorant font-light tracking-[0.35em] text-[17px] uppercase text-[#191716] transition-opacity hover:opacity-70"
            aria-label="AURÈLE — Accueil"
          >
            AURÈLE
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Navigation principale">
            {CONFIG.nav.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative font-jost text-[13px] uppercase tracking-[0.2em] pb-0.5 text-[#191716] hover:text-[#8a7d6b] transition-colors duration-200"
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-[#8a7d6b]"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-5 lg:gap-7">
            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="font-jost text-[13px] uppercase tracking-[0.2em] flex items-center gap-2 text-[#191716] transition-opacity hover:opacity-60"
              aria-label={`Panier, ${totalItems} article${totalItems !== 1 ? "s" : ""}`}
            >
              PANIER
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#191716] flex items-center justify-center text-[#f5f2ed] text-[9px] font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA — desktop only */}
            <Link
              href={CONFIG.nav.cta.href}
              className="hidden lg:inline-flex group relative overflow-hidden items-center justify-center rounded-full border border-[#191716] px-6 py-2 font-jost text-[11px] uppercase tracking-[0.2em] text-[#191716] hover:text-[#f5f2ed] transition-colors duration-300"
            >
              <span
                className="absolute inset-0 rounded-full bg-[#191716] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                aria-hidden="true"
              />
              <span className="relative z-10">{CONFIG.nav.cta.label}</span>
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex flex-col gap-[5px] p-1 transition-opacity hover:opacity-50 text-[#191716]"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <span className="w-6 h-px bg-[#191716]" />
              <span className="w-4 h-px bg-[#191716]" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9300] bg-[#191716]/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-[min(380px,100vw)] z-[9400] bg-[#f5f2ed] flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              {/* Close */}
              <div className="flex justify-between items-center px-8 h-16 border-b border-[#191716]/10">
                <span className="font-cormorant font-light tracking-[0.35em] text-[17px] uppercase text-[#191716]">
                  AURÈLE
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#191716]/50 hover:text-[#191716] transition-colors"
                  aria-label="Fermer le menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
                {CONFIG.nav.links.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-cormorant italic text-5xl text-[#191716] py-3 hover:text-[#8a7d6b] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 pt-8 border-t border-[#191716]/10"
                >
                  <Link
                    href={CONFIG.nav.cta.href}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-4 font-jost text-[13px] uppercase tracking-[0.25em] text-[#8a7d6b]"
                  >
                    {CONFIG.nav.cta.label}
                    <span className="w-8 h-px bg-[#8a7d6b]" aria-hidden="true" />
                  </Link>
                </motion.div>
              </nav>

              {/* Footer contact */}
              <div className="px-8 pb-10 border-t border-[#191716]/10 pt-6">
                <p className="font-jost text-[11px] text-[#7a756e] uppercase tracking-[0.2em] mb-1">
                  Contact
                </p>
                <a
                  href={`mailto:${CONFIG.contact.email}`}
                  className="font-jost text-[13px] text-[#191716] hover:text-[#8a7d6b] transition-colors"
                >
                  {CONFIG.contact.email}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
