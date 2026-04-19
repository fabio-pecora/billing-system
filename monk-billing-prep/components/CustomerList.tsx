"use client";

import { Customer } from "@/types";

type CustomerListProps = {
  customers: Customer[];
};

export default function CustomerList({ customers }: CustomerListProps) {
  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">Customers</h2>

      {customers.length === 0 ? (
        <p className="text-zinc-400">No customers yet.</p>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="p-4 rounded border border-zinc-800 bg-zinc-950"
            >
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-zinc-400">{customer.email}</p>
              <p className="text-xs text-zinc-500 mt-1">{customer.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
