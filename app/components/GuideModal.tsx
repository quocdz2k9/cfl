"use client";

import React from "react";
import { HelpCircle, X } from "lucide-react";

interface GuideModalProps {
  onClose: () => void;
}

export default function GuideModal({ onClose }: GuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#000000] border border-black dark:border-white p-5 rounded-xl w-full max-w-xl relative z-10 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-black/20 dark:border-white/20 sticky top-0 bg-white dark:bg-[#000000] z-10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-black dark:text-white" />
            <h4 className="text-xs font-bold tracking-wider uppercase">Hướng dẫn lấy ID nhân vật chi tiết</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded border border-transparent text-black dark:text-white bg-transparent transition-colors duration-150 active:border-black dark:active:border-white focus:border-black dark:focus:border-white focus:outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-black dark:text-white text-[13px] border-l-2 border-black dark:border-white pl-2">Bước 1: Bấm vào Ảnh Đại Diện</span>
            <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
              <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/5b95789c00384ad491632945de1163451765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Guide Step 1" className="w-full h-auto max-h-[260px] object-contain mx-auto" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-black dark:text-white text-[13px] border-l-2 border-black dark:border-white pl-2">Bước 2: Bấm vào Danh Thiếp</span>
            <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
              <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/6d084649d1a9471caaac8a5f6aaae2961765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Guide Step 2" className="w-full h-auto max-h-[260px] object-contain mx-auto" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-black dark:text-white text-[13px] border-l-2 border-black dark:border-white pl-2">Bước 3: Bấm copy</span>
            <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
              <img src="https://res.ldrescdn.com/rms/ldplayer/process/img/acccdc36597c467fb97444a2fa6311ff1765883793.png?x-oss-process=image/format,webp/quality,Q_100/resize,w_1024" alt="Guide Step 3" className="w-full h-auto max-h-[260px] object-contain mx-auto" />
            </div>
          </div>
        </div>
        <div className="flex justify-end text-xs font-bold pt-2 border-t border-black/10 dark:border-white/10 sticky bottom-0 bg-white dark:bg-[#000000] z-10">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-[#000000] dark:hover:text-white transition-all cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
