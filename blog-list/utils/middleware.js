const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    logger.error('Please check fields of request')
    return response.status(400).send({'error': error.name})
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({error: 'missing or invalid token'})
  }
  logger.error(error.name)
  response.status(500).end()
  next(error)
}

const unknownEndpoint = (request, response) => {
  logger.error('Unknown endpoint')
  return response.status(404).send({'error': 'unknown endpoint'})
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}
const userExtractor = (request, response, next) => {
  if(request.token) {
    request.user = jwt.decode(request.token, process.env.SECRET)
  }
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}