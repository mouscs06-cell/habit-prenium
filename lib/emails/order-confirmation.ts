import { CONFIG } from "@/CLIENT_CONFIG"

export type OrderConfirmationProps = {
  orderNumber: string
  customerName: string
  items: { title: string; quantity: number; unitPrice: number }[]
  totalAmount: number
  shippingAmount: number
  shippingAddress: {
    name: string
    address: string
    city: string
    zip: string
    country: string
  }
}

export function generateOrderConfirmationHTML(props: OrderConfirmationProps): string {
  const { orderNumber, customerName, items, totalAmount, shippingAmount, shippingAddress } = props
  const firstName = customerName.split(" ")[0] || customerName
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://elua-paris.fr"

  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #f0ede8;font-family:Georgia,serif;font-size:15px;color:#1a1714;">
        ${item.title}
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:center;font-family:Arial,sans-serif;font-size:13px;color:#6b6560;">
        ×${item.quantity}
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:Georgia,serif;font-size:15px;color:#1a1714;">
        ${(item.unitPrice * item.quantity).toFixed(2)}&nbsp;€
      </td>
    </tr>`
    )
    .join("")

  const shippingLine =
    shippingAmount === 0
      ? `<span style="color:#7b8a6e;">Offerte</span>`
      : `${shippingAmount.toFixed(2)}&nbsp;€`

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Commande confirmée — ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f5f0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0;padding:48px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- Logo -->
    <tr>
      <td align="center" style="padding:0 0 36px;">
        <h1 style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:32px;color:#1a1714;letter-spacing:0.06em;">${CONFIG.brandName}</h1>
        <p style="margin:5px 0 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#c4a97d;">${CONFIG.tagline}</p>
      </td>
    </tr>

    <!-- Card -->
    <tr>
      <td style="background-color:#ffffff;border-radius:20px;padding:52px 48px 48px;">

        <!-- Checkmark -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:60px;height:60px;border-radius:50%;border:1.5px solid #c4a97d;text-align:center;vertical-align:middle;font-size:26px;color:#c4a97d;">✓</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Heading -->
        <h2 style="margin:0 0 10px;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:26px;color:#1a1714;">
          Merci ${firstName}&nbsp;!
        </h2>
        <p style="margin:0 0 36px;text-align:center;font-family:Arial,sans-serif;font-size:14px;color:#6b6560;line-height:1.7;">
          Votre commande a été confirmée et sera préparée<br>avec le plus grand soin dans notre atelier parisien.
        </p>

        <!-- Order number badge -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
          <tr>
            <td align="center" style="background-color:#f7f5f0;border-radius:14px;padding:18px 24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6b6560;">Numéro de commande</p>
              <p style="margin:5px 0 0;font-family:Georgia,serif;font-size:20px;color:#1a1714;letter-spacing:0.05em;">${orderNumber}</p>
            </td>
          </tr>
        </table>

        <!-- Items table header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #e8e5e0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#6b6560;">Produit</td>
            <td style="padding:8px 0;border-bottom:1px solid #e8e5e0;text-align:center;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#6b6560;">Qté</td>
            <td style="padding:8px 0;border-bottom:1px solid #e8e5e0;text-align:right;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#6b6560;">Prix</td>
          </tr>
          ${itemRows}
        </table>

        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
          <tr>
            <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6560;">Sous-total</td>
            <td style="padding:10px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#1a1714;">${(totalAmount - shippingAmount).toFixed(2)}&nbsp;€</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:13px;color:#6b6560;">Livraison</td>
            <td style="padding:10px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;">${shippingLine}</td>
          </tr>
          <tr>
            <td style="padding:18px 0 0;border-top:1px solid #e8e5e0;font-family:Georgia,serif;font-size:20px;color:#1a1714;">Total</td>
            <td style="padding:18px 0 0;border-top:1px solid #e8e5e0;text-align:right;font-family:Georgia,serif;font-size:20px;color:#1a1714;">${totalAmount.toFixed(2)}&nbsp;€</td>
          </tr>
        </table>

        <!-- Shipping address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
          <tr>
            <td style="background-color:#f7f5f0;border-radius:14px;padding:22px 28px;">
              <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6b6560;">Adresse de livraison</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#1a1714;line-height:1.7;">
                ${shippingAddress.name}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.zip} ${shippingAddress.city}<br>
                ${shippingAddress.country}
              </p>
            </td>
          </tr>
        </table>

        <!-- Reassurance -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
          <tr>
            <td align="center" style="border-top:1px solid #f0ede8;padding-top:28px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b6560;line-height:2.0;">
                ✓ Livraison sous 1–3 jours ouvrés &nbsp;·&nbsp; ✓ Paiement sécurisé &nbsp;·&nbsp; ✓ Retours 30 jours
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
          <tr>
            <td align="center">
              <a href="${baseUrl}/catalog"
                 style="display:inline-block;background-color:#1a1714;color:#f7f5f0;text-decoration:none;border-radius:999px;padding:15px 36px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;">
                Continuer mes achats
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding:36px 0 0;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b6560;">
          ${CONFIG.contact.email} &nbsp;·&nbsp; ${CONFIG.contact.phone}
        </p>
        <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#aaa;">
          © 2025 ${CONFIG.brandName} ${CONFIG.city} — Tous droits réservés
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}
