import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
import { users } from "../users/model";

export const find = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return users.forUser(userId).find(ctx.db);
  },
});
