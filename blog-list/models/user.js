const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: String,
    name: String,
    passwordHash: String,
    blogs: {
      type: Array,
      default: [],
      ref: 'Blog'
    }
  }
)
userSchema.set('toJSON', {
  transform: (document, returnObj) => {
    returnObj.id = String(returnObj._id)
    delete returnObj._id
    delete returnObj.__v
    delete returnObj.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)