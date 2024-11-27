import { handleRequest } from "guava/handle-request";
// import { Slot } from "waku/minimal/client";
import { new_defineEntries } from "waku/minimal/server";

// let pageRoutes = new Map(
//   routes.filter(([_, route]) => route.type === "rsc") as Array<[string, Route]>,
// );
// let pageRouter = new Router([...pageRoutes.values()]);

// let apiRoutes = new Map(
//   routes.filter(([_, route]) => route.type === "route") as Array<
//     [string, Route]
//   >,
// );
// let apiRouter = new Router([...apiRoutes.values()]);

// const stringToStream = (str: string): ReadableStream => {
//   const encoder = new TextEncoder();
//   return new ReadableStream({
//     start(controller) {
//       controller.enqueue(encoder.encode(str));
//       controller.close();
//     },
//   });
// };

// async function load(path: string) {
//   const DO_NOT_BUNDLE = "";
//   let mod = await import(/* @vite-ignore */ `${DO_NOT_BUNDLE}./app/${path}`);
//   return mod.default;
// }

// function TODO() {
//   return (
//     <html lang="en">
//       <head>
//         <title>TODO</title>
//       </head>
//       <body>TODO</body>
//     </html>
//   );
// }

export default new_defineEntries({
  unstable_handleRequest: handleRequest,
  unstable_getBuildConfig: async () => [
    { pathSpec: [], entries: [{ rscPath: "" }] },
  ],
});
