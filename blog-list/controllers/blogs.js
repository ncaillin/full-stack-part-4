const express = require('express')
const Blog = require('./../models/blog')
const blogRouter = express.Router()

blogRouter.use(express.json())

blogRouter.get(
  '/', (request, response) => {
    Blog
      .find({})
      .then(result => {
        response.json(result)
      })
  }
)

blogRouter.post(
  '/', (request,response, next) => {
    const blog = new Blog(request.body)
    blog
      .save()
      .then(result => {
        response.json(result)
      })
      .catch((err) => next(err))
  }
)




module.exports = blogRouter