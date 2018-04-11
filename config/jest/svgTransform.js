'use strict';
// module.exports = 'div';
// const re = /((<\?xml[^>]*>\s*)|(<\!--[^>]*>\s*)|(<title>(.*)?<\/title>\s*)|(<desc>(.*)?<\/desc>\s*)|(<defs><\/defs>\s*))/g;
module.exports = {
  process(src, filename) {
    console.log(src);
    // return `module.exports = '${filename}';`;
    return `module.exports = 'div';`;
  },
};
