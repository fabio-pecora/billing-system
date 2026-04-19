"use client";

import { useEffect, useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import CustomerList from "@/components/CustomerList";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import { supabase } from "@/lib/supabase";
import { Customer, Invoice } from "@/types";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  async function fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("FETCH CUSTOMERS ERROR:", error);

    if (!error && data) {
      setCustomers(data);
    }
  }

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("FETCH INVOICES ERROR:", error);

    if (!error && data) {
      setInvoices(data);
    }
  }

  async function refreshAll() {
    await fetchCustomers();
    await fetchInvoices();
  }

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Billing Prep App</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <CustomerForm onCustomerCreated={fetchCustomers} />
          <InvoiceForm customers={customers} onInvoiceCreated={fetchInvoices} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CustomerList customers={customers} />
          <InvoiceList
            invoices={invoices}
            customers={customers}
            onInvoiceUpdated={fetchInvoices}
          />
        </div>
      </div>
    </main>
  );
}
