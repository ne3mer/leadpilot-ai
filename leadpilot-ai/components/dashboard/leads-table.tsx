import { leadsData } from "@/lib/mock-data";

const statusClasses: Record<string, string> = {
  Qualified: "bg-emerald-500/15 text-emerald-300",
  Contacted: "bg-cyan-500/15 text-cyan-300",
  "Proposal Sent": "bg-indigo-500/15 text-indigo-300",
  Negotiation: "bg-amber-500/15 text-amber-300",
  New: "bg-slate-500/20 text-slate-200",
};

export function LeadsTable() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-lg font-medium text-white">Lead Pipeline</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead) => (
              <tr key={lead.email} className="border-t border-white/10">
                <td className="px-3 py-3 text-white">{lead.name}</td>
                <td className="px-3 py-3 text-slate-300">{lead.email}</td>
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
