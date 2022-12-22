const logger = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch {
    throw Error('BadRequest')
  }
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

module.exports = blogsRouter
