import Link from "next/link"

export const metadata = {
  title: "Livraison & Expédition — AURÈLE Paris",
  description: "Délais, tarifs et zones de livraison AURÈLE Paris.",
}

const zones = [
  { pays: "France métropolitaine", standard: "Gratuit dès 150€ / 5,90€", express: "12,90€", delai: "2–5 jours" },
  { pays: "Belgique, Luxembourg", standard: "9,90€", express: "18,90€", delai: "3–6 jours" },
  { pays: "Suisse", standard: "14,90€", express: "24,90€", delai: "4–7 jours" },
  { pays: "Allemagne, Italie, Espagne", standard: "9,90€", express: "18,90€", delai: "3–6 jours" },
  { pays: "Pays-Bas", standard: "9,90€", express: "18,90€", delai: "3–6 jours" },
]

export default function LivraisonPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.15em] text-[#191716]/50 mb-10">
          <Link href="/" className="hover:text-[#191716] transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#191716]">Livraison</span>
        </nav>

        {/* Header */}
        <p className="font-jost text-[11px] tracking-[0.4em] uppercase text-[#8a7d6b] mb-4">
          Expédition
        </p>
        <h1 className="font-cormorant italic text-4xl md:text-5xl text-[#191716] leading-tight mb-6">
          Livraison &amp; Expédition
        </h1>
        <div className="h-px w-16 bg-[#8a7d6b] mb-12" />

        {/* Section 1 — Modes */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-6">
          Modes de livraison
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {[
            {
              label: "Standard",
              delai: "2–5 jours ouvrés",
              prix: "Gratuit dès 150€ / sinon 5,90€",
              desc: "Livraison à domicile ou en point relais, avec numéro de suivi.",
            },
            {
              label: "Express",
              delai: "24–48h",
              prix: "12,90€",
              desc: "Livraison prioritaire à domicile, disponible du lundi au vendredi.",
            },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl p-6 border border-[#191716]/[0.05]">
              <p className="font-jost text-[11px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-2">{m.label}</p>
              <p className="font-cormorant italic text-2xl text-[#191716] mb-1">{m.delai}</p>
              <p className="font-jost text-[13px] font-medium text-[#191716] mb-3">{m.prix}</p>
              <p className="font-jost text-[13px] text-[#191716]/55 leading-[1.7]">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 2 — Zones */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-6">
          Zones de livraison
        </p>
        <div className="overflow-hidden rounded-xl border border-[#191716]/[0.06] mb-14">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#191716]">
                <th className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#f5f2ed] py-4 px-5">Destination</th>
                <th className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#f5f2ed] py-4 px-5">Standard</th>
                <th className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#f5f2ed] py-4 px-5">Express</th>
                <th className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#f5f2ed] py-4 px-5">Délai</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z, i) => (
                <tr key={z.pays} className={i % 2 === 0 ? "bg-white" : "bg-[#f5f2ed]/50"}>
                  <td className="font-jost text-[14px] text-[#191716] py-4 px-5">{z.pays}</td>
                  <td className="font-jost text-[14px] text-[#191716]/70 py-4 px-5">{z.standard}</td>
                  <td className="font-jost text-[14px] text-[#191716]/70 py-4 px-5">{z.express}</td>
                  <td className="font-jost text-[14px] text-[#191716]/70 py-4 px-5">{z.delai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3 — Suivi */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Suivi de commande
        </p>
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-14">
          Un email avec votre numéro de suivi vous est envoyé dès l&apos;expédition de votre colis. Vous pouvez suivre votre livraison en temps réel directement depuis cet email ou dans votre espace client.
        </p>

        {/* Section 4 — Contact */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Des questions ?
        </p>
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-4">
          Notre service client est disponible du lundi au samedi, 10h–19h. Consultez notre{" "}
          <Link href="/faq" className="text-[#8a7d6b] hover:opacity-70 transition-opacity underline underline-offset-2">
            FAQ
          </Link>{" "}
          ou écrivez-nous à{" "}
          <a href="mailto:contact@aurele-paris.fr" className="text-[#8a7d6b] hover:opacity-70 transition-opacity underline underline-offset-2">
            contact@aurele-paris.fr
          </a>
          .
        </p>

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
