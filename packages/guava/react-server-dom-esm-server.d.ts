// declare module "react-server-dom-esm/server.node" {
//   export function renderToPipeableStream(
//     payload: { returnValue: unknown; root: unknown } | unknown,
//     moduleBasePath: string,
//   ): { pipe(res: Response): void };
//   // export function renderToReadableStream(model: unknown, moduleBasePath: string): ReadableStream;
// }

declare module "react-server-dom-esm/server.edge" {
  export function renderToReadableStream(model: unknown, moduleBasePath: string): ReadableStream;
}
