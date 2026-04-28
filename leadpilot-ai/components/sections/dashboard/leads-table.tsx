"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { leadsData } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";

const LEADS_STORAGE_KEY = "leadpilot.dashboard.leads";

const statusClasses: Record<LeadStatus, string> = {
  New: "bg-zinc-100 text-zinc-700",
  Contacted: "bg-lime-100 text-lime-800",
  Qualified: "bg-emerald-100 text-emerald-800",
  "Proposal Sent": "bg-slate-100 text-slate-700",
  Negotiation: "bg-amber-100 text-amber-800",
};

function createLeadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function getInitialLeads(): Lead[] {
  return leadsData.map((lead) => ({
    id: createLeadId(),
    ...lead,
  }));
}

function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") {
    return getInitialLeads();
  }

  try {
    const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!storedLeads) {
      return getInitialLeads();
    }

    const parsed = JSON.parse(storedLeads) as Lead[];
    if (!Array.isArray(parsed)) {
      return getInitialLeads();
    }

    const sanitized = parsed.filter(
      (lead) =>
        typeof lead.id === "string" &&
        typeof lead.name === "string" &&
        typeof lead.email === "string" &&
        leadStatuses.includes(lead.status)
    );

    return sanitized;
  } catch {
    return getInitialLeads();
  }
}

export function DashboardLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");

  useEffect(() => {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  const hasDuplicateEmail = useMemo(
    () => leads.some((lead) => lead.email.toLowerCase() === email.trim().toLowerCase()),
    [email, leads]
  );

  const isFormValid = name.trim().length > 1 && email.trim().includes("@") && !hasDuplicateEmail;

  function handleAddLead() {
    if (!isFormValid) {
      return;
    }

    setLeads((prev) => [
      {
        id: createLeadId(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        status,
      },
      ...prev,
    ]);

    setName("");
    setEmail("");
    setStatus("New");
  }

  function handleDeleteLead(id: string) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  function handleStatusChange(id: string, nextStatus: LeadStatus) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status: nextStatus,
            }
          : lead
      )
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-black">Lead Pipeline</h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {leads.length} leads
        </span>
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-black/10 bg-slate-50 p-4 md:grid-cols-4">
        <label className="text-sm text-slate-700 md:col-span-1">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Lead name"
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          />
        </label>

        <label className="text-sm text-slate-700 md:col-span-1">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lead@company.com"
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          />
        </label>

        <label className="text-sm text-slate-700 md:col-span-1">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
          >
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end md:col-span-1">
          <button
            type="button"
            onClick={handleAddLead}
            disabled={!isFormValid}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(22,163,74,0.65)] transition duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_28px_-14px_rgba(22,163,74,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {hasDuplicateEmail ? (
        <p className="mt-2 text-xs text-amber-700">A lead with this email already exists.</p>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-black/10">
                <td className="px-3 py-3 font-medium text-black">{lead.name}</td>
                <td className="px-3 py-3 text-slate-600">{lead.email}</td>
                <td className="px-3 py-3">
                  <select
                    value={lead.status}
                    onChange={(event) =>
                      handleStatusChange(lead.id, event.target.value as LeadStatus)
                    }
                    className={`rounded-full border border-transparent px-2.5 py-1 text-xs font-medium outline-none ring-emerald-300/60 transition focus:ring ${statusClasses[lead.status]}`}
                  >
                    {leadStatuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDeleteLead(lead.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
