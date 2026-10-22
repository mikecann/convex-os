import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api, components } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { initConvexTest } from "../test.setup";
import { CHEFFY_LIMITS } from "../cheffy/limits";

// Fake timers keep scheduled functions from ever running, so nothing here
// calls OpenAI. We only check what got scheduled.

const setup = async (t: ReturnType<typeof initConvexTest>) => {
  const userId = await t.run((ctx) => ctx.db.insert("users", {}));
  const processId = await t.run((ctx) =>
    ctx.db.insert("processes", {
      userId,
      kind: "cheffy_chat",
      props: { sidebar: { isOpen: false, width: 250 } },
    }),
  );
  const as = t.withIdentity({ subject: `${userId}|session` });
  return { userId, processId, as };
};

const scheduledCount = (t: ReturnType<typeof initConvexTest>) =>
  t.run(async (ctx) => {
    const jobs = await ctx.db.system.query("_scheduled_functions").collect();
    return jobs.length;
  });

describe("my.cheffy.sendMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("OPENAI_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  test("schedules a reply until the user's daily limit, then refuses", async () => {
    vi.stubEnv("CHEFFY_DAILY_USER_LIMIT", "2");
    const t = initConvexTest();
    const { processId, as } = await setup(t);

    await as.mutation(api.my.cheffy.sendMessage, { processId, text: "hi" });
    const afterFirst = await scheduledCount(t);
    expect(afterFirst).toBeGreaterThan(0);

    await as.mutation(api.my.cheffy.sendMessage, { processId, text: "again" });
    const afterSecond = await scheduledCount(t);

    await expect(
      as.mutation(api.my.cheffy.sendMessage, { processId, text: "more" }),
    ).rejects.toThrow(/today's Cheffy message limit/);
    expect(await scheduledCount(t)).toBe(afterSecond);
  });

  test("scheduled replies carry low reasoning effort", async () => {
    const t = initConvexTest();
    const { processId, as } = await setup(t);
    await as.mutation(api.my.cheffy.sendMessage, { processId, text: "hi" });
    const jobs = await t.run((ctx) =>
      ctx.db.system.query("_scheduled_functions").collect(),
    );
    const reply = jobs.find((job) =>
      job.name.includes("generateResponseAsync"),
    );
    expect(reply?.args[0]).toMatchObject({
      providerOptions: { openai: { reasoningEffort: "low" } },
    });
  });

  test("new signups share the global limit", async () => {
    vi.stubEnv("CHEFFY_DAILY_GLOBAL_LIMIT", "1");
    const t = initConvexTest();
    const first = await setup(t);
    await first.as.mutation(api.my.cheffy.sendMessage, {
      processId: first.processId,
      text: "hi",
    });

    const second = await setup(t);
    const before = await scheduledCount(t);
    await expect(
      second.as.mutation(api.my.cheffy.sendMessage, {
        processId: second.processId,
        text: "hi",
      }),
    ).rejects.toThrow(/daily budget for everyone/);
    expect(await scheduledCount(t)).toBe(before);
  });

  test("rejects oversized messages without spending", async () => {
    const t = initConvexTest();
    const { processId, as } = await setup(t);
    await expect(
      as.mutation(api.my.cheffy.sendMessage, {
        processId,
        text: "x".repeat(CHEFFY_LIMITS.maxInputChars + 1),
      }),
    ).rejects.toThrow(/characters or fewer/);
    expect(await scheduledCount(t)).toBe(0);
  });

  test("rejects too many attachments", async () => {
    const t = initConvexTest();
    const { userId, processId, as } = await setup(t);
    const fileIds: Id<"files">[] = [];
    for (let i = 0; i <= CHEFFY_LIMITS.maxAttachments; i++)
      fileIds.push(
        await t.run((ctx) =>
          ctx.db.insert("files", {
            userId,
            name: `f${i}.txt`,
            size: 1,
            type: "text/plain",
            position: { x: 0, y: 0 },
            uploadState: { kind: "created" },
          }),
        ),
      );
    await t.run(async (ctx) => {
      const process = await ctx.db.get(processId);
      if (process?.kind !== "cheffy_chat") throw new Error("bad setup");
      await ctx.db.patch(processId, {
        props: { ...process.props, input: { text: "", attachments: fileIds } },
      });
    });
    await expect(
      as.mutation(api.my.cheffy.sendMessage, { processId, text: "look" }),
    ).rejects.toThrow(/attach up to/);
    expect(await scheduledCount(t)).toBe(0);
  });

  test("can't spend through someone else's process", async () => {
    const t = initConvexTest();
    const victim = await setup(t);
    const attacker = await setup(t);
    await expect(
      attacker.as.mutation(api.my.cheffy.sendMessage, {
        processId: victim.processId,
        text: "hi",
      }),
    ).rejects.toThrow(/does not belong/);
    expect(await scheduledCount(t)).toBe(0);
  });

  test("can't point a process at someone else's thread", async () => {
    const t = initConvexTest();
    const victim = await setup(t);
    const attacker = await setup(t);
    const victimThreadId = await victim.as.mutation(
      api.my.cheffy.createThread,
      { processId: victim.processId },
    );

    await expect(
      attacker.as.mutation(api.my.cheffy.setThreadId, {
        processId: attacker.processId,
        threadId: victimThreadId,
      }),
    ).rejects.toThrow(/does not belong to you/);

    // Process props are also writable through my.processes.updateProps.
    await attacker.as.mutation(api.my.processes.updateProps, {
      processId: attacker.processId,
      props: {
        threadId: victimThreadId,
        sidebar: { isOpen: false, width: 250 },
      },
    });
    await expect(
      attacker.as.mutation(api.my.cheffy.sendMessage, {
        processId: attacker.processId,
        text: "hi",
      }),
    ).rejects.toThrow(/does not belong to you/);
    expect(await scheduledCount(t)).toBe(0);

    await expect(
      attacker.as.query(api.my.cheffy.listThreadMessages, {
        threadId: victimThreadId,
        paginationOpts: { numItems: 10, cursor: null },
        streamArgs: undefined,
      }),
    ).rejects.toThrow(/does not belong to you/);

    const thread = await t.run((ctx) =>
      ctx.runQuery(components.agent.threads.getThread, {
        threadId: victimThreadId,
      }),
    );
    expect(thread?.userId).toBe(victim.userId);
  });
});

describe("my.cheffy.listThreadMessages streams", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const addStream = (
    t: ReturnType<typeof initConvexTest>,
    threadId: string,
    text: string,
  ) =>
    t.run(async (ctx) => {
      const streamId = await ctx.runMutation(components.agent.streams.create, {
        threadId,
        order: 0,
        stepOrder: 0,
        format: "UIMessageChunk",
      });
      await ctx.runMutation(components.agent.streams.addDelta, {
        streamId,
        start: 0,
        end: 1,
        parts: [{ type: "text-delta", id: "0", delta: text }],
      });
      return streamId;
    });

  const deltasFor = (
    as: Awaited<ReturnType<typeof setup>>["as"],
    threadId: string,
    streamId: string,
  ) =>
    as.query(api.my.cheffy.listThreadMessages, {
      threadId,
      paginationOpts: { numItems: 10, cursor: null },
      streamArgs: { kind: "deltas", cursors: [{ streamId, cursor: 0 }] },
    });

  test("only returns deltas for streams in the caller's own thread", async () => {
    const t = initConvexTest();
    const victim = await setup(t);
    const attacker = await setup(t);
    const victimThreadId = await victim.as.mutation(
      api.my.cheffy.createThread,
      { processId: victim.processId },
    );
    const attackerThreadId = await attacker.as.mutation(
      api.my.cheffy.createThread,
      { processId: attacker.processId },
    );
    const victimStreamId = await addStream(t, victimThreadId, "secret");
    const attackerStreamId = await addStream(t, attackerThreadId, "mine");

    // Legit streaming still works for the owner.
    const own = await deltasFor(victim.as, victimThreadId, victimStreamId);
    expect(own.streams).toMatchObject({ kind: "deltas" });
    expect(JSON.stringify(own.streams)).toContain("secret");

    // Own thread + victim's stream ID leaks nothing.
    const stolen = await deltasFor(
      attacker.as,
      attackerThreadId,
      victimStreamId,
    );
    expect(stolen.streams).toEqual({ kind: "deltas", deltas: [] });

    // Mixed cursors keep the attacker's own stream and drop the victim's.
    const mixed = await attacker.as.query(api.my.cheffy.listThreadMessages, {
      threadId: attackerThreadId,
      paginationOpts: { numItems: 10, cursor: null },
      streamArgs: {
        kind: "deltas",
        cursors: [
          { streamId: victimStreamId, cursor: 0 },
          { streamId: attackerStreamId, cursor: 0 },
        ],
      },
    });
    const json = JSON.stringify(mixed.streams);
    expect(json).toContain("mine");
    expect(json).not.toContain("secret");
  });

  test("a deleted thread lists empty and forwards no cursors", async () => {
    const t = initConvexTest();
    const victim = await setup(t);
    const attacker = await setup(t);
    const victimThreadId = await victim.as.mutation(
      api.my.cheffy.createThread,
      { processId: victim.processId },
    );
    const victimStreamId = await addStream(t, victimThreadId, "secret");
    const attackerThreadId = await attacker.as.mutation(
      api.my.cheffy.createThread,
      { processId: attacker.processId },
    );
    await t.action(components.agent.threads.deleteAllForThreadIdSync, {
      threadId: attackerThreadId,
    });

    const result = await deltasFor(
      attacker.as,
      attackerThreadId,
      victimStreamId,
    );
    expect(result.page).toEqual([]);
    expect(result.streams).toEqual({ kind: "deltas", deltas: [] });
  });
});
