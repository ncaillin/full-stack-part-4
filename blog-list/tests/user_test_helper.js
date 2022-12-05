const User = require('../models/user')

const usersinDB = async () => {
  const users = await User.find({})
  return users
}


module.exports = {
  usersinDB
}