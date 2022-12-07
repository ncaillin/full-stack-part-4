const express = require('express')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const app = express()
app.use(cors())
app.use(express.json())

logger.info('Connecting to DB')

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info('Connected to Mongo DB')
  })
  .catch((err) => logger.error(err))

app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app