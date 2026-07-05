export interface LogEntry {
  time: string;
  id: string;
  code: string;
  status: "success" | "error" | "processing";
  message: string;
}

export interface SavedAccount {
  roleId: string;
  roleName: string;
  serverName: string;
  level: string;
}

export interface DBStats {
  totalRedeem: number;
  totalIdUsed: number;
  onlineCount: number;
}

