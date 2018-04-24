const fs = require('fs');
const pkg = require('../../package.json');
const { TMP_STYLES_FILE } = pkg.jest.globals;

if (!TMP_STYLES_FILE) {
  throw new Error('Please provide a global TMP_STYLES_FILE in package.json, under the jest section');
}

module.exports = function generateSnapshot(data, filename) {
  const cssMap = JSON.parse(fs.readFileSync(TMP_STYLES_FILE, 'utf8'));
  console.log(global);
  const styles = global.includedCssModules.map(path => cssMap[path] || '').filter(Boolean);

  console.log(styles);
  return styles;
}
