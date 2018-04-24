// const re = /((<\?xml[^>]*>\s*)|(<\!--[^>]*>\s*)|(<title>(.*)?<\/title>\s*)|(<desc>(.*)?<\/desc>\s*)|(<defs><\/defs>\s*))/g;
const { resolve, dirname } = require('path');
const fs = require('fs');
const { looksLike } = require('./bUtils');
// const findParent = (path) => path.findParent(parentPath => parentPath.isProgram());
const matchExtensions = /\.svg$/i;

module.exports = oldTransform;

// eslint-disable-next-line
function oldTransform({ types: t }) {
  return {
    visitor: {
      // import SvgFile from './image.svg';
      ImportDefaultSpecifier(path) {
        const isSvgImport = looksLike(path, {
          parentPath: {
            node: {
              source: {
                value: (src) => /\.svg$/.test(src)
              }
            }
          }
        });
        if (isSvgImport) {
          const { value } = path.parentPath.node.source;
          const { name } = path.node.local;
          const { parentPath } = path;
          path.remove();
          parentPath.replaceWith(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier(name),
                t.callExpression(t.identifier('require'), [
                  t.stringLiteral(value),
                ])
              ),
            ])
          );
        }
      },

      // const SvgFile = require('./image.svg');
      CallExpression(path, { file }) {
        const { arguments: args } = path.node;
        const isRequireCall = looksLike(path, {
          node: {
            callee: { name: 'require' }
          }
        });

        if (
          !isRequireCall ||
          !args.length ||
          !t.isStringLiteral(args[0])
        ) {
          return;
        }

        const [{ value: svgPath }] = args;

        if (matchExtensions.test(svgPath)) {
          let svgFile;

          if (svgPath[0] === '.') {
            const requiringFile = file.opts.filename;
            svgFile = resolve(dirname(requiringFile), svgPath);
          } else {
            return;
          }
          
          console.log('processed svg file:', svgFile);
          const svg = fs.readFileSync(svgFile);
          // console.log('source', path.parentPath.node);

          if (!t.isExpressionStatement(path.parent)) {
            path.replaceWithSourceString(`
              () => ${svg}
            `);
          } else {
            svgFile.remove();
          }
        }
      },
    },
  };
};
