const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'foo',
    author: 'bar',
    url: 'asdad.com/blog',
    likes: 0
  },
  {
    title: 'ghast tears',
    author: 'barkley',
    url: 'asfk.com/blog',
    likes: 12
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe ('GET /blog', () => {
  test('response is in JSON format', async () => {
    const response = await api.get('/blogs')
    expect(response.header['content-type']).toMatch(/application\/json/)
  })
  test('get returns correct amount', async () => {
    const response = await api.get('/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  test('specific blog title in /blogs GET', async () => {
    const response = await api.get('/blogs')
    const titles = response.body.map(response => response.title)
    expect(titles).toContain('ghast tears')
  })
})

afterAll(() => {
  mongoose.connection.close()
})