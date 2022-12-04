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
    const response = await api.get('/api/blogs')
    expect(response.header['content-type']).toMatch(/application\/json/)
  })
  test('get returns correct amount', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  test('specific blog title in /api/blogs GET', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(response => response.title)
    expect(titles).toContain('ghast tears')
  })
  test('unique identifier is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})
describe('POST /api/blogs', () => {
  const blogToPost = {
    title: 'Posting to your Database',
    author: 'Maple',
    url: 'catsmakingblogs.com/POST-requests',
    likes: 2
  }
  const blogWithoutLikesSpecified = {
    title: 'No Likes on your blog?',
    author: 'the likeable Jerry',
    url: 'how-to-get-likes.com'
  }

  test('POST returns blog as response', async () => {
    const response = await api.post('/api/blogs').send(blogToPost)
    expect(response.body.title).toEqual('Posting to your Database')
  })
  test('Correct number of entries in DB', async () => {
    await api.post('/api/blogs').send(blogToPost)
    const blogs = await Blog.find({})
    expect(blogs.length).toEqual(initialBlogs.length + 1)
  })
  test('Correct blog added to DB', async () => {
    await api.post('/api/blogs').send(blogToPost)
    const blogs = await Blog.find({})
    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain('Posting to your Database')
  })
  test('if likes is missing, defaults to zero', async () => {
    const response = await api.post('/api/blogs').send(blogWithoutLikesSpecified)
    expect(response.body.likes).toEqual(0)
    const blog = await Blog.find({ title: 'No Likes on your blog?' })
    expect(blog[0].likes).toEqual(0)
  })

})


afterAll(() => {
  mongoose.connection.close()
})