var gulpUtil = require('gulp-util')
var path = require('path')
var webpack = require('webpack')
var express = require('express')
var compress = require('compression')
var app = express()

var hipley = require('../')
var config = require('../config/webpack.config')({
  development: true
})
var compiler = webpack(config)

var ROOT = hipley.options.root
var DEST = path.resolve(ROOT, hipley.options.dest)
var STATIC = path.resolve(ROOT, hipley.options.static)
var PORT = hipley.options.devServer
var PROXY = hipley.options.proxy

// Enable gzip compression.
app.use(compress())

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
