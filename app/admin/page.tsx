"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Stats = {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  monthlyOrders: number
  monthlyRevenue: number
  averageOrder: number
  lowStock: { id: string; title: string; stock: number; category: string }[]
  recentOrders: {
    id: string
    orderNumber: string
    totalAmount: number
    status: string
    createdAt: string
    customer: { firstName: string; lastName: string; email: string }
  }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-700",
  PAID:       "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED:    "bg-orange-100 text-orange-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-700",
  REFUNDED:   "bg-gray-100 text-gray-600",
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e8e5e0]">
      <p className="font-inter text-[9px] tracking-[0.3em] uppercase text-[#6b6560] mb-2">{label}</p>
      <p className="font-cormorant italic text-4xl text-[#1a1714]">{value}</p>
      {sub && <p className="font-inter text-[11px] text-[#6b6560] mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <p className="font-inter text-[12px] text-[#6b6560]">Chargement des données…</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant italic text-4xl text-[#1a1714] mb-1">Dashboard</h1>
        <p className="font-inter text-[11px] text-[#6b6560]">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Chiffre d'affaires"
          value={`${stats.totalRevenue.toFixed(0)} €`}
          sub={`${stats.monthlyRevenue.toFixed(0)} € ce mois`}
        />
        <KpiCard
          label="Commandes"
          value={String(stats.totalOrders)}
          sub={`${stats.monthlyOrders} ce mois`}
        />
        <KpiCard
          label="Clients"
          value={String(stats.totalCustomers)}
        />
        <KpiCard
          label="Panier moyen"
          value={`${stats.averageOrder.toFixed(0)} €`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8]">
            <h2 className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#1a1714]">Commandes récentes</h2>
            <Link href="/admin/orders" className="font-inter text-[10px] text-[#c4a97d] hover:text-[#1a1714] transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0ede8]">
                  {["Commande", "Client", "Montant", "Statut", "Date"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-inter text-[9px] tracking-[0.2em] uppercase text-[#6b6560]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center font-inter text-[12px] text-[#6b6560]">Aucune commande</td></tr>
                ) : stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f7f5f0] hover:bg-[#faf9f7] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders`} className="font-inter text-[12px] text-[#c4a97d] hover:text-[#1a1714]">{order.orderNumber}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-inter text-[12px] text-[#1a1714]">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="font-inter text-[10px] text-[#6b6560]">{order.customer.email}</p>
                    </td>
                    <td className="px-6 py-4 font-cormorant text-xl text-[#1a1714]">{order.totalAmount.toFixed(0)} €</td>
                    <td className="px-6 py-4">
                      <span className={`font-inter text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter text-[11px] text-[#6b6560]">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8]">
            <h2 className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#1a1714]">Stock faible</h2>
            <Link href="/admin/products" className="font-inter text-[10px] text-[#c4a97d] hover:text-[#1a1714] transition-colors">
              Gérer →
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="font-inter text-[12px] text-[#7b8a6e]">✓ Tous les stocks sont bons</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0ede8]">
              {stats.lowStock.map((p) => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-inter text-[12px] text-[#1a1714]">{p.title}</p>
                    <p className="font-inter text-[10px] text-[#6b6560]">{p.category}</p>
                  </div>
                  <span className={`font-inter text-[11px] font-medium px-2.5 py-1 rounded-full ${p.stock <= 5 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.stock} en stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
