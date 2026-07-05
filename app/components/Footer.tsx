"use client";

import React from "react";
import { BookOpen, HelpCircle, ShieldAlert, ChevronUp, ChevronDown } from "lucide-react";

interface FooterProps {
  footerOpenSections: Record<string, boolean>;
  toggleFooterSection: (section: string) => void;
}

export default function Footer({ footerOpenSections, toggleFooterSection }: FooterProps) {
  return (
    <footer className="mt-8 border border-black dark:border-white bg-white dark:bg-[#000000] rounded-xl p-4 font-mono text-xs flex flex-col gap-4 shadow-sm">
      <div className="border-b border-black/10 dark:border-white/10 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="font-bold uppercase tracking-wider text-sm">Hệ thống thông tin Crossfire: Legends</span>
        <span className="text-black/50 dark:text-white/50 text-[11px]">© 2026 CFL Multi-Redeemer. All rights reserved.</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFooterSection("intro")}
            className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              GIỚI THIỆU TRÒ CHƠI CROSSFIRE: LEGENDS
            </span>
            {footerOpenSections.intro ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {footerOpenSections.intro && (
            <div className="p-3 text-black/80 dark:text-white/80 leading-relaxed border-t border-black/10 dark:border-white/10 bg-white dark:bg-black">
              Crossfire: Legends là tựa game bắn súng góc nhìn thứ nhất (FPS) đỉnh cao trên di động, mang đến trải nghiệm chiến đấu chân thực và kịch tính ngay trong lòng bàn tay. Người chơi sẽ được bước vào những trận đấu rực lửa, nơi tốc độ, chiến thuật và kỹ năng bắn súng quyết định chiến thắng. Game sở hữu đồ họa sắc nét, hiệu ứng chiến đấu sống động, cùng hệ thống điều khiển tối ưu cho di động, giúp thao tác di chuyển, ngắm bắn và đổi vũ khí trở nên mượt mà, dễ làm chủ. Crossfire: Legends mang đến nhiều chế độ chơi đa dạng như Đặt bom, Team Deathmatch, Sinh tồn và Zombie Mode, đáp ứng mọi phong cách chiến đấu – từ đối đầu căng thẳng 5v5 đến sinh tồn nghẹt thở cùng hàng chục người chơi khác. Kho vũ khí phong phú và tùy chỉnh đa dạng cho phép người chơi lựa chọn trang bị phù hợp với lối chơi của mình. Hệ thống xếp hạng, sự kiện và giải đấu liên tục tạo nên một cộng đồng FPS sôi động, nơi người chơi khẳng định bản lĩnh, kỹ năng và niềm đam mê bắn súng đích thực. Crossfire: Legends – nơi mọi phát đạn đều có thể trở thành huyền thoại.
            </div>
          )}
        </div>
        <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFooterSection("guide")}
            className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              CÁCH LẤY ID NHÂN VẬT TRONG GAME
            </span>
            {footerOpenSections.guide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {footerOpenSections.guide && (
            <div className="p-3 text-black/80 dark:text-white/80 leading-relaxed border-t border-black/10 dark:border-white/10 bg-white dark:bg-black flex flex-col gap-4">
              <div>
                <p className="font-bold text-black dark:text-white mb-1">Bước 1: Bấm vào Ảnh Đại Diện</p>
                <div className="max-w-md border border-black/20 dark:border-white/20 rounded overflow-hidden">
                  <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/5b95789c00384ad491632945de1163451765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Bước 1" className="w-full h-auto object-cover" />
                </div>
              </div>
              <div>
                <p className="font-bold text-black dark:text-white mb-1">Bước 2: Bấm vào Danh Thiếp</p>
                <div className="max-w-md border border-black/20 dark:border-white/20 rounded overflow-hidden">
                  <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/6d084649d1a9471caaac8a5f6aaae2961765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Bước 2" className="w-full h-auto object-cover" />
                </div>
              </div>
              <div>
                <p className="font-bold text-black dark:text-white mb-1">Bước 3: Bấm copy</p>
                <div className="max-w-md border border-black/20 dark:border-white/20 rounded overflow-hidden">
                  <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/acccdc36597c467fb97444a2fa6311ff1765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Bước 3" className="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFooterSection("rules")}
            className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              CÁC LƯU Ý QUAN TRỌNG KHI SỬ DỤNG CODE
            </span>
            {footerOpenSections.rules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {footerOpenSections.rules && (
            <div className="p-3 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black">
              <ul className="list-disc pl-5 flex flex-col gap-2 text-black/80 dark:text-white/80">
                <li>Kiểm tra lại ký tự trong giftcode. Một số giftcode tính cả chữ <span className="font-bold text-black dark:text-white">IN HOA</span> lẫn chữ thường.</li>
                <li>Kiểm tra lại xem có dư ký tự <span className="font-bold text-black dark:text-white">“trắng”</span> ở cuối đoạn văn bản giftcode hay không.</li>
                <li>Nếu giftcode vẫn báo lỗi sai, có thể mã đã quá hạn hoặc hệ thống đã đạt giới hạn tối đa lượt nhập.</li>
                <li>Một tài khoản chỉ được phép kích hoạt một mã cho mỗi loại giftcode. Có thể có nhiều giftcode khác nhau nhưng cùng chung một nhóm loại quà tặng.</li>
                <li>Mỗi giftcode chỉ được sử dụng duy nhất một lần trên một tài khoản chỉ định.</li>
                <li>Một số giftcode bị khóa cấu hình cho các khu vực địa lý cụ thể (ví dụ: Châu Á, EU, NA). Hãy chắc chắn rằng mã có giá trị sử dụng cho máy chủ của bạn.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
