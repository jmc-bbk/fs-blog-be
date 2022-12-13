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
        return res.json(blog)
    }
    catch (error) {
        return res.status(400).json({error})
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

module.exports = blogsRouter
