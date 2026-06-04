import type { Metadata } from "next"
import { Cormorant_Garamond, Jost, Geist } from "next/font/google"
import "./globals.css"
import { GSAPProvider } from "@/components/GSAPProvider"
import { LenisProvider } from "@/components/LenisProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CartSidebar from "@/components/CartSidebar"
import { CartProvider } from "@/components/MiniCart"
import { CONFIG } from "@/CLIENT_CONFIG"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
})

export const metadata: Metadata = {
  title: CONFIG.seo.title,
  description: CONFIG.seo.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={cn(cormorant.variable, jost.variable, "font-sans", geist.variable)}>
      <body>
        <CartProvider>
          <GSAPProvider>
            <LenisProvider>
              <div className="relative z-[1] bg-surface">
                <Header />
                {children}
              </div>
              <div className="sticky bottom-0 z-[0]">
                <Footer />
              </div>
            </LenisProvider>
          </GSAPProvider>

          <CartSidebar />
        </CartProvider>

        {/* Film grain + vignette — fixed, pointer-events:none, GPU safe */}
        <div className="vignette-overlay" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  )
}
