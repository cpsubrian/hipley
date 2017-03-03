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
    devtool: 'sourcemap',
    entry: {
      app: [
        require.resolve('babel-polyfill'),
        path.resolve(SRC, './app')
      ]
    },
    output: {
      path: DEST,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'js/[id].chunk.js'
    },
    resolve: {
      modules: [
        path.join(ROOT, './node_modules'),
        path.join(__dirname, '../node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join(ROOT, './node_modules'),
        path.join(__dirname, '../node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: SRC,
          use: [{
            loader: 'babel-loader',
            options: _.extend({cacheDirectory: true}, hipley.getBabel())
          }]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        'Promise': 'exports-loader?global.Promise!es6-promise',
        'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
        'window.fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: SRC
        }
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
    conf.plugins = conf.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          'BROWSER': JSON.stringify(true),
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      })
    ])
  }

  // Development Sever.
  if (options.development) {
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
