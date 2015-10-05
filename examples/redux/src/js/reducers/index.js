import {combineReducers} from 'redux'
import comments from './comments'

const reducers = {
  comments
}
const combined = combineReducers(reducers)

// Allows 'global' state outside of our keyed reducers.
export default function (state, action) {
  let partialState = Object.keys(reducers).reduce((memo, key) => {
    memo[key] = state[key]
    return memo
  }, {})
  let combinedState = combined(partialState, action)
  return {...state, ...combinedState}
}
