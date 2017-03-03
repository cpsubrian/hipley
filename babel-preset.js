var _ = require('lodash')
var hipley = require('hipley')

module.exports = {
  buildPreset (context, opts) {
    let config = hipley.getBabel()
    config = _.merge(
      config,
      _.get(config, ['env', process.NODE_ENV || 'development']) || {}
    )
    return config
  }
}
