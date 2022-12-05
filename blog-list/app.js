const express = require('express')
const blogRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const app = express()
app.use(cors())

logger.info('Connecting to DB')

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info('Connected to Mongo DB')
  })
  .catch((err) => logger.error(err))


app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app