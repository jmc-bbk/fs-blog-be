const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favouriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = blogs => {
  const groupedBlogs = _.groupBy(blogs, 'author')

  if (_.isEmpty(groupedBlogs)) {
    return null
  }

  const mostBlogs = _.maxBy(
    Object.values(groupedBlogs),
    function(author) {return author.length}
  )

  return {author: mostBlogs[0].author, blogs: mostBlogs.length}
}

const mostLikes = blogs => {
  const groupedBlogs = _.groupBy(blogs, 'author')

  if (_.isEmpty(groupedBlogs)) {
    return null
  }

  const mostLikes = _.maxBy(
    Object.values(groupedBlogs),
    function(author) {return author.reduce((total, blog) => total + blog.likes, 0)}
  )

  console.log(mostLikes)

  return {author: mostLikes[0].author, likes: mostLikes.reduce((total, blog) => total + blog.likes, 0)}

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
