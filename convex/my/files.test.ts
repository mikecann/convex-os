import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { initConvexTest } from "../test.setup";

const SITE = "https://site.invalid";

const signUp = async (t: ReturnType<typeof initConvexTest>) => {
  const userId = await t.run((ctx) => ctx.db.insert("users", {}));
  const as = t.withIdentity({ subject: `${userId}|session` });
  const [fileId] = await as.mutation(api.my.files.createAll, {
    files: [
      { name: "a.txt", size: 5, type: "text/plain", position: { x: 0, y: 0 } },
    ],
  });
  return { userId, as, fileId };
};

const post = (
  t: ReturnType<typeof initConvexTest>,
  uploadUrl: string,
  body = "hello",
) => {
  const url = new URL(uploadUrl);
  return t.fetch(url.pathname + url.search, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
  });
};

const blobIds = (t: ReturnType<typeof initConvexTest>) =>
  t.run(async (ctx) =>
    (await ctx.db.system.query("_storage").collect()).map((s) => s._id),
  );

describe("file uploads", () => {
  beforeEach(() => vi.stubEnv("CONVEX_SITE_URL", SITE));
  afterEach(() => vi.unstubAllEnvs());

  test("the server stores and links the blob; clients can't name one", async () => {
    const t = initConvexTest();
    const { as, fileId } = await signUp(t);
    const { uploadUrl } = await as.mutation(api.my.files.startUpload, {
      fileId,
    });
    expect(uploadUrl.startsWith(`${SITE}/files/upload?`)).toBe(true);

    const response = await post(t, uploadUrl);
    expect(response.status).toBe(200);
    const file = await as.query(api.my.files.find, { fileId });
    expect(file?.uploadState.kind).toBe("uploaded");
    expect(file?.size).toBe(5);
    expect(await blobIds(t)).toHaveLength(1);

    // Single use: replaying the link stores nothing new.
    expect((await post(t, uploadUrl, "other")).status).toBe(403);
    expect(await blobIds(t)).toHaveLength(1);
  });

  test("a cached old frontend can finish an upload the server already linked", async () => {
    const t = initConvexTest();
    const { as, fileId } = await signUp(t);
    const { uploadUrl } = await as.mutation(api.my.files.startUpload, {
      fileId,
    });
    // Old frontends read storageId from the response and pass it back.
    const { storageId } = await (await post(t, uploadUrl)).json();
    expect(await blobIds(t)).toEqual([storageId]);
    const linked = await as.query(api.my.files.find, { fileId });

    await as.mutation(api.my.files.completeUpload, { fileId, storageId });
    expect(await as.query(api.my.files.find, { fileId })).toEqual(linked);
  });

  test("completeUpload never links a storage ID the server didn't link", async () => {
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const victimLink = await victim.as.mutation(api.my.files.startUpload, {
      fileId: victim.fileId,
    });
    await post(t, victimLink.uploadUrl, "victim secret");
    const victimFile = await victim.as.query(api.my.files.find, {
      fileId: victim.fileId,
    });
    if (victimFile?.uploadState.kind !== "uploaded") throw new Error("setup");
    const victimBlob = victimFile.uploadState.storageId;
    const otherBlob = await t.run((ctx) =>
      ctx.storage.store(new Blob(["other"])),
    );

    // The attacker's own file, still uploading under the new flow.
    await attacker.as.mutation(api.my.files.startUpload, {
      fileId: attacker.fileId,
    });
    const attackerFile = await attacker.as.query(api.my.files.find, {
      fileId: attacker.fileId,
    });
    // An upload from a raw storage URL issued before the change.
    const legacy = await t.run((ctx) =>
      ctx.db.insert("files", {
        userId: attacker.userId,
        name: "old",
        size: 1,
        type: "text/plain",
        position: { x: 0, y: 0 },
        uploadState: { kind: "uploading", progress: 0, uploadUrl: "x" },
      }),
    );
    const legacyFile = await t.run((ctx) => ctx.db.get(legacy));

    await expect(
      attacker.as.mutation(api.my.files.completeUpload, {
        fileId: attacker.fileId,
        storageId: victimBlob,
      }),
    ).rejects.toThrow("Refresh the page");
    await expect(
      attacker.as.mutation(api.my.files.completeUpload, {
        fileId: legacy,
        storageId: otherBlob,
      }),
    ).rejects.toThrow("Refresh the page");
    // Someone else's file, a different blob, or no sign-in.
    await expect(
      attacker.as.mutation(api.my.files.completeUpload, {
        fileId: victim.fileId,
        storageId: victimBlob,
      }),
    ).rejects.toThrow();
    await expect(
      victim.as.mutation(api.my.files.completeUpload, {
        fileId: victim.fileId,
        storageId: otherBlob,
      }),
    ).rejects.toThrow();
    await expect(
      t.mutation(api.my.files.completeUpload, {
        fileId: victim.fileId,
        storageId: victimBlob,
      }),
    ).rejects.toThrow();

    expect(
      await attacker.as.query(api.my.files.find, { fileId: attacker.fileId }),
    ).toEqual(attackerFile);
    expect(await t.run((ctx) => ctx.db.get(legacy))).toEqual(legacyFile);
    expect(
      await victim.as.query(api.my.files.find, { fileId: victim.fileId }),
    ).toEqual(victimFile);
    expect((await blobIds(t)).sort()).toEqual([victimBlob, otherBlob].sort());
  });

  test("parallel claims on one link link exactly one blob", async () => {
    const t = initConvexTest();
    const { as, fileId } = await signUp(t);
    const { uploadUrl } = await as.mutation(api.my.files.startUpload, {
      fileId,
    });
    const statuses = (
      await Promise.all([post(t, uploadUrl, "one"), post(t, uploadUrl, "two")])
    ).map((r) => r.status);
    expect(statuses.sort()).toEqual([200, 403]);
    const file = await as.query(api.my.files.find, { fileId });
    if (file?.uploadState.kind !== "uploaded") throw new Error("not uploaded");
    expect(await blobIds(t)).toEqual([file.uploadState.storageId]);
  });

  test("another user's token or an expired link can't upload", async () => {
    vi.useFakeTimers();
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const victimLink = await victim.as.mutation(api.my.files.startUpload, {
      fileId: victim.fileId,
    });
    const attackerLink = await attacker.as.mutation(api.my.files.startUpload, {
      fileId: attacker.fileId,
    });
    const forged = new URL(victimLink.uploadUrl);
    forged.searchParams.set(
      "token",
      new URL(attackerLink.uploadUrl).searchParams.get("token") ?? "",
    );
    expect((await post(t, forged.toString())).status).toBe(403);
    expect(
      (await victim.as.query(api.my.files.find, { fileId: victim.fileId }))
        ?.uploadState.kind,
    ).toBe("uploading");

    vi.advanceTimersByTime(2 * 60 * 60 * 1000);
    expect((await post(t, attackerLink.uploadUrl)).status).toBe(403);
    expect(await blobIds(t)).toHaveLength(0);
    vi.useRealTimers();
  });

  test("deleting a file that shares a legacy-adopted blob keeps the victim's", async () => {
    const t = initConvexTest();
    const victim = await signUp(t);
    const attacker = await signUp(t);
    const { uploadUrl } = await victim.as.mutation(api.my.files.startUpload, {
      fileId: victim.fileId,
    });
    await post(t, uploadUrl, "victim secret");
    const victimFile = await victim.as.query(api.my.files.find, {
      fileId: victim.fileId,
    });
    if (victimFile?.uploadState.kind !== "uploaded") throw new Error("setup");
    const victimBlob = victimFile.uploadState.storageId;

    // Before this fix completeUpload let anyone link a storage ID they knew.
    const adopted: Id<"files"> = await t.run((ctx) =>
      ctx.db.insert("files", {
        userId: attacker.userId,
        name: "stolen",
        size: 13,
        type: "text/plain",
        position: { x: 0, y: 0 },
        uploadState: victimFile.uploadState,
      }),
    );
    await attacker.as.mutation(api.my.files.deleteAll, { fileIds: [adopted] });

    expect(await blobIds(t)).toEqual([victimBlob]);
    expect(
      await victim.as.query(api.my.files.find, { fileId: victim.fileId }),
    ).toEqual(victimFile);
    const bytes = await t.run(async (ctx) =>
      (await ctx.storage.get(victimBlob))?.text(),
    );
    expect(bytes).toBe("victim secret");

    // Once nothing else references it, the owner's delete removes the blob.
    await victim.as.mutation(api.my.files.deleteAll, {
      fileIds: [victim.fileId],
    });
    expect(await blobIds(t)).toEqual([]);
  });

  test("an upload started before this change can't be completed", async () => {
    const t = initConvexTest();
    const { userId } = await signUp(t);
    const legacy = await t.run((ctx) =>
      ctx.db.insert("files", {
        userId,
        name: "old",
        size: 1,
        type: "text/plain",
        position: { x: 0, y: 0 },
        uploadState: { kind: "uploading", progress: 0, uploadUrl: "x" },
      }),
    );
    const response = await post(
      t,
      `${SITE}/files/upload?fileId=${legacy}&token=undefined`,
    );
    expect(response.status).toBe(403);
    expect(await blobIds(t)).toHaveLength(0);
  });
});
