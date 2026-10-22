/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import agentTest from "@convex-dev/agent/test";
import schema from "./schema";

export const modules = import.meta.glob("./**/!(*.*.*)*.*s");

export const initConvexTest = () => {
  const t = convexTest(schema, modules);
  agentTest.register(t);
  return t;
};
