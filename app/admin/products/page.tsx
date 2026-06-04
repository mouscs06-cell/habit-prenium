"use client"

import { useEffect, useState } from "react"

type Product = {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  price: number
  stock: number
  badge: string
  isActive: boolean
}

export default function AdminProductsPage() {
  const [products,  setProducts]  = useState<Product[]>([])
  const [loading,   setLoading]   = useState(true)
  const [editing,   setEditing]   = useState<Record<string, number>>({})
  const [saving,    setSaving]    = useState<string | null>(null)
  const [saved,     setSaved]     = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d); setLoading(false) })
  }, [])

  async function saveStock(product: Product) {
    const newStock = editing[product.id]
    if (newStock === undefined) return
    setSaving(product.id)

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ stock: newStock }),
    })

    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, stock: newStock } : p))
      setEditing((prev) => { const n = { ...prev }; delete n[product.id]; return n })
      setSaved(product.id)
      setTimeout(() => setSaved(null), 2000)
    }
    setSaving(null)
  }

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-cormorant italic text-4xl text-[#1a1714] mb-1">Produits</h1>
          <p className="font-inter text-[11px] text-[#6b6560]">
            {products.length} produits · Valeur stock : {totalValue.toFixed(0)} €
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center font-inter text-[12px] text-[#6b6560]">Chargement…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0ede8]">
                {["Produit", "Catégorie", "Prix", "Stock", "Valeur", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-inter text-[9px] tracking-[0.2em] uppercase text-[#6b6560]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const editStock  = editing[product.id]
                const isEditing  = editStock !== undefined
                const currentStock = isEditing ? editStock : product.stock

                return (
                  <tr key={product.id} className="border-b border-[#f7f5f0] hover:bg-[#faf9f7] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-inter text-[13px] text-[#1a1714] font-medium">{product.title}</p>
                      <p className="font-inter text-[10px] text-[#6b6560]">{product.subtitle}</p>
                      {product.badge && (
                        <span className="font-inter text-[8px] tracking-[0.2em] uppercase bg-[#c4a97d]/15 text-[#c4a97d] px-2 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-inter text-[12px] text-[#6b6560]">{product.category}</td>
                    <td className="px-6 py-4 font-cormorant text-xl text-[#1a1714]">{product.price} €</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={currentStock}
                          onChange={(e) => setEditing((prev) => ({ ...prev, [product.id]: parseInt(e.target.value) || 0 }))}
                          className={[
                            "w-20 border rounded-lg px-3 py-1.5 font-inter text-[12px] text-center focus:outline-none transition-colors",
                            product.stock <= 10 ? "border-red-300 bg-red-50" : "border-[#e8e5e0] bg-transparent",
                            "focus:border-[#c4a97d]",
                          ].join(" ")}
                        />
                        {product.stock <= 10 && !isEditing && (
                          <span className="font-inter text-[9px] text-red-500">⚠ Faible</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-inter text-[12px] text-[#6b6560]">
                      {(currentStock * product.price).toFixed(0)} €
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveStock(product)}
                            disabled={saving === product.id}
                            className="font-inter text-[10px] tracking-[0.1em] uppercase bg-[#1a1714] text-white px-3 py-1.5 rounded-lg hover:bg-[#c4a97d] transition-colors disabled:opacity-50"
                          >
                            {saving === product.id ? "…" : "Sauver"}
                          </button>
                          <button
                            onClick={() => setEditing((prev) => { const n = { ...prev }; delete n[product.id]; return n })}
                            className="font-inter text-[10px] text-[#6b6560] hover:text-[#1a1714] px-2"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      {saved === product.id && !isEditing && (
                        <span className="font-inter text-[10px] text-[#7b8a6e]">✓ Sauvé</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
