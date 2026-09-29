import "server-only";

import OpenAI from "openai";
import {
  assertDeepSeekConfigured,
  DEEPSEEK_API_BASE_URL,
  getDeepSeekApiKey,
  getDeepSeekModel,
} from "@/lib/ai/config";

let client: OpenAI | null = null;

export function getDeepSeekClient(): OpenAI {
  assertDeepSeekConfigured();
  const apiKey = getDeepSeekApiKey();
  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  if (!client) {
    client = new OpenAI({
      apiKey,
      baseURL: DEEPSEEK_API_BASE_URL,
    });
  }

  return client;
}

export function getDeepSeekChatModel(): string {
  return getDeepSeekModel();
}
