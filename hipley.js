var fs = require('fs')
var path = require('path')
var extend = require('extend')

var ROOT = process.env.__root || process.cwd()

var options = defaults = {
  port: 3000,
  proxy: null,
  cmd: null,
  src: 'src',
  dest: 'build',
  browserSync: {
    ui: 3001
  },
  devServer: 3002,
  vendors: []
}

// Load .hipleyrc.
var rc = {}
try {
  rc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.hipleyrc')))
} catch (e) {
  console.log('Error Parsing .hipleyrc', e)
}

// Merge .hipleyrc into options.
if (rc) {
  options = extend(true, {}, options, rc)
}

// Read app's babelrc and merge into our babel options.
var babel = {
  'stage': 0,
  'optional': [
    'runtime'
  ],
  'plugins': [
    require('babel-plugin-react-transform')
  ],
  'extra': {
    'react-transform': [{
      'target': 'react-transform-webpack-hmr',
      'imports': ['react'],
      'locals': ['module']
    }, {
      'target': 'react-transform-catch-errors',
      'imports': ['react', 'redbox-react']
    }]
  }
}
try {
  if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
    babelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
    babel = extend(true, {}, babel, babelrc)
  }
} catch (e) {
  console.log('Error parsing .babelrc', e)
}

module.exports = {
  root: ROOT,
  defaults: defaults,
  rc: rc,
  babel: babel,
  options: options
}
