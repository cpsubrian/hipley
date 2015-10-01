var fs = require('fs')
var path = require('path')
var extend = require('extend')

var ROOT = process.env.__root || process.cwd()

var defaults = {
  port: process.env.__port || process.env.PORT || 3000,
  proxy: process.env.__proxy || null,
  cmd: process.env.__cmd || null,
  src: process.env.__src || 'src',
  dest: process.env.__dest || 'build',
  static: process.env.__static || 'public',
  devServer: process.env.__devServer || 3002,
  browserSync: {
    ui: 3001
  },
  vendors: []
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

// Read app's babelrc and merge into our babel options.
var babel = {
  'stage': 0,
  'optional': [
    'runtime'
  ],
  'env': {
    'development': {
      'plugins': [
        require('babel-plugin-react-transform')
      ],
      'extra': {
        'react-transform': {
          'transforms': [{
            'transform': 'react-transform-hmr',
            'imports': ['react'],
            'locals': ['module']
          }, {
            'transform': 'react-transform-catch-errors',
            'imports': ['react', 'redbox-react']
          }]
        }
      }
    }
  }
}
if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
  try {
    var babelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
    babel = extend(true, {}, babel, babelrc)
  } catch (e) {
    console.log('Error parsing .babelrc', e)
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
