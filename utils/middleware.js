const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// TODO: clean this up
// works with express-async-errors but gives poor error message
const errorHandler = (err, req, res, next) => {
  logger.error(err)

  if (err.message === 'BadRequest') {
    res.status(400)
    res.json({error: err.message})
  }

  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
