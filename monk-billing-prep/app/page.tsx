"use client";

import { useCallback, useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import CustomerList from "@/components/CustomerList";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import { supabase } from "@/lib/supabase";
import { Customer, Invoice } from "@/types";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("FETCH CUSTOMERS ERROR:", error);

    return !error && data ? data : [];
  }

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("FETCH INVOICES ERROR:", error);

    return !error && data ? data : [];
  }

  const refreshAll = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }

    const [customerData, invoiceData] = await Promise.all([
      fetchCustomers(),
      fetchInvoices(),
    ]);

    setCustomers(customerData);
    setInvoices(invoiceData);
    setLastRefreshed(new Date());
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshAll(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshAll]);

  const pendingInvoices = invoices.filter((invoice) => invoice.status !== "paid");
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const totalInvoiced = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0,
  );
  const outstandingRevenue = pendingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0,
  );

  const stats = [
    {
      label: "Active customers",
      value: customers.length.toString().padStart(2, "0"),
      detail: "Profiles ready for billing",
      tone:
        "from-white via-white to-amber-50/80 border-amber-200/60 text-amber-950",
    },
    {
      label: "Open invoices",
      value: pendingInvoices.length.toString().padStart(2, "0"),
      detail: "Invoices still awaiting payment",
      tone:
        "from-white via-white to-teal-50/80 border-teal-200/60 text-slate-950",
    },
    {
      label: "Collected",
      value: currencyFormatter.format(
        paidInvoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0),
      ),
      detail: "Marked as paid in this workspace",
      tone:
        "from-white via-white to-emerald-50/80 border-emerald-200/60 text-slate-950",
    },
    {
      label: "Outstanding",
      value: currencyFormatter.format(outstandingRevenue),
      detail: `${invoices.length} total invoices, ${currencyFormatter.format(totalInvoiced)} overall`,
      tone:
        "from-white via-white to-orange-50/80 border-orange-200/60 text-slate-950",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_15%_10%,rgba(180,83,9,0.12),transparent_24%),radial-gradient(circle_at_85%_8%,rgba(15,118,110,0.18),transparent_26%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="dashboard-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-end">
            <div className="space-y-5">
              <span className="info-chip">Monk billing workspace</span>
              <div className="space-y-4">
                <p className="section-kicker">Overview</p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Billing ops that are easier to scan, split, and act on.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Create customer records, draft invoices, and close payment
                  status from one dashboard. The layout separates creation from
                  tracking so the next action is always obvious.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="info-chip">Customers first, invoices second</span>
                <span className="info-chip">Newest records stay on top</span>
                <span className="info-chip">Pending invoices stay visible</span>
              </div>
            </div>

            <div className="dashboard-card dashboard-card-muted p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="section-kicker">Workspace status</p>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      Refresh to sync both customer and invoice data from
                      Supabase in one pass.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void refreshAll()}
                    disabled={isRefreshing}
                    className="ui-button ui-button-secondary min-w-[8.5rem]"
                  >
                    {isRefreshing ? "Syncing..." : "Refresh data"}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="list-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Last refresh
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {lastRefreshed
                        ? lastRefreshed.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Loading"}
                    </p>
                  </div>

                  <div className="list-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Focus
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {customers.length === 0
                        ? "Add your first customer"
                        : pendingInvoices.length === 0
                          ? "Everything is paid"
                          : "Follow up on open invoices"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className={`list-card border bg-gradient-to-br p-5 ${stat.tone}`}
              >
                <p className="text-sm font-semibold text-[var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
          <section className="space-y-6 xl:sticky xl:top-6 self-start">
            <div className="dashboard-card dashboard-card-muted p-6">
              <p className="section-kicker">Create records</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Start with clean customer details, then issue invoices.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                The forms stay grouped together so data entry feels like one
                workflow instead of two separate tools.
              </p>
            </div>

            <CustomerForm onCustomerCreated={() => void refreshAll()} />
            <InvoiceForm
              customers={customers}
              onInvoiceCreated={() => void refreshAll()}
            />
          </section>

          <section className="space-y-6">
            <div className="dashboard-card p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <p className="section-kicker">Operations board</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Review customers and invoice activity side by side.
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    Customer records stay separate from payment tracking, which
                    makes it easier to move from account lookup to collection
                    work without losing context.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="info-chip">
                    {customers.length} customer{customers.length === 1 ? "" : "s"}
                  </span>
                  <span className="info-chip">
                    {pendingInvoices.length} open invoice
                    {pendingInvoices.length === 1 ? "" : "s"}
                  </span>
                  <span className="info-chip">
                    {currencyFormatter.format(outstandingRevenue)} outstanding
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 2xl:grid-cols-2">
              <CustomerList customers={customers} />
              <InvoiceList
                invoices={invoices}
                customers={customers}
                onInvoiceUpdated={() => void refreshAll()}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
