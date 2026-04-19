"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type CustomerFormProps = {
  onCustomerCreated: () => void;
};

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) return;

    setLoading(true);

    const { error } = await supabase.from("customers").insert([
      {
        name,
        email,
      },
    ]);

    console.log("CREATE CUSTOMER ERROR:", error);

    if (!error) {
      setName("");
      setEmail("");
      onCustomerCreated();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Customer</h2>

      <div>
        <label className="block mb-2 text-sm">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name"
          className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white outline-none"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter customer email"
          className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Customer"}
      </button>
    </form>
  );
}
