import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: { select: { id: true, totalAmount: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error("[API/admin/customers] Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
