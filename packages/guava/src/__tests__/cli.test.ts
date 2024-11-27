import { expect, test } from "bun:test";
import { collectRoutes } from "../cli";

test("collects routes", () => {
  let routes = collectRoutes([
    "src/app/@error.page.tsx",
    "src/app/@not-found.page.tsx",
    "src/app/index.page.tsx",
    "src/app/api/@error.route.tsx",
    "src/app/api/[...params].route.ts",
    "src/app/api/foo.route.ts",
  ]);
  expect([...routes.values()]).toEqual([
    {
      $type: "error",
      routeType: "static",
      rawPath: "",
      filePath: "/@error.page.tsx",
      type: "page",
      params: [],
    },
    {
      $type: "not-found",
      routeType: "static",
      rawPath: "",
      filePath: "/@not-found.page.tsx",
      type: "page",
      params: [],
    },
    {
      routeType: "static",
      rawPath: "/",
      filePath: "/index.page.tsx",
      type: "page",
      params: [],
      $type: "custom",
    },
    {
      $type: "error",
      routeType: "static",
      rawPath: "/api",
      filePath: "/api/@error.route.tsx",
      type: "api",
      params: [],
    },
    {
      routeType: "catch-all",
      rawPath: "/api/[...params]",
      filePath: "/api/[...params].route.ts",
      params: ["params"],
      type: "api",
      $type: "custom",
    },
    {
      routeType: "static",
      rawPath: "/api/foo",
      filePath: "/api/foo.route.ts",
      type: "api",
      params: [],
      $type: "custom",
    },
  ]);
});
