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
  '/', async (request,response, next) => {
    try {
      const blog = await new Blog(request.body).save()
      response.json(blog)
    } catch(error) {
      next(error)
    }
  }
)




module.exports = blogRouter