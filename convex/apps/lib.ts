import { Id } from "../_generated/dataModel";
import { Infer, v } from "convex/values";
import { DatabaseWriter } from "../_generated/server";
import { appStartingValidator } from "./schema";
import { processes } from "../processes/lib";
import { windows } from "../windows/lib";
import { exhaustiveCheck } from "../../shared/misc";

export const apps = {
  forUser(userId: Id<"users">) {
    return {
      start: async (
        db: DatabaseWriter,
        { app }: { app: Infer<typeof appStartingValidator> },
      ) => {
        const processId = await processes.forUser(userId).create(db, {
          process: app,
        });

        if (app.kind === "image_preview") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...app.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).activate(db);
        } else if (app.kind === "video_player") {
          const windowId = await windows.forProcess(processId).create(db, {
            params: {
              ...app.windowCreationParams,
              viewState: { kind: "open", viewStackOrder: 0, isActive: false },
            },
          });
          await windows.forWindow(windowId).activate(db);
        } else exhaustiveCheck(app);

        return processId;
      },
    };
  },
};
