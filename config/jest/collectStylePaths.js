const { resolve, dirname } = require('path');
const { looksLike } = require('./astUtils');

const matchExtensions = /\.css$/i;

module.exports = function({ types: t }) {
  return {
    visitor: {
      // import styles from './style.css';
      ImportDefaultSpecifier(path) {
        const { value } = path.parentPath.node.source;
        if (!matchExtensions.test(value)) {
          return;
        }

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
      },

      // const styles = require('./styles.css');
      CallExpression(path, { file }) {
        const { arguments: args } = path.node;
        const isRequireCall = looksLike(path, {
          node: {
            callee: {
              name: 'require'
            }
          }
        });

        if (
          !isRequireCall ||
          !args.length ||
          !t.isStringLiteral(args[0])
        ) {
          return;
        }

        const [{ value: stylesheetPath }] = args;

        if (matchExtensions.test(stylesheetPath)) {
          let csspath;

          if (stylesheetPath[0] === '.') {
            const requiringFile = file.opts.filename;
            csspath = resolve(dirname(requiringFile), stylesheetPath);
          } else {
            csspath = resolve('node_modules/' + stylesheetPath);
            console.log('nodeModulesCssPath', csspath);
          }

          console.log('processed css file:', csspath);
          const tokens = require(csspath) || {};

          if (!t.isExpressionStatement(path.parent)) {
            path.replaceWithSourceString(`
              (function(){
                global.includedCssModules = global.includedCssModules || [];

                if (global.includedCssModules.indexOf('${csspath}') === -1) {
                    global.includedCssModules.push('${csspath}');
                }

                return ${JSON.stringify(tokens)};
              })()
            `);
          } else {
            csspath.remove();
          }
        }
      },
    },
  };
};
