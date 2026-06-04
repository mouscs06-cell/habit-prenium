import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const SECRET = process.env.ADMIN_SECRET   ?? "elua-admin-secret-2025"
const PW     = process.env.ADMIN_PASSWORD ?? "elua2025!"

function makeToken() {
  return createHmac("sha256", SECRET).update(PW).digest("hex")
}

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string }

  if (!password || password !== PW) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("elua_admin", makeToken(), {
    httpOnly: true,
    sameSite: "strict",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
    secure:   process.env.NODE_ENV === "production",
  })
  return res
}
