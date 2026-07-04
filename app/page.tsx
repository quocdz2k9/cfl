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
  UserPlus,
  AlertCircle,
  Copy,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  Eraser,
  AlignLeft,
  Type,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  ShieldAlert
} from "lucide-react";

interface LogEntry {                                                     
  time: string;
  id: string;
  code: string;
  status: "success" | "error" | "processing";
  message: string;                                                     
}

interface SavedAccount {                                                 
  roleId: string;
  roleName: string;
  serverName: string;
  level: string;                                                       
}                                                                                                                                             

interface DBStats {                                                      
  totalRedeem: number;                                                   
  totalIdUsed: number;
  onlineCount: number;
}

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
      )                                                                    ).join("\n");                                                          
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
            CFL Code Multi-Redeemer Pro                                          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-[#000000] text-black dark:text-white transition-colors z-10 cursor-pointer border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          aria-label="Toggle Theme"                                            >
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
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-1 px-2.5 rounded bg-white dark:bg-[#000000] border border-black dark:border-white text-black dark:text-white transition-all active:scale-[0.98] cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"                                      >
                    <HelpCircle className="w-3.5 h-3.5" />                                 
                    Hướng dẫn lấy ID
                  </button>                                                              
                  <button
                    onClick={() => { setModalAlert(null); setCurrentPage(1); setIsModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold py-1 px-2.5 rounded bg-white dark:bg-[#000000] border border-black dark:border-white text-black dark:text-white transition-all active:scale-[0.98] cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"                                    >
                    Danh Sách ID ({savedAccounts.length} ID)                             
                  </button>
                </div>
              </div>
              <input                                                                   
                type="text"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                placeholder="Nhập Role ID (Ví dụ: 1526737692)"
                className="w-full bg-white dark:bg-[#000000] border border-black dark:border-white rounded-lg px-4 py-2.5 text-sm font-mono text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none"                                                                 />
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
                      className="p-1.5 rounded-md bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"                                                           >
                      <Menu className="w-4 h-4" />                                         
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-48 bg-white dark:bg-black border border-black dark:border-white rounded-lg shadow-xl overflow-hidden flex flex-col font-mono text-xs text-left">
                        <button
                          onClick={() => { setCodeTextArea(""); setShowCount(false); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left font-bold"                                                  >
                          <Eraser className="w-3.5 h-3.5" /> Xóa tất cả code
                        </button>
                        <button                                                                  
                          onClick={handleFormatCodes}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"                                                                                           >                                                                        
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
              }`}                                                                  >                                                                        
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
                Nhật Ký Tiến Trình Thực Thi                                          </h3>                                                                
            </div>                                                                 
            <div className="flex items-center gap-1.5 w-full sm:w-auto">                                                                                    
              <button
                onClick={() => setFilter("all")}                                       
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${
                  filter === "all" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}                                                                  >
                Tổng ({totalCount})                                                  </button>
              <button                                                                  
                onClick={() => setFilter("success")}
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${                                                                                 filter === "success" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"                                                                            }`}                                                                  >                                                                        
                Thành công ({successCount})                                          </button>                                                              
              <button                                                                  
                onClick={() => setFilter("error")}                                     
                className={`flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 border border-black dark:border-white transition-all cursor-pointer ${
                  filter === "error" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                }`}                                                                  >                                                                        
                Thất bại ({errorCount})                                              </button>                                                            
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
        
        <footer className="mt-8 border border-black dark:border-white bg-white dark:bg-[#000000] rounded-xl p-4 font-mono text-xs flex flex-col gap-4 shadow-sm">
          <div className="border-b border-black/10 dark:border-white/10 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">                                                                       
            <span className="font-bold uppercase tracking-wider text-sm">Hệ thống thông tin Crossfire: Legends</span>                                     
            <span className="text-black/50 dark:text-white/50 text-[11px]">© 2026 CFL Multi-Redeemer. All rights reserved.</span>                       
          </div>                                                                                                                                        
          <div className="flex flex-col gap-3">
            <div className="border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">                                                        
              <button                                                                  
                onClick={() => toggleFooterSection("intro")}
                className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"                >                                                                        
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
                className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"                >                                                                        
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
                className="w-full flex items-center justify-between p-3 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors font-bold text-left cursor-pointer"                >
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
      </div>
                                                                             
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">                                                                       
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#000000] border border-black dark:border-white p-5 rounded-xl w-full max-w-md relative z-10 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-black/20 dark:border-white/20">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-black dark:text-white" />
                <h4 className="text-xs font-bold tracking-wider uppercase">Cấu hình danh sách dữ liệu ID</h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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
                  className="py-2 px-4 rounded border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-white hover:text-black dark:hover:bg-[#000000] dark:hover:text-white transition-all cursor-pointer whitespace-nowrap"                     >
                  Lưu & Gửi                                                            </button>                                                            
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
                          className="p-1 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-[10px] font-bold rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"                                                            >                                                                        
                          <Copy className="w-3 h-3" />                                         
                        </button>                                                              
                        <button
                          onClick={(e) => triggerDeleteConfirm(acc, e)}
                          className="p-1 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-[10px] font-bold rounded hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer"                                                                               >                                                                        
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
                          className={`p-1.5 border border-black dark:border-white rounded transition-all cursor-pointer ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"}`}                                                      >
                          <ChevronLeft className="w-3.5 h-3.5" />                              
                        </button>
                        <button                                                                  
                          disabled={currentPage === totalPages}                                  
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={`p-1.5 border border-black dark:border-white rounded transition-all cursor-pointer ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"}`}                                             >                                                                        
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
                onClick={() => setIsModalOpen(false)}                                  
                className="py-2 px-4 rounded border border-black dark:border-white bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"                                                         >
                Đóng màn hình                                                        </button>                                                            
            </div>                                                               
          </div>
        </div>
      )}
                                                                             
      {isGuideModalOpen && (                                                   
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">                                                                       
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsGuideModalOpen(false)}></div>
          <div className="bg-white dark:bg-[#000000] border border-black dark:border-white p-5 rounded-xl w-full max-w-xl relative z-10 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar font-mono text-xs">                                                                 
            <div className="flex items-center justify-between pb-2 border-b border-black/20 dark:border-white/20 sticky top-0 bg-white dark:bg-[#000000] z-10">                                                                    
              <div className="flex items-center gap-2">                                
                <HelpCircle className="w-5 h-5 text-black dark:text-white" />
                <h4 className="text-xs font-bold tracking-wider uppercase">Hướng dẫn lấy ID nhân vật chi tiết</h4>                                          
              </div>
              <button                                                                  
                onClick={() => setIsGuideModalOpen(false)}                             
                className="p-1 rounded border border-transparent text-black dark:text-white bg-transparent transition-colors duration-150 active:border-black dark:active:border-white focus:border-black dark:focus:border-white focus:outline-none cursor-pointer"                                      >                                                                        
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
                onClick={() => setIsGuideModalOpen(false)}                             
                className="py-2 px-5 rounded border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-[#000000] dark:hover:text-white transition-all cursor-pointer"
              >                                                                        
                Đã hiểu
              </button>                                                            
            </div>                                                               
          </div>                                                               
        </div>                                                               
      )}                                                                                                                                            
      
      {accountToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">                                                                       
          <div className="absolute inset-0 bg-black/60" onClick={() => setAccountToDelete(null)}></div>
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
                onClick={() => setAccountToDelete(null)}                               
                className="py-2 px-4 rounded border border-black dark:border-white bg-white text-black dark:bg-[#000000] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
              >                                                                        
                Hủy
              </button>                                                              
              <button                                                                  
                onClick={confirmDeleteAccount}                                         
                className="py-2 px-4 rounded border border-red-600 bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"                    >
                Xác nhận xóa                                                         </button>                                                            
            </div>
          </div>                                                               
        </div>                                                               
      )}                                                                   
    </div>
  );
}
