const express = require('express')
const User = require('../models/user')
const Blog = require('./../models/blog')
const blogRouter = express.Router()
const jwt = require('jsonwebtoken')

blogRouter.use(express.json())

blogRouter.get(
  '/', async (request, response, next) => {
    try {
      const blogs = await Blog.find({}).populate('user', ['username', 'name', 'id'])
      response.json(blogs)
    } catch(error) {
      next(error)
    }
  }
)
blogRouter.get(
  '/:id', async (request, response, next) => {
    try {
      const blog = await Blog.findById(request.params.id).populate('user')
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
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!decodedToken) {
        return response.status(401).json({error: 'token missing or invalid'})
      }
      const user = await User.findById(decodedToken.id)
      const blogObject = {
        author: request.body.author,
        title: request.body.title,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
      }
      const blog = await new Blog(blogObject).save()
      const blogID = blog._id
      const blogs = user.blogs.concat(blogID)
      await User.findByIdAndUpdate(user._id, {blogs: blogs}, {new: true})
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