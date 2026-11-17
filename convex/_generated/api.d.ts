/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as cheffy_agent from "../cheffy/agent.js";
import type * as cheffy_limits from "../cheffy/limits.js";
import type * as cheffy_model from "../cheffy/model.js";
import type * as files_http from "../files/http.js";
import type * as files_model from "../files/model.js";
import type * as http from "../http.js";
import type * as internal_cheffy from "../internal/cheffy.js";
import type * as internal_files from "../internal/files.js";
import type * as lib from "../lib.js";
import type * as my_cheffy from "../my/cheffy.js";
import type * as my_files from "../my/files.js";
import type * as my_processes from "../my/processes.js";
import type * as my_user from "../my/user.js";
import type * as my_windows from "../my/windows.js";
import type * as playground from "../playground.js";
import type * as processes_model from "../processes/model.js";
import type * as users_model from "../users/model.js";
import type * as windows_lib from "../windows/lib.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "cheffy/agent": typeof cheffy_agent;
  "cheffy/limits": typeof cheffy_limits;
  "cheffy/model": typeof cheffy_model;
  "files/http": typeof files_http;
  "files/model": typeof files_model;
  http: typeof http;
  "internal/cheffy": typeof internal_cheffy;
  "internal/files": typeof internal_files;
  lib: typeof lib;
  "my/cheffy": typeof my_cheffy;
  "my/files": typeof my_files;
  "my/processes": typeof my_processes;
  "my/user": typeof my_user;
  "my/windows": typeof my_windows;
  playground: typeof playground;
  "processes/model": typeof processes_model;
  "users/model": typeof users_model;
  "windows/lib": typeof windows_lib;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
};
