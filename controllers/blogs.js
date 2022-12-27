const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = req => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: User
  })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  
  const decodedToken = jwt.verify(token, config.SECRET)
  if(!decodedToken.id) {
    return res.status(401).json({
      error: 'invalid/missing token'
    })
  }
  const bodyWithId = {...body, user_id: decodedToken.id}
  
  const blog = await Blog.create(bodyWithId)
  res.status(201).json(blog)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    logger.info(blog.toJSON())
    res.json(blog)
  }
  else {
    res.status(404).end()
  }
})

// 4.13 update likes
// TODO allow update of all valid vars in req.body
blogsRouter.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!req.body.likes) {
    return res.status(400).end()
  }

  if (!blog) {
    return res.status(404).end()
  }

  blog.set({
    likes: req.body.likes
  })
  await blog.save()
  res.status(204).end()
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.status(204).end()
  }
  else {
    res.status(404).end()
  }
})

Blog.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = blogsRouter
