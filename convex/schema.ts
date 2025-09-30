import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { filesTable } from "./files/schema";
import { processesTable } from "./processes/schema";

export default defineSchema({
  ...authTables,
  files: filesTable,
  processes: processesTable,
});
