export type LeadPriorityExplanation = {
  explanation: string;
  nextAction: string;
};

export function mapPriorityInsightApiError(
  status: number,
  apiMessage: string | undefined
): string {
  switch (status) {
    case 401:
      return "You must be signed in.";
    case 400:
      return apiMessage && apiMessage.trim().length > 0
        ? apiMessage
        : "Something went wrong. Please try again.";
    case 404:
      return "Lead not found.";
    case 503:
      return "AI service is not configured.";
    case 502:
      return "AI insight failed. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function isLeadPriorityExplanation(value: unknown): value is LeadPriorityExplanation {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.explanation === "string" &&
    typeof record.nextAction === "string" &&
    record.explanation.trim().length > 0 &&
    record.nextAction.trim().length > 0
  );
}
