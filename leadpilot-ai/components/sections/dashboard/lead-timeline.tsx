import { Mail, Phone, StickyNote, UserPlus } from "lucide-react";
import type { LeadActivity } from "@/lib/activity-types";
import { formatLeadTimestamp } from "@/lib/leads/format";
import {
  buildLeadTimelineEvents,
  leadTimelineEventLabels,
  type LeadTimelineEventType,
} from "@/lib/lead-timeline";
import { Card } from "@/components/ui/card";

type LeadTimelineProps = {
  leadCreatedAt: string;
  activities: LeadActivity[];
};

function TimelineEventIcon({ type }: { type: LeadTimelineEventType }) {
  const className = "h-4 w-4 shrink-0 text-emerald-700";
  if (type === "lead_created") {
    return <UserPlus className={className} aria-hidden />;
  }
  if (type === "email") {
    return <Mail className={className} aria-hidden />;
  }
  if (type === "call") {
    return <Phone className={className} aria-hidden />;
  }
  return <StickyNote className={className} aria-hidden />;
}

export function LeadTimeline({ leadCreatedAt, activities }: LeadTimelineProps) {
  const events = buildLeadTimelineEvents(leadCreatedAt, activities);

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
        3 · History
      </p>
      <h2 className="mt-1 text-lg font-medium text-black">Lead timeline</h2>
      <p className="mt-2 text-sm text-slate-600">
        Chronological history of this lead—read-only context. Add or edit entries in Activity below.
      </p>
      {activities.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">No additional activity yet.</p>
      ) : null}

      <ol className="relative mt-4 space-y-0 border-l border-slate-200 pl-4 sm:pl-5">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const label = leadTimelineEventLabels[event.type];

          return (
            <li
              key={event.id}
              className={`relative ${isLast ? "pb-0" : "pb-6"}`}
            >
              <span
                className="absolute -left-[1.35rem] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white sm:-left-[1.45rem]"
                aria-hidden
              >
                <TimelineEventIcon type={event.type} />
              </span>

              <div className="min-w-0 pl-2 sm:pl-3">
                <time
                  dateTime={event.created_at}
                  className="text-xs text-slate-500"
                >
                  {formatLeadTimestamp(event.created_at)}
                </time>
                <p className="mt-1 text-sm font-semibold text-black">{label}</p>
                {event.type !== "lead_created" ? (
                  <p className="mt-1 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                    {event.content}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
