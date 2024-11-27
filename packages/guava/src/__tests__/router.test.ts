import { describe, expect, it } from "bun:test";
import { Router } from "../router";

describe("Router", () => {
  it("should match static routes", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/foo",
        filePath: "/foo.page.tsx",
        params: [],
        type: "page",
        $type: "custom",
      },
    ]);

    let requestedURL = new URL("/foo", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "static",
      params: [],
      rawPath: "/foo",
      filePath: "/foo.page.tsx",
      type: "page",
      matchedParams: {},
      $type: "custom",
    });

    let requestedURL2 = new URL("/foo/anything", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute2 = router.match(requestedURL2);

    // no not found route present
    expect(matchedRoute2).toBeUndefined();
  });

  it("should match dynamic routes", () => {
    let router = new Router([
      {
        routeType: "dynamic",
        params: ["single"],
        rawPath: "/foo/[single]",
        filePath: "/foo/[single].page.tsx",
        type: "page",
        $type: "custom",
      },
    ]);

    let requestedURL = new URL("/foo/anything", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "dynamic",
      params: ["single"],
      rawPath: "/foo/[single]",
      filePath: "/foo/[single].page.tsx",
      type: "page",
      matchedParams: { single: "anything" },
      $type: "custom",
    });

    let requestedURL2 = new URL("/foo/anything/else", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toBeUndefined();
  });

  it("should match many dynamic routes", () => {
    let router = new Router([
      {
        routeType: "dynamic",
        params: ["id"],
        rawPath: "/foo/[id]/bar",
        filePath: "/foo/[id]/bar.page.tsx",
        type: "page",
        $type: "custom",
      },
    ]);

    let requestedURL = new URL("/foo/anything/bar", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "dynamic",
      params: ["id"],
      rawPath: "/foo/[id]/bar",
      filePath: "/foo/[id]/bar.page.tsx",
      type: "page",
      matchedParams: { id: "anything" },
      $type: "custom",
    });
  });

  it("should match nested dynamic routes", () => {
    let router = new Router([
      {
        routeType: "catch-all",
        params: ["nested"],
        rawPath: "/foo/[...nested]",
        filePath: "/foo/[...nested].page.tsx",
        type: "page",
        $type: "custom",
      },
    ]);

    let requestedURL = new URL("/foo/anything", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "catch-all",
      params: ["nested"],
      rawPath: "/foo/[...nested]",
      filePath: "/foo/[...nested].page.tsx",
      type: "page",
      matchedParams: { nested: ["anything"] },
      $type: "custom",
    });

    let requestedURL2 = new URL("/foo/anything/else", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toEqual({
      routeType: "catch-all",
      params: ["nested"],
      rawPath: "/foo/[...nested]",
      filePath: "/foo/[...nested].page.tsx",
      type: "page",
      matchedParams: { nested: ["anything", "else"] },
      $type: "custom",
    });
  });

  it("should fall back to a @not-found route if present", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/",
        filePath: "/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
    ]);

    let requestedURL = new URL("/anything", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "static",
      params: [],
      matchedParams: {},
      rawPath: "/",
      filePath: "/@not-found.page.tsx",
      type: "page",
      $type: "not-found",
    });
  });

  it("should fall back to the closest @not-found route", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/",
        filePath: "/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
      {
        routeType: "static",
        rawPath: "/foo",
        filePath: "/foo/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
      {
        routeType: "static",
        rawPath: "/foo/bar",
        filePath: "/foo/bar/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
    ]);

    let requestedURL = new URL("/foo/bar/baz", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "static",
      rawPath: "/foo/bar",
      filePath: "/foo/bar/@not-found.page.tsx",
      params: [],
      type: "page",
      $type: "not-found",
      matchedParams: {},
    });

    let requestedURL2 = new URL("/foo/blah", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toEqual({
      routeType: "static",
      rawPath: "/foo",
      filePath: "/foo/@not-found.page.tsx",
      params: [],
      type: "page",
      $type: "not-found",
      matchedParams: {},
    });

    let requestedURL3 = new URL("/something", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let matchedRoute3 = router.match(requestedURL3);

    expect(matchedRoute3).toEqual({
      routeType: "static",
      rawPath: "/",
      filePath: "/@not-found.page.tsx",
      params: [],
      type: "page",
      $type: "not-found",
      matchedParams: {},
    });
  });

  it("supports finding the nearest error route", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/",
        filePath: "/@error.page.tsx",
        params: [],
        type: "page",
        $type: "error",
      },
      {
        routeType: "static",
        rawPath: "/foo",
        filePath: "/foo/@error.page.tsx",
        params: [],
        type: "page",
        $type: "error",
      },
      {
        routeType: "static",
        rawPath: "/foo/bar",
        filePath: "/foo/bar/@error.page.tsx",
        params: [],
        type: "page",
        $type: "error",
      },
    ]);

    let requestedURL = new URL("/foo/bar/baz", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let nearestErrorRoute = router.findNearestRoute(requestedURL, "error");

    expect(nearestErrorRoute).toEqual({
      routeType: "static",
      rawPath: "/foo/bar",
      filePath: "/foo/bar/@error.page.tsx",
      params: [],
      matchedParams: {},
      type: "page",
      $type: "error",
    });
  });

  it("supports finding the nearest not-found route", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/",
        filePath: "/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
      {
        routeType: "static",
        rawPath: "/foo",
        filePath: "/foo/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
      {
        routeType: "static",
        rawPath: "/foo/bar",
        filePath: "/foo/bar/@not-found.page.tsx",
        params: [],
        type: "page",
        $type: "not-found",
      },
    ]);

    let requestedURL = new URL("/foo/bar/baz", "http://localhost");
    // @ts-expect-error - TODO figure out proper URL type
    let nearestErrorRoute = router.findNearestRoute(requestedURL, "not-found");

    expect(nearestErrorRoute).toEqual({
      routeType: "static",
      rawPath: "/foo/bar",
      filePath: "/foo/bar/@not-found.page.tsx",
      params: [],
      type: "page",
      $type: "not-found",
      matchedParams: {},
    });
  });
});
