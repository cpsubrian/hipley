var path = require('path')
var webpack = require('webpack')
var hipley = require('./')

var ROOT = hipley.root
var SRC = path.resolve(ROOT, hipley.options.src, 'js')
var BUILD = path.resolve(ROOT, hipley.options.dest)

module.exports = function (options) {
  // Initialize conf.
  var conf = {
    cache: true,
    context: SRC,
    entry: {
      app: [
        './app'
      ],
      vendors: hipley.options.vendors || []
    },
    output: {
      path: BUILD,
      filename: 'js/app.js',
      publicPath: '/'
    },
    resolve: {
      root: ROOT,
      fallback: path.resolve(__dirname, 'node_modules'),
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
      new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js'),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
        'window.fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ],
    babel: hipley.babel
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
