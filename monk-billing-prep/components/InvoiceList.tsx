"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Customer, Invoice } from "@/types";

type InvoiceListProps = {
  invoices: Invoice[];
  customers: Customer[];
  onInvoiceUpdated: () => void;
};

export default function InvoiceList({
  invoices,
  customers,
  onInvoiceUpdated,
}: InvoiceListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function getCustomerName(customerId: string) {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.name} (${customer.email})` : customerId;
  }

  function formatDate(value?: string) {
    if (!value) {
      return "Recently created";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently created";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function markAsPaid(invoiceId: string) {
    setUpdatingId(invoiceId);

    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoiceId);

    console.log("UPDATE INVOICE ERROR:", error);

    if (!error) {
      onInvoiceUpdated();
    }

    setUpdatingId(null);
  }

  return (
    <section className="dashboard-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Payment tracking</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Invoices
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Review status, amount, and customer assignment without leaving the
            same screen.
          </p>
        </div>

        <span className="info-chip">
          {invoices.length} total
        </span>
      </div>

      {invoices.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-white/40 p-6 text-sm leading-6 text-[var(--muted)]">
          No invoices yet. Create one after at least one customer record exists.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {invoices.map((invoice) => (
            <article
              key={invoice.id}
              className="list-card p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`ui-status ${
                        invoice.status === "paid"
                          ? "ui-status-success"
                          : "ui-status-warning"
                      }`}
                    >
                      {invoice.status === "paid" ? "Paid" : "Pending"}
                    </span>
                    <span className="info-chip">{formatDate(invoice.created_at)}</span>
                  </div>

                  <p className="mt-4 truncate text-lg font-semibold text-slate-950">
                    {getCustomerName(invoice.customer_id)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Invoice ID
                  </p>
                  <p className="truncate font-mono text-xs text-slate-700">
                    {invoice.id}
                  </p>
                </div>

                <div className="rounded-3xl bg-[var(--accent-soft)] px-4 py-3 text-left sm:min-w-[9rem] sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                    Amount
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    ${Number(invoice.amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {invoice.status !== "paid" && (
                <button
                  type="button"
                  onClick={() => void markAsPaid(invoice.id)}
                  disabled={updatingId === invoice.id}
                  className="ui-button mt-4 w-full sm:w-auto"
                >
                  {updatingId === invoice.id ? "Updating..." : "Mark as paid"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
