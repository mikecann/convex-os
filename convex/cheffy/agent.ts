import { components } from "../_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { CHEFFY_LIMITS } from "./limits";

export const cheffyAgent = new Agent(components.agent, {
  name: "Cheffy",
  languageModel: openai.chat("gpt-5"),
  instructions:
    "You are a general, friendly assistant with witty, light-hearted humor (but not cringe). Be helpful, warm, and conversational.",
  // Cheffy has no tools, so one step is all a reply ever needs.
  maxSteps: 1,
  contextOptions: { recentMessages: CHEFFY_LIMITS.contextMessages },
  callSettings: {
    maxOutputTokens: CHEFFY_LIMITS.maxOutputTokens,
    maxRetries: CHEFFY_LIMITS.maxProviderRetries,
  },
});
