"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "La livraison standard est de 2 à 5 jours ouvrés en France métropolitaine. La livraison express (24-48h) est disponible pour 12,90€. La livraison est offerte dès 150€ d'achat.",
  },
  {
    question: "Comment retourner un article ?",
    answer: "Vous disposez de 30 jours après réception pour retourner un article. Connectez-vous à votre espace client, sélectionnez la commande concernée et imprimez l'étiquette de retour prépayée. Le remboursement est effectué sous 5 à 7 jours après réception du colis.",
  },
  {
    question: "Comment choisir ma taille ?",
    answer: "Consultez notre guide des tailles détaillé pour chaque catégorie de vêtement. En cas de doute, notre service client est disponible par email ou téléphone pour vous conseiller. Nos coupes sont généralement fidèles à la taille.",
  },
  {
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), Apple Pay, Google Pay. Tous les paiements sont sécurisés par Stripe. Aucune donnée bancaire n'est stockée sur nos serveurs.",
  },
  {
    question: "Les matières sont-elles responsables ?",
    answer: "Oui. Nous sélectionnons exclusivement des matières certifiées : coton bio GOTS, lin European Flax, laine mérinos mulesing-free RWS, cachemire issu du commerce équitable. Chaque fiche produit détaille les certifications.",
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation. Passé ce délai, contactez-nous par email à contact@aurele-paris.fr et nous ferons notre possible pour vous aider.",
  },
  {
    question: "Livrez-vous à l'international ?",
    answer: "Nous livrons en France, Belgique, Suisse, Luxembourg, Allemagne, Italie, Espagne et Pays-Bas. Les frais et délais varient selon la destination. Le détail est affiché lors du passage en caisse.",
  },
  {
    question: "Comment entretenir mes vêtements AURÈLE ?",
    answer: "Chaque pièce est livrée avec ses instructions d'entretien. En général, nous recommandons un lavage à 30°C, un séchage à plat et un repassage à basse température. Le cachemire et la soie nécessitent un lavage à la main ou un nettoyage à sec.",
  },
  {
    question: "Proposez-vous des emballages cadeaux ?",
    answer: "Oui. Chaque commande est emballée dans notre packaging signature : papier de soie, pochette en coton réutilisable et carte manuscrite optionnelle. L'option cadeau est gratuite.",
  },
  {
    question: "Comment vous contacter ?",
    answer: "Par email à contact@aurele-paris.fr (réponse sous 24h) ou par téléphone au 01 42 33 78 90 du lundi au samedi, 10h-19h. Vous pouvez aussi nous écrire sur Instagram @aurele_paris.",
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.15em] text-[#191716]/50 mb-10">
          <Link href="/" className="hover:text-[#191716] transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#191716]">FAQ</span>
        </nav>

        {/* Header */}
        <p className="font-jost text-[11px] tracking-[0.4em] uppercase text-[#8a7d6b] mb-4">
          Service client
        </p>
        <h1 className="font-cormorant italic text-4xl md:text-5xl text-[#191716] leading-tight mb-6">
          Questions fréquentes
        </h1>
        <div className="h-px w-16 bg-[#8a7d6b] mb-12" />

        {/* Accordéons */}
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#191716]/8">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-jost text-[15px] font-medium text-[#191716] pr-6 group-hover:text-[#8a7d6b] transition-colors duration-200">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 w-6 h-6 rounded-full border border-[#191716]/20 flex items-center justify-center text-[#191716] text-lg leading-none"
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] pb-6 max-w-[600px]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Retour */}
        <div className="mt-16 pt-10 border-t border-[#191716]/8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-jost text-[12px] uppercase tracking-[0.2em] text-[#8a7d6b] hover:opacity-70 transition-opacity group"
          >
            <span className="w-6 h-px bg-[#8a7d6b] transition-all duration-300 group-hover:w-10" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
