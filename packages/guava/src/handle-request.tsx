import { getContextData } from "waku/middleware/context";
import { Slot } from "waku/minimal/client";
import type { new_defineEntries } from "waku/minimal/server";
import { unstable_getPlatformObject } from "waku/server";
import Fallback from "./fallback";
import type { APIHandler, Page } from "./router";
import { type Store, callWithStore } from "./store";

type RequestHandler = ReturnType<
  typeof new_defineEntries
>["unstable_handleRequest"];

type Input = Parameters<RequestHandler>[0];
type Utils = Parameters<RequestHandler>[1];

type HandlerRes = ReturnType<RequestHandler>;

export async function handleRequest(input: Input, utils: Utils): HandlerRes {
  let data = getContextData() as { guavaStore?: Store };
  let platformObject = unstable_getPlatformObject();
  if (typeof platformObject === "object" && "buildOptions" in platformObject) {
    return new Response("<build-time-request-bail>").body;
  }
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
        if (route.type === "api") {
          throw new Error(
            "Attempted to handle request via API Handler and not a Page!",
          );
        }
        let Component = (await route.mod()).default as Page;
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
          let handler = (await route.mod()).default as APIHandler;
          return handler(input.req as unknown as Request, {
            params: route.matchedParams,
          }) as unknown as HandlerRes;
        }
        let Component = (await route.mod()).default as Page;
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
