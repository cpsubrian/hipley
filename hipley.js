var fs = require('fs')
var path = require('path')
var extend = require('extend')

var ROOT = process.env.__root || process.cwd()

var defaults = {
  port: process.env.__port || process.env.PORT || 3000,
  proxy: process.env.__proxy || null,
  cmd: process.env.__cmd || null,
  src: process.env.__src || 'src',
  dest: process.env.__dest || 'dist',
  static: process.env.__static || 'public',
  devServer: process.env.__devServer || 3002,
  browserSync: {
    ui: 3001
  },
  vendors: [],
  optional: {
    'react-transform-catch-errors': true
  }
}

// Load .hipleyrc.
var rc = {}
if (fs.existsSync(path.resolve(ROOT, '.hipleyrc'))) {
  try {
    rc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.hipleyrc')))
  } catch (e) {
    console.log('Error Parsing .hipleyrc', e)
  }
}

// Merge .hipleyrc into options.
var options = extend(true, {}, defaults, rc)

// Base babel options.
var babel = {
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0')
  ],
  env: {
    development: {
      plugins: [
        [require.resolve('babel-plugin-transform-runtime')],
        [require.resolve('babel-plugin-transform-decorators-legacy')],
        [require.resolve('babel-plugin-add-module-exports')],
        [require.resolve('babel-plugin-react-transform'), {
          'transforms': [
            {
              'transform': require.resolve('react-transform-hmr'),
              'imports': ['react'],
              'locals': ['module']
            }
          ]
        }]
      ]
    },
    production: {
      plugins: [
        [require.resolve('babel-plugin-transform-runtime')],
        [require.resolve('babel-plugin-transform-decorators-legacy')],
        [require.resolve('babel-plugin-add-module-exports')],
        [require.resolve('babel-plugin-transform-react-constant-elements')],
        [require.resolve('babel-plugin-transform-react-inline-elements')]
      ]
    }
  }
}

// Read app's babelrc and merge into base babel options.
if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
  try {
    var babelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
    babel = extend(true, {}, babel, babelrc)
  } catch (e) {
    console.error('Error parsing .babelrc', e)
  }
}

module.exports = {
  root: ROOT,
  defaults: defaults,
  rc: rc,
  babel: babel,
  options: options,
  set: function (key, val) {
    options[key] = val
  }
}
