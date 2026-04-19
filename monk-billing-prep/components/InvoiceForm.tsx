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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!customerId || !amount) return;

    setLoading(true);

    const { error } = await supabase.from("invoices").insert([
      {
        customer_id: customerId,
        amount: Number(amount),
        status: "pending",
      },
    ]);

    console.log("CREATE INVOICE ERROR:", error);

    if (!error) {
      setCustomerId("");
      setAmount("");
      onInvoiceCreated();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Invoice</h2>

      <div>
        <label className="block mb-2 text-sm">Customer</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white outline-none"
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
        <label className="block mb-2 text-sm">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter invoice amount"
          className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || customers.length === 0}
        className="bg-white text-black px-4 py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}
