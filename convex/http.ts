import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { uploadFile, uploadFileOptions } from "./files/http";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({ path: "/files/upload", method: "POST", handler: uploadFile });
http.route({
  path: "/files/upload",
  method: "OPTIONS",
  handler: uploadFileOptions,
});

export default http;
