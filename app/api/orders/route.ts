import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@/lib/generated/prisma/enums"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as OrderStatus | null
    const limit  = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200)

    const orders = await prisma.order.findMany({
      where:   status ? { status } : undefined,
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take:    limit,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[API/orders] Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
