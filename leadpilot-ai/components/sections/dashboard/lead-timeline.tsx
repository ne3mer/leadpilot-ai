import type { LeadActivity } from "@/lib/activity-types";
import { formatLeadTimestamp } from "@/lib/leads/format";
import {
  buildLeadTimelineEvents,
  leadTimelineEventLabels,
} from "@/lib/lead-timeline";
import { LeadDetailSection } from "@/components/leads/lead-detail-section";
import { typographyClass } from "@/lib/design-system/typography";

type LeadTimelineProps = {
  leadCreatedAt: string;
  activities: LeadActivity[];
  /** When true, section chrome is provided by parent */
  embedded?: boolean;
};

function TimelineList({
  leadCreatedAt,
  activities,
}: {
  leadCreatedAt: string;
  activities: LeadActivity[];
}) {
  const events = buildLeadTimelineEvents(leadCreatedAt, activities);

  if (events.length === 0) {
    return (
      <p className={typographyClass("bodySmall", "text-muted")}>No history yet.</p>
    );
  }

  return (
    <ol className="min-w-0 divide-y divide-border">
      {events.map((event) => {
        const label = leadTimelineEventLabels[event.type];

        return (
          <li key={event.id} className="min-w-0 py-[var(--lp-space-4)] first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className={typographyClass("bodySmall", "font-medium text-primary")}>
                {label}
              </span>
              <time
                dateTime={event.created_at}
                className={typographyClass("caption", "shrink-0 tabular-nums text-muted")}
              >
                {formatLeadTimestamp(event.created_at)}
              </time>
            </div>
            {event.type !== "lead_created" ? (
              <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap break-words lp-text-body-small text-secondary">
                {event.content}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function LeadTimeline({ leadCreatedAt, activities, embedded = false }: LeadTimelineProps) {
  const list = <TimelineList leadCreatedAt={leadCreatedAt} activities={activities} />;

  if (embedded) {
    return list;
  }

  return (
    <LeadDetailSection
      index="03"
      title="History"
      description="Understand what happened—read-only context from pipeline and activity."
    >
      {list}
    </LeadDetailSection>
  );
}
