"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Play,
  ClipboardList,
  RefreshCw,
  Terminal,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Inbox,
  Menu,
  Eraser,
  AlignLeft,
  Type,
  Sparkles,
  HelpCircle
} from "lucide-react";

import { LogEntry, SavedAccount, DBStats } from "./types";
import Footer from "./components/Footer";
import GuideModal from "./components/GuideModal";
import IdListModal from "./components/IdListModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const DEFAULT_CODES = [
  "LIKE500KCFL", "CFLTOP1APP", "CFLTOP1GG", "TOP1APPLECFL", "CONGDONGCFL110K",
  "TOANDANF11", "2026CFLKHAIHOA", "HUYENTHOAICF", "LIKE1KOBCFL", "TIKTOKCUS1D",
  "MILES200YRF", "YOUTUBE1CUZ", "UPDATE235MOD", "TIKTOK1ZCUS", "YOUTUBE1PR",
  "UPDATE235M2K", "YOUTUBECFL1", "TIKTOK200FL", "UPDATE235Z3T", "ZOMBIETRUYKICH",
  "CHEDOTRONTIM", "BOSSTHEGIOICFL", "DATBOMKINHTE"
];

const translateMessage = (msg: string): string => {
  if (!msg) return "Lỗi không xác định";
  const cleanMsg = msg.trim();
  if (cleanMsg === "1" || cleanMsg.toLowerCase() === "success") {
    return "Thành công!";
  }
  switch (cleanMsg) {
    case "Active code: campaign status not active":
      return "Chiến dịch đã kết thúc";
    case "Active code fail":
      return "Mã không hợp lệ";
    case "Active code: other error":
      return "Lỗi không xác định";
    case "Active code: user code management quantity exhausted":
      return "Bạn đã sử dụng mã này rồi";
    case "Account not online or not exist":
      return "Tài khoản không tồn tại";
    case "Too many requests":
    case "Thao tác quá nhanh vui lòng thử lại":
      return "Thao tác quá nhanh vui lòng thử lại";
    default:
      return cleanMsg;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [roleId, setRoleId] = useState<string>("");
  const [codeTextArea, setCodeTextArea] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>("");
  const [modalAlert, setModalAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [accountToDelete, setAccountToDelete] = useState<SavedAccount | null>(null);
  const [dbStats, setDbStats] = useState<DBStats>({ totalRedeem: 0, totalIdUsed: 0, onlineCount: 1 });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showCount, setShowCount] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [footerOpenSections, setFooterOpenSections] = useState<Record<string, boolean>>({
    intro: false,
    guide: false,
    rules: false
  });

  const toggleFooterSection = (section: string) => {
    setFooterOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const fetchSystemStats = async () => {
    try {
      const response = await axios.post("/api/stats");
      if (response.data?.success) {
        setDbStats(response.data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const isDark = localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined" && localStorage.getItem("cfl_saved_accounts")) {
      try {
        setSavedAccounts(JSON.parse(localStorage.getItem("cfl_saved_accounts") || "[]"));
      } catch (e) {}
    }
    fetchSystemStats();
    const statsInterval = setInterval(fetchSystemStats, 180000);
    return () => clearInterval(statsInterval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    }
  };

  const handleImportAllDefaultCodes = () => {
    const currentCodes = codeTextArea
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    const newCodes = [...currentCodes];
    DEFAULT_CODES.forEach((code) => {
      if (!newCodes.includes(code)) {
        newCodes.push(code);
      }
    });
    setCodeTextArea(newCodes.join("\n"));
  };

  const handleFormatCodes = () => {
    const formatted = codeTextArea
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c !== "")
      .join("\n");
    setCodeTextArea(formatted);
    setShowCount(true);
    setIsMenuOpen(false);
  };

  const handleUppercaseCodes = () => {
    const uppercased = codeTextArea
      .split("\n")
      .map((c) => c.trim().toUpperCase())
      .join("\n");
    setCodeTextArea(uppercased);
    setIsMenuOpen(false);
  };

  const handleDistinctCodes = () => {
    const unique = Array.from(
      new Set(
        codeTextArea
          .split("\n")
          .map((c) => c.trim())
          .filter((c) => c !== "")
      )
    ).join("\n");
    setCodeTextArea(unique);
    setIsMenuOpen(false);
  };

  const handleSaveModalData = async () => {
    if (!modalInput.trim()) {
      setModalAlert({ type: "error", message: "Vui lòng nhập ID nhân vật!" });
      return;
    }
    setModalAlert(null);
    try {
      const response = await axios.post("/api/quick-auth", { roleId: modalInput.trim() });
      const resData = response.data;
      if (resData.success && resData.data) {
        const vngInfo = resData.data.data;
        if (vngInfo && vngInfo.info) {
          const newAccount: SavedAccount = {
            roleId: String(vngInfo.roleID || modalInput.trim()),
            roleName: String(vngInfo.info.charac_name || "Không tên"),
            serverName: String(vngInfo.serverName || "101"),
            level: String(vngInfo.info.level || "0")
          };
          const updated = [newAccount, ...savedAccounts.filter(acc => acc.roleId !== newAccount.roleId)];
          setSavedAccounts(updated);
          localStorage.setItem("cfl_saved_accounts", JSON.stringify(updated));
          setCurrentPage(1);
          setModalAlert({
            type: "success",
            message: `Xác thực thành công: [${newAccount.roleName}] - Lv.${newAccount.level}`
          });
          setModalInput("");
          fetchSystemStats();
        } else {
          setModalAlert({ type: "error", message: resData.message || "Tài khoản không tồn tại hoặc dữ liệu trống." });
        }
      } else {
        setModalAlert({ type: "error", message: resData.message || "Xác thực thất bại từ cổng phân phối." });
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Lỗi cổng kết nối proxy hệ thống.";
      setModalAlert({ type: "error", message: errMsg });
    }
  };

  const triggerDeleteConfirm = (acc: SavedAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    setAccountToDelete(acc);
  };

  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    const updated = savedAccounts.filter(acc => acc.roleId !== accountToDelete.roleId);
    setSavedAccounts(updated);
    localStorage.setItem("cfl_saved_accounts", JSON.stringify(updated));
    const maxPage = Math.ceil(updated.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
    setAccountToDelete(null);
  };

  const handleSelectAccount = (idToSelect: string) => {
    setRoleId(idToSelect);
    setIsModalOpen(false);
  };

  const handleRedeemAll = async () => {
    if (!roleId.trim()) {
      alert("Vui lòng nhập ID nhân vật!");
      return;
    }
    const codesToProcess = codeTextArea
      .split("\n")
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c !== "");
    if (codesToProcess.length === 0) {
      alert("Vui lòng nhập hoặc chọn ít nhất 1 Code!");
      return;
    }
    const targetRoleId = roleId.trim();
    setLogs([]);
    setLoading(true);
    for (let i = 0; i < codesToProcess.length; i++) {
      const code = codesToProcess[i];
      let timestamp = new Date().toLocaleTimeString();
      let success = false;
      let retries = 0;
      const maxRetries = 1;

      setLogs((prev) => [
        { time: timestamp, id: targetRoleId, code, status: "processing", message: "Đang gửi yêu cầu..." },
        ...prev,
      ]);

      while (!success && retries <= maxRetries) {
        try {
          const response = await axios.post("/api/redeem", { roleId: targetRoleId, code: code });
          const result = response.data;
          const isSuccess = result.success || String(result.message).toLowerCase() === "success" || String(result.message) === "1";

          setLogs((prev) =>
            prev.map((log) =>
              log.code === code && log.status === "processing"
                ? {
                    ...log,
                    status: isSuccess ? "success" : "error",
                    message: translateMessage(result.message || (isSuccess ? "Success" : "Active code: other error")),
                  }
                : log
            )
          );
          success = true;
        } catch (error: any) {
          const status = error.response?.status;
          const rawMsg = error.response?.data?.message || "";
          const is429 = status === 429 || rawMsg.includes("Too many requests") || rawMsg.includes("Thao tác quá nhanh");

          if (is429 && retries < maxRetries) {
            retries++;
            setLogs((prev) =>
              prev.map((log) =>
                log.code === code && log.status === "processing"
                  ? { ...log, message: "Thao tác quá nhanh. Tự động thử lại sau 3 giây..." }
                  : log
              )
            );
            await delay(3000);
            timestamp = new Date().toLocaleTimeString();
          } else {
            const finalMsg = rawMsg || "Lỗi kết nối API mạng nội bộ";
            setLogs((prev) =>
              prev.map((log) =>
                log.code === code && log.status === "processing" ? { ...log, status: "error", message: translateMessage(finalMsg) } : log
              )
            );
            break;
          }
        }
      }
      if (i < codesToProcess.length - 1) {
        await delay(2500);
      }
    }
    setLoading(false);
    fetchSystemStats();
  };

  const totalCount = logs.length;
  const successCount = logs.filter((log) => log.status === "success").length;
  const errorCount = logs.filter((log) => log.status === "error").length;

  const filteredLogs = logs.filter((log) => {
    if (filter === "success") return log.status === "success";
    if (filter === "error") return log.status === "error";
    return true;
  });

  const totalPages = Math.ceil(savedAccounts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = savedAccounts.slice(indexOfFirstItem, indexOfLastItem);

  const calculatedCodeCount = codeTextArea.split("\n").map((c) => c.trim()).filter((c) => c !== "").length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white flex flex-col transition-colors duration-200 relative">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#000000] border-b border-black dark:border-white px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-7 h-7 text-black dark:text-white" />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white">
            CFL Code Multi-Redeemer Pro
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-[#000000] text-black dark:text-white transition-colors z-10 cursor-pointer border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto relative z-10">
        <div className="flex flex-wrap items-center gap-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-mono max-w-fit">
          <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Trực tuyến: {dbStats.onlineCount}
          </span>
          <span className="text-black/30 dark:text-white/30">|</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Lượt dùng: {dbStats.totalRedeem}</span>
          <span className="text-black/30 dark:text-white/30">|</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">ID lưu trữ: {dbStats.totalIdUsed}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <div className="flex flex-row items-center justify-between gap-2 mb-1.5">
                <label className="block text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                  ID Nhân Vật (RoleId)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsGuideModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-1 px-2.5 rounded bg-white dark:bg-[#000000] border border-black dark:border-white text-black dark:text-white transition-all active:scale-[0.98] cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Hướng dẫn lấy ID
                  </button>
                  <button
                    onClick={() => { setModalAlert(null); setCurrentPage(1); setIsModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold py-1 px-2.5 rounded bg-white dark:bg-[#000000] border border-black dark:border-white text-black dark:text-white transition-all active:scale-[0.98] cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    Danh Sách ID ({savedAccounts.length} ID)
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                placeholder="Nhập Role ID (Ví dụ: 1526737692)"
                className="w-full bg-white dark:bg-[#000000] border border-black dark:border-white rounded-lg px-4 py-2.5 text-sm font-mono text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none"
              />
            </div>

            <div className="relative">
              <div className="flex flex-row items-center justify-between gap-2 mb-1.5">
                <label className="block text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                  Danh Sách Code Nhập (Mỗi dòng 1 code)
                </label>
                <div className="flex items-center gap-2">
                  {showCount && calculatedCodeCount > 0 && (
                    <span className="text-[11px] font-mono font-bold text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">
                      Số lượng: {calculatedCodeCount} code
                    </span>
                  )}
                  <button
                    onClick={handleImportAllDefaultCodes}
                    className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold py-1 px-2.5 rounded bg-white dark:bg-[#000000] border border-black dark:border-white text-black dark:text-white transition-all active:scale-[0.98] cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    Danh Sách Code Mẫu
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={codeTextArea}
                  onChange={(e) => {
                    setCodeTextArea(e.target.value);
                    if (e.target.value === "") {
                      setShowCount(false);
                    }
                  }}
                  rows={6}
                  placeholder="Nhập code thủ công tại đây hoặc nhấn nút lấy danh sách mẫu phía trên..."
                  className="w-full bg-white dark:bg-[#000000] border border-black dark:border-white rounded-lg p-3 pr-10 text-sm font-mono text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none resize-y"
                />
                {codeTextArea.length > 0 && (
                  <div className="absolute bottom-3 right-3 z-20" ref={menuRef}>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-1.5 rounded-md bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                    >
                      <Menu className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white dark:bg-black border border-black dark:border-white rounded-lg shadow-xl overflow-hidden flex flex-col font-mono text-xs text-left">
                        <button
                          onClick={() => { setCodeTextArea(""); setShowCount(false); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left font-bold"
                        >
                          <Eraser className="w-3.5 h-3.5" /> Xóa tất cả code
                        </button>
                        <button
                          onClick={handleFormatCodes}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                        >
                          <AlignLeft className="w-3.5 h-3.5" /> Định dạng số lượng
                        </button>
                        <button
                          onClick={handleUppercaseCodes}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                        >
                          <Type className="w-3.5 h-3.5" /> Đổi chữ hoa
                        </button>
                        <button
                          onClick={handleDistinctCodes}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Lọc trùng lặp
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:self-end">
            <button
              onClick={handleRedeemAll}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-4 rounded-lg transition-all border border-black dark:border-white ${
                loading
                  ? "bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40 cursor-not-allowed"
                  : "bg-black dark:bg-white text-white dark:text-black cursor-pointer hover:bg-white hover:text-black dark:hover:bg-[#000000] dark:hover:text-white"
              }`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              {loading ? "ĐANG TIẾN HÀNH..." : "KÍCH HOẠT HÀNG LOẠT"}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#000000] rounded-xl border border-black dark:border-white flex flex-col max-h-[380px] mt-2 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-black/20 dark:border-white/20 bg-white dark:bg-[#000000] flex-shrink-0 gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${logs.length > 0 ? "bg-black dark:bg-white animate-pulse" : "bg-black/30 dark:bg-white/30"}`} />
              <h3 className="font-bold text-xs tracking-wider text-black dark:text-white uppercase">
                Nhật Ký Tiến Trình Thực Thi
              </h3>
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${
                  filter === "all" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                Tổng ({totalCount})
              </button>
              <button
                onClick={() => setFilter("success")}
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${
                  filter === "success" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                Thành công ({successCount})
              </button>
              <button
                onClick={() => setFilter("error")}
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${
                  filter === "error" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}
              >
                Thất bại ({errorCount})
              </button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar pt-2">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-black/60 dark:text-white/60 gap-3">
                <Inbox className="w-10 h-10 stroke-[1.5]" />
                <p className="text-xs sm:text-sm italic text-center">Chưa có dữ liệu phù hợp với bộ lọc hiện tại.</p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead className="sticky top-0 bg-white dark:bg-[#000000] text-black dark:text-white uppercase font-mono border-b border-black dark:border-white z-10">
                    <tr>
                      <th className="py-2.5 px-4 w-24">Thời Gian</th>
                      <th className="py-2.5 px-4 w-32">ID Người Dùng</th>
                      <th className="py-2.5 px-4 w-44">Mã Quà Tặng</th>
                      <th className="py-2.5 px-4">Thông Báo Trả Về</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono">
                    {filteredLogs.map((log, index) => (
                      <tr
                        key={index}
                        className={`transition-colors ${
                          log.status === "success" ? "bg-black/5 dark:bg-white/10 text-black dark:text-white font-bold" : "bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80"
                        }`}
                      >
                        <td className="py-2 px-4 text-black/50 dark:text-white/50">{log.time}</td>
                        <td className="py-2 px-4 font-semibold">{log.id}</td>
                        <td className="py-2 px-4 font-bold tracking-wider">{log.code}</td>
                        <td className="py-2 px-4 flex items-center gap-2">
                          {log.status === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                          {log.status === "error" && <XCircle className="w-4 h-4 flex-shrink-0" />}
                          {log.status === "processing" && <RefreshCw className="w-3.5 h-3.5 animate-spin flex-shrink-0" />}
                          <span className="truncate max-w-xs sm:max-w-md">{log.message}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer footerOpenSections={footerOpenSections} toggleFooterSection={toggleFooterSection} />
      </div>

      {isModalOpen && (
        <IdListModal
          onClose={() => setIsModalOpen(false)}
          modalAlert={modalAlert}
          modalInput={modalInput}
          setModalInput={setModalInput}
          handleSaveModalData={handleSaveModalData}
          savedAccounts={savedAccounts}
          currentAccounts={currentAccounts}
          handleSelectAccount={handleSelectAccount}
          triggerDeleteConfirm={triggerDeleteConfirm}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {isGuideModalOpen && (
        <GuideModal onClose={() => setIsGuideModalOpen(false)} />
      )}

      {accountToDelete && (
        <DeleteConfirmModal
          accountToDelete={accountToDelete}
          onCancel={() => setAccountToDelete(null)}
          onConfirm={confirmDeleteAccount}
        />
      )}
    </div>
  );
}
