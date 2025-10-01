import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { filesTable } from "./files/schema";
import { processesTable } from "./processes/schema";
import { windowsTable } from "./windows/schema";

export default defineSchema({
  ...authTables,
  files: filesTable,
  processes: processesTable,
  windows: windowsTable,
});
