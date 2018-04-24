const { createTransformer } = require('babel-jest');
const { resolve } = require('path');

module.exports = createTransformer({
  plugins: [
    // resolve(__dirname, 'svgTransform.js'),
    resolve(__dirname, '../../node_modules/babel-plugin-inline-react-svg/lib/index.js'),
    // collect paths for all styles files (css, scss)
    resolve(__dirname, 'collectStylePaths.js'),
    [ 'css-modules-transform', {
      // process sass files, converting from sass-modules to native css
      preprocessCss: resolve(__dirname, 'processSass.js'),
      // process css files, converting from css-modules to native css
      processCss: resolve(__dirname, 'processCss.js'),
    } ]
  ]
});
