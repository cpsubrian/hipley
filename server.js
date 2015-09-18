var gulpUtil = require('gulp-util')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')({
  development: true
})
var app = express()
var compiler = webpack(config)
var hipley = require('./')

var ROOT = hipley.root
var DEST = path.resolve(ROOT, hipley.options.dest)
var STATIC = path.resolve(ROOT, hipley.options.static)
var PORT = hipley.options.devServer
var PROXY = hipley.options.proxy

// If we're not proxying, serve the dest and static directories.
if (!PROXY) {
  app.use(express.static(DEST))
  app.use(express.static(STATIC))
}

// Catch requests for webpack resources.
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

if (PROXY) {
  // Proxy requests if needed.
  var proxy = require('http-proxy').createProxyServer()
  app.use(function (req, res) {
    proxy.web(req, res, {target: 'http://localhost:' + PROXY}, function (err) {
      console.error(err)
    })
  })
} else {
  // Otherwise, serve all requests with an index.html in the static directory.
  app.get('*', function (req, res) {
    res.sendFile(path.join(STATIC, 'index.html'))
  })
}

// Start listening.
app.listen(PORT, 'localhost', function (err) {
  if (err) {
    gulpUtil.log(err)
    return
  }
  gulpUtil.log('Development server listening at http://localhost:' + PORT)
})
