/** Automatically Generated! */
import type { Route } from "guava/router";

export let routes: Array<[string, Route]> = [
  [
    "/@error",
    {
      "$type": "error",
      "routeType": "static",
      "rawPath": "",
      "filePath": "/@error.page.tsx",
      "type": "page",
      "params": []
    }
  ],
  [
    "/@not-found",
    {
      "$type": "not-found",
      "routeType": "static",
      "rawPath": "",
      "filePath": "/@not-found.page.tsx",
      "type": "page",
      "params": []
    }
  ],
  [
    "/",
    {
      "routeType": "static",
      "rawPath": "/",
      "filePath": "/index.page.tsx",
      "type": "page",
      "params": [],
      "$type": "custom"
    }
  ],
  [
    "/catch-all/[...params]",
    {
      "routeType": "catch-all",
      "rawPath": "/catch-all/[...params]",
      "filePath": "/catch-all/[...params].route.ts",
      "params": [
        "params"
      ],
      "type": "api",
      "$type": "custom"
    }
  ],
  [
    "/api/@error",
    {
      "$type": "error",
      "routeType": "static",
      "rawPath": "/api",
      "filePath": "/api/@error.route.ts",
      "type": "api",
      "params": []
    }
  ],
  [
    "/api/@not-found",
    {
      "$type": "not-found",
      "routeType": "static",
      "rawPath": "/api",
      "filePath": "/api/@not-found.route.ts",
      "type": "api",
      "params": []
    }
  ],
  [
    "/api/foo",
    {
      "routeType": "static",
      "rawPath": "/api/foo",
      "filePath": "/api/foo.route.ts",
      "type": "api",
      "params": [],
      "$type": "custom"
    }
  ]
];