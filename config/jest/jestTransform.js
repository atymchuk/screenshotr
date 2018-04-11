const { createTransformer } = require('babel-jest');
const { resolve } = require('path');

module.exports = createTransformer({
  plugins: [
    resolve(__dirname, 'collectStylePaths.js'),
    [ 'css-modules-transform', {
      processCss: resolve(__dirname, 'processCss.js')
    } ],
  ]
});
