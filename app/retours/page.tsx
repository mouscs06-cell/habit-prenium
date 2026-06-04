import Link from "next/link"

export const metadata = {
  title: "Retours & Échanges — AURÈLE Paris",
  description: "Politique de retours et échanges AURÈLE Paris. 30 jours, retours gratuits.",
}

const steps = [
  {
    num: "01",
    title: "Connectez-vous",
    desc: "Accédez à votre espace client et sélectionnez la commande concernée.",
  },
  {
    num: "02",
    title: "Sélectionnez les articles",
    desc: "Choisissez les pièces à retourner et indiquez la raison du retour.",
  },
  {
    num: "03",
    title: "Imprimez l'étiquette",
    desc: "Téléchargez et imprimez votre étiquette de retour prépayée.",
  },
  {
    num: "04",
    title: "Déposez le colis",
    desc: "Emballez soigneusement vos articles et déposez le colis dans le point relais le plus proche.",
  },
]

export default function RetoursPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.15em] text-[#191716]/50 mb-10">
          <Link href="/" className="hover:text-[#191716] transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#191716]">Retours</span>
        </nav>

        {/* Header */}
        <p className="font-jost text-[11px] tracking-[0.4em] uppercase text-[#8a7d6b] mb-4">
          Politique
        </p>
        <h1 className="font-cormorant italic text-4xl md:text-5xl text-[#191716] leading-tight mb-6">
          Retours &amp; Échanges
        </h1>
        <div className="h-px w-16 bg-[#8a7d6b] mb-12" />

        {/* Section 1 — Politique */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Notre politique
        </p>
        <div className="bg-white rounded-2xl p-8 border border-[#191716]/[0.05] mb-14">
          <p className="font-cormorant italic text-2xl text-[#191716] mb-3">
            30 jours pour changer d&apos;avis
          </p>
          <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8]">
            Retours gratuits en France métropolitaine. Les articles doivent être retournés dans leur état d&apos;origine, non portés, non lavés et avec leurs étiquettes d&apos;origine. Les articles soldés ne sont pas repris.
          </p>
        </div>

        {/* Section 2 — Étapes */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-8">
          Comment retourner un article
        </p>
        <div className="space-y-6 mb-14">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6 items-start">
              <span className="font-cormorant italic text-3xl text-[#8a7d6b]/40 flex-shrink-0 leading-none mt-1">
                {s.num}
              </span>
              <div>
                <p className="font-jost text-[15px] font-medium text-[#191716] mb-1">{s.title}</p>
                <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3 — Remboursement */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Remboursement
        </p>
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-14">
          Le remboursement est effectué sous 5 à 7 jours ouvrés après réception et contrôle de votre colis. Il est réalisé sur le moyen de paiement utilisé lors de votre commande.
        </p>

        {/* Section 4 — Échanges */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Échanges
        </p>
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-4">
          Pour un échange de taille ou de coloris, retournez l&apos;article en suivant la procédure ci-dessus et passez une nouvelle commande sur notre boutique. Cela vous garantit la disponibilité immédiate de la pièce souhaitée.
        </p>
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-14">
          Pour toute question, notre équipe est disponible à{" "}
          <a href="mailto:contact@aurele-paris.fr" className="text-[#8a7d6b] hover:opacity-70 transition-opacity underline underline-offset-2">
            contact@aurele-paris.fr
          </a>
          .
        </p>

        {/* Liens croisés */}
        <div className="grid grid-cols-2 gap-4 mb-14">
          <Link href="/livraison" className="bg-white rounded-xl p-5 border border-[#191716]/[0.05] hover:border-[#8a7d6b]/20 transition-colors group">
            <p className="font-jost text-[11px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-2">Voir aussi</p>
            <p className="font-jost text-[14px] text-[#191716] group-hover:text-[#8a7d6b] transition-colors">Livraison →</p>
          </Link>
          <Link href="/faq" className="bg-white rounded-xl p-5 border border-[#191716]/[0.05] hover:border-[#8a7d6b]/20 transition-colors group">
            <p className="font-jost text-[11px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-2">Voir aussi</p>
            <p className="font-jost text-[14px] text-[#191716] group-hover:text-[#8a7d6b] transition-colors">FAQ →</p>
          </Link>
        </div>

        {/* Retour */}
        <div className="mt-4 pt-10 border-t border-[#191716]/8">
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
