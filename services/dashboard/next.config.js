const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  experimental: { esmExternals: true },
  env: {
    NXTRANET_DOMAIN: process.env.NXTRANET_DOMAIN,
  }
});
