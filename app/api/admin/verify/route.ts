import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const SECRET = process.env.ADMIN_SECRET   ?? "elua-admin-secret-2025"
const PW     = process.env.ADMIN_PASSWORD ?? "elua2025!"

function makeToken() {
  return createHmac("sha256", SECRET).update(PW).digest("hex")
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("elua_admin")
  const ok = cookie?.value === makeToken()
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 })
}
