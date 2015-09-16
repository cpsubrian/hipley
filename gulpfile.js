var path = require('path')
var spawn = require('child_process').spawn
var _ = require('lodash')
var rimraf = require('rimraf')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var runSequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var webpack = require('webpack')
var webpackconf = require('./webpack.config')
var BrowserSync = require('browser-sync')
var browserSync
var hipley = require('./')

var ROOT = hipley.root
var SRC = path.resolve(ROOT, hipley.options.src)
var BUILD = path.resolve(ROOT, hipley.options.dest)
var PORT = hipley.options.port
var DEV = hipley.options.devServer

// Clean ./build folder.
gulp.task('clean:build', function (cb) {
  rimraf(BUILD, cb)
})

// Copy ./public assets.
gulp.task('copy:public', function () {
  var stream = gulp
    .src(SRC + '/public/**/*')
    .pipe(gulp.dest(BUILD))

  if (browserSync) {
    stream = stream.pipe(browserSync.stream({match: ['**/images/*']}))
  }

  return stream
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
      BUILD + '/**/*.html'
    ]
  })
})

// Compile LESS stylesheets.
gulp.task('build:less', function () {
  var stream = gulp.src(SRC + '/styles/*.less')
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
    .pipe(gulp.dest(BUILD + '/css'))

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
    cb()
  })
})

// Watch ./public for changes.
gulp.task('watch:public', function () {
  gulp.watch(SRC + '/public/**/*', {interval: 2000}, ['copy:public'])
})

// Watch ./styles for changes.
gulp.task('watch:styles', function () {
  gulp.watch(SRC + '/styles/**/*', {interval: 300}, ['build:less'])
})

// Watch all the things.
gulp.task('watch', ['watch:public', 'watch:styles'])

// General build.
gulp.task('build', function (cb) {
  runSequence('clean:build', ['copy:public', 'build:less'], cb)
})

// Production
gulp.task('build-prod', ['webpack:build'])

// Default (Development)
gulp.task('default', function (cb) {
  runSequence('build', 'browser-sync', 'watch', cb)
})
