/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as files_model from "../files/model.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as my_files from "../my/files.js";
import type * as my_processes from "../my/processes.js";
import type * as my_user from "../my/user.js";
import type * as my_windows from "../my/windows.js";
import type * as processes_model from "../processes/model.js";
import type * as users_model from "../users/model.js";
import type * as windows_lib from "../windows/lib.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "files/model": typeof files_model;
  http: typeof http;
  lib: typeof lib;
  "my/files": typeof my_files;
  "my/processes": typeof my_processes;
  "my/user": typeof my_user;
  "my/windows": typeof my_windows;
  "processes/model": typeof processes_model;
  "users/model": typeof users_model;
  "windows/lib": typeof windows_lib;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
