/*
 * This is the entry point for our client application in node. It is a
 * "client runtime" as far as React is concerned. Because it is a client runtime,
 * it can render client components but not server components.
 */

import "./prelude.mjs";

import { PassThrough, type Readable } from "node:stream";
import { type ReactNode, use } from "react";
import { renderToPipeableStream } from "react-dom/server";
// import { StaticRouter } from "react-router-dom/server.js";
import { createFromNodeStream } from "react-server-dom-webpack/client.node";

import "./rsc-runtime-client.mjs";
import { manifest } from "./rsc-runtime-client.mjs";

/*
 * Takes the RSC payload stream and transforms it to HTML for SSR. We are able
 * to do this in the same process as our Node server thanks to Vite. We use Vite
 * to load this module with the correct conditions.
 *
 *  See file://./NodeServer.tsx ssr
 */
export function renderToHtml(rscPayload: Readable, url: string): Readable {
  const promise = createFromNodeStream<ReactNode>(rscPayload, manifest);
  function Root() {
    return use(promise);
  }
  //   const { pathname, search } = new URL(url);

  const { pipe } = renderToPipeableStream(
    // <StaticRouter location={`${pathname}${search}`}>
    <Root />,
    // </StaticRouter>,
  );

  return pipe(new PassThrough());
}
