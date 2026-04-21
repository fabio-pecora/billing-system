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
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setFeedback({
        tone: "error",
        message: "Enter both a customer name and email address.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const { error } = await supabase.from("customers").insert([
      {
        name: trimmedName,
        email: trimmedEmail,
      },
    ]);

    console.log("CREATE CUSTOMER ERROR:", error);

    if (!error) {
      setName("");
      setEmail("");
      setFeedback({
        tone: "success",
        message: `${trimmedName} is ready for invoicing.`,
      });
      onCustomerCreated();
    } else {
      setFeedback({
        tone: "error",
        message: "Customer could not be created. Check your Supabase setup.",
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
        <p className="section-kicker">Customer profile</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Create customer
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Add the contact information you need before creating invoices.
            </p>
          </div>

          <span className="ui-status ui-status-warning">Step 1</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="field-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Health Group"
            className="ui-input"
          />
        </div>

        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="billing@acmehealth.com"
            className="ui-input"
          />
        </div>

        <div className="list-card p-4">
          <p className="text-sm font-semibold text-slate-950">
            Keep contact details consistent
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            This list becomes the source for invoice assignment, so clear names
            and dedicated billing emails make the rest of the workflow easier.
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
          disabled={loading}
          value={loading ? "Creating customer..." : "Save customer"}
          className="ui-button w-full"
        />
      </div>
    </form>
  );
}
