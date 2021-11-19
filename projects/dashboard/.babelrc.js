const path = require('path');

const isProd = process.env.NODE_ENV == 'production';

module.exports = {
  "presets": [
    "next/babel"
  ],
  "plugins": [
    ["styled-components", {
      "ssr": true,
      "displayName": true,
      "preprocess": false
    }],
    ["module-resolver", {
      "root": ["."],
      "alias": {
        "~/utils": "./utils",
        "~/redux": "./redux",
        "~/styles": "./styles",
        "~/components": "./components",
      }
    }]
  ]
}
