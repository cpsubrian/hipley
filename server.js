var path = require('path')
var compress = require('compression')
var express = require('express')
var app = express()
var hipley = require('./')

var ROOT = hipley.root
var DEST = path.resolve(ROOT, hipley.options.dest)
var STATIC = path.resolve(ROOT, hipley.options.static)
var PORT = hipley.options.port

app.use(compress())
app.use(express.static(DEST))
app.use(express.static(STATIC))

app.get('*', function (req, res) {
  res.sendFile(path.join(STATIC, 'index.html'))
})

app.listen(PORT, 'localhost', function (err) {
  if (err) throw err
  console.log('Server listening at http://localhost:' + PORT)
})
