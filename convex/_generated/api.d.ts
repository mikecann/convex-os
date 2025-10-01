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
import type * as apps_lib from "../apps/lib.js";
import type * as auth from "../auth.js";
import type * as files_lib from "../files/lib.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as my_apps from "../my/apps.js";
import type * as my_files from "../my/files.js";
import type * as my_processes from "../my/processes.js";
import type * as my_user from "../my/user.js";
import type * as my_windows from "../my/windows.js";
import type * as processes_lib from "../processes/lib.js";
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
  "apps/lib": typeof apps_lib;
  auth: typeof auth;
  "files/lib": typeof files_lib;
  http: typeof http;
  lib: typeof lib;
  "my/apps": typeof my_apps;
  "my/files": typeof my_files;
  "my/processes": typeof my_processes;
  "my/user": typeof my_user;
  "my/windows": typeof my_windows;
  "processes/lib": typeof processes_lib;
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
