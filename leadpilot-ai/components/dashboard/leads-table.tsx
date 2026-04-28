import { leadsData } from "@/lib/mock-data";

const statusClasses: Record<string, string> = {
  Qualified: "bg-emerald-100 text-emerald-800",
  Contacted: "bg-lime-100 text-lime-800",
  "Proposal Sent": "bg-slate-100 text-slate-700",
  Negotiation: "bg-amber-100 text-amber-800",
  New: "bg-zinc-100 text-zinc-700",
};

export function LeadsTable() {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-lg font-medium text-black">Lead Pipeline</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead) => (
              <tr key={lead.email} className="border-t border-black/10">
                <td className="px-3 py-3 text-black">{lead.name}</td>
                <td className="px-3 py-3 text-slate-600">{lead.email}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusClasses[lead.status]
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
