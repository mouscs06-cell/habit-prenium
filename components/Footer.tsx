"use client"

import Link from "next/link"
import { useState } from "react"
import { CONFIG } from "@/CLIENT_CONFIG"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <footer className="bg-[#191716] text-[#f5f2ed]">
      {/* Newsletter band */}
      <div className="border-b border-[#f5f2ed]/8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-jost text-[12px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-4">
              Newsletter
            </p>
            <h3 className="font-cormorant italic text-4xl lg:text-5xl text-[#f5f2ed] leading-tight">
              Rejoignez l&apos;essentiel
            </h3>
          </div>
          <div>
            {submitted ? (
              <p className="font-cormorant italic text-2xl text-[#8a7d6b]">
                Merci. Bienvenue dans l&apos;essentiel.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-0">
                <label htmlFor="footer-email" className="sr-only">Adresse email</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  required
                  className="flex-1 bg-transparent border border-[#f5f2ed]/20 px-5 py-4 font-jost text-[13px] text-[#f5f2ed] placeholder-[#7a756e] focus:outline-none focus:border-[#8a7d6b] transition-colors min-h-[52px]"
                />
                <button
                  type="submit"
                  className="bg-[#8a7d6b] px-7 font-jost text-[12px] uppercase tracking-[0.2em] text-white hover:bg-[#6b5f50] transition-colors min-h-[52px] whitespace-nowrap"
                >
                  S&apos;inscrire
                </button>
              </form>
            )}
            <p className="font-jost text-[11px] text-[#7a756e] mt-3">
              Discret. Pas de spam. Désabonnement en un clic.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-14 lg:py-20 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="font-cormorant font-light tracking-[0.35em] text-[18px] uppercase text-[#f5f2ed] block mb-5">
            AURÈLE
          </Link>
          <p className="font-jost text-[13px] text-[#f5f2ed]/60 leading-relaxed mb-6 max-w-[200px]">
            Vêtements premium conçus à Paris. Matières nobles, coupes intemporelles.
          </p>
          <div className="flex gap-4">
            {CONFIG.social.instagram && (
              <a
                href={CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-jost text-[11px] uppercase tracking-[0.2em] text-[#7a756e] hover:text-[#f5f2ed] transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Collections */}
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.25em] text-[#7a756e] mb-5">Collections</p>
          <ul className="space-y-3">
            {[
              { label: "Femme", href: "/catalog?cat=femme" },
              { label: "Homme", href: "/catalog?cat=homme" },
              { label: "Unisexe", href: "/catalog?cat=unisexe" },
              { label: "Accessoires", href: "/catalog?cat=accessoires" },
              { label: "Voir tout", href: "/catalog" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-jost text-[13px] text-[#f5f2ed]/70 hover:text-[#f5f2ed] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service */}
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.25em] text-[#7a756e] mb-5">Service</p>
          <ul className="space-y-3">
            {[
              { label: "Guide des tailles", href: "/guide-tailles" },
              { label: "Livraison", href: "/livraison" },
              { label: "Retours", href: "/retours" },
              { label: "FAQ", href: "/faq" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-jost text-[13px] text-[#f5f2ed]/70 hover:text-[#f5f2ed] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.25em] text-[#7a756e] mb-5">Contact</p>
          <address className="not-italic space-y-3">
            <p className="font-jost text-[13px] text-[#f5f2ed]/70 leading-relaxed">
              {CONFIG.contact.address}
            </p>
            <a
              href={`mailto:${CONFIG.contact.email}`}
              className="font-jost text-[13px] text-[#f5f2ed]/70 hover:text-[#f5f2ed] transition-colors block"
            >
              {CONFIG.contact.email}
            </a>
            <p className="font-jost text-[13px] text-[#f5f2ed]/70">{CONFIG.contact.hours}</p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#f5f2ed]/8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-jost text-[11px] text-[#7a756e] uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} AURÈLE Paris. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Mentions légales", href: "#" },
              { label: "Confidentialité", href: "#" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-jost text-[11px] text-[#7a756e] hover:text-[#f5f2ed] transition-colors uppercase tracking-[0.15em]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
