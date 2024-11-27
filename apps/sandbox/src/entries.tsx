import { handleRequest } from "guava/handle-request";
import { new_defineEntries } from "waku/minimal/server";

export default new_defineEntries({
  unstable_handleRequest: handleRequest,
  unstable_getBuildConfig: async () => [
    { pathSpec: [], entries: [{ rscPath: "" }], isStatic: false },
  ],
});
