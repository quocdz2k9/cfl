import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Thu thập IP Client định danh session ẩn danh
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Cập nhật thời gian hoạt động / Tạo mới nếu chưa tồn tại
    await prisma.activeSession.upsert({
      where: { clientIp: ip },
      update: { lastActive: new Date() },
      create: { clientIp: ip, lastActive: new Date() },
    });

    // 2. Tự động xóa sạch các phiên không tương tác trong vòng 1 phút qua
    const oneMinuteAgo = new Date(Date.now() - 60000);
    await prisma.activeSession.deleteMany({
      where: {
        lastActive: { lt: oneMinuteAgo },
      },
    });

    // 3. Truy xuất số liệu phân tích tổng hợp
    const metrics = await prisma.systemMetric.findUnique({
      where: { id: "global_metrics" },
    });

    const activeCount = await prisma.activeSession.count();

    return NextResponse.json({
      success: true,
      stats: {
        totalRedeem: metrics?.totalRedeem || 0,
        totalIdUsed: metrics?.totalIdUsed || 0,
        onlineCount: activeCount,
      },
    });
  } catch (error: any) {
    console.error("Lỗi đồng bộ dữ liệu thống kê:", error.message);
    return NextResponse.json({ success: false, message: "Lỗi hệ thống database nội bộ" }, { status: 500 });
  }
}
