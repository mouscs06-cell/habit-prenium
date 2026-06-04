import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await req.json()) as { stock?: number; isActive?: boolean }

    const product = await prisma.product.update({
      where: { id },
      data:  body,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[API/admin/products/id] PATCH Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
