import { CONFIG } from "@/CLIENT_CONFIG"

export type ShippingConfirmationProps = {
  orderNumber: string
  customerName: string
  trackingUrl?: string
}

export function generateShippingHTML(props: ShippingConfirmationProps): string {
  const { orderNumber, customerName, trackingUrl } = props
  const firstName = customerName.split(" ")[0] || customerName
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://elua-paris.fr"

  const trackingBlock = trackingUrl
    ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
          <tr>
            <td align="center">
              <a href="${trackingUrl}"
                 style="display:inline-block;background-color:#c4a97d;color:#ffffff;text-decoration:none;border-radius:999px;padding:15px 36px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;">
                Suivre mon colis →
              </a>
            </td>
          </tr>
        </table>`
    : ""

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Votre commande ${orderNumber} est en route !</title>
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

        <!-- Icon -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <p style="margin:0;font-size:40px;line-height:1;">📦</p>
            </td>
          </tr>
        </table>

        <!-- Heading -->
        <h2 style="margin:0 0 10px;text-align:center;font-family:Georgia,serif;font-style:italic;font-size:26px;color:#1a1714;">
          En route, ${firstName}&nbsp;!
        </h2>
        <p style="margin:0 0 36px;text-align:center;font-family:Arial,sans-serif;font-size:14px;color:#6b6560;line-height:1.7;">
          Votre commande a été confiée à notre transporteur<br>et sera livrée sous 1–3 jours ouvrés.
        </p>

        <!-- Order number badge -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
          <tr>
            <td align="center" style="background-color:#f7f5f0;border-radius:14px;padding:18px 24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#6b6560;">Commande expédiée</p>
              <p style="margin:5px 0 0;font-family:Georgia,serif;font-size:20px;color:#1a1714;letter-spacing:0.05em;">${orderNumber}</p>
            </td>
          </tr>
        </table>

        <!-- Delivery steps -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          ${[
            { icon: "✓", label: "Commande confirmée", done: true },
            { icon: "✓", label: "Préparation en atelier", done: true },
            { icon: "→", label: "En cours de livraison", done: true },
            { icon: "○", label: "Livraison prévue sous 1–3 jours", done: false },
          ]
            .map(
              (step) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0ede8;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:28px;font-family:Arial,sans-serif;font-size:14px;color:${step.done ? "#c4a97d" : "#ccc"};">${step.icon}</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:${step.done ? "#1a1714" : "#aaa"};">${step.label}</td>
                </tr>
              </table>
            </td>
          </tr>`
            )
            .join("")}
        </table>

        ${trackingBlock}

        <!-- Contact -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
          <tr>
            <td style="border-top:1px solid #f0ede8;padding-top:28px;text-align:center;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#6b6560;line-height:1.7;">
                Une question sur votre commande ?<br>
                Contactez-nous à <a href="mailto:${CONFIG.contact.email}" style="color:#c4a97d;text-decoration:none;">${CONFIG.contact.email}</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
          <tr>
            <td align="center">
              <a href="${baseUrl}/catalog"
                 style="display:inline-block;background-color:#1a1714;color:#f7f5f0;text-decoration:none;border-radius:999px;padding:15px 36px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;">
                Découvrir nos nouveautés
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
