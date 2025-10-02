import { v } from "convex/values";
import { userMutation, userQuery } from "../lib";
import {} from "../processes/schema";
import { windows } from "../windows/lib";
import { windowViewStateValidator } from "../windows/schema";

export const list = userQuery({
  args: {},
  handler: (ctx) => windows.forUser(ctx.userId).list(ctx.db),
});

export const listForProcess = userQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => windows.forProcess(processId).list(ctx.db),
});

export const minimize = userMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => windows.forWindow(windowId).minimize(ctx.db),
});

export const updateGeometry = userMutation({
  args: {
    windowId: v.id("windows"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    size: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      }),
    ),
  },
  handler: (ctx, { windowId, position, size }) =>
    windows.forWindow(windowId).updateGeometry(ctx.db, { position, size }),
});

export const focus = userMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => windows.forWindow(windowId).focus(ctx.db),
});

export const close = userMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => {
    windows.forWindow(windowId).close(ctx.db);
  },
});

export const toggleMaximize = userMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) =>
    windows.forWindow(windowId).toggleMaximize(ctx.db),
});

export const updateTitle = userMutation({
  args: {
    windowId: v.id("windows"),
    title: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { windowId, title }) => {
    await ctx.db.patch(windowId, { title });
    return null;
  },
});
