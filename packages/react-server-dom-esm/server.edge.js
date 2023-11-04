"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-server-dom-esm-server.edge.production.min.js");
} else {
  module.exports = require("./cjs/react-server-dom-esm-server.edge.development.js");
}
