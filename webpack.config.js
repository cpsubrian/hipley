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

// Read in our local .babelrc. Also try to read and merge in the app's copy.
var babelrc = {}
var appbabelrc = {}
try {
  babelrc =  JSON.parse(fs.readFileSync(path.resolve(__dirname, '.babelrc')))
  if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
    appbabelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
    babelrc = extend(true, {}, babelrc, appbabelrc)
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
        { test: /\.js?$/, loader: 'babel', include: SRC, query: babelrc }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js')
    ]
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
