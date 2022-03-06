const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  experimental: { esmExternals: true },
  compiler: {
    styledComponents: true,
  },
  env: {
    NXTRANET_DOMAIN: process.env.NXTRANET_DOMAIN,
  }
});
