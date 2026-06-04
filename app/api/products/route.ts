import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where:   { isActive: true },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("[API/products] Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
