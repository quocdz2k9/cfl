"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { SavedAccount } from "../types";

interface DeleteConfirmModalProps {
  accountToDelete: SavedAccount;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ accountToDelete, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel}></div>
      <div className="bg-white dark:bg-[#000000] border border-black dark:border-white p-5 rounded-xl w-full max-w-sm relative z-10 flex flex-col gap-4 shadow-xl font-mono text-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-black/20 dark:border-white/20">
          <AlertCircle className="w-5 h-5 text-black dark:text-white" />
          <h4 className="font-bold tracking-wider uppercase">Xác nhận xóa tài khoản</h4>
        </div>
        <p className="text-black/80 dark:text-white/80 leading-relaxed">
          Bạn có chắc chắn muốn xóa tài khoản <span className="font-bold text-black dark:text-white">[{accountToDelete.roleName}]</span> (ID: {accountToDelete.roleId}) khỏi danh sách lưu trữ tạm thời không?
        </p>
        <div className="flex gap-2 justify-end font-bold pt-2 border-t border-black/10 dark:border-white/10">
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded border border-black dark:border-white bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded border border-red-600 bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}

