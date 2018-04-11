const path = require('path');
const csstree = require('css-tree');
const fs = require('fs');
const mime = require('mime');
const pkg = require('../../package.json');
const TMP_STYLES_FILE = pkg.jest.globals.TMP_STYLES_FILE;

if (!TMP_STYLES_FILE) {
  throw new Error('Please provide a global TMP_STYLES_FILE in package.json, under the jest section');
} else {
  console.log(TMP_STYLES_FILE);
}

module.exports = function processingCSS(data, filename) {
  const ast = csstree.parse(data);

  csstree.walk(ast, function(node) {
    if (node.type === 'Url') {
      const { type, value } = node.value;
      const url =
        type === 'String' ? value.substring(1, value.length - 1) : value;
      node.value = {
        type: 'Raw',
        value: inlineResource(url, path.dirname(filename)),
      };
    }
  });

  const css = csstree.generate(ast);
  let serializedCss;
  try {
    serializedCss = JSON.parse(fs.readFileSync(TMP_STYLES_FILE, 'utf8'));
  } catch (error) {
    serializedCss = {};
  }
  serializedCss[filename] = css;
  fs.writeFileSync(TMP_STYLES_FILE, JSON.stringify(serializedCss));

  return css;
};

function inlineResource(uri, baseURI) {
  const filepath = path.resolve(baseURI, uri);
  const data = fs.readFileSync(filepath);
  // NOTE: use getType for mime versions 2+
  // const mimeType = mime.getType(filepath);
  const mimeType = mime.lookup(filepath);
  return 'data:' + mimeType + ';base64,' + data.toString('base64');
}
