const logger = require('./logger.js')

const isValidUsername = username => {
  if (username.length < 3) {
    logger.error('Username must be at least 3 characters.')
    return false
  } else if (username.length > 15) {
    logger.error('Username cannot be longer than 15 characters.')
    return false
  }

  return true
}

const isValidPassword = password => {
  if (password.length < 3) {
    logger.error('Password must be at least 3 characters.')
    return false
  }

  return true
}

module.exports = {
  isValidUsername,
  isValidPassword
}
