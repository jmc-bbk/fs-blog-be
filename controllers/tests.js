const config = require('../utils/config')
const testsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// For use with Cypress E2E tests.
// Allow a post request to reset models in db.
testsRouter.post('/reset', async (req, res) => {
  await Blog.sync({force: true})
  await User.sync({force: true})

  res.status(204).end()
})

module.exports = testsRouter
