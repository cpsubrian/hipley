var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var _ = require('lodash')
var extend = require('extend')

var ROOT = process.env.__root
var PKG = require(path.resolve(ROOT, 'package.json'))
var SRC = path.resolve(ROOT, (process.env.__src || 'src'), 'js')
var BUILD = path.resolve(ROOT, process.env.__dest || 'build')

// Try to read .hipleyrc.
var settings = {}
try {
  settings = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.hipleyrc')))
} catch (e) {}

// Read app's babelrc and merge into our options.
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
} catch (e) {}

module.exports = function (options) {
  // Initialize conf.
  var conf = {
    cache: true,
    context: SRC,
    entry: {
      app: [
        './app'
      ],
      vendors: settings.vendors || []
    },
    output: {
      path: BUILD,
      filename: 'js/app.js',
      publicPath: '/'
    },
    resolve: {
      root: [ROOT, path.resolve(__dirname, 'node_modules')],
      extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
      root: path.resolve(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        { test: /\.js?$/, loader: 'babel', include: SRC }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js')
    ],
    babel: babel
  }

  // Set root.
  conf.root = SRC

  // Enable sourcemaps.
  conf.devtool = 'sourcemap'

  // Production.
  if (options.production) {
    conf.plugins = conf.plugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    )
  }

  // Development Sever.
  if (options.development) {
    conf.debug = true
    conf.entry.app = conf.entry.app.concat([
      'webpack-hot-middleware/client'
    ])
    conf.plugins = conf.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('development')
        }
      }),
      new webpack.HotModuleReplacementPlugin()
    ])
  }

  return conf
}
