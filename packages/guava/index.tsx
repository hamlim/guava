// Following this example: https://github.com/facebook/react/blob/main/fixtures/flight-esm/server/global.js

import { pathToFileURL } from "node:url";
import React from "react";

import { renderToPipeableStream } from "react-dom/server";
import { createFromNodeStream } from "react-server-dom-esm/client";

// Where to find the code
let moduleBasePath = new URL(
  "../src",
  // @ts-expect-error
  pathToFileURL(import.meta.path),
).href;

function App() {
  return <marquee>Hello!</marquee>;
}

async function renderApp({ request }: { request: Request }, returnValue?: unknown) {
  let { renderToReadableStream } = await import("react-server-dom-esm/server.edge");
  // Import the app:
  // let m = await import("./src/App.js");
  // let App = m.default;
  let root = React.createElement(App, { request });
  // For client-invoked server actions we refresh the tree and return a return value.
  let payload = returnValue ? { returnValue, root } : root;
  return renderToReadableStream(payload, moduleBasePath);
}

Bun.serve({
  port: 3000,
  async fetch(request: Request) {
    let { method } = request;

    switch (method) {
      case "POST": {
        break;
      }
      case "GET":
      default: {
        return new Response(await renderApp({ request }), { status: 200 });
      }
    }

    return new Response(`<h1>Yo</h1>`, {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    });
  },
});
