// import * as cookie from 'cookie';

// import type { Middleware } from 'waku/config';

// // XXX we would probably like to extend config.
// const COOKIE_OPTS = {};

// const cookieMiddleware: Middleware = () => {
//   return async (ctx, next) => {
//     const cookies = cookie.parse(ctx.req.headers.cookie || '');
//     ctx.data.count = Number(cookies.count) || 0;
//     await next();
//     ctx.res.headers ||= {};
//     let origSetCookie = ctx.res.headers['set-cookie'] || ([] as string[]);
//     if (typeof origSetCookie === 'string') {
//       origSetCookie = [origSetCookie];
//     }
//     ctx.res.headers['set-cookie'] = [
//       ...origSetCookie,
//       cookie.serialize('count', String(ctx.data.count), COOKIE_OPTS),
//     ];
//   };
// };

// export default cookieMiddleware;

import { join as pathJoin } from "node:path";
import { cwd } from "node:process";
import type { Middleware } from "waku/config";
// import { getHonoContext } from "waku/unstable_hono";
import type { Route } from "./router";
import { type Store, makeStore } from "./store";

async function loadRoutes(): Promise<Array<Route>> {
  try {
    let { routes } = (await import(
      /* @vite-ignore */ `${pathJoin(cwd(), "src", "routes.gen.ts")}`
    )) as { routes: Array<[string, Route]> };
    return routes.map(([_, route]) => route);
  } catch (e) {
    console.error(
      `Error loading routes from ${pathJoin(cwd(), "src", "routes.gen.ts")}, is guava running correctly?`,
    );
    console.error(e);
    throw e;
  }
}

type MiddlewareFunc = ReturnType<Middleware>;
type Context = Parameters<MiddlewareFunc>[0];
type Next = Parameters<MiddlewareFunc>[1];
type Result = Awaited<ReturnType<MiddlewareFunc>>;

export default function createGuavaMiddleware(): MiddlewareFunc {
  return async function guavaMiddleware(
    wakuContext: Context,
    next: Next,
  ): Promise<Result> {
    let routes = await loadRoutes();
    // @TODO - is there a safe way to do this?
    let honoContext = wakuContext.data.__hono_context as Store["context"];
    let store = makeStore({ context: honoContext, routes });
    wakuContext.data.guavaStore = store;
    await next();
  };
}
