import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId, code } = body;

    if (!roleId || !code) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin ID hoặc Code bắt buộc." },
        { status: 400 }
      );
    }

    const vngResponse = await axios.post(
      "https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem",
      {
        serverId: "101",
        gameCode: "A49",
        roleId: roleId,
        roleName: roleId,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Client-Region": "VN",
        },
        timeout: 10000,
      }
    );

    const data = vngResponse.data;
    
    await prisma.systemMetric.upsert({
      where: { id: "global_metrics" },
      update: { totalRedeem: { increment: 1 } },
      create: { id: "global_metrics", totalRedeem: 1, totalIdUsed: 0 },
    });

    const isSuccess = data && (
      data.code === 1 || 
      data.returnCode === 1 || 
      data.success === true || 
      data.error === 0 ||
      data.data?.code === 1 ||
      String(data.message).toLowerCase().includes("success") ||
      String(data.message).includes("thành công")
    );

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: data.message || data.returnMessage || "Kích hoạt Code thành công!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || data.returnMessage || `Thất bại (Mã lỗi: ${data.code || "VNG_ERR"})`,
      });
    }
  } catch (error: any) {
    console.error("Lỗi xử lý API Hệ thống:", error.message);

    await prisma.systemMetric.upsert({
      where: { id: "global_metrics" },
      update: { totalRedeem: { increment: 1 } },
      create: { id: "global_metrics", totalRedeem: 1, totalIdUsed: 0 },
    });

    const serverErrorMessage = error.response?.data?.message || error.response?.data?.returnMessage;
    return NextResponse.json(
      {
        success: false,
        message: serverErrorMessage || "Cổng kết nối VNG từ chối phản hồi hoặc Code không hợp lệ.",
      },
      { status: error.response?.status || 500 }
    );
  }
}
