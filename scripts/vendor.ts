import { exec as execOLD } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";

let exec = promisify(execOLD);

let dep = process.argv[2];

let base = `https://react-builds.vercel.app/`;

// Edge build for react-server-dom-esm
// See: https://github.com/facebook/react/pull/27353
let commit = `cd16c3d40cab47c69e18bf12cc97a591f4ec5407`;

switch (dep) {
  case "react-server-dom-esm": {
    await Promise.all([
      exec(`curl -L ${base}api/commits/${commit}/packages/react-server-dom-esm | tar -xz`),
      exec(`rm -rf packages/react-server-dom-esm/`),
    ]);
    await exec(`mv package/ packages/react-server-dom-esm/`);
    await writeFile(
      `packages/react-server-dom-esm/server.edge.js`,
      `"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-server-dom-esm-server.edge.production.min.js");
} else {
  module.exports = require("./cjs/react-server-dom-esm-server.edge.development.js");
}
`,
    );
    break;
  }
  default: {
    throw new Error(`No provided dependency to vendor!`);
  }
}
