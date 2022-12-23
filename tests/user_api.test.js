const sequelize = require('../database')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.sync({force:true})

  await User.create({
    username: 'Mike',
    name: 'Michael Chan',
    passwordHash: 'foobar',
  })
  await User.create({
    username: 'Edsger',
    name: 'Edsger W. Dijkstra',
    passwordHash: 'barfoo',
  })
})

describe('POST user to /api/users', () => {
  test('a valid user can be added', async() => {
    const usersAtStart = await User.findAll()

    const newUser = {
      username: 'Trevor',
      name: 'Trevor',
      password: 'foo'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.findAll()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    // TODO make this await User.findOne(...)
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('a username less than 3 characters cannot be added', async() => {
    const newUser = {
      username: 'tv',
      name: 'Trevor',
      password: 'foo'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
  })

  test('a password less than 3 characters cannot be added', async() => {
    const newUser = {
      username: 'Trevor',
      name: 'Trevor',
      password: 'tv'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
  })
})

afterAll(() => {
  sequelize.close()
})
