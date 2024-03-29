const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const {username, password} = req.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  const isPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && isPassword)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, config.SECRET)

  // Send token to client for future auth requests
  res
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
      id: user.id
    })

})

module.exports = loginRouter
