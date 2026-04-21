"use client";

import { Customer } from "@/types";

type CustomerListProps = {
  customers: Customer[];
};

function formatDate(value?: string) {
  if (!value) {
    return "Recently added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomerList({ customers }: CustomerListProps) {
  return (
    <section className="dashboard-card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Customer records</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Customers
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Newest profiles are shown first so billing-ready accounts stay easy
            to find.
          </p>
        </div>

        <span className="info-chip">
          {customers.length} total
        </span>
      </div>

      {customers.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-white/40 p-6 text-sm leading-6 text-[var(--muted)]">
          No customers yet. Create a customer in the left column to start
          building the billing list.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="list-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {customer.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "CU"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-slate-950">
                        {customer.name}
                      </p>
                      <p className="truncate text-sm text-[var(--muted)]">
                        {customer.email}
                      </p>
                    </div>

                    <span className="info-chip whitespace-nowrap">
                      {formatDate(customer.created_at)}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Customer ID
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-700">
                      {customer.id}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
