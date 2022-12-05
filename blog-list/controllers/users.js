const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const userRouter = express.Router()
userRouter.use(express.json())


userRouter.post(
  '/', async (request, response) => {
    const {username, name, password} = request.body

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
    const users = await User.find({})
    response.status(200).json(users)
  }
)

module.exports = userRouter
