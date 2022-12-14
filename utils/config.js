require('dotenv').config()

const PORT = process.env.PORT
// TODO: migrate test db to docker
const PG_DB = process.env.NODE_ENV === 'test'
  ? process.env.TEST_PG_DB
  : process.env.PG_DB
const PG_HOST = process.env.PG_HOST
const PG_USER = process.env.PG_USER
const PG_PASS = null

const SECRET = process.env.SECRET

module.exports = {
  PORT,
  PG_DB,
  PG_HOST,
  PG_USER,
  PG_PASS,
  SECRET
}
