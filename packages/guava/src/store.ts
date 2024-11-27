import { AsyncLocalStorage } from "node:async_hooks";
import type { Context } from "hono";
import { type MatchedRoute, type RouteManifest, Router } from "./router";

export type Store = {
  context: Context;
  request: Request;
  route: MatchedRoute | undefined;
  routes: RouteManifest;
};

export let storage: AsyncLocalStorage<Store> = new AsyncLocalStorage<Store>();

export function makeStore({
  context,
  routes,
}: {
  context: Context;
  routes: RouteManifest;
}): Store {
  let router = new Router(routes);
  // @ts-expect-error - TODO - fix url types
  let matchedRoute = router.match(new URL(context.req.raw.url, "http://n"));

  return { context, request: context.req.raw, route: matchedRoute, routes };
}

export function callWithStore<T>(
  providedStore: Store,
  cb: () => Promise<T> | T,
): Promise<T> | T {
  return storage.run(providedStore, cb);
}

export function getStore(): Store {
  let store = storage.getStore();

  if (!store) {
    throw new Error("Unable to access the store!");
  }

  return store;
}
