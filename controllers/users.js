const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const usersRouter = require('express').Router()
const User = require('../models/user')
const {isValidUsername, isValidPassword} = require('../utils/user_helper')

// Begin routes
usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: Blog
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const {username, password, name} = req.body


  // TODO pass error from function to here for custom error message
  if (!isValidUsername(username)) {
    return res.status(400).json({error: 'Username is not valid.'})
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({error: 'Password is not valid.'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    passwordHash
  })
  res.status(201).json(user)
})

module.exports = usersRouter
