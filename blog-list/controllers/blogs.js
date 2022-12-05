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
blogRouter.get(
  '/:id', async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id)
      if (!blog) {
        return response.status(404).end()
      }
      response.json(blog)
      response.status(200).end()
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

blogRouter.delete(
  '/:id', async (request, response, next) => {
    try  {
      const id = request.params.id
      await Blog.findByIdAndDelete(id)
      response.status(204).end()

    } catch(error) {
      next(error)
    }
  }
)
blogRouter.put(
  '/:id', async (request, response, next) => {
    try {
      const id = request.params.id
      const body = request.body
      const updateObj = {}
      if (body.title) {
        updateObj.title = body.title
      }
      if (body.author) {
        updateObj.author = body.author
      }
      if (body.likes) {
        updateObj.likes = body.likes
      }
      if (body.url) {
        updateObj.url = body.url
      }
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateObj, {new: true})
      response.json(updatedBlog)
      response.status(200).end()

    } catch(error) {
      next(error)
    }
  }
)


module.exports = blogRouter