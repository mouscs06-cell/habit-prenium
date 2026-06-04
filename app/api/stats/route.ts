import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@/lib/generated/prisma/enums"

const PAID_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]

export async function GET() {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [
      totalOrders,
      revenue,
      totalCustomers,
      monthlyOrders,
      monthlyRevenue,
      lowStock,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),

      prisma.order.aggregate({
        _sum:  { totalAmount: true },
        where: { status: { in: PAID_STATUSES } },
      }),

      prisma.customer.count(),

      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      prisma.order.aggregate({
        _sum:  { totalAmount: true },
        where: { createdAt: { gte: startOfMonth }, status: { in: PAID_STATUSES } },
      }),

      prisma.product.findMany({
        where:   { stock: { lt: 20 }, isActive: true },
        orderBy: { stock: "asc" },
      }),

      prisma.order.findMany({
        take:    5,
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      }),
    ])

    const totalRevenue = revenue._sum?.totalAmount ?? 0
    const averageOrder = totalOrders > 0
      ? Math.round((totalRevenue / totalOrders) * 100) / 100
      : 0

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      monthlyOrders,
      monthlyRevenue:  monthlyRevenue._sum?.totalAmount ?? 0,
      averageOrder,
      lowStock,
      recentOrders,
    })
  } catch (error) {
    console.error("[API/stats] Error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
