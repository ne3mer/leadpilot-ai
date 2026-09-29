import "server-only";

/** Default model: DeepSeek-V4.1-Flash (OpenAI-compatible API). */
export const DEFAULT_DEEPSEEK_MODEL = "deepseek-flash";

export const DEEPSEEK_API_BASE_URL = "https://api.deepseek.com";

export function getDeepSeekModel(): string {
  const configured = process.env.DEEPSEEK_MODEL?.trim();
  return configured || DEFAULT_DEEPSEEK_MODEL;
}

export function getDeepSeekApiKey(): string | null {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function assertDeepSeekConfigured(): void {
  if (!getDeepSeekApiKey()) {
    throw new Error("AI_NOT_CONFIGURED");
  }
}
