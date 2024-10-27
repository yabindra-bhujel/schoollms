const path = require('path');

module.exports = {

  entry: './src/index.js',

  devServer: {
    client: {
      overlay: {
        runtimeErrors: true, 
        errors: true,     
      },
    },
  },
};
