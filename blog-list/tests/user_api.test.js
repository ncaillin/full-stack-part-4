const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./user_test_helper')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

describe('when there is one user in DB', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)

    const newUser = new User({username: 'root', name: 'Caillin', passwordHash})
    await newUser.save()
  })

  test('User creation succeeds with fresh user', async () => {
    const usersAtStart = await helper.usersinDB()

    const newUser = {
      username: 'maple123',
      name: 'maple',
      password: 'tuna'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersinDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)

  }, 100000)

  test('responds with appropriate error if username < 3', async () => {
    const newUser = {
      username: 'yo',
      name: 'jerry',
      password: 'test'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({error: 'username must be at least 3 characters long'})
  })

  test('responds with appropriate error if password < 3', async () => {
    const newUser = {
      username: 'Maple1234',
      name: 'Maple',
      password: 'yo'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({error: 'password must be at least 3 characters long'})
  })

  test('responds with appropriate error if username not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Kiwi',
      password: 'admin'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect({error: 'username must be unique'})
  })

  test('invalid Users not added to DB', async () => {
    const atStartDB = await helper.usersinDB()
    const newUser = {
      username: 'Maple1234',
      name: 'Maple',
      password: 'yo'
    }
    await api
      .post('/api/users')
      .send(newUser)
    const atEndDB = await helper.usersinDB()
    expect(atStartDB.length).toEqual(atEndDB.length)
    expect(atEndDB.map(u=>u.username).includes(newUser.username)).toEqual(false)
  })

  test('GET works appropriately', async () => {

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const body = response.body
    expect(body.length).toEqual(1)
    const usernames = body.map(u => u.username)
    expect(usernames).toContain('root')
  })

  afterAll(() => {
    mongoose.connection.close()
  })

})