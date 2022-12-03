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

const mostLikes = (blogs) => {
  if (lodash.isEqual(blogs, [])) return null
  
  var authors = []
  var maxLikes = 0
  var maxAuthor = {}
  
  blogs.forEach(blog => {
    const author = authors.find(author => author.name === blog.author)

    if (!author) { // author not yet accounted for, initialising
      authors = authors.concat( { name: blog.author, likes: blog.likes } )
    } else { // author exists, adding likes to total
      authors = authors.map(author => {
        if (blog.author === author.name) {
          return { name: author.name, likes: author.likes + blog.likes }
        } else {
          return author
        }
      })
    }

    // max likes logic -- need extra var incase undef earlier
    const authorForMaxLikesComparison = authors.find(author => author.name === blog.author)
    if (authorForMaxLikesComparison.likes > maxLikes) {
      maxLikes = authorForMaxLikesComparison.likes
      maxAuthor = authorForMaxLikesComparison
    }
  })
  return { author: maxAuthor.name, likes: maxAuthor.likes }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}