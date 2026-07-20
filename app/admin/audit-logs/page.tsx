"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { cn, formatDate } from "@/lib/utils";
import type { AuditLogEntry } from "@/types";

function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  try {
    return formatDate(value);
  } catch {
    return value;
  }
}

function JsonBlock({
  label,
  data,
}: {
  label: string;
  data: Record<string, unknown> | null | undefined;
}) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div>
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="mt-1 text-sm text-muted">null</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <pre className="mt-2 max-h-64 overflow-auto rounded-btn bg-navy/5 p-3 text-xs leading-relaxed text-body-text">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function AuditLogRow({ log }: { log: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={cn(
          "cursor-pointer border-b border-[#E2E8F0] transition-colors hover:bg-gray-50",
          expanded && "bg-gray-50"
        )}
        onClick={() => setExpanded((current) => !current)}
      >
        <td className="px-4 py-4 text-sm text-body-text">
          {formatTimestamp(log.created_at)}
        </td>
        <td className="px-4 py-4">
          <span className="inline-flex rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-forest">
            {log.action}
          </span>
        </td>
        <td className="px-4 py-4 text-sm text-body-text">{log.table_name}</td>
        <td className="px-4 py-4 text-sm text-body-text">
          {log.actor_email || "—"}
        </td>
        <td className="px-4 py-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-navy">
            Details
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </span>
        </td>
      </tr>

      {expanded ? (
        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <td colSpan={5} className="px-4 py-5">
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted">
              <span>
                Record ID:{" "}
                <span className="font-mono text-body-text">{log.record_id}</span>
              </span>
              {log.actor_id ? (
                <span>
                  Actor ID:{" "}
                  <span className="font-mono text-body-text">{log.actor_id}</span>
                </span>
              ) : null}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <JsonBlock label="Before" data={log.before_data} />
              <JsonBlock label="After" data={log.after_data} />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch("/api/admin/audit-logs?limit=100");

      if (response.status === 401 || response.status === 403) {
        setFetchError("You do not have permission to view audit logs.");
        setLogs([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load audit logs");
      }

      const payload = (await response.json()) as { data: AuditLogEntry[] };
      setLogs(payload.data ?? []);
    } catch (error) {
      console.error("[admin/audit-logs]", error);
      setFetchError(
        "We couldn't load audit logs. Check your connection and try again."
      );
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-label text-2xl font-semibold text-navy">
          Audit Logs
        </h2>
        <p className="mt-1 text-sm text-muted">
          Manager and owner access only — timestamp, action, table, and actor
          email with expandable before/after data.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        {fetchError ? (
          <AdminErrorState
            message={fetchError}
            onRetry={() => void fetchLogs()}
          />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted">
            No audit entries yet.
          </p>
        ) : (
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Action
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Table
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Actor email
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <AuditLogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
