import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { MAX_UPLOAD_BYTES } from "./model";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const respond = (status: number, body: object) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const tooBig = () =>
  respond(413, {
    error: `Files must be ${MAX_UPLOAD_BYTES / 1024 / 1024}MB or smaller`,
  });

export const uploadFileOptions = httpAction(
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);

// The upload link from my.files.startUpload carries a single-use token that
// only the file's owner ever sees. We store the bytes and link the new blob
// here, so the client never chooses a storage ID.
export const uploadFile = httpAction(async (ctx, request) => {
  const params = new URL(request.url).searchParams;
  const fileId = params.get("fileId");
  const token = params.get("token");
  if (!fileId || !token) return respond(400, { error: "Bad upload" });
  const target = { fileId: fileId as Id<"files">, token };

  const valid = await ctx
    .runQuery(internal.internal.files.checkUploadTarget, target)
    .catch(() => false);
  if (!valid) return respond(403, { error: "Upload link is invalid or used" });

  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_UPLOAD_BYTES)
    return tooBig();
  const blob = await request.blob();
  if (blob.size > MAX_UPLOAD_BYTES) return tooBig();

  const storageId = await ctx.storage.store(blob);
  const linked = await ctx
    .runMutation(internal.internal.files.completeUpload, {
      ...target,
      storageId,
    })
    .catch(() => false);
  if (!linked) {
    await ctx.storage.delete(storageId);
    return respond(403, { error: "Upload link is invalid or used" });
  }
  // storageId is only for frontends cached from before this change, which
  // pass it back to my/files:completeUpload.
  return respond(200, { fileId, storageId });
});
