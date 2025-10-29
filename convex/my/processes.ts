import { v } from "convex/values";
import { userMutation, userQuery } from "../lib";
import { processes } from "../processes/model";
import {
  processPropsUpdateValidator,
  processStartingValidator,
} from "../processes/schema";

export const get = userQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) =>
    processes.forProcess(processId).withUser(ctx.userId).get(ctx.db),
});

export const list = userQuery({
  args: {},
  handler: (ctx) => processes.forUser(ctx.userId).list(ctx.db),
});

export const listWithWindows = userQuery({
  args: {},
  handler: (ctx) => processes.forUser(ctx.userId).listWithWindows(ctx.db),
});

export const activeProcessId = userQuery({
  args: {},
  handler: (ctx) =>
    processes
      .forUser(ctx.userId)
      .findActive(ctx.db)
      .then((p) => p?._id ?? null),
});

export const minimize = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).minimize(ctx.db);
  },
});

export const focus = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).focus(ctx.db);
  },
});

export const findName = userQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) =>
    processes.forProcess(processId).findName(ctx.db),
});

export const close = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, { processId }) =>
    processes.forProcess(processId).close(ctx.db),
});

export const restore = userMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).focus(ctx.db);
  },
});

export const centerOnScreen = userMutation({
  args: {
    processId: v.id("processes"),
    desktopWidth: v.number(),
    desktopHeight: v.number(),
  },
  handler: (ctx, { processId, desktopWidth, desktopHeight }) => {
    return processes
      .forProcess(processId)
      .centerOnScreen(ctx.db, { desktopWidth, desktopHeight });
  },
});

export const updateProps = userMutation({
  args: {
    processId: v.id("processes"),
    props: processPropsUpdateValidator,
  },
  handler: async (ctx, { processId, props }) => {
    console.log("updateProps", processId, props);
    await processes
      .forProcess(processId)
      .withUser(ctx.userId)
      .updateProps(ctx.db, {
        props,
      });
  },
});

export const start = userMutation({
  args: {
    process: processStartingValidator,
  },
  handler: (ctx, { process }) => {
    return processes.forUser(ctx.userId).start(ctx.db, {
      process,
    });
  },
});
