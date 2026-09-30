"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Mail, Phone, Plus, StickyNote } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

function ActivityTypeIcon({ type }: { type: LeadActivityType }) {
  const className = "h-4 w-4 shrink-0 text-emerald-700";
  if (type === "email") {
    return <Mail className={className} aria-hidden />;
  }
  if (type === "call") {
    return <Phone className={className} aria-hidden />;
  }
  return <StickyNote className={className} aria-hidden />;
}

export function LeadActivityPanel({ leadId, initialActivities }: LeadActivityPanelProps) {
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
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-black">Activity</h2>
        {!showForm ? (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError(null);
              setConfirmDeleteId(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add Activity
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <form className="mt-4 space-y-3 rounded-xl border border-black/10 bg-slate-50/80 p-4" onSubmit={handleCreate}>
          <label className="block text-sm text-slate-700">
            Type
            <select
              value={form.type}
              disabled={isPending}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, type: event.target.value as LeadActivityType }))
              }
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
            >
              {leadActivityTypes.map((type) => (
                <option key={type} value={type}>
                  {leadActivityTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            Content
            <textarea
              required
              rows={4}
              value={form.content}
              disabled={isPending}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              className="mt-2 w-full resize-y rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
              placeholder="What happened or what should be remembered?"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl px-4 py-2 text-sm disabled:opacity-60"
            >
              {isPending ? "Adding…" : "Add Activity"}
            </Button>
            <button
              type="button"
              disabled={isPending}
              onClick={resetCreateForm}
              className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 bg-slate-50/50 px-4 py-5 text-sm text-slate-600">
            <p>No activity recorded yet.</p>
            <p className="mt-1">Add a note, email, or call to keep context for this lead.</p>
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Plus className="h-4 w-4" aria-hidden />
                Add Activity
              </button>
            ) : null}
          </div>
        ) : (
          activities.map((activity) => (
            <article
              key={activity.id}
              className="rounded-xl border border-black/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500">{formatLeadTimestamp(activity.created_at)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ActivityTypeIcon type={activity.type} />
                    <span className="text-sm font-semibold text-black">
                      {leadActivityTypeLabels[activity.type]}
                    </span>
                  </div>
                </div>

                {editingId !== activity.id && confirmDeleteId !== activity.id ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startEdit(activity)}
                      className="text-xs font-semibold text-slate-600 hover:text-emerald-700 disabled:opacity-60"
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
                      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>

              {confirmDeleteId === activity.id ? (
                <div
                  className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3"
                  role="alertdialog"
                  aria-labelledby={`delete-activity-${activity.id}`}
                >
                  <p id={`delete-activity-${activity.id}`} className="text-sm text-red-900">
                    Delete this activity? This cannot be undone.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(activity.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {isPending ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {editingId === activity.id ? (
                <form className="mt-3 space-y-3" onSubmit={(event) => handleUpdate(event, activity.id)}>
                  <label className="block text-sm text-slate-700">
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
                      className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
                    >
                      {leadActivityTypes.map((type) => (
                        <option key={type} value={type}>
                          {leadActivityTypeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm text-slate-700">
                    Content
                    <textarea
                      required
                      rows={4}
                      value={editForm.content}
                      disabled={isPending}
                      onChange={(event) =>
                        setEditForm((prev) => ({ ...prev, content: event.target.value }))
                      }
                      className="mt-2 w-full resize-y rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="rounded-xl px-4 py-2 text-sm disabled:opacity-60"
                    >
                      {isPending ? "Saving…" : "Save"}
                    </Button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={cancelEdit}
                      className="rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                  {activity.content}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
