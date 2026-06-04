import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@/lib/generated/prisma/enums"
import { sendShippingConfirmation } from "@/lib/send-email"

const include = { customer: true, items: { include: { product: true } } } as const

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id }, include })

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error("[API/orders/id] GET Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = (await req.json()) as { status: OrderStatus }

    const order = await prisma.order.update({
      where:   { id },
      data:    { status },
      include,
    })

    // Envoie l'email d'expédition quand le statut passe à SHIPPED
    if (status === "SHIPPED") {
      await sendShippingConfirmation({
        to:           order.customer.email,
        orderNumber:  order.orderNumber,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("[API/orders/id] PATCH Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
