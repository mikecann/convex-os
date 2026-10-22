import { describe, expect, test } from "vitest";
import { initConvexTest } from "../test.setup";
import {
  CHEFFY_LIMITS,
  consumeDailyBudget,
  DEFAULT_DAILY_GLOBAL_LIMIT,
  DEFAULT_DAILY_USER_LIMIT,
  readDailyLimits,
  utcDayKey,
} from "./limits";

const DAY = Date.UTC(2026, 9, 22, 12);

describe("readDailyLimits", () => {
  test("uses modest defaults when unset or invalid", () => {
    expect(readDailyLimits({})).toEqual({
      perUser: DEFAULT_DAILY_USER_LIMIT,
      global: DEFAULT_DAILY_GLOBAL_LIMIT,
    });
    expect(
      readDailyLimits({
        CHEFFY_DAILY_USER_LIMIT: "lots",
        CHEFFY_DAILY_GLOBAL_LIMIT: "-5",
      }),
    ).toEqual({
      perUser: DEFAULT_DAILY_USER_LIMIT,
      global: DEFAULT_DAILY_GLOBAL_LIMIT,
    });
  });

  test("accepts overrides, including 0 to switch Cheffy off", () => {
    expect(
      readDailyLimits({
        CHEFFY_DAILY_USER_LIMIT: "3",
        CHEFFY_DAILY_GLOBAL_LIMIT: "0",
      }),
    ).toEqual({ perUser: 3, global: 0 });
  });
});

describe("consumeDailyBudget", () => {
  const newUser = (t: ReturnType<typeof initConvexTest>) =>
    t.run((ctx) => ctx.db.insert("users", {}));

  test("stops a user at their daily limit", async () => {
    const t = initConvexTest();
    const userId = await newUser(t);
    const limits = { perUser: 2, global: 100 };
    const consume = () =>
      t.run((ctx) => consumeDailyBudget(ctx.db, userId, { now: DAY, limits }));

    await consume();
    await consume();
    await expect(consume()).rejects.toThrow(/today's Cheffy message limit/);
  });

  test("fresh accounts can't get around the global limit", async () => {
    const t = initConvexTest();
    const limits = { perUser: 5, global: 3 };
    for (let i = 0; i < 3; i++) {
      const userId = await newUser(t);
      await t.run((ctx) =>
        consumeDailyBudget(ctx.db, userId, { now: DAY, limits }),
      );
    }
    const latecomer = await newUser(t);
    await expect(
      t.run((ctx) =>
        consumeDailyBudget(ctx.db, latecomer, { now: DAY, limits }),
      ),
    ).rejects.toThrow(/daily budget for everyone/);
  });

  test("concurrent sends never overspend", async () => {
    const t = initConvexTest();
    const userId = await newUser(t);
    const limits = { perUser: 4, global: 100 };
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () =>
        t.run((ctx) =>
          consumeDailyBudget(ctx.db, userId, { now: DAY, limits }),
        ),
      ),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(4);
    const counters = await t.run((ctx) =>
      ctx.db.query("cheffyUsage").collect(),
    );
    expect(counters.map((c) => c.count)).toEqual([4, 4]);
  });

  test("resets on the next UTC day", async () => {
    const t = initConvexTest();
    const userId = await newUser(t);
    const limits = { perUser: 1, global: 1 };
    await t.run((ctx) =>
      consumeDailyBudget(ctx.db, userId, { now: DAY, limits }),
    );
    const tomorrow = DAY + 24 * 60 * 60 * 1000;
    expect(utcDayKey(tomorrow)).not.toEqual(utcDayKey(DAY));
    await t.run((ctx) =>
      consumeDailyBudget(ctx.db, userId, { now: tomorrow, limits }),
    );
  });
});

describe("provider retries", () => {
  test("Cheffy replies retry at most once", async () => {
    const { cheffyAgent } = await import("./agent");
    expect(cheffyAgent.options.callSettings?.maxRetries).toBe(
      CHEFFY_LIMITS.maxProviderRetries,
    );
    expect(CHEFFY_LIMITS.maxProviderRetries).toBe(1);
  });
});

describe("reply reasoning budget", () => {
  test("gpt-5 replies ask for low reasoning within the output cap", async () => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { generateText } = await import("ai");
    const { replyProviderOptions } = await import("./limits");
    const bodies: Record<string, unknown>[] = [];
    // A local fake endpoint: checks the request the SDK builds, no network.
    const provider = createOpenAI({
      apiKey: "test-only",
      fetch: async (_url, init) => {
        bodies.push(JSON.parse(String(init?.body)));
        return new Response(
          JSON.stringify({
            id: "test",
            created: 0,
            model: "gpt-5",
            choices: [
              {
                index: 0,
                message: { role: "assistant", content: "Hello!" },
                finish_reason: "stop",
              },
            ],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          }),
          { headers: { "content-type": "application/json" } },
        );
      },
    });
    const { text } = await generateText({
      model: provider.chat("gpt-5"),
      prompt: "hi",
      maxOutputTokens: CHEFFY_LIMITS.maxOutputTokens,
      maxRetries: CHEFFY_LIMITS.maxProviderRetries,
      providerOptions: replyProviderOptions,
    });
    expect(text).toBe("Hello!");
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({
      model: "gpt-5",
      reasoning_effort: "low",
      max_completion_tokens: CHEFFY_LIMITS.maxOutputTokens,
    });
  });
});
