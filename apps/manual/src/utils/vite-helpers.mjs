import { readFileSync } from "node:fs";
import { createViteRuntime, createServer as createViteServer } from "vite";

/*
 * Functions for working with Vite manifests.
 */
export function getEntryChunk(manifest) {
  return Object.values(manifest).find((chunk) => chunk.isEntry);
}

export function fromFile(path) {
  return JSON.parse(readFileSync(path, { encoding: "utf-8" }));
}

/*
 * Creates a Vite dev server and runtime
 */

export let server = await createViteServer({
  configFile: "./vite.config.ts",
});

export let runtime = await createViteRuntime(server);

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Not sure if this is necessary or not in middleware mode.
    server.close();
  });
}
