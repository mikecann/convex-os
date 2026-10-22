import { describe, expect, test } from "vitest";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { initConvexTest } from "../test.setup";

const windowParams = {
  x: 10,
  y: 20,
  width: 300,
  height: 200,
  title: "Notes",
};

const signUp = async (t: ReturnType<typeof initConvexTest>) => {
  const userId = await t.run((ctx) => ctx.db.insert("users", {}));
  const as = t.withIdentity({ subject: `${userId}|session` });
  const processId = await as.mutation(api.my.processes.start, {
    process: {
      kind: "text_preview",
      props: {},
      windowCreationParams: windowParams,
    },
  });
  const [window] = await as.query(api.my.windows.listForProcess, {
    processId,
  });
  return { userId, as, processId, windowId: window._id };
};

const snapshot = (
  t: ReturnType<typeof initConvexTest>,
  processId: Id<"processes">,
) =>
  t.run(async (ctx) => ({
    process: await ctx.db.get(processId),
    windows: await ctx.db
      .query("windows")
      .withIndex("by_processId", (q) => q.eq("processId", processId))
      .collect(),
  }));

describe("my.processes", () => {
  test("owners can still use their own processes", async () => {
    const t = initConvexTest();
    const { as, processId } = await signUp(t);

    expect(await as.query(api.my.processes.findName, { processId })).toBe(
      "Notes",
    );
    await as.mutation(api.my.processes.minimize, { processId });
    await as.mutation(api.my.processes.restore, { processId });
    await as.mutation(api.my.processes.focus, { processId });
    await as.mutation(api.my.processes.centerOnScreen, {
      processId,
      desktopWidth: 1000,
      desktopHeight: 800,
    });
    await as.mutation(api.my.processes.updateProps, {
      processId,
      props: {},
    });
    const [win] = await as.query(api.my.windows.listForProcess, { processId });
    expect(win.x).toBe(350);
    expect(win.y).toBe(300);

    await as.mutation(api.my.processes.close, { processId });
    expect(await snapshot(t, processId)).toEqual({
      process: null,
      windows: [],
    });
  });

  test("other users can't read, change or close someone's process", async () => {
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const processId = victim.processId;
    const before = await snapshot(t, processId);

    const reject = /does not belong/;
    await expect(
      attacker.as.query(api.my.processes.get, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.query(api.my.processes.findName, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.query(api.my.windows.listForProcess, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.close, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.minimize, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.focus, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.restore, { processId }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.centerOnScreen, {
        processId,
        desktopWidth: 1000,
        desktopHeight: 800,
      }),
    ).rejects.toThrow(reject);
    await expect(
      attacker.as.mutation(api.my.processes.updateProps, {
        processId,
        props: { url: "https://example.com" },
      }),
    ).rejects.toThrow(reject);

    expect(await snapshot(t, processId)).toEqual(before);
  });

  test("can't start a file browser attached to someone else's process", async () => {
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const countProcesses = () =>
      t.run(async (ctx) => (await ctx.db.query("processes").collect()).length);
    const before = await countProcesses();

    await expect(
      attacker.as.mutation(api.my.processes.start, {
        process: {
          kind: "file_browser",
          props: { parentProcessId: victim.processId },
          windowCreationParams: windowParams,
        },
      }),
    ).rejects.toThrow(/does not belong/);
    expect(await countProcesses()).toBe(before);

    // Attaching to your own process still works.
    await attacker.as.mutation(api.my.processes.start, {
      process: {
        kind: "file_browser",
        props: { parentProcessId: attacker.processId },
        windowCreationParams: windowParams,
      },
    });
    expect(await countProcesses()).toBe(before + 1);
  });
});

describe("my.windows", () => {
  test("owners can still use their own windows", async () => {
    const t = initConvexTest();
    const { as, processId, windowId } = await signUp(t);

    await as.mutation(api.my.windows.minimize, { windowId });
    await as.mutation(api.my.windows.focus, { windowId });
    await as.mutation(api.my.windows.toggleMaximize, { windowId });
    await as.mutation(api.my.windows.toggleMaximize, { windowId });
    await as.mutation(api.my.windows.updateGeometry, {
      windowId,
      position: { x: 1, y: 2 },
      size: { width: 3, height: 4 },
    });
    await as.mutation(api.my.windows.updateTitle, { windowId, title: "Mine" });
    const [win] = await as.query(api.my.windows.listForProcess, { processId });
    expect(win).toMatchObject({ x: 1, y: 2, width: 3, height: 4 });
    expect(win.title).toBe("Mine");

    await as.mutation(api.my.windows.close, { windowId });
    expect(await snapshot(t, processId)).toEqual({
      process: null,
      windows: [],
    });
  });

  test("other users can't change or close someone's window", async () => {
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const { processId, windowId } = victim;
    const before = await snapshot(t, processId);

    const reject = /does not belong/;
    for (const call of [
      () => attacker.as.mutation(api.my.windows.close, { windowId }),
      () => attacker.as.mutation(api.my.windows.minimize, { windowId }),
      () => attacker.as.mutation(api.my.windows.focus, { windowId }),
      () => attacker.as.mutation(api.my.windows.toggleMaximize, { windowId }),
      () =>
        attacker.as.mutation(api.my.windows.updateGeometry, {
          windowId,
          position: { x: 0, y: 0 },
        }),
      () =>
        attacker.as.mutation(api.my.windows.updateTitle, {
          windowId,
          title: "pwned",
        }),
    ])
      await expect(call()).rejects.toThrow(reject);

    expect(await snapshot(t, processId)).toEqual(before);
  });
});
