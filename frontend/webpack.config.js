const path = require('path');

module.exports = {
  // Your other webpack configurations...

  devServer: {
    client: {
      overlay: {
        runtimeErrors: true, // Enable runtime error overlay
        errors: true,         // Enable general error overlay
      },
    },
  },
};
