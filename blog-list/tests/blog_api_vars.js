const initialBlogs = [
  {
    title: 'foo',
    author: 'bar',
    url: 'asdad.com/blog',
    likes: 0
  },
  {
    title: 'ghast tears',
    author: 'barkley',
    url: 'asfk.com/blog',
    likes: 12
  }
]

const blogToPost = {
  title: 'Posting to your Database',
  author: 'Maple',
  url: 'catsmakingblogs.com/POST-requests',
  likes: 2
}

const blogWithoutLikesSpecified = {
  title: 'No Likes on your blog?',
  author: 'the likeable Jerry',
  url: 'how-to-get-likes.com'
}

const blogWithoutTitle = {
  author: 'foobar',
  url: 'asdasd.com',
  likes: 2
}

const blogWithoutURL = {
  author: 'lemon slice',
  title: 'how to cut a lemon',
  likes: 12
}


module.exports = {
  initialBlogs,
  blogToPost,
  blogWithoutLikesSpecified,
  blogWithoutTitle,
  blogWithoutURL
}