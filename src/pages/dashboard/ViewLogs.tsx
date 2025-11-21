import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { fetchWithAuth } from "@/lib/api";
import { MedicalButton } from "@/components/ui/medical-button";
import { RefreshCw, Trash2, Search } from "lucide-react";

interface LogEntry {
  timestamp?: string;
  level?: string;
  channel?: string;
  message?: string;
  raw: string;
}

export default function ViewLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState(100);
  const [filter, setFilter] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("lines", lines.toString());
      if (filter) params.append("filter", filter);
      
      const data = await fetchWithAuth<{
        entries: LogEntry[];
        total_lines: number;
        log_file: string;
        file_size: number;
        last_modified: string;
      }>(`/crud/logs?${params.toString()}`);
      
      setLogs(data.entries || []);
    } catch (err: any) {
      setError(err.message || "Failed to load logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all logs?")) return;
    
    try {
      await fetchWithAuth("/crud/logs/clear", { method: "POST" });
      setLogs([]);
      alert("Logs cleared successfully");
    } catch (err: any) {
      alert("Failed to clear logs: " + err.message);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [lines, filter]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, lines, filter]);

  const getLevelColor = (level?: string) => {
    if (!level) return "text-gray-600";
    switch (level.toUpperCase()) {
      case "ERROR":
      case "CRITICAL":
        return "text-red-600 font-bold";
      case "WARNING":
        return "text-yellow-600";
      case "INFO":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Backend Logs Viewer</h1>
          <div className="flex gap-2">
            <MedicalButton
              onClick={loadLogs}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </MedicalButton>
            <MedicalButton
              onClick={clearLogs}
              variant="secondary"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </MedicalButton>
          </div>
        </div>

        <div className="mb-4 flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Lines:</label>
            <select
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by keyword (e.g., ERROR, ⚠️, product, etc.)"
              className="flex-1 border rounded px-3 py-1"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Auto-refresh (3s)</span>
          </label>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-8">Loading logs...</div>}

        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto max-h-[600px]">
          {logs.length === 0 && !loading && (
            <div className="text-gray-500">No logs found</div>
          )}
          {logs.map((entry, idx) => (
            <div key={idx} className="mb-1">
              {entry.timestamp && (
                <span className="text-gray-500">[{entry.timestamp}]</span>
              )}
              {entry.level && (
                <span className={`ml-2 ${getLevelColor(entry.level)}`}>
                  {entry.level}
                </span>
              )}
              {entry.channel && (
                <span className="text-gray-400 ml-2">.{entry.channel}</span>
              )}
              {entry.message && (
                <span className="ml-2">{entry.message}</span>
              )}
              {!entry.timestamp && (
                <span className="text-gray-600">{entry.raw}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

