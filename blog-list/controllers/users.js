const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const userRouter = express.Router()
const helper = require('../tests/user_test_helper')
userRouter.use(express.json())


userRouter.post(
  '/', async (request, response) => {
    const {username, name, password} = request.body
    const usersinDB = await helper.usersinDB()
    const usernamesinDB = usersinDB.map(u => u.username)

    if (usernamesinDB.includes(username)) {
      return response.status(400).send({error: 'username must be unique'})
    }
    if (password.length < 3) {
      return response.status(400).send({error: 'password must be at least 3 characters long'})
    }
    if (username.length < 3) {
      return response.status(400).send({error: 'username must be at least 3 characters long'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })
    
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
)

userRouter.get(
  '/', async (request,response) => {
    const users = await User.find({}).populate('blogs', ['url', 'title', 'author', 'id'])
    response.status(200).json(users)
  }
)

module.exports = userRouter
