var sass = require('node-sass');
// var path = require('path');

module.exports = function processSass(data, file) {
  return sass.renderSync({ data, file }).css.toString('utf8');
};
