const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const vars = require('./blog_api_vars')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(vars.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(vars.initialBlogs[1])
  await blogObject.save()
})

describe ('GET /blog', () => {
  test('response is in JSON format', async () => {
    const response = await api.get('/api/blogs')
    expect(response.header['content-type']).toMatch(/application\/json/)
  })
  test('get returns correct amount', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(vars.initialBlogs.length)
  })
  test('specific blog title in /api/blogs GET', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(response => response.title)
    expect(titles).toContain(vars.initialBlogs[0].title)
  })
  test('unique identifier is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('GET one blog', () => {
  test('works correctly with one ID', async () => {
    const blogs = await api.get('/api/blogs')
    const response = await api.get(`/api/blogs/${blogs.body[0].id}`)
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(blogs.body[0])
  })
  test('returns 404 when ID not found', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[0].id
    await Blog.findByIdAndDelete(id)
    const response = await api.get(`/api/blogs/${id}`)
    expect(response.status).toEqual(404)
  })
})


describe('POST /api/blogs', () => {

  test('POST returns blog as response', async () => {
    const response = await api.post('/api/blogs').send(vars.blogToPost)
    expect(response.body.title).toEqual(vars.blogToPost.title)
  })
  test('Correct number of entries in DB', async () => {
    await api.post('/api/blogs').send(vars.blogToPost)
    const blogs = await Blog.find({})
    expect(blogs.length).toEqual(vars.initialBlogs.length + 1)
  })
  test('Correct blog added to DB', async () => {
    await api.post('/api/blogs').send(vars.blogToPost)
    const blogs = await Blog.find({})
    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain(vars.blogToPost.title)
  })
  test('if likes is missing, defaults to zero', async () => {
    const response = await api.post('/api/blogs').send(vars.blogWithoutLikesSpecified)
    expect(response.body.likes).toEqual(0)
    const blog = await Blog.find({ title: vars.blogWithoutLikesSpecified.title })
    expect(blog[0].likes).toEqual(0)
  })
  test('if url or title is missing, 400', async () => {
    const missingUrlReq = await api.post('/api/blogs').send(vars.blogWithoutURL)
    const missingTitleReq = await api.post('/api/blogs').send(vars.blogWithoutTitle)
    expect(missingUrlReq.status).toEqual(400)
    expect(missingTitleReq.status).toEqual(400)
  })

})
describe('delete requests', () => {
  test('returns 204 on success', async () => {
    const blogsReq = await api.get('/api/blogs')
    const id = blogsReq.body[0].id
    const response = await api.del(`/api/blogs/${id}`)
    expect(response.status).toEqual(204)
  })
  test('blog is removed from DB', async () => {
    const blogsReq = await api.get('/api/blogs')
    const id = blogsReq.body[0].id
    await api.del(`/api/blogs/${id}`)
    const search = await Blog.findById(id)
    expect(search).toEqual(null)
    
  })
})



afterAll(() => {
  mongoose.connection.close()
})