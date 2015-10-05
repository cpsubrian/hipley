import thunk from './thunk'
import logger from './logger'

const middleware = [
  thunk,
  logger
]

export default middleware
