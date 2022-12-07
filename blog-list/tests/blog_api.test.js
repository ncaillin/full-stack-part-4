const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const vars = require('./blog_api_vars')
const helper = require('./user_test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)

  const newUser = new User({username: 'root', name: 'Caillin', passwordHash})
  await newUser.save()

  const usersinDB = await helper.usersinDB()
  const userID = usersinDB[0]._id

  var blog = new Blog({...vars.initialBlogs[0], user: userID})
  await blog.save()
  blog = new Blog({...vars.initialBlogs[1], user: userID})
  await blog.save()

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
    const blogs = await Blog.find({}).populate('user')
    const response = await api.get(`/api/blogs/${blogs[0].id}`)
    expect(response.status).toEqual(200)
    expect(response.body.title).toEqual(blogs[0].title)
    expect(response.body.user.username).toEqual(blogs[0].user.username)
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
    const users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send({...vars.blogToPost})
    expect(response.body.title).toEqual(vars.blogToPost.title)
  })
  test('Correct number of entries in DB', async () => {
    const users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogToPost)
    const blogs = await Blog.find({})
    expect(blogs.length).toEqual(3)
  })
  test('Correct blog added to DB', async () => {
    const users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogToPost)
    const blogs = await Blog.find({})
    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain(vars.blogToPost.title)
  })
  test('if likes is missing, defaults to zero', async () => {
    const users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogWithoutLikesSpecified)
    expect(response.body.likes).toEqual(0)
    const blog = await Blog.find({ title: vars.blogWithoutLikesSpecified.title })
    expect(blog[0].likes).toEqual(0)
  })
  test('if url or title is missing, 400', async () => {
    
    const users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token

    const missingUrlReq = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogWithoutURL)
    const missingTitleReq = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogWithoutTitle)
    expect(missingUrlReq.status).toEqual(400)
    expect(missingTitleReq.status).toEqual(400)
  })
  test('blog ID appended to user', async () => {
    var users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token

    const newBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${String(token)}`)
      .send(vars.blogToPost)
    users = await helper.usersinDB()
    expect(users[0].blogs.includes((newBlog.body.id))).toEqual(true)
  })
  test('401 if token not provided', async () => {
    const response = await api
      .post('/api/blogs')
      .send(vars.blogToPost)
    expect(response.status).toEqual(401)
  })

})
describe('delete requests', () => {
  test('returns 204 on success', async () => {
    var users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token


    const blogsReq = await api.get('/api/blogs')
    const id = blogsReq.body[0].id
    const response = await api
      .del(`/api/blogs/${id}`)
      .set('Authorization', `bearer ${String(token)}`)
    expect(response.status).toEqual(204)
  })
  test('blog is removed from DB', async () => {
    var users = await helper.usersinDB()
    const userDetails = {username: users[0].username, password: 'secret'}
    const loginReq = await api
      .post('/api/login')
      .send(userDetails)
    const token = loginReq.body.token

    const blogsReq = await api.get('/api/blogs')
    const id = blogsReq.body[0].id
    await api
      .del(`/api/blogs/${id}`)
      .set('Authorization', `bearer ${String(token)}`)
    const search = await Blog.findById(id)
    expect(search).toEqual(null)
    
  })
})
describe('put requests', () => {
  test('id remains unchanged, change reflected in DB', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[0].id
    await api.put(`/api/blogs/${id}`).send({author: 'this is a new author'})
    const blog = await Blog.findById(id)
    expect(blog.author).toEqual('this is a new author')
  })
  test('returns changed note', async () => {
    const users = await helper.usersinDB()
    const userID = users[0]._id
    const blogs = await api.get('/api/blogs')
    const newLikes = 1234
    const id = blogs.body[0].id
    const expectedResult = {...blogs.body[0], likes: newLikes, user: String(userID)}
    const response = await api.put(`/api/blogs/${id}`).send({likes: newLikes})
    expect(response.body).toEqual(expectedResult)
  })
  test('returns 200 on success', async () => {
    const blogs = await api.get('/api/blogs')
    const newLikes = 1234
    const id = blogs.body[0].id
    const response = await api.put(`/api/blogs/${id}`).send({likes: newLikes})
    expect(response.status).toEqual(200)
  })
})



afterAll(() => {
  mongoose.connection.close()
})