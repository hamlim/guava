import { getStore } from "guava/store";
// import { handleRequest } from "guava/handle-request";
import { Slot } from "waku/minimal/client";
import { new_defineRouter } from "waku/router/server";

console.log("Entries file");

let router = new_defineRouter({
  async getPathConfig() {
    console.log("getPathConfig called");
    return [
      {
        pattern: "/",
        path: [],
        routeElement: {
          isStatic: false,
        },
        elements: {
          root: { isStatic: false },
        },
      },
    ];
  },
  async renderRoute(path, options) {
    console.log("renderRoute called");
    console.log(path, options);

    // let store = getStore();
    // console.log(Object.keys(store));

    return {
      routeElement: <Slot id="root" />,
      elements: {
        root: (
          <html lang="en">
            <head>
              <title>New</title>
            </head>
            <body>
              <marquee>Hello World</marquee>
            </body>
          </html>
        ),
      },
    };
  },
});

console.log("router", router);

export default router;
