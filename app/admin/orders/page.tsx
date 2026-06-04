"use client"

import { useEffect, useState } from "react"

type Order = {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingAmount: number
  createdAt: string
  customer: { firstName: string; lastName: string; email: string }
  items: { quantity: number; unitPrice: number; product: { title: string } }[]
}

const ALL_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-700",
  PAID:       "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED:    "bg-orange-100 text-orange-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-600",
  REFUNDED:   "bg-gray-100 text-gray-600",
}

const STATUS_FR: Record<string, string> = {
  PENDING:    "En attente",
  PAID:       "Payée",
  PROCESSING: "En préparation",
  SHIPPED:    "Expédiée",
  DELIVERED:  "Livrée",
  CANCELLED:  "Annulée",
  REFUNDED:   "Remboursée",
}

export default function AdminOrdersPage() {
  const [orders,    setOrders]    = useState<Order[]>([])
  const [filter,    setFilter]    = useState("ALL")
  const [loading,   setLoading]   = useState(true)
  const [updating,  setUpdating]  = useState<string | null>(null)
  const [expanded,  setExpanded]  = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const qs = filter !== "ALL" ? `?status=${filter}` : ""
    fetch(`/api/orders${qs}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false) })
  }, [filter])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    const res = await fetch(`/api/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: updated.status } : o))
    }
    setUpdating(null)
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-cormorant italic text-4xl text-[#1a1714] mb-1">Commandes</h1>
          <p className="font-inter text-[11px] text-[#6b6560]">{orders.length} commande{orders.length > 1 ? "s" : ""}</p>
        </div>
        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", ...ALL_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "font-inter text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition-colors",
                filter === s
                  ? "bg-[#1a1714] text-white border-[#1a1714]"
                  : "bg-transparent text-[#6b6560] border-[#1a1714]/15 hover:border-[#c4a97d]",
              ].join(" ")}
            >
              {s === "ALL" ? "Tous" : STATUS_FR[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center font-inter text-[12px] text-[#6b6560]">Chargement…</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center font-inter text-[12px] text-[#6b6560]">Aucune commande trouvée</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0ede8]">
                {["", "Commande", "Client", "Articles", "Total", "Statut", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-inter text-[9px] tracking-[0.2em] uppercase text-[#6b6560]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-[#f7f5f0] hover:bg-[#faf9f7] transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-5 py-4 text-[#6b6560] text-sm">
                      {expanded === order.id ? "▾" : "▸"}
                    </td>
                    <td className="px-5 py-4 font-inter text-[12px] text-[#c4a97d] whitespace-nowrap">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p className="font-inter text-[12px] text-[#1a1714]">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="font-inter text-[10px] text-[#6b6560]">{order.customer.email}</p>
                    </td>
                    <td className="px-5 py-4 font-inter text-[12px] text-[#6b6560]">{order.items.length} article{order.items.length > 1 ? "s" : ""}</td>
                    <td className="px-5 py-4 font-cormorant text-xl text-[#1a1714] whitespace-nowrap">{order.totalAmount.toFixed(0)} €</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={[
                          "font-inter text-[9px] tracking-[0.1em] uppercase px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer disabled:opacity-50",
                          STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600",
                        ].join(" ")}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_FR[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 font-inter text-[11px] text-[#6b6560] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-[#faf9f7] border-b border-[#f0ede8]">
                      <td colSpan={7} className="px-8 py-4">
                        <div className="flex gap-8 flex-wrap">
                          <div>
                            <p className="font-inter text-[9px] tracking-[0.25em] uppercase text-[#6b6560] mb-2">Articles</p>
                            {order.items.map((item, i) => (
                              <p key={i} className="font-inter text-[12px] text-[#1a1714]">
                                {item.product.title} ×{item.quantity} — {(item.unitPrice * item.quantity).toFixed(0)} €
                              </p>
                            ))}
                          </div>
                          <div>
                            <p className="font-inter text-[9px] tracking-[0.25em] uppercase text-[#6b6560] mb-2">Livraison</p>
                            <p className="font-inter text-[12px] text-[#1a1714]">
                              {order.shippingAmount === 0 ? "Offerte" : `${order.shippingAmount.toFixed(2)} €`}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
