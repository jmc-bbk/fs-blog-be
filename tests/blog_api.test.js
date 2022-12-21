const config = require('../utils/config')
// const helper = require('./test_helper')
const {Sequelize} = require('sequelize')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const sequelize = new Sequelize(config.PG_DB, 'jmcneilis', null, {
  host: config.PG_HOST,
  dialect: 'postgres'
})

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

beforeEach(async () => {
  // force sync drops table and re-creates
  await Blog.sync({force: true})
  await Blog.create(initialBlogs[0])
  await Blog.create(initialBlogs[1])
})

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

test('a valid blog can be added', async() => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.findAll()
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  const contents = blogsAtEnd.map(blog => blog.content)
  expect(contents).toContain(newBlog.content)
})

test('a blog with no likes defaults to zero', async() => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  }

  await api
    .post('/api/blogs/')
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

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(400)
})

// Skipped optional exercise 4.9
// as it is impossible to have non-unique PK in relational db

afterAll(() => {
  sequelize.close()
})