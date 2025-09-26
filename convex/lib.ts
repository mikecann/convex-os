import { mutation, query, action } from "./_generated/server";
import {
  customMutation,
  customQuery,
  customAction,
} from "convex-helpers/server/customFunctions";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ensure } from "../shared/ensure";

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error(`Couldnt find user with id ${userId}`);
    return {
      ctx: {
        userId,
        getUser: async () =>
          ensure(
            await ctx.db.get(userId),
            `couldnt find user with id ${userId}`,
          ),
      },
      args: {},
    };
  },
});

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (_ctx, args) => {
    const userId = await getAuthUserId(_ctx);
    if (userId === null) throw new Error(`Couldnt find user with id ${userId}`);
    return {
      ctx: {
        userId,
        getUser: async () =>
          ensure(
            await _ctx.db.get(userId),
            `couldnt find user with id ${userId}`,
          ),
      },
      args: {},
    };
  },
});
