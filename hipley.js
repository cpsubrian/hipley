var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var extend = require('extend')
var _ = require('lodash')
var babelConfig = require('./config/babel.config.js')

var ROOT = process.env.hipley_root || process.cwd()

// Defaults
var defaults = {
  root: ROOT,
  port: process.env.hipley_port || process.env.PORT || 3000,
  proxy: process.env.hipley_proxy || null,
  cmd: process.env.hipley_cmd || null,
  src: process.env.hipley_src || 'src',
  dest: process.env.hipley_dest || 'dist',
  static: process.env.hipley_static || 'public',
  devServer: process.env.hipley_devServer || 3002,
  browserSync: {
    ui: 3001
  },
  vendors: [],
  optional: {
    'react-transform-catch-errors': true
  }
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

var hipley = module.exports = {
  // Merge .hipleyrc into options.
  options: extend(true, {}, defaults, rc),

  // Set or override an option.
  set: function (key, val) {
    hipley.options[key] = val
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

  // Get our base babel options and merge in user's .babelrc.
  getBabel: function () {
    // Base babel options.
    var babel = babelConfig(hipley.options)

    // Read app's babelrc and merge into base babel options.
    if (fs.existsSync(path.resolve(ROOT, '.babelrc'))) {
      try {
        var babelrc = JSON.parse(fs.readFileSync(path.resolve(ROOT, '.babelrc')))
        babel = extend(true, {}, babel, babelrc)
      } catch (e) {
        console.error('Error parsing .babelrc', e)
      }
    }

    return babel
  },

  // Babel preset that loads the hipley conf.
  buildPreset (context, opts) {
    let config = hipley.getBabel()
    config = _.merge(
      config,
      _.get(config, ['env', process.env.BABEL_ENV || process.env.NODE_ENV || 'development']) || {}
    )
    console.log(config)
    return config
  },

  // Helper to merge options into env.
  getEnv: function (env) {
    var optionEnv = {}
    Object.keys(hipley.options).forEach(function (key) {
      optionEnv['hipley_' + key] = hipley.options[key]
    })
    return _.pickBy(_.extend(optionEnv, process.env, env || {}), _.identity)
  },

  // Helper to spawn a command.
  run: function (opts, cb) {
    var proc = spawn(opts.cmd, opts.args, {
      cwd: opts.cwd || __dirname,
      env: hipley.getEnv(opts.env || {})
    })
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
      args: [task],
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
