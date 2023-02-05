const config = require('./utils/config')
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(config.PG_DB, config.PG_USER, null, {
  host: config.PG_HOST,
  dialect: 'postgres',
  logging: false
  // logging: console.log
})

// Authenticate connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established.')
  })
  .catch(err => {
    console.error('Unable to connect to the database', err)
  })

// Create tables
sequelize
  .sync()
  .then(() => {
    console.log('Successfully created tables.')
  })
  .catch(err => {
    console.error('Error creating tables', err)
  })

module.exports = sequelize
