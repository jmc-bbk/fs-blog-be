const listHelper = require('../utils/list_helper')

// Test cases
const listWithNoBlogs = []

const listWithOneBlogs = [
  {
    id: 1,
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const listWithManyBlogs = [
  {
    id: 1,
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    id: 2,
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    id: 3,
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    id: 4,
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    id: 5,
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    id: 6,
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has no blogs return zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlogs)
    expect(result).toBe(5)
  })

  test('when list has many blogs, equals the likes of them all', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favourite blog', () => {
  test('when list no blogs return null', () => {
    const result = listHelper.favouriteBlog(listWithNoBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlogs)
    expect(result).toEqual({
      id: 1,
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    })
  })

  test('when list has many blogs, returns blog with most likes', () => {
    const result = listHelper.favouriteBlog(listWithManyBlogs)
    expect(result).toEqual({
      id: 3,
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('when list no blogs return null', () => {
    const result = listHelper.mostBlogs(listWithNoBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, returns author and 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has many blogs, returns author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('when list no blogs return null', () => {
    const result = listHelper.mostLikes(listWithNoBlogs)
    expect(result).toBe(null)
  })

  test('when list has only one blog, returns author and likes', () => {
    const result = listHelper.mostLikes(listWithOneBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blogs, returns author with most likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
