import { ensureFP } from "../../shared/ensure";
import { Id } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";

export const users = {
  forUser(userId: Id<"users">) {
    return {
      find(db: DatabaseReader) {
        return db.get(userId);
      },

      get(db: DatabaseReader) {
        return this.find(db).then(ensureFP(`could not find user ${userId}`));
      },
    };
  },
};
