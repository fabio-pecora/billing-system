"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Customer } from "@/types";

type InvoiceFormProps = {
  customers: Customer[];
  onInvoiceCreated: () => void;
};

export default function InvoiceForm({
  customers,
  onInvoiceCreated,
}: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const invoiceAmount = Number(amount);

    if (!customerId || !amount) {
      setFeedback({
        tone: "error",
        message: "Choose a customer and enter an amount before continuing.",
      });
      return;
    }

    if (!Number.isFinite(invoiceAmount) || invoiceAmount <= 0) {
      setFeedback({
        tone: "error",
        message: "Invoice amount must be greater than zero.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const { error } = await supabase.from("invoices").insert([
      {
        customer_id: customerId,
        amount: invoiceAmount,
        status: "pending",
      },
    ]);

    console.log("CREATE INVOICE ERROR:", error);

    if (!error) {
      setCustomerId("");
      setAmount("");
      setFeedback({
        tone: "success",
        message: "Invoice created and marked as pending.",
      });
      onInvoiceCreated();
    } else {
      setFeedback({
        tone: "error",
        message: "Invoice could not be created. Check your Supabase setup.",
      });
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="dashboard-card p-6 sm:p-7"
    >
      <div className="space-y-3">
        <p className="section-kicker">Invoice draft</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Create invoice
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Link the invoice to an existing customer and the app will track it
              as pending until payment is confirmed.
            </p>
          </div>

          <span className="ui-status ui-status-success">Step 2</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="field-label">Customer</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="ui-input"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1250.00"
            className="ui-input"
          />
        </div>

        <div className="list-card p-4">
          <p className="text-sm font-semibold text-slate-950">
            Invoice status starts as pending
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Once payment is received, use the invoice list to mark it as paid.
            {customers.length === 0
              ? " Add a customer first to enable invoice creation."
              : ""}
          </p>
        </div>

        {feedback && (
          <p
            className={`ui-status ${
              feedback.tone === "success"
                ? "ui-status-success"
                : "ui-status-danger"
            }`}
          >
            {feedback.message}
          </p>
        )}

        <input
          type="submit"
          disabled={loading || customers.length === 0}
          value={loading ? "Creating invoice..." : "Save invoice"}
          className="ui-button w-full"
        />
      </div>
    </form>
  );
}
