import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId } = body;

    if (!roleId) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin ID bắt buộc." },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append("platform", "mobile");
    formData.append("clientKey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoiMTAxMDQ5IiwiYSI6IjEwMTA0OSIsInMiOjF9.gRZXpz23XDuCB_Px8INGXldSlaGiCCsuIvw5dfjuXEY");
    formData.append("loginType", "9");
    formData.append("lang", "VI");
    formData.append("roleID", roleId);
    formData.append("roleName", roleId);
    formData.append("getVgaId", "0");

    const vngResponse = await axios.post(
      "https://billing.vnggames.com/fe/api/auth/quick",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Origin": "https://shop.vnggames.com",
          "Referer": "https://shop.vnggames.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        timeout: 15000,
      }
    );

    const data = vngResponse.data;

    if (data && (data.code === 1 || data.returnCode === 1 || data.success === true || data.error === 0)) {
      
      // Kích hoạt thêm ID thành công -> Tăng chỉ số totalIdUsed
      await prisma.systemMetric.upsert({
        where: { id: "global_metrics" },
        update: { totalIdUsed: { increment: 1 } },
        create: { id: "global_metrics", totalRedeem: 0, totalIdUsed: 1 },
      });

      return NextResponse.json({
        success: true,
        message: data.message || data.returnMessage || "Xác thực tài khoản thành công!",
        data: data,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || data.returnMessage || `Tài khoản không tồn tại (Mã lỗi: ${data.code || "VNG_ERR"})`,
        data: data,
      });
    }

  } catch (error: any) {
    console.error("Lỗi xử lý API Quick Auth:", error.message);
    const serverErrorMessage = error.response?.data?.message || error.response?.data?.returnMessage;
    return NextResponse.json(
      {
        success: false,
        message: serverErrorMessage || "Cổng kết nối VNG từ chối phản hồi hoặc ID không hợp lệ.",
      },
      { status: error.response?.status || 500 }
    );
  }
}

