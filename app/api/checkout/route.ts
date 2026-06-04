import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { CONFIG } from "@/CLIENT_CONFIG"

type CheckoutItem = {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  subtitle: string
}

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as { items: CheckoutItem[] }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    const currency = CONFIG.shop.currency.toLowerCase()
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    // Line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.title,
          description: item.subtitle,
          images: [`${baseUrl}${item.image}`],
          metadata: { product_id: item.id },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Determine shipping options based on cart total
    const isFreeShipping = totalPrice >= CONFIG.shop.freeShippingThreshold

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/catalog`,

      shipping_address_collection: {
        allowed_countries: CONFIG.shop.allowedCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: isFreeShipping ? 0 : Math.round(CONFIG.shop.shippingCost * 100),
              currency,
            },
            display_name: isFreeShipping
              ? "Livraison offerte"
              : `Livraison standard (${CONFIG.shop.shippingCost}${CONFIG.shop.currencySymbol})`,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(CONFIG.shop.expressShippingCost * 100),
              currency,
            },
            display_name: `Livraison express 24h (${CONFIG.shop.expressShippingCost}${CONFIG.shop.currencySymbol})`,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],

      locale: "fr",
      allow_promotion_codes: true,

      metadata: {
        order_source: `${CONFIG.brandName.toLowerCase()}_website`,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    )
  }
}
