"use client";

import React from "react";
import { UserPlus, X, AlertCircle, Inbox, Copy, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { SavedAccount } from "../types";

interface IdListModalProps {
  onClose: () => void;
  modalAlert: { type: "success" | "error"; message: string } | null;
  modalInput: string;
  setModalInput: (val: string) => void;
  handleSaveModalData: () => Promise<void>;
  savedAccounts: SavedAccount[];
  currentAccounts: SavedAccount[];
  handleSelectAccount: (id: string) => void;
  triggerDeleteConfirm: (acc: SavedAccount, e: React.MouseEvent) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function IdListModal({
  onClose,
  modalAlert,
  modalInput,
  setModalInput,
  handleSaveModalData,
  savedAccounts,
  currentAccounts,
  handleSelectAccount,
  triggerDeleteConfirm,
  currentPage,
  totalPages,
  setCurrentPage,
}: IdListModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#000000] border border-black dark:border-white p-5 rounded-xl w-full max-w-md relative z-10 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-black/20 dark:border-white/20">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-black dark:text-white" />
            <h4 className="text-xs font-bold tracking-wider uppercase">Cấu hình danh sách dữ liệu ID</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded border border-transparent text-black dark:text-white bg-transparent transition-colors duration-150 active:border-black dark:active:border-white focus:border-black dark:focus:border-white focus:outline-none cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {modalAlert && (
          <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs font-mono transition-all ${
            modalAlert.type === "success" ? "bg-black/5 dark:bg-white/10 border-black dark:border-white text-black dark:text-white font-bold" : "bg-black/5 dark:bg-white/5 border-black/30 dark:border-white/30 text-black/80 dark:text-white/80"
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{modalAlert.message}</div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-wider uppercase text-black/60 dark:text-white/60">Nhập ID nhân vật mới</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder="Nhập ID (Ví dụ: 1526737692)"
              className="flex-1 bg-white dark:bg-[#000000] border border-black dark:border-white rounded-lg px-4 py-2 text-sm font-mono text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none"
            />
            <button
              onClick={handleSaveModalData}
              className="py-2 px-4 rounded border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-white hover:text-black dark:hover:bg-[#000000] dark:hover:text-white transition-all cursor-pointer whitespace-nowrap"
            >
              Lưu & Gửi
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-h-[120px]">
          {savedAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-black/60 dark:text-white/60 gap-2 border border-dashed border-black/20 dark:border-white/20 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
              <Inbox className="w-8 h-8 stroke-[1.5]" />
              <p className="text-xs italic text-center">Chưa có lưu ID nào trong danh sách cấu hình tạm thời.</p>
            </div>
          ) : (
            <>
              {currentAccounts.map((acc) => (
                <div
                  key={acc.roleId}
                  onClick={() => handleSelectAccount(acc.roleId)}
                  className="flex items-center justify-between p-2.5 border border-black dark:border-white bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer rounded-lg transition-all"
                >
                  <div className="flex flex-col gap-0.5 font-mono text-left">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span className="text-black dark:text-white">{acc.roleName}</span>
                      <span className="text-[10px] px-1 bg-black/5 dark:bg-white/20 rounded text-black/60 dark:text-white/80">Lv.{acc.level}</span>
                    </div>
                    <div className="text-[10px] text-black/50 dark:text-white/50">
                      ID: {acc.roleId} | Server: {acc.serverName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSelectAccount(acc.roleId)}
                      className="p-1 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-[10px] font-bold rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => triggerDeleteConfirm(acc, e)}
                      className="p-1 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-[10px] font-bold rounded hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 text-xs font-mono">
                  <span className="text-black/60 dark:text-white/60">Trang {currentPage}/{totalPages}</span>
                  <div className="flex gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={`p-1.5 border border-black dark:border-white rounded transition-all cursor-pointer ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"}`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={`p-1.5 border border-black dark:border-white rounded transition-all cursor-pointer ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"}`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end text-xs font-bold pt-2 border-t border-black/10 dark:border-white/10">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded border border-black dark:border-white bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
          >
            Đóng màn hình
          </button>
        </div>
      </div>
    </div>
  );
}
