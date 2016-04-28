var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var extend = require('extend')
var _ = require('lodash')

var ROOT = process.env.__root || process.cwd()

var defaults = {
  port: process.env.__port || process.env.PORT || 3000,
  proxy: process.env.__proxy || null,
  cmd: process.env.__cmd || null,
  src: process.env.__src || 'src',
  dest: process.env.__dest || 'dist',
  static: process.env.__static || 'public',
  devServer: process.env.__devServer || 3002,
  browserSync: {
    ui: 3001
  },
  vendors: []
}

// Load .hipleyrc.
var rc = {}
if (fs.existsSync(path.resolve(ROOT, '.hipleyrc'))) {
  try {
    rc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.hipleyrc')))
  } catch (e) {
    console.log('Error Parsing .hipleyrc', e)
  }
}

// Merge .hipleyrc into options.
var options = extend(true, {}, defaults, rc)

// Base babel options.
var babel = {
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-stage-0')
  ],
  env: {
    development: {
      plugins: [
        [require.resolve('babel-plugin-transform-runtime')],
        [require.resolve('babel-plugin-transform-decorators-legacy')],
        [require.resolve('babel-plugin-add-module-exports')],
        [require.resolve('babel-plugin-react-transform'), {
          'transforms': [
            {
              'transform': require.resolve('react-transform-hmr'),
              'imports': ['react'],
              'locals': ['module']
            }
          ]
        }]
      ]
    },
    production: {
      plugins: [
        [require.resolve('babel-plugin-transform-runtime')],
        [require.resolve('babel-plugin-transform-decorators-legacy')],
        [require.resolve('babel-plugin-add-module-exports')],
        [require.resolve('babel-plugin-transform-react-constant-elements')],
        [require.resolve('babel-plugin-transform-react-inline-elements')]
      ]
    }
  }
}

// Read app's babelrc and merge into base babel options.
if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
  try {
    var babelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
    babel = extend(true, {}, babel, babelrc)
  } catch (e) {
    console.error('Error parsing .babelrc', e)
  }
}

var hipley = module.exports = {
  root: ROOT,
  defaults: defaults,
  rc: rc,
  babel: babel,
  options: options,
  set: function (key, val) {
    options[key] = val
  },

  // Prepare options from program arguments.
  prepare: function (program) {
    var keys = ['port', 'proxy', 'cmd', 'src', 'dest']
    keys.forEach(function (key) {
      if (program[key]) {
        hipley.set(key, program[key])
      }
    })
  },

  // Helper to merge options into env.
  getEnv: function (env) {
    var optionEnv = {__root: hipley.root}
    Object.keys(hipley.options).forEach(function (key) {
      optionEnv['__' + key] = hipley.options[key]
    })
    return _.pickBy(_.extend(optionEnv, process.env, env || {}), _.identity)
  },

  // Helper to spawn a command.
  run: function (opts, cb) {
    var proc = spawn(opts.cmd, opts.args, {env: hipley.getEnv(opts.env || {})})
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    if (cb) {
      proc.on('exit', cb)
    }
    return proc
  },

  // Helper to run a gulp task.
  runGulp: function (task, env, cb) {
    return hipley.run({
      cmd: path.resolve(__dirname, 'node_modules/.bin/gulp'),
      args: [task, '--cwd', __dirname],
      env: hipley.getEnv(env)
    }, cb)
  },

  printHelp: function () {
    console.log([
      '',
      '  Configuration can be added to a .hipleyrc json file.',
      '',
      '  Defaults:',
      '',
      JSON.stringify(hipley.defaults, null, 2).split('\n').map(function (line) { return '    ' + line }).join('\n'),
      ''
    ].join('\n'))
  }
}
