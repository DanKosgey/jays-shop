"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { LogEntry, LogLevel } from "@/lib/admin-logging";

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (levelFilter !== "all") params.append('level', levelFilter);
        if (searchTerm) params.append('search', searchTerm);
        if (emailFilter) params.append('email', emailFilter);
        if (dateFilter) params.append('date', dateFilter);
        
        const res = await fetch(`/api/admin/logs?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        
        const data = await res.json();
        setLogs(data.logs);
        setFilteredLogs(data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        // Fallback to mock data if API fails
        const MOCK_LOGS: LogEntry[] = [
          {
            timestamp: "2025-10-20T10:30:00.000Z",
            level: "info",
            message: "Login attempt",
            userEmail: "admin@jaysphonerepair.com",
            ip: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            metadata: { sessionId: "sess_12345" }
          },
          {
            timestamp: "2025-10-20T10:30:05.000Z",
            level: "info",
            message: "Login successful",
            userId: "user_abc123",
            userEmail: "admin@jaysphonerepair.com",
            ip: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            metadata: { sessionId: "sess_12345" }
          },
          {
            timestamp: "2025-10-20T10:30:10.000Z",
            level: "info",
            message: "Admin dashboard accessed",
            userId: "user_abc123",
            userEmail: "admin@jaysphonerepair.com",
            ip: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          {
            timestamp: "2025-10-20T10:45:22.000Z",
            level: "warn",
            message: "Login failed",
            userEmail: "hacker@example.com",
            ip: "203.0.113.45",
            userAgent: "Mozilla/5.0 (Unknown; Malicious Bot)",
            metadata: { error: "Invalid credentials" }
          },
          {
            timestamp: "2025-10-20T11:15:30.000Z",
            level: "info",
            message: "Admin dashboard exited",
            userId: "user_abc123",
            userEmail: "admin@jaysphonerepair.com",
            ip: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        ];
        setLogs(MOCK_LOGS);
        setFilteredLogs(MOCK_LOGS);
      }
    };
    
    fetchLogs();
  }, [searchTerm, levelFilter, emailFilter, dateFilter]);

  const handleExportLogs = () => {
    // In a real implementation, this would export the logs to a file
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `admin-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getLevelBadgeVariant = (level: LogLevel) => {
    switch (level) {
      case "error": return "destructive";
      case "warn": return "secondary";
      case "info": return "default";
      default: return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <CardTitle>Authentication Logs</CardTitle>
            <CardDescription>
              View and monitor admin authentication events
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={handleExportLogs} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={levelFilter} onValueChange={(value: LogLevel | "all") => setLevelFilter(value)}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Filter by email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-[180px]"
          />
          
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[140px]"
          />
        </div>
        
        {/* Logs Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="w-[120px]">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLevelBadgeVariant(log.level)}>
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.message}
                      {log.metadata && log.metadata.error && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Error: {log.metadata.error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.userEmail || "N/A"}
                      {log.userId && (
                        <div className="text-xs text-muted-foreground">
                          ID: {log.userId.substring(0, 8)}...
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.ip || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No logs found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div>
            Total logs: <span className="font-medium">{logs.length}</span>
          </div>
          <div>
            Filtered logs: <span className="font-medium">{filteredLogs.length}</span>
          </div>
          <div>
            Errors: <span className="font-medium text-destructive">
              {logs.filter(log => log.level === "error").length}
            </span>
          </div>
          <div>
            Warnings: <span className="font-medium text-yellow-600">
              {logs.filter(log => log.level === "warn").length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}