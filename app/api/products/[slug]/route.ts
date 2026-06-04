import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({ where: { slug } })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("[API/products/slug] Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
