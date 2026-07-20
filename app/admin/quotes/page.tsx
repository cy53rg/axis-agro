"use client";

import { Download, Loader2, MoreHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import {
  cn,
  formatDate,
  formatPhone,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { QuoteRequest, QuoteStatus } from "@/types";

type StatusFilter = "all" | QuoteStatus;

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Responded", value: "responded" },
  { label: "Closed", value: "closed" },
];

const STATUS_ACTIONS: { label: string; value: QuoteStatus }[] = [
  { label: "Mark as In Progress", value: "in_progress" },
  { label: "Mark as Responded", value: "responded" },
  { label: "Mark as Closed", value: "closed" },
];

function getWhatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("234")
    ? digits
    : digits.startsWith("0")
      ? `234${digits.slice(1)}`
      : digits;

  return `https://wa.me/${normalized}`;
}

function exportQuotesToCsv(quotes: QuoteRequest[]) {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Service",
    "Quantity",
    "Message",
    "Status",
    "Created At",
  ];

  const rows = quotes.map((quote) => [
    quote.name,
    quote.phone,
    quote.email ?? "",
    quote.service_type,
    quote.quantity ?? "",
    quote.message,
    quote.status,
    quote.created_at,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jrn-agro-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function QuoteDetailPanel({
  quote,
  notes,
  onNotesChange,
  onSaveNotes,
  isSavingNotes,
}: {
  quote: QuoteRequest;
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
  isSavingNotes: boolean;
}) {
  return (
    <div className="space-y-4 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-muted">Name</p>
          <p className="text-sm text-body-text">{quote.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Phone</p>
          <p className="text-sm text-body-text">{formatPhone(quote.phone)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Email</p>
          <p className="text-sm text-body-text">{quote.email || "Not provided"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Service</p>
          <p className="text-sm text-body-text">{quote.service_type}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Quantity</p>
          <p className="text-sm text-body-text">
            {quote.quantity || "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Date</p>
          <p className="text-sm text-body-text">{formatDate(quote.created_at)}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted">Message</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-body-text">
          {quote.message}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={`tel:${quote.phone}`}
          className="rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90"
          onClick={(event) => event.stopPropagation()}
        >
          Call
        </a>
        {quote.email ? (
          <a
            href={`mailto:${quote.email}`}
            className="rounded-btn border border-forest px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
            onClick={(event) => event.stopPropagation()}
          >
            Email
          </a>
        ) : null}
        <a
          href={getWhatsAppHref(quote.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-btn border border-[#25D366] px-4 py-2 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/5"
          onClick={(event) => event.stopPropagation()}
        >
          WhatsApp
        </a>
      </div>

      <div onClick={(event) => event.stopPropagation()}>
        <label
          htmlFor={`notes-${quote.id}`}
          className="mb-2 block text-sm font-medium text-navy"
        >
          Internal Notes (not visible to client)
        </label>
        <textarea
          id={`notes-${quote.id}`}
          rows={3}
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="w-full rounded-btn border border-divider px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <button
          type="button"
          onClick={onSaveNotes}
          disabled={isSavingNotes}
          className="mt-3 inline-flex items-center gap-2 rounded-btn bg-forest px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest/90 disabled:opacity-70"
        >
          {isSavingNotes ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            "Save Notes"
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setQuotes((data ?? []) as QuoteRequest[]);
    } catch (error) {
      console.error("[admin/quotes] fetch failed:", error);
      setFetchError(
        "We couldn't load quote requests. Check your connection and try again."
      );
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quoteId = params.get("id");
    if (quoteId) {
      setExpandedQuoteId(quoteId);
    }
  }, []);

  const filteredQuotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;
      const matchesSearch =
        !query ||
        quote.name.toLowerCase().includes(query) ||
        quote.phone.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [quotes, searchQuery, statusFilter]);

  const updateStatus = async (quoteId: string, newStatus: QuoteStatus) => {
    const previousQuotes = quotes;

    setQuotes((current) =>
      current.map((quote) =>
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      )
    );
    setOpenMenuId(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("quote_requests")
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (error) {
      console.error("[admin/quotes] status update failed:", error.message);
      setQuotes(previousQuotes);
    }
  };

  const handleRowClick = (quote: QuoteRequest) => {
    setExpandedQuoteId((current) =>
      current === quote.id ? null : quote.id
    );
    setNotesDraft((current) => ({
      ...current,
      [quote.id]: current[quote.id] ?? quote.admin_notes ?? "",
    }));
  };

  const saveNotes = async (quoteId: string) => {
    const admin_notes = notesDraft[quoteId] ?? "";
    const previousQuotes = quotes;

    setSavingNotesId(quoteId);
    setQuotes((current) =>
      current.map((quote) =>
        quote.id === quoteId ? { ...quote, admin_notes } : quote
      )
    );

    const supabase = createClient();
    const { error } = await supabase
      .from("quote_requests")
      .update({ admin_notes })
      .eq("id", quoteId);

    setSavingNotesId(null);

    if (error) {
      console.error("[admin/quotes] notes save failed:", error.message);
      setQuotes(previousQuotes);
    }
  };

  const activeChips = [
    statusFilter !== "all"
      ? {
          key: "status",
          label: `Status: ${getStatusLabel(statusFilter)}`,
          onRemove: () => setStatusFilter("all"),
        }
      : null,
    searchQuery.trim()
      ? {
          key: "search",
          label: `Search: ${searchQuery.trim()}`,
          onRemove: () => setSearchQuery(""),
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    onRemove: () => void;
  }[];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-label text-2xl font-semibold text-navy">
          Quote Requests
        </h2>
        <button
          type="button"
          onClick={() => exportQuotesToCsv(filteredQuotes)}
          className="inline-flex min-h-11 items-center gap-2 rounded-btn border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gray-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "min-h-11 rounded-full px-4 py-2 font-label text-[13px] font-semibold transition-colors",
                statusFilter === filter.value
                  ? "bg-forest text-white"
                  : "border border-[#E2E8F0] bg-white text-navy hover:bg-gray-50"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full min-h-11 rounded-btn border border-divider px-4 py-3 text-sm text-body-text focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />

        {activeChips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-forest"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        {fetchError ? (
          <AdminErrorState
            message={fetchError}
            onRetry={() => void fetchQuotes()}
          />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading quotes...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted">
            No quote requests yet. Requests will appear here when submitted.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-muted">#</th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Phone
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Service
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote, index) => (
                <QuoteTableRows
                  key={quote.id}
                  quote={quote}
                  index={index}
                  isExpanded={expandedQuoteId === quote.id}
                  isMenuOpen={openMenuId === quote.id}
                  notes={notesDraft[quote.id] ?? quote.admin_notes ?? ""}
                  isSavingNotes={savingNotesId === quote.id}
                  onRowClick={() => handleRowClick(quote)}
                  onToggleMenu={() =>
                    setOpenMenuId((current) =>
                      current === quote.id ? null : quote.id
                    )
                  }
                  onCloseMenu={() => setOpenMenuId(null)}
                  onStatusChange={(status) => updateStatus(quote.id, status)}
                  onNotesChange={(value) =>
                    setNotesDraft((current) => ({
                      ...current,
                      [quote.id]: value,
                    }))
                  }
                  onSaveNotes={() => saveNotes(quote.id)}
                />
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}

function QuoteTableRows({
  quote,
  index,
  isExpanded,
  isMenuOpen,
  notes,
  isSavingNotes,
  onRowClick,
  onToggleMenu,
  onCloseMenu,
  onStatusChange,
  onNotesChange,
  onSaveNotes,
}: {
  quote: QuoteRequest;
  index: number;
  isExpanded: boolean;
  isMenuOpen: boolean;
  notes: string;
  isSavingNotes: boolean;
  onRowClick: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onStatusChange: (status: QuoteStatus) => void;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
}) {
  return (
    <>
      <tr
        onClick={onRowClick}
        className={cn(
          "cursor-pointer border-b border-[#E2E8F0] transition-colors hover:bg-gray-50",
          isExpanded && "bg-gray-50"
        )}
      >
        <td className="px-4 py-4 text-sm text-muted">{index + 1}</td>
        <td className="px-4 py-4 text-sm font-medium text-navy">{quote.name}</td>
        <td className="px-4 py-4 text-sm text-body-text">
          {formatPhone(quote.phone)}
        </td>
        <td className="px-4 py-4 text-sm text-body-text">{quote.service_type}</td>
        <td className="px-4 py-4 text-sm text-body-text">
          {formatDate(quote.created_at)}
        </td>
        <td className="px-4 py-4">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
              getStatusColor(quote.status)
            )}
          >
            {getStatusLabel(quote.status)}
          </span>
        </td>
        <td className="relative px-4 py-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu();
            }}
            className="rounded-lg p-2 text-navy transition-colors hover:bg-white"
            aria-label="Quote actions"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>

          {isMenuOpen ? (
            <>
              <button
                type="button"
                aria-label="Close actions menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={(event) => {
                  event.stopPropagation();
                  onCloseMenu();
                }}
              />
              <div className="absolute right-4 top-12 z-20 min-w-[200px] rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg">
                {STATUS_ACTIONS.map((action) => (
                  <button
                    key={action.value}
                    type="button"
                    disabled={quote.status === action.value}
                    onClick={(event) => {
                      event.stopPropagation();
                      onStatusChange(action.value);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-navy transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </td>
      </tr>

      {isExpanded ? (
        <tr>
          <td colSpan={7} className="p-0">
            <QuoteDetailPanel
              quote={quote}
              notes={notes}
              onNotesChange={onNotesChange}
              onSaveNotes={onSaveNotes}
              isSavingNotes={isSavingNotes}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}
