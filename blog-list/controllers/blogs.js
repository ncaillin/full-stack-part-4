const express = require('express')
const Blog = require('./../models/blog')
const blogRouter = express.Router()

blogRouter.use(express.json())

blogRouter.get(
  '/', async (request, response, next) => {
    try {
      const blogs = await Blog.find({})
      response.json(blogs)
    } catch(error) {
      next(error)
    }
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