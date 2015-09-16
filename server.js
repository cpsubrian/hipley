var gulpUtil = require('gulp-util')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.config')({
  development: true
})
var app = express()
var compiler = webpack(config)
var ROOT = process.env.__root
var DEST = path.resolve(ROOT, process.env.__dest || 'build')
var PORT = process.env.__dev || 3002
var PROXY = process.env.__proxy

// If we're not proxying, serve the dest directory.
if (!PROXY) {
  app.use(express.static(DEST))
}

// Catch requests for webpack resources.
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))
app.use(require('webpack-hot-middleware')(compiler))

// Proxy requests if needed.
if (PROXY) {
  var proxy = require('http-proxy').createProxyServer()
  app.use(function (req, res) {
    proxy.web(req, res, {target: 'http://localhost:' + PROXY})
  })
}
// Otherwise, serve all requests with an index.html in the dest directory.
else {
  app.get('*', function(req, res) {
    res.sendFile(path.join(DEST, 'index.html'));
  });
}

// Start listening.
app.listen(PORT, 'localhost', function (err) {
  if (err) {
    gulpUtil.log(err)
    return
  }
  gulpUtil.log('Development server listening at http://localhost:' + PORT)
})