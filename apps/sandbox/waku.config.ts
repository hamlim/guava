// This is a temporary file while experimenting new_defineEntries

// import createGuavaMiddleware from "guava/middleware";
import { defineConfig } from "waku/config";
import { routes } from "./src/routes.gen";

export default defineConfig({
  middleware: () => [
    import("waku/middleware/context"),
    import("guava/middleware").then((m) => m.default(routes)),
    import("waku/middleware/dev-server"),
    import("waku/middleware/handler"),
  ],
});
