import { userMutation, userQuery } from "../lib";
import { appStartingValidator } from "../apps/schema";
import { apps } from "../apps/lib";

export const start = userMutation({
  args: {
    app: appStartingValidator,
  },
  handler: (ctx, { app }) => {
    return apps.forUser(ctx.userId).start(ctx.db, {
      app,
    });
  },
});
