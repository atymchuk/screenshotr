const { resolve, dirname } = require('path');

const matchExtensions = /\.css$/i;

module.exports = function({ types: t }) {
  return {
    visitor: {
      // import styles from './style.css';
      ImportDefaultSpecifier(path) {
        const { value } = path.parentPath.node.source;
        if (matchExtensions.test(value)) {
          const { name } = path.node.local;
          // console.log('path', path);
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

      // const styles = require('./styles.css');
      CallExpression(path, { file }) {
        const { callee: { name: calleeName }, arguments: args } = path.node;

        if (
          calleeName !== 'require' ||
          !args.length ||
          !t.isStringLiteral(args[0])
        ) {
          return;
        }

        const [{ value: stylesheetPath }] = args;
        console.log('stylesheetPath', stylesheetPath);

        if (matchExtensions.test(stylesheetPath)) {
          let csspath;

          if (stylesheetPath[0] === '.') {
            const requiringFile = file.opts.filename;
            console.log('requiringFile', requiringFile);
            csspath = resolve(dirname(requiringFile), stylesheetPath);
          } else {
            csspath = resolve('node_modules/' + stylesheetPath);
            console.log('nodeModulesCssPath', csspath);
          }
          
          console.log('require path', csspath);
          const tokens = require(csspath) || {};
          console.log('tokens', tokens);

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
