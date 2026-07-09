import { format } from "date-fns";
import { Bell, ClipboardList, Image, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { getDashboardStats } from "@/lib/supabase/queries";
import {
  cn,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import type { QuoteStatus } from "@/types";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  context: string;
  badge?: string;
}

function StatCard({
  icon,
  iconBg,
  value,
  label,
  context,
  badge,
}: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            iconBg
          )}
        >
          {icon}
        </div>
        {badge ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-4 font-label text-4xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-sm font-normal text-muted">{label}</p>
      <p className="mt-1 text-sm text-body-text">{context}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const { totalQuotes, newQuotes, galleryCount, recentQuotes, hasError } =
    stats;
  const today = format(new Date(), "d MMMM yyyy");

  if (hasError) {
    return (
      <AdminErrorState message="We couldn't load dashboard data from Supabase. Refresh the page to try again." />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={
            <ClipboardList
              className="h-5 w-5 text-blue-700"
              aria-hidden="true"
            />
          }
          iconBg="bg-blue-100"
          value={totalQuotes}
          label="Total Quotes"
          context="All time"
        />
        <StatCard
          icon={<Bell className="h-5 w-5 text-amber-700" aria-hidden="true" />}
          iconBg="bg-amber-100"
          value={newQuotes}
          label="New Quotes"
          context="Awaiting response"
          badge={newQuotes > 0 ? `${newQuotes} new` : undefined}
        />
        <StatCard
          icon={<Image className="h-5 w-5 text-forest" aria-hidden="true" />}
          iconBg="bg-green-100"
          value={galleryCount}
          label="Gallery Photos"
          context="Active in gallery"
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-navy" aria-hidden="true" />}
          iconBg="bg-sage/30"
          value={today}
          label="Last Updated"
          context="System status: Active"
        />
      </div>

      <section className="mt-8">
        <h2 className="font-label text-lg font-semibold text-navy">
          Recent Quote Requests
        </h2>

        <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-muted">
                  Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-muted">
                  Service
                </th>
                <th className="px-6 py-3 text-sm font-medium text-muted">
                  Date
                </th>
                <th className="px-6 py-3 text-sm font-medium text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-[#E2E8F0] last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-navy">
                      {quote.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-body-text">
                      {quote.service_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-body-text">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          getStatusColor(quote.status as QuoteStatus)
                        )}
                      >
                        {getStatusLabel(quote.status as QuoteStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/quotes?id=${quote.id}`}
                        className="text-sm font-semibold text-forest transition-colors hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-muted"
                  >
                    No quote requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link
          href="/admin/quotes"
          className="mt-4 inline-flex text-sm font-semibold text-forest transition-colors hover:underline"
        >
          View All Quotes →
        </Link>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap gap-3">
          <Button href="/admin/gallery" variant="outline">
            Upload Photos
          </Button>
          <Button href="/admin/quotes" variant="outline">
            View All Quotes
          </Button>
          <Button href="/admin/content" variant="outline">
            Edit Site Content
          </Button>
        </div>
      </section>
    </div>
  );
}
