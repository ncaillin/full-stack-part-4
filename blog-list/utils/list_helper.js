const lodash = require('lodash')

const dummy = () => {
  return 1
}


const totalLikes = (blogs) => {
    
  return blogs.reduce(
    (total, currentBlog) => total + currentBlog.likes,
    0
  )
}
const favouriteBlog = (blogs) => {
  var favourite = {}
  var favouriteLikes = null

  blogs.forEach(blog => {
    if (blog.likes > favouriteLikes || favouriteLikes === null) {
      favourite = blog
      favouriteLikes = blog.likes
    }
  })

  if (lodash.isEqual(favourite, {})) {
    return null
  }
  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}