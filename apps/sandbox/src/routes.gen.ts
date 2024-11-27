/** Automatically Generated! */
import type { Route } from "guava/router";

export let routes: Array<[string, Route]> = [
  [
    "/@error",
    {
      $type: "error",
      routeType: "static",
      rawPath: "",
      filePath: "/@error.page.tsx",
      type: "page",
      params: [],
      mod: () => import("./app/@error.page")
    }
  ],
  [
    "/@not-found",
    {
      $type: "not-found",
      routeType: "static",
      rawPath: "",
      filePath: "/@not-found.page.tsx",
      type: "page",
      params: [],
      mod: () => import("./app/@not-found.page")
    }
  ],
  [
    "/",
    {
      routeType: "static",
      rawPath: "/",
      filePath: "/index.page.tsx",
      type: "page",
      params: [],
      $type: "custom",
      mod: () => import("./app/index.page")
    }
  ],
  [
    "/api/@error",
    {
      $type: "error",
      routeType: "static",
      rawPath: "/api",
      filePath: "/api/@error.route.ts",
      type: "api",
      params: [],
      mod: () => import("./app/api/@error.route")
    }
  ],
  [
    "/api/@not-found",
    {
      $type: "not-found",
      routeType: "static",
      rawPath: "/api",
      filePath: "/api/@not-found.route.ts",
      type: "api",
      params: [],
      mod: () => import("./app/api/@not-found.route")
    }
  ],
  [
    "/api/foo",
    {
      routeType: "static",
      rawPath: "/api/foo",
      filePath: "/api/foo.route.ts",
      type: "api",
      params: [],
      $type: "custom",
      mod: () => import("./app/api/foo.route")
    }
  ],
  [
    "/catch-all/[...params]",
    {
      routeType: "catch-all",
      rawPath: "/catch-all/[...params]",
      filePath: "/catch-all/[...params].route.ts",
      params: ["params"],
      type: "api",
      $type: "custom",
      mod: () => import("./app/catch-all/[...params].route")
    }
  ],
];