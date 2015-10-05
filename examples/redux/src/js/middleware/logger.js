import _ from 'lodash'

/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  if (!action._logged) {
    if (typeof action === 'function') {
      console.log('DISPATCHING', 'THUNK', action.name ? `(${action.name})` : '')
    } else {
      console.log('DISPATCHING', action)
    }
    action._logged = true
    let result = next(action)
    console.log('NEXT STATE', _.mapValues(store.getState(), (val, key) => {
      if (val && typeof val.toJS === 'function') {
        return val.toJS()
      } else {
        return val
      }
    }))
    return result
  } else {
    return next(action)
  }
}

export default logger
