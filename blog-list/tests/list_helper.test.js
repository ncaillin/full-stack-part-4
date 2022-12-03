const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '63872c6cc82815464b23307a',
      title: 'Flea rearing for beginners',
      author: 'Kiwi',
      url: 'https://www.notafakeurl.com/blogs/1.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '63872e3d83e2ba87161809e4',
      title: 'How to cook Bacon',
      author: 'Apple',
      url:'https://www.notafakeurl.com/blogs/2.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '63872e6c60ea5fd58adbb549',
      title: 'Twiddling your thumbs',
      author: 'Pomegranate',
      url: 'https://www.notafakeurl.com/blogs/3.html',
      likes: 5,
      __v: 0
    }
  ]



  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(20)
  })
})

describe('favourite blog', () => {
  const empty_list = []
  const listWithOne = [
    {
      _id: '63872e3d83e2ba87161809e4',
      title: 'How to cook Bacon',
      author: 'Apple',
      url:'https://www.notafakeurl.com/blogs/2.html',
      likes: 3,
      __v: 0
    }
  ]
  const listWithMany = [
    {
      _id: '63872c6cc82815464b23307a',
      title: 'Flea rearing for beginners',
      author: 'Kiwi',
      url: 'https://www.notafakeurl.com/blogs/1.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '63872e3d83e2ba87161809e4',
      title: 'How to cook Bacon',
      author: 'Apple',
      url:'https://www.notafakeurl.com/blogs/2.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '63872e6c60ea5fd58adbb549',
      title: 'Twiddling your thumbs',
      author: 'Pomegranate',
      url: 'https://www.notafakeurl.com/blogs/3.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithDuplicateMaxLikes = [
    {
      _id: '63872c6cc82815464b23307a',
      title: 'Flea rearing for beginners',
      author: 'Kiwi',
      url: 'https://www.notafakeurl.com/blogs/1.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '63872e3d83e2ba87161809e4',
      title: 'How to cook Bacon',
      author: 'Apple',
      url:'https://www.notafakeurl.com/blogs/2.html',
      likes: 3,
      __v: 0
    },
    {
      _id: '63872e6c60ea5fd58adbb549',
      title: 'Twiddling your thumbs',
      author: 'Pomegranate',
      url: 'https://www.notafakeurl.com/blogs/3.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '63872e6c60ea5fd58adbb549',
      title: 'Flea rearing for experts',
      author: 'Maple',
      url: 'https://www.notafakeurl.com/blogs/4.html',
      likes: 12,
      __v: 0
    },
  ]


  test('when list is empty, return null', () => {
    const result = listHelper.favouriteBlog(empty_list)
    expect(result).toEqual(null)
  })

  test('when list has one, return it', () => {
    const result = listHelper.favouriteBlog(listWithOne)
    expect(result).toEqual(
      {
        title: 'How to cook Bacon',
        author: 'Apple',
        likes: 3
      }
    )
  })

  test('when list has many, works correctly', () => {
    const result = listHelper.favouriteBlog(listWithMany)
    expect(result).toEqual(
      {
        title: 'Flea rearing for beginners',
        author: 'Kiwi',
        likes: 12
      }
    )
  })

  test('when list has duplicates, return first largest', () => {
    const result = listHelper.favouriteBlog(listWithDuplicateMaxLikes)
    expect(result).toEqual(
      {
        title: 'Flea rearing for beginners',
        author: 'Kiwi',
        likes: 12
      }
    )
  })

})