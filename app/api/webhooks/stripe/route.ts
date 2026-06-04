import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/send-email"

export const dynamic = "force-dynamic"

function generateOrderNumber(): string {
  const now = new Date()
  const yy = now.getFullYear().toString().slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `EL-${yy}${mm}-${random}`
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  try {
    const event = JSON.parse(body) as {
      type: string
      data: { object: Record<string, unknown> }
    }

    console.log("[Webhook] Event:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string
        amount_total?: number
        payment_intent?: string
        customer_details?: { email?: string; name?: string }
        shipping_details?: {
          address?: {
            line1?: string
            city?: string
            postal_code?: string
            country?: string
          }
        }
        total_details?: { amount_shipping?: number }
      }

      const customerEmail = session.customer_details?.email ?? ""
      const customerName  = session.customer_details?.name  ?? ""
      const shipping      = session.shipping_details

      const [firstName, ...rest] = customerName.split(" ")
      const lastName = rest.join(" ")

      // ── 1. Upsert client ──────────────────────────────────────────────────────
      const customer = await prisma.customer.upsert({
        where:  { email: customerEmail },
        update: {
          firstName, lastName,
          address: shipping?.address?.line1 ?? "",
          city:    shipping?.address?.city  ?? "",
          zipCode: shipping?.address?.postal_code ?? "",
          country: shipping?.address?.country     ?? "FR",
        },
        create: {
          email: customerEmail,
          firstName, lastName,
          address: shipping?.address?.line1 ?? "",
          city:    shipping?.address?.city  ?? "",
          zipCode: shipping?.address?.postal_code ?? "",
          country: shipping?.address?.country     ?? "FR",
        },
      })

      console.log("[Webhook] Customer:", customer.email)

      // ── 2. Récupère les line_items Stripe ────────────────────────────────────
      const lineItemsPage = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 100 }
      )

      // ── 3. Construit les orderItems en cherchant chaque produit par titre ───
      type OrderItemInput = { quantity: number; unitPrice: number; productId: string }
      const orderItemInputs: OrderItemInput[] = []

      for (const item of lineItemsPage.data) {
        const product = await prisma.product.findFirst({
          where: { title: item.description ?? "" },
        })

        if (product) {
          // Décrémente le stock (pas en dessous de 0)
          await prisma.product.update({
            where: { id: product.id },
            data:  { stock: { decrement: item.quantity ?? 1 } },
          })
          console.log(`[Webhook] Stock ${product.title}: -${item.quantity}`)

          orderItemInputs.push({
            quantity:  item.quantity ?? 1,
            unitPrice: (item.price?.unit_amount ?? 0) / 100,
            productId: product.id,
          })
        }
      }

      // ── 4. Crée la commande ──────────────────────────────────────────────────
      const order = await prisma.order.create({
        data: {
          orderNumber:     generateOrderNumber(),
          status:          "PAID",
          totalAmount:     (session.amount_total ?? 0) / 100,
          shippingAmount:  (session.total_details?.amount_shipping ?? 0) / 100,
          stripeSessionId: session.id,
          stripePaymentId: String(session.payment_intent ?? ""),
          shippingName:    customerName,
          shippingAddress: shipping?.address?.line1 ?? "",
          shippingCity:    shipping?.address?.city  ?? "",
          shippingZip:     shipping?.address?.postal_code ?? "",
          shippingCountry: shipping?.address?.country     ?? "FR",
          customerId:      customer.id,
          items: { create: orderItemInputs },
        },
        include: { items: { include: { product: true } }, customer: true },
      })

      console.log(`[Webhook] ✅ Commande ${order.orderNumber} — ${order.totalAmount}€ — ${order.items.length} article(s)`)

      // ── 5. Envoie l'email de confirmation ────────────────────────────────────
      await sendOrderConfirmation({
        to:           customer.email,
        orderNumber:  order.orderNumber,
        customerName: `${customer.firstName} ${customer.lastName}`.trim() || customerName,
        items: order.items.map((item) => ({
          title:     item.product.title,
          quantity:  item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount:    order.totalAmount,
        shippingAmount: order.shippingAmount,
        shippingAddress: {
          name:    order.shippingName,
          address: order.shippingAddress,
          city:    order.shippingCity,
          zip:     order.shippingZip,
          country: order.shippingCountry,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] Error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
