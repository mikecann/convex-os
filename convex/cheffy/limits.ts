import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { DatabaseWriter } from "../_generated/server";

// Hard size limits for anything that ends up in a paid model call.
export const CHEFFY_LIMITS = {
  maxInputChars: 4_000,
  maxAttachments: 3,
  maxAttachmentBytes: 2 * 1024 * 1024,
  // How many previous messages of a thread are sent as context.
  contextMessages: 20,
  // gpt-5 counts hidden reasoning against this cap, so replies also run with
  // low reasoning effort (replyProviderOptions) to leave room for the answer.
  maxOutputTokens: 6_000,
  titlePromptChars: 2_000,
  titleMaxOutputTokens: 500,
  // Retries per provider call (the AI SDK default is 2). With 1, a reply or
  // a title is at most two OpenAI requests.
  maxProviderRetries: 1,
} as const;

// Sent with every scheduled reply. Supported by the AI SDK's OpenAI chat
// provider as `reasoning_effort` (see @ai-sdk/openai's chat model options).
export const replyProviderOptions = {
  openai: { reasoningEffort: "low" },
} as const;

// Daily request budgets (UTC day). Each sent message uses one unit, which
// covers the reply and, for a thread's first message, the title.
export const DEFAULT_DAILY_USER_LIMIT = 20;
export const DEFAULT_DAILY_GLOBAL_LIMIT = 100;

const parseLimit = (raw: string | undefined, fallback: number) => {
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) return fallback;
  return parsed;
};

export const readDailyLimits = (
  env: Record<string, string | undefined> = process.env,
) => ({
  perUser: parseLimit(env.CHEFFY_DAILY_USER_LIMIT, DEFAULT_DAILY_USER_LIMIT),
  global: parseLimit(env.CHEFFY_DAILY_GLOBAL_LIMIT, DEFAULT_DAILY_GLOBAL_LIMIT),
});

export const utcDayKey = (now: number) =>
  new Date(now).toISOString().slice(0, 10);

const GLOBAL_SCOPE = "global";
const userScope = (userId: Id<"users">) => `user:${userId}`;

const findCounter = (db: DatabaseWriter, scope: string, day: string) =>
  db
    .query("cheffyUsage")
    .withIndex("by_scope_day", (q) => q.eq("scope", scope).eq("day", day))
    .unique();

/**
 * Reserves one unit of the per-user and global daily budget, or throws.
 * Runs inside the calling mutation, so Convex's serializable transactions
 * make concurrent sends conflict and retry instead of overspending.
 */
export const consumeDailyBudget = async (
  db: DatabaseWriter,
  userId: Id<"users">,
  {
    now = Date.now(),
    limits = readDailyLimits(),
  }: { now?: number; limits?: { perUser: number; global: number } } = {},
) => {
  const day = utcDayKey(now);
  const userCounter = await findCounter(db, userScope(userId), day);
  const globalCounter = await findCounter(db, GLOBAL_SCOPE, day);

  if ((userCounter?.count ?? 0) >= limits.perUser)
    throw new ConvexError(
      "You've hit today's Cheffy message limit. Try again tomorrow (UTC).",
    );

  if ((globalCounter?.count ?? 0) >= limits.global)
    throw new ConvexError(
      "Cheffy has hit its daily budget for everyone. Try again tomorrow (UTC).",
    );

  for (const [scope, counter] of [
    [userScope(userId), userCounter],
    [GLOBAL_SCOPE, globalCounter],
  ] as const)
    if (counter) await db.patch(counter._id, { count: counter.count + 1 });
    else await db.insert("cheffyUsage", { scope, day, count: 1 });
};
