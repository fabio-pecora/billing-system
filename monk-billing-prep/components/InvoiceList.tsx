"use client";

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
  function getCustomerName(customerId: string) {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.name} (${customer.email})` : customerId;
  }

  async function markAsPaid(invoiceId: string) {
    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoiceId);

    console.log("UPDATE INVOICE ERROR:", error);

    if (!error) {
      onInvoiceUpdated();
    }
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">Invoices</h2>

      {invoices.length === 0 ? (
        <p className="text-zinc-400">No invoices yet.</p>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="p-4 rounded border border-zinc-800 bg-zinc-950"
            >
              <p className="font-medium">
                {getCustomerName(invoice.customer_id)}
              </p>
              <p className="text-sm text-zinc-400">
                Amount: ${Number(invoice.amount).toFixed(2)}
              </p>
              <p className="text-sm text-zinc-400">Status: {invoice.status}</p>
              <p className="text-xs text-zinc-500 mt-1">{invoice.id}</p>

              {invoice.status !== "paid" && (
                <button
                  onClick={() => markAsPaid(invoice.id)}
                  className="mt-3 bg-white text-black px-3 py-2 rounded text-sm font-medium"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
