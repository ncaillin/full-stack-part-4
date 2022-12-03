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

const mostBlogs = (blogs) => {
  if (lodash.isEqual(blogs, [])) return null
  var authors = []
  var maxAuthor = {}
  var maxBlogs = 0
  blogs.forEach(blog => {
    const author = authors.find(author => author.name === blog.author)

    //author not present, adding to authors obj with one blog
    if (!author) {
      authors = authors.concat({name: blog.author, blogs: 1})
    }
    // author present, add one to entry in author obj
    else {
      authors = authors.map( author => {
        if (author.name === blog.author) {
          return {name: author.name, blogs: author.blogs + 1}
        } else {
          return author
        }
      })
    }

  })

  authors.forEach(author => {
    if (author.blogs > maxBlogs) {
      maxBlogs = author.blogs
      maxAuthor = {...author}
    }
  })
  return {author: maxAuthor.name, blogs: maxAuthor.blogs}
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}