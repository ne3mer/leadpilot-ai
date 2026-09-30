"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  createLeadActivityAction,
  deleteLeadActivityAction,
  updateLeadActivityAction,
} from "@/lib/activities/actions";
import {
  leadActivityTypeLabels,
  leadActivityTypes,
  type LeadActivity,
  type LeadActivityType,
} from "@/lib/activity-types";
import { formatLeadTimestamp } from "@/lib/leads/format";
import { LeadDetailSection } from "@/components/leads/lead-detail-section";
import { Button, buttonClassName } from "@/components/ui/button";
import {
  fieldLabelClassName,
  inputClassName,
  selectClassName,
} from "@/components/ui/input";
import { typographyClass } from "@/lib/design-system/typography";

type LeadActivityPanelProps = {
  leadId: string;
  initialActivities: LeadActivity[];
};

type ActivityFormState = {
  type: LeadActivityType;
  content: string;
};

const defaultFormState: ActivityFormState = {
  type: "note",
  content: "",
};

function ActivityPanelContent({ leadId, initialActivities }: LeadActivityPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ActivityFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ActivityFormState>(defaultFormState);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activities = initialActivities;

  function resetCreateForm() {
    setForm(defaultFormState);
    setShowForm(false);
    setError(null);
  }

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLeadActivityAction(leadId, form);
      if (!result.success) {
        setError(result.error);
        return;
      }
      resetCreateForm();
      router.refresh();
    });
  }

  function startEdit(activity: LeadActivity) {
    setConfirmDeleteId(null);
    setEditingId(activity.id);
    setEditForm({ type: activity.type, content: activity.content });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(defaultFormState);
    setError(null);
  }

  function handleUpdate(event: React.FormEvent, activityId: string) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateLeadActivityAction(leadId, activityId, editForm);
      if (!result.success) {
        setError(result.error);
        return;
      }
      cancelEdit();
      router.refresh();
    });
  }

  function handleDelete(activityId: string) {
    setError(null);

    startTransition(async () => {
      const result = await deleteLeadActivityAction(leadId, activityId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      if (editingId === activityId) {
        cancelEdit();
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={typographyClass("bodySmall", "text-secondary")}>
          Record notes, emails, and calls for this lead.
        </p>
        {!showForm ? (
          <Button
            type="button"
            variant="secondary"
            className="gap-1.5"
            onClick={() => {
              setShowForm(true);
              setError(null);
              setConfirmDeleteId(null);
            }}
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden />
            Add activity
          </Button>
        ) : null}
      </div>

      {error ? (
        <p
          className="mt-4 rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {showForm ? (
        <form
          className="mt-[var(--lp-space-5)] space-y-[var(--lp-space-form-gap)] border-y border-border py-[var(--lp-space-5)]"
          onSubmit={handleCreate}
        >
          <label className={fieldLabelClassName()}>
            Type
            <select
              value={form.type}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, type: event.target.value as LeadActivityType }))
              }
              className={selectClassName("mt-2")}
            >
              {leadActivityTypes.map((type) => (
                <option key={type} value={type}>
                  {leadActivityTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>

          <label className={fieldLabelClassName()}>
            Content
            <textarea
              required
              rows={4}
              value={form.content}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              className={`${inputClassName("mt-2")} resize-y`}
              placeholder="What happened or what should be remembered?"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding…" : "Add activity"}
            </Button>
            <button
              type="button"
              disabled={isPending}
              onClick={resetCreateForm}
              className={buttonClassName("secondary", "px-4 py-2 text-sm disabled:opacity-60")}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-[var(--lp-space-5)] min-w-0 divide-y divide-border">
        {activities.length === 0 ? (
          <div className="py-[var(--lp-space-6)] lp-text-body-small text-muted">
            <p>No activity recorded yet.</p>
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="lp-focus-ring mt-3 inline-flex items-center gap-1.5 font-medium text-accent"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add activity
              </button>
            ) : null}
          </div>
        ) : (
          activities.map((activity) => (
            <article key={activity.id} className="min-w-0 py-[var(--lp-space-4)] first:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className={typographyClass("bodySmall", "font-medium text-primary")}>
                      {leadActivityTypeLabels[activity.type]}
                    </span>
                    <time
                      dateTime={activity.created_at}
                      className={typographyClass("caption", "tabular-nums text-muted")}
                    >
                      {formatLeadTimestamp(activity.created_at)}
                    </time>
                  </div>
                </div>

                {editingId !== activity.id && confirmDeleteId !== activity.id ? (
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startEdit(activity)}
                      className="lp-focus-ring lp-text-caption font-medium text-secondary hover:text-primary disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        setConfirmDeleteId(activity.id);
                        setError(null);
                      }}
                      className="lp-focus-ring lp-text-caption font-medium text-danger hover:opacity-90 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>

              {confirmDeleteId === activity.id ? (
                <div
                  className="mt-3 rounded-sm border border-danger/25 bg-danger-muted px-3 py-3"
                  role="alertdialog"
                  aria-labelledby={`delete-activity-${activity.id}`}
                >
                  <p
                    id={`delete-activity-${activity.id}`}
                    className={typographyClass("bodySmall", "text-danger")}
                  >
                    Delete this activity? This cannot be undone.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(activity.id)}
                      className="rounded-sm bg-danger px-3 py-1.5 lp-text-caption font-medium text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {isPending ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setConfirmDeleteId(null)}
                      className={buttonClassName("secondary", "px-3 py-1.5 lp-text-caption disabled:opacity-60")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {editingId === activity.id ? (
                <form
                  className="mt-3 space-y-[var(--lp-space-form-gap)]"
                  onSubmit={(event) => handleUpdate(event, activity.id)}
                >
                  <label className={fieldLabelClassName()}>
                    Type
                    <select
                      value={editForm.type}
                      disabled={isPending}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          type: event.target.value as LeadActivityType,
                        }))
                      }
                      className={selectClassName("mt-2")}
                    >
                      {leadActivityTypes.map((type) => (
                        <option key={type} value={type}>
                          {leadActivityTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={fieldLabelClassName()}>
                    Content
                    <textarea
                      required
                      rows={4}
                      value={editForm.content}
                      disabled={isPending}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, content: event.target.value }))
                      }
                      className={`${inputClassName("mt-2")} resize-y`}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving…" : "Save"}
                    </Button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={cancelEdit}
                      className={buttonClassName("secondary", "px-4 py-2 text-sm disabled:opacity-60")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-2 whitespace-pre-wrap break-words lp-text-body-small leading-relaxed text-secondary">
                  {activity.content}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </>
  );
}

export function LeadActivityPanel({ leadId, initialActivities }: LeadActivityPanelProps) {
  return (
    <LeadDetailSection
      index="04"
      title="Activity"
      description="Workspace for recording what you learn and do with this lead."
    >
      <ActivityPanelContent leadId={leadId} initialActivities={initialActivities} />
    </LeadDetailSection>
  );
}
