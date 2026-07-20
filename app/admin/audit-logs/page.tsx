"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { Badge } from "@/components/ui/badge";
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
import { cn, formatDate } from "@/lib/utils";
import type { AuditAction, AuditLogEntry } from "@/types";

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

function ActionBadge({ action }: { action: AuditAction }) {
  const styles: Record<AuditAction, string> = {
    insert: "border-transparent bg-green-100 text-green-800",
    update: "border-transparent bg-amber-100 text-amber-900",
    delete: "border-transparent bg-red-100 text-red-800",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wide",
        styles[action]
      )}
    >
      {action}
    </Badge>
  );
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
      <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-navy/5 p-3 text-xs leading-relaxed text-body-text">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function AuditLogRow({ log }: { log: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className={cn("cursor-pointer", expanded && "bg-slate-50")}
        onClick={() => setExpanded((current) => !current)}
        data-state={expanded ? "selected" : undefined}
      >
        <TableCell className="px-4 py-3 text-body-text">
          {formatTimestamp(log.created_at)}
        </TableCell>
        <TableCell className="px-4 py-3">
          <ActionBadge action={log.action} />
        </TableCell>
        <TableCell className="px-4 py-3 text-body-text">
          {log.table_name}
        </TableCell>
        <TableCell className="px-4 py-3 text-body-text">
          {log.actor_email || "—"}
        </TableCell>
        <TableCell className="px-4 py-3">
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
        </TableCell>
      </TableRow>

      {expanded ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={5} className="bg-slate-50 px-4 py-5">
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
          </TableCell>
        </TableRow>
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
    <div className="space-y-6">
      <div>
        <h2 className="font-label text-2xl font-semibold text-navy">
          Audit Logs
        </h2>
        <p className="mt-1 text-sm text-muted">
          Manager and owner access only — timestamp, action, table, and actor
          email with expandable before/after data.
        </p>
      </div>

      <Card className="bg-white py-0 shadow-sm ring-1 ring-black/5">
        <CardHeader className="border-b border-divider px-4 py-4 sm:px-6">
          <CardTitle className="font-label text-base text-navy">
            Internal records
          </CardTitle>
          <CardDescription className="text-muted">
            {isLoading ? "Loading…" : `${logs.length} recent entries`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {fetchError ? (
            <div className="p-6">
              <AdminErrorState
                message={fetchError}
                onRetry={() => void fetchLogs()}
              />
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted">
              <Loader2
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-muted">
              No audit entries yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 text-muted">Timestamp</TableHead>
                  <TableHead className="px-4 text-muted">Action</TableHead>
                  <TableHead className="px-4 text-muted">Table</TableHead>
                  <TableHead className="px-4 text-muted">Actor email</TableHead>
                  <TableHead className="px-4 text-muted">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <AuditLogRow key={log.id} log={log} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
