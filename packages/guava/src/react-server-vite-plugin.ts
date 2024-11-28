import { transformSource } from "react-server-dom-webpack/node-loader";
import type { Plugin } from "vite";

/*
 * A Vite plugin that just delegates to `transformSource`.
 */
export const reactServerPlugin = (): Plugin => ({
  name: "react-server",
  async transform(code: string, id: string): Promise<string> {
    const context = {
      format: "module",
      url: id,
    };

    const { source } = await transformSource(
      code,
      context,
      async (source: string): Promise<{ source: string }> => ({
        source,
      }),
    );

    return source as string;
  },
});
