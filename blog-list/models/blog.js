const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    likes: Number
  }
)
blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = String(returnedObj._id)
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)