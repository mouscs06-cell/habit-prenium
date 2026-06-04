"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin")
      router.refresh()
    } else {
      setError("Mot de passe incorrect")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-cormorant italic text-4xl text-[#1a1714] tracking-[0.08em]">ÉLUA</h1>
          <p className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#c4a97d] mt-2">Administration</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#1a1714]/[0.06]">
          <h2 className="font-cormorant italic text-2xl text-[#1a1714] mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-inter text-[10px] tracking-[0.2em] uppercase text-[#6b6560] block mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full border border-[#1a1714]/15 rounded-xl px-4 py-3 font-inter text-[13px] text-[#1a1714] focus:outline-none focus:border-[#c4a97d] transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-inter text-[11px] text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1a1714] text-white rounded-xl py-3.5 font-inter text-[10px] tracking-[0.3em] uppercase hover:bg-[#c4a97d] transition-colors duration-300 disabled:opacity-50 mt-2 min-h-[48px]"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center font-inter text-[10px] text-[#6b6560]/50 mt-6">
          ÉLUA Paris — Espace réservé
        </p>
      </div>
    </div>
  )
}
