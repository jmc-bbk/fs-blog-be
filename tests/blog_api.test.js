const bcrypt = require('bcrypt')
const sequelize = require('../database')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

// TODO: migrate tests for each route to own file

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user_id: 1
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user_id: 2
  }
]

beforeAll(async () => {
  await sequelize.authenticate()
})

beforeEach(async () => {
  await User.sync({force:true})
  await Blog.sync({force:true})

  const passwordHash = await bcrypt.hash('foobar', 10)
  await User.create({
    username: 'Mike',
    name: 'Michael Chan',
    passwordHash: passwordHash
  })
  await User.create({
    username: 'Edsger',
    name: 'Edsger W. Dijkstra',
    passwordHash: passwordHash
  })

  await Blog.create(initialBlogs[0])
  await Blog.create(initialBlogs[1])
})

describe('GET blogs from /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('POST blog to /api/blogs', () => {
  // Skipped optional exercise 4.9
  // as it is impossible to have non-unique PK in relational db
  test('a valid blog can be added', async() => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user_id: 2
    }

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'Edsger',
        password: 'foobar'
      })
      .expect(200)

    await api
      .post('/api/blogs/')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.findAll()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.content)
    expect(contents).toContain(newBlog.content)
  })

  test('a blog with invalid token returns 401', async() => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user_id: 2
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(401)
  })

  test('a blog with no likes defaults to zero', async() => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      user_id: 2
    }

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'Edsger',
        password: 'foobar'
      })
      .expect(200)

    await api
      .post('/api/blogs/')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body.likes).toEqual(0)
      })
  })

  test('a blog with no title returns 400', async() => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    }

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'Edsger',
        password: 'foobar'
      })
      .expect(200)

    await api
      .post('/api/blogs/')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE blog from /api/blogs/:id', () => {
  test('deleting a blog returns 204', async() => {
    const blogsAtStart = await Blog.findAll()
    const blogToDelete = blogsAtStart[0]

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'Mike',
        password: 'foobar'
      })
      .expect(200)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .expect(204)

    const blogsAtEnd = await Blog.findAll()

    // Test the db contains one less blog
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(b => b.id)

    // Test that id from blog is not in db
    expect(ids).not.toContain(blogToDelete.id)
  })

  test('deleting a non-existing blog returns 404', async() => {
    const nonExistingId = 999

    const loginResponse = await api
      .post('/api/login/')
      .send({
        username: 'Mike',
        password: 'foobar'
      })
      .expect(200)

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .expect(404)
  })
})

describe('PUT blog to /api/blogs/:id', () => {
  test('updating an existing blog returns 204', async () => {
    const blogsAtStart = await Blog.findAll()
    const blogToUpdate = blogsAtStart[0]

    const likesAtEnd = blogToUpdate.likes + 200

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Content-Type', 'application/json')
      .send({
        likes: likesAtEnd
      })
      .set('Accept', 'application/json')
      .expect(204)

    // Expect the likes to be updated
    const blogAtEnd = await Blog.findByPk(blogToUpdate.id)
    expect(blogAtEnd.likes).toEqual(likesAtEnd)
  })

  test('updating an existing blog with no likes returns 400', async () => {
    const blogsAtStart = await Blog.findAll()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Content-Type', 'application/json')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)

  })

  test('updating an non-existing blog returns 404', async () => {
    const nonExistingId = 999

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .set('Content-Type', 'application/json')
      .send({
        likes: 200
      })
      .set('Accept', 'application/json')
      .expect(404)

  })

  // Not sure if we should allow this
  // Alternative is to return 400 for any request with additional content
  test('updating an existing blog only updates likes', async () => {
    const blogsAtStart = await Blog.findAll()
    const blogToUpdate = blogsAtStart[0]

    const likesAtEnd = blogToUpdate.likes + 200

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Content-Type', 'application/json')
      .send({
        title: 'foo',
        author: 'bar',
        likes: likesAtEnd
      })
      .set('Accept', 'application/json')
      .expect(204)

    // Expect the likes to be updated
    const blogToCompare = await Blog.findByPk(blogToUpdate.id)
    expect(blogToCompare.likes).toEqual(likesAtEnd)

    // Expect the title to be the same as the original
    expect(blogToCompare.title).toEqual(blogToUpdate.title)

    // Expect the author to be the same as the original
    expect(blogToCompare.author).toEqual(blogToUpdate.author)

  })
})

afterAll(() => {
  sequelize.close()
})
