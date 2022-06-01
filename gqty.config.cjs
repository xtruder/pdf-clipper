/**
 * @type {import("@gqty/cli").GQtyConfig}
 */
const config = {
  react: true,
  scalarTypes: { DateTime: "string", ID: "string" },
  introspection: {
    endpoint: "schema/**",
    headers: {},
  },
  destination: "./src/gqty/index.ts",
  subscriptions: true,
  javascriptOutput: false,
  enumsAsConst: false,
};

module.exports = config;
