import { v } from "convex/values";
import { myMutation, myQuery } from "../lib";
import {} from "../processes/schema";
import { windows } from "../windows/lib";
import { windowViewStateValidator } from "../windows/schema";

export const list = myQuery({
  args: {},
  handler: (ctx) => windows.forUser(ctx.userId).list(ctx.db),
});

export const listForProcess = myQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => windows.forProcess(processId).list(ctx.db),
});

export const minimize = myMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => windows.forWindow(windowId).minimize(ctx.db),
});

export const updateGeometry = myMutation({
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

export const focus = myMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => windows.forWindow(windowId).focus(ctx.db),
});

export const close = myMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) => {
    windows.forWindow(windowId).close(ctx.db);
  },
});

export const toggleMaximize = myMutation({
  args: {
    windowId: v.id("windows"),
  },
  handler: (ctx, { windowId }) =>
    windows.forWindow(windowId).toggleMaximize(ctx.db),
});

export const updateTitle = myMutation({
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

export const deactivateActive = myMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const activeWindow = await windows.forUser(ctx.userId).findActive(ctx.db);
    if (activeWindow)
      await windows.forWindow(activeWindow._id).deactivate(ctx.db);

    return null;
  },
});
