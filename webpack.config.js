var _ = require('lodash')
var path = require('path')
var webpack = require('webpack')
var hipley = require('./')

var ROOT = hipley.root
var SRC = path.resolve(ROOT, hipley.options.src, 'js')
var DEST = path.resolve(ROOT, hipley.options.dest)

module.exports = function (options) {
  // Initialize conf.
  var conf = {
    cache: true,
    devtool: 'sourcemap',
    context: SRC,
    root: SRC,
    entry: {
      app: [require.resolve('babel-core/polyfill'), './app']
    },
    output: {
      path: DEST,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].chunk.js'
    },
    resolve: {
      root: ROOT,
      fallback: path.resolve(__dirname, 'node_modules'),
      extensions: ['', '.js', '.jsx'],
      alias: {
        'app': SRC
      }
    },
    resolveLoader: {
      root: path.resolve(__dirname, 'node_modules')
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          loader: 'babel',
          include: SRC
        }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
        'window.fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      }),
      // If using code splitting, dedupe commons in child chunks.
      new webpack.optimize.CommonsChunkPlugin({
        names: ['app'],
        children: true,
        async: true,
        minChunks: 3
      })
    ],
    babel: _.extend({cacheDirectory: true}, hipley.babel)
  }

  // Optionally, support vendors splitting.
  if (hipley.options.vendors && hipley.options.vendors.length) {
    conf.entry.vendors = hipley.options.vendors
    conf.plugins = conf.plugins.concat([
      new webpack.optimize.CommonsChunkPlugin('vendors', 'js/vendors.js')
    ])
  }

  // Optionally, support externals.
  if (hipley.options.externals) {
    conf.externals = hipley.options.externals
  }

  // Production.
  if (options.production) {
    conf.plugins = conf.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(true)
    ])
    if (hipley.options.minify) {
      conf.plugins = conf.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
      ])
    }
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
