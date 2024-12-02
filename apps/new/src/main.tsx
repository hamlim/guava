// import { StrictMode } from "react";
// import { createRoot, hydrateRoot } from "react-dom/client";
// import { Root, Slot } from "waku/minimal/client";

// const rootElement = (
//   <StrictMode>
//     <Root>
//       <Slot id="App" />
//     </Root>
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { NewRouter } from "waku/router/client";

let rootElement = (
  <StrictMode>
    <NewRouter />
  </StrictMode>
);

// @ts-expect-error
if (globalThis.__WAKU_HYDRATE__) {
  hydrateRoot(document, rootElement);
} else {
  // @ts-expect-error - createRoot should support `document`
  createRoot(document).render(rootElement);
}
