const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: User
  })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const {body, token} = req
  const decodedToken = jwt.verify(token, config.SECRET)

  if(!decodedToken.id) {
    return res.status(401).json({
      error: 'invalid/missing token'
    })
  }

  if(!body.title) {
    return res.status(400).json({
      error: 'Bad Request: Missing title from blog.'
    })
  }

  const bodyWithId = {...body, user_id: decodedToken.id}

  // Sequelize does not support eager loading with create.
  const newBlog = await Blog.create(bodyWithId)
  const returnBlog = await Blog.findByPk(newBlog.id, {
    include: User
  })
  res.status(201).json(returnBlog)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    res.json(blog)
  }
  else {
    res.status(404).end()
  }
})

// 4.13 update likes
// TODO allow update of all valid vars in req.body
blogsRouter.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: User
  })

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
  res.json(blog).status(204).end()
})

blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  console.log(req.token)
  const decodedToken = jwt.verify(req.token, config.SECRET)

  if(!blog) {
    return res.status(404).end()
  }

  // Note. Middleware handles NULL token error.
  if(decodedToken.id !== blog.user_id) {
    return res.status(400).json({
      error: 'Bad Request: User does not have permission to delete blog.'
    })
  }

  await blog.destroy()
  res.status(204).end()
})

Blog.belongsTo(User, {
  foreignKey: 'user_id'
})

module.exports = blogsRouter
