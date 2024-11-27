import { join as pathJoin } from "node:path";
import { cwd } from "node:process";
import { getContextData } from "waku/middleware/context";
import { Slot } from "waku/minimal/client";
import type { new_defineEntries } from "waku/minimal/server";
import Fallback from "./fallback";
import {
  // getStore,
  type Store,
  callWithStore,
} from "./store";

async function load(path: string) {
  const DO_NOT_BUNDLE = "";
  let mod = await import(
    /* @vite-ignore */ `${DO_NOT_BUNDLE}${pathJoin(cwd(), "src", "app", path)}`
  );
  return mod.default;
}

type RequestHandler = ReturnType<
  typeof new_defineEntries
>["unstable_handleRequest"];

type Input = Parameters<RequestHandler>[0];
type Utils = Parameters<RequestHandler>[1];

export async function handleRequest(
  input: Input,
  utils: Utils,
): ReturnType<RequestHandler> {
  let data = getContextData() as { guavaStore?: Store };
  if (!data.guavaStore) {
    throw new Error(
      "Unable to access the store, did you correctly configure the 'guava/middleware'?!",
    );
  }
  let store = data.guavaStore;
  let route = store.route;

  return await callWithStore<ReturnType<RequestHandler>>(store, async () => {
    let { renderHtml, renderRsc } = utils;
    switch (input.type) {
      case "component": {
        if (!route) {
          console.warn(`No page route found for ${input.req.url}`);
          return renderRsc({
            App: (
              <Fallback>
                <h1>No found RSC route!</h1>
                <pre>
                  {JSON.stringify(
                    {
                      "Requested Path": input.req.url.pathname,
                      "Available Routes": store.routes,
                    },
                    null,
                    2,
                  )}
                </pre>
              </Fallback>
            ),
          });
        }
        let Component = await load(route.filePath);
        return renderRsc({ App: <Component /> });
      }
      case "function": {
        let elements: Record<string, unknown> = {};
        let rerender = (rscPath: string) => {
          elements.App = (
            <Fallback>
              <h1>TODO</h1>
            </Fallback>
          );
        };
        // let value = await runWithRerender(rerender, () =>
        //   input.fn(...input.args),
        // );
        let value = await input.fn(...input.args);
        return renderRsc({ ...elements, _value: value });
      }
      case "custom": {
        if (!route) {
          console.warn(`No API or page route found for ${input.req.url}`);
          return renderHtml(
            {
              App: (
                <Fallback>
                  <h1>No found route!</h1>
                  <pre>
                    {JSON.stringify(
                      {
                        "Requested Path": input.req.url.pathname,
                        "Available Routes": store.routes,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </Fallback>
              ),
            },
            <Slot id="App" />,
            "",
          );
        }
        let type = route.type;
        if (type === "api") {
          let handler = await load(route.filePath);
          return handler(input.req, {
            params: route.matchedParams,
          });
        }
        let Component = await load(route.filePath);
        return renderHtml({ App: <Component /> }, <Slot id="App" />, "");
      }
      default: {
        return renderHtml(
          {
            App: (
              <Fallback>
                <h1>TODO</h1>
              </Fallback>
            ),
          },
          <Slot id="App" />,
          "",
        );
      }
    }
  });
}
