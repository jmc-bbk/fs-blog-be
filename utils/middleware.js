const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

// Extract token sent from client in auth headers
const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7)
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error)

  if (error.name === 'JsonWebTokenError') {
    response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    response.status(400).send({
      error: error.message
    })
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({
      error: 'token expired'
    })
  } else if (error.message === 'BadRequest') {
    response.status(400).json({
      error: 'bad request'
    })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

module.exports = {
  requestLogger,
  tokenExtractor,
  errorHandler,
  unknownEndpoint
}
