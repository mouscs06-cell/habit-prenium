import Link from "next/link"

export const metadata = {
  title: "Guide des Tailles — AURÈLE Paris",
  description: "Tableau des tailles homme et femme pour les collections AURÈLE Paris.",
}

const hommeRows = [
  { taille: "S", poitrine: "88–92 cm", taille_m: "76–80 cm", hanches: "90–94 cm" },
  { taille: "M", poitrine: "92–96 cm", taille_m: "80–84 cm", hanches: "94–98 cm" },
  { taille: "L", poitrine: "96–100 cm", taille_m: "84–88 cm", hanches: "98–102 cm" },
  { taille: "XL", poitrine: "100–104 cm", taille_m: "88–92 cm", hanches: "102–106 cm" },
  { taille: "XXL", poitrine: "104–108 cm", taille_m: "92–96 cm", hanches: "106–110 cm" },
]

const femmeRows = [
  { taille: "34", poitrine: "80–84 cm", taille_m: "60–64 cm", hanches: "86–90 cm" },
  { taille: "36", poitrine: "84–88 cm", taille_m: "64–68 cm", hanches: "90–94 cm" },
  { taille: "38", poitrine: "88–92 cm", taille_m: "68–72 cm", hanches: "94–98 cm" },
  { taille: "40", poitrine: "92–96 cm", taille_m: "72–76 cm", hanches: "98–102 cm" },
  { taille: "42", poitrine: "96–100 cm", taille_m: "76–80 cm", hanches: "102–106 cm" },
  { taille: "44", poitrine: "100–104 cm", taille_m: "80–84 cm", hanches: "106–110 cm" },
]

function SizeTable({ rows, headers }: {
  rows: Record<string, string>[]
  headers: { key: string; label: string }[]
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#191716]/[0.06] mb-14">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#191716]">
            {headers.map((h) => (
              <th key={h.key} className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#f5f2ed] py-4 px-5 md:px-6">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#f5f2ed]/50"}>
              {headers.map((h) => (
                <td key={h.key} className={`font-jost text-[14px] py-4 px-5 md:px-6 ${h.key === "taille" ? "font-medium text-[#191716]" : "text-[#191716]/70"}`}>
                  {row[h.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const tableHeaders = [
  { key: "taille", label: "Taille" },
  { key: "poitrine", label: "Tour poitrine" },
  { key: "taille_m", label: "Tour taille" },
  { key: "hanches", label: "Tour hanches" },
]

export default function GuideTaillesPage() {
  return (
    <main className="min-h-[100dvh] bg-[#f5f2ed] pt-32 pb-24 px-6 md:px-20">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.15em] text-[#191716]/50 mb-10">
          <Link href="/" className="hover:text-[#191716] transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#191716]">Guide des tailles</span>
        </nav>

        {/* Header */}
        <p className="font-jost text-[11px] tracking-[0.4em] uppercase text-[#8a7d6b] mb-4">
          Conseil
        </p>
        <h1 className="font-cormorant italic text-4xl md:text-5xl text-[#191716] leading-tight mb-6">
          Guide des Tailles
        </h1>
        <div className="h-px w-16 bg-[#8a7d6b] mb-12" />

        {/* Comment se mesurer */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-4">
          Comment se mesurer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {[
            { label: "Tour de poitrine", desc: "Placez le mètre ruban sous les aisselles, à la partie la plus forte de la poitrine." },
            { label: "Tour de taille", desc: "Mesurez à l'endroit le plus étroit du torse, généralement au-dessus du nombril." },
            { label: "Tour de hanches", desc: "Placez le mètre à la partie la plus forte des hanches, environ 20 cm sous la taille." },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl p-5 border border-[#191716]/[0.05]">
              <p className="font-jost text-[12px] uppercase tracking-[0.2em] text-[#8a7d6b] mb-2">{m.label}</p>
              <p className="font-jost text-[13px] text-[#191716]/60 leading-[1.7]">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Tableau Homme */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-6">
          Homme
        </p>
        <SizeTable rows={hommeRows} headers={tableHeaders} />

        {/* Tableau Femme */}
        <p className="font-jost text-[13px] tracking-[0.25em] uppercase text-[#191716] font-medium mb-6">
          Femme
        </p>
        <SizeTable rows={femmeRows} headers={tableHeaders} />

        {/* Conseil */}
        <div className="bg-[#191716] rounded-2xl p-8 mb-14">
          <p className="font-jost text-[11px] uppercase tracking-[0.3em] text-[#8a7d6b] mb-3">Conseil AURÈLE</p>
          <p className="font-cormorant italic text-xl text-[#f5f2ed] leading-[1.6]">
            En cas de doute entre deux tailles, nous vous recommandons de prendre la taille supérieure pour un confort optimal. Nos coupes structurées sont conçues pour être portées légèrement relâchées.
          </p>
        </div>

        {/* Contact */}
        <p className="font-jost text-[15px] text-[#191716]/60 leading-[1.8] mb-14">
          Besoin d&apos;un conseil personnalisé ? Notre équipe est disponible à{" "}
          <a href="mailto:contact@aurele-paris.fr" className="text-[#8a7d6b] hover:opacity-70 transition-opacity underline underline-offset-2">
            contact@aurele-paris.fr
          </a>
          .
        </p>

        {/* Retour */}
        <div className="pt-10 border-t border-[#191716]/8">
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
