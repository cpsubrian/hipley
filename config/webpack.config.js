var _ = require('lodash')
var path = require('path')
var webpack = require('webpack')
var hipley = require('../')

var ROOT = hipley.options.root
var SRC = path.resolve(ROOT, hipley.options.src, 'js')
var DEST = path.resolve(ROOT, hipley.options.dest)

module.exports = function (options) {
  // Initialize conf.
  var conf = {
    cache: true,
    devtool: 'source-map',
    context: SRC,
    root: SRC,
    entry: {
      app: ['./app']
    },
    output: {
      path: DEST,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].chunk.js'
    },
    resolve: {
      modules: [ROOT, 'node_modules', path.join(__dirname, '../node_modules')],
      extensions: ['', '.js', '.jsx'],
      alias: {
        'app': SRC
      }
    },
    resolveLoader: {
      modules: [ROOT, 'node_modules', path.join(__dirname, '../node_modules')]
    },
    module: {
      loaders: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          include: SRC,
          query: _.extend({cacheDirectory: true}, hipley.getBabel())
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
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
    ]
  }

  // Optionally, support vendors splitting.
  if (hipley.options.vendors && hipley.options.vendors.length) {
    conf.entry.vendors = hipley.options.vendors
    conf.plugins = conf.plugins.concat([
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'js/vendors.js'
      })
    ])
  }

  // Optionally, support externals.
  if (hipley.options.externals) {
    conf.externals = hipley.options.externals
  }

  // Production.
  if (options.production) {
    conf.plugins = conf.plugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    )
  }

  // Development Sever.
  if (options.development) {
    conf.entry.app = conf.entry.app.concat([
      'webpack-hot-middleware/client'
    ])
    conf.plugins = conf.plugins.concat([
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true
      }),
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
