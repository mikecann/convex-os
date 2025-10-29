import { v } from "convex/values";
import { myMutation, myQuery } from "../lib";
import { processes } from "../processes/model";
import {
  processPropsUpdateValidator,
  processStartingValidator,
} from "../processes/schema";

export const get = myQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) =>
    processes.forProcess(processId).withUser(ctx.userId).get(ctx.db),
});

export const list = myQuery({
  args: {},
  handler: (ctx) => processes.forUser(ctx.userId).list(ctx.db),
});

export const listWithWindows = myQuery({
  args: {},
  handler: (ctx) => processes.forUser(ctx.userId).listWithWindows(ctx.db),
});

export const activeProcessId = myQuery({
  args: {},
  handler: (ctx) =>
    processes
      .forUser(ctx.userId)
      .findActive(ctx.db)
      .then((p) => p?._id ?? null),
});

export const minimize = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).minimize(ctx.db);
  },
});

export const focus = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).focus(ctx.db);
  },
});

export const findName = myQuery({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) =>
    processes.forProcess(processId).findName(ctx.db),
});

export const close = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: async (ctx, { processId }) =>
    processes.forProcess(processId).close(ctx.db),
});

export const restore = myMutation({
  args: {
    processId: v.id("processes"),
  },
  handler: (ctx, { processId }) => {
    return processes.forProcess(processId).focus(ctx.db);
  },
});

export const centerOnScreen = myMutation({
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

export const updateProps = myMutation({
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

export const start = myMutation({
  args: {
    process: processStartingValidator,
  },
  handler: (ctx, { process }) => {
    return processes.forUser(ctx.userId).start(ctx.db, {
      process,
    });
  },
});
