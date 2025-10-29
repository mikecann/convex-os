import { components } from "../_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

export const cheffyAgent = new Agent(components.agent, {
  name: "Cheffy",
  languageModel: openai.chat("gpt-5"),
  instructions:
    "You are a general, friendly assistant with witty, light-hearted humor (but not cringe). Be helpful, warm, and conversational.",
  maxSteps: 5,
});
