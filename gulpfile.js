var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')
var ncp = require('ncp')
var async = require('async')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var runSequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var webpack = require('webpack')
var webpackconf = require('./config/webpack.config')
var BrowserSync = require('browser-sync')
var browserSync
var hipley = require('./')

var ROOT = hipley.options.root
var SRC = path.resolve(ROOT, hipley.options.src)
var DEST = path.resolve(ROOT, hipley.options.dest)
var STATS = path.join(DEST, 'webpack-stats.json')
var PORT = hipley.options.port
var DEV = hipley.options.devServer
var copy = hipley.options.copy

// Clean ./build folder.
gulp.task('clean:build', function (cb) {
  rimraf(DEST, cb)
})

// Initialize browserSync.
gulp.task('browser-sync', function () {
  browserSync = BrowserSync.create()
  browserSync.init({
    port: PORT,
    proxy: 'http://localhost:' + DEV,
    open: false,
    notify: false,
    files: [
      DEST + '/**/*.html'
    ],
    ghostMode: false
  })
})

// Copy folders/files.
gulp.task('build:copy', function (cb) {
  if (copy) {
    async.each(copy, function (source, next) {
      ncp(path.resolve(ROOT, source), DEST, next)
    }, cb)
  } else {
    cb()
  }
})

// Compile LESS stylesheets.
gulp.task('build:less', function () {
  var stream = gulp.src(SRC + '/less/*.less')
    .pipe(plumber({
      errorHandler: function (err) {
        console.error(err)
        this.emit('end')
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST + '/css'))

  if (browserSync) {
    stream = stream.pipe(browserSync.stream({match: '**/*.css'}))
  }

  return stream
})

// Webpack production build.
gulp.task('webpack:build', ['build'], function (cb) {
  var conf = webpackconf({production: true})

  webpack(conf, function (err, stats) {
    if (err) throw new gulpUtil.PluginError('webpack:build', err)
    gulpUtil.log('[webpack:build]', stats.toString({
      colors: true
    }))
    gulpUtil.log('[webpack:build] Writing stats to `' + STATS + '`')
    fs.writeFileSync(STATS, JSON.stringify(stats.toJson(), null, 2))
    cb()
  })
})

// Watch ./less for changes.
gulp.task('watch:less', function () {
  gulp.watch(SRC + '/less/**/*', {interval: 300}, ['build:less'])
})

// Watch all the things.
gulp.task('watch', ['watch:less'])

// General build.
gulp.task('build', function (cb) {
  runSequence('clean:build', ['build:less', 'build:copy'], cb)
})

// Production
gulp.task('build-prod', ['webpack:build'])

// Default (Development)
gulp.task('default', function (cb) {
  runSequence('build', 'browser-sync', 'watch', cb)
})
