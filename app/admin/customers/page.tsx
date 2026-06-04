"use client"

import { useEffect, useState } from "react"

type Customer = {
  id: string
  email: string
  firstName: string
  lastName: string
  city: string
  country: string
  createdAt: string
  orders: { id: string; totalAmount: number }[]
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState("")

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => { setCustomers(d); setLoading(false) })
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.email.toLowerCase().includes(q) || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
  })

  const totalRevenue = customers.reduce(
    (sum, c) => sum + c.orders.reduce((s, o) => s + o.totalAmount, 0),
    0
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-cormorant italic text-4xl text-[#1a1714] mb-1">Clients</h1>
          <p className="font-inter text-[11px] text-[#6b6560]">
            {customers.length} clients · Revenus totaux : {totalRevenue.toFixed(0)} €
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email…"
          className="border border-[#e8e5e0] rounded-xl px-4 py-2.5 font-inter text-[12px] text-[#1a1714] focus:outline-none focus:border-[#c4a97d] transition-colors w-full max-w-[280px] bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center font-inter text-[12px] text-[#6b6560]">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center font-inter text-[12px] text-[#6b6560]">Aucun client trouvé</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0ede8]">
                {["Client", "Email", "Ville", "Commandes", "Dépenses totales", "Depuis"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-inter text-[9px] tracking-[0.2em] uppercase text-[#6b6560]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const spent = customer.orders.reduce((s, o) => s + o.totalAmount, 0)
                return (
                  <tr key={customer.id} className="border-b border-[#f7f5f0] hover:bg-[#faf9f7] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-inter text-[13px] text-[#1a1714] font-medium">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-inter text-[12px] text-[#6b6560]">{customer.email}</td>
                    <td className="px-6 py-4 font-inter text-[12px] text-[#6b6560]">
                      {customer.city ? `${customer.city}, ${customer.country}` : customer.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-inter text-[12px] bg-[#f7f5f0] px-2.5 py-1 rounded-full text-[#1a1714]">
                        {customer.orders.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-cormorant text-xl text-[#1a1714]">{spent.toFixed(0)} €</td>
                    <td className="px-6 py-4 font-inter text-[11px] text-[#6b6560]">
                      {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
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
