import { resend } from "@/lib/resend"
import { CONFIG } from "@/CLIENT_CONFIG"
import { generateOrderConfirmationHTML, type OrderConfirmationProps } from "@/lib/emails/order-confirmation"
import { generateShippingHTML, type ShippingConfirmationProps } from "@/lib/emails/shipping-confirmation"

// In Resend free tier, the from address must be onboarding@resend.dev.
// Once a custom domain is verified on Resend, change to e.g. contact@elua-paris.fr
const FROM = `${CONFIG.brandName} <onboarding@resend.dev>`

export async function sendOrderConfirmation(
  params: OrderConfirmationProps & { to: string }
) {
  try {
    const { to, ...rest } = params
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to,
      subject: `Commande confirmée — ${params.orderNumber}`,
      html:    generateOrderConfirmationHTML(rest),
    })

    if (error) {
      console.error("[Email] sendOrderConfirmation error:", error)
      return { success: false, error }
    }

    console.log("[Email] ✅ Confirmation envoyée:", data?.id)
    return { success: true, id: data?.id }
  } catch (err) {
    console.error("[Email] sendOrderConfirmation threw:", err)
    return { success: false, error: err }
  }
}

export async function sendShippingConfirmation(
  params: ShippingConfirmationProps & { to: string }
) {
  try {
    const { to, ...rest } = params
    const { data, error } = await resend.emails.send({
      from:    FROM,
      to,
      subject: `Votre commande ${params.orderNumber} est en route !`,
      html:    generateShippingHTML(rest),
    })

    if (error) {
      console.error("[Email] sendShippingConfirmation error:", error)
      return { success: false, error }
    }

    console.log("[Email] ✅ Expédition envoyée:", data?.id)
    return { success: true, id: data?.id }
  } catch (err) {
    console.error("[Email] sendShippingConfirmation threw:", err)
    return { success: false, error: err }
  }
}
