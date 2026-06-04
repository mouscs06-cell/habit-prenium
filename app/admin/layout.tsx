"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { CONFIG } from "@/CLIENT_CONFIG"

const NAV = [
  { label: "Dashboard",  href: "/admin",            icon: "◈" },
  { label: "Commandes",  href: "/admin/orders",      icon: "⊡" },
  { label: "Produits",   href: "/admin/products",    icon: "◫" },
  { label: "Clients",    href: "/admin/customers",   icon: "◯" },
]

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] shrink-0 bg-[#111] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/[0.06]">
        <p className="font-cormorant italic text-2xl text-[#f7f5f0] tracking-[0.08em]">{CONFIG.brandName}</p>
        <p className="font-inter text-[8px] tracking-[0.35em] uppercase text-[#c4a97d] mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-[11px] tracking-[0.1em] transition-colors duration-200",
                active
                  ? "bg-[#c4a97d]/20 text-[#c4a97d]"
                  : "text-[#f7f5f0]/50 hover:text-[#f7f5f0] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <span className="text-[16px] leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06] flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-[11px] text-[#f7f5f0]/30 hover:text-[#f7f5f0]/60 transition-colors"
        >
          <span className="text-[14px]">↗</span> Voir le site
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-[11px] text-[#f7f5f0]/30 hover:text-red-400 transition-colors text-left w-full"
        >
          <span className="text-[14px]">→</span> Se déconnecter
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [auth, setAuth]       = useState<"loading" | "ok" | "no">("loading")

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) { setAuth("ok"); return }

    fetch("/api/admin/verify")
      .then((r) => setAuth(r.ok ? "ok" : "no"))
      .catch(() => setAuth("no"))
  }, [isLoginPage])

  useEffect(() => {
    if (auth === "no") router.push("/admin/login")
  }, [auth, router])

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  // Login page — no chrome
  if (isLoginPage) return <>{children}</>

  // Loading
  if (auth === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
        <p className="font-cormorant italic text-2xl text-[#1a1714]/30">Chargement…</p>
      </div>
    )
  }

  if (auth === "no") return null

  return (
    <div className="flex min-h-screen bg-[#f4f2ed]">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
