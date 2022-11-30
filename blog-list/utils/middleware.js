const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    logger.error('Please check fields of request')
    return response.status(400).send({'error': error.name})
  }
  logger.error(error.name)
  response.status(500).end()
}

const unknownEndpoint = (request, response) => {
  logger.error('Unknown endpoint')
  return response.status(404).send({'error': 'unknown endpoint'})
}

module.exports = {
  errorHandler,
  unknownEndpoint
}