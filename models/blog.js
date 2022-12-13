const config = require('../utils/config')
const {Sequelize, Model, DataTypes} = require('sequelize')

// TODO: Move to app.js
const sequelize = new Sequelize(config.PG_DB, config.PG_USER, config.PG_PASS, {
  host: config.PG_HOST,
  dialect: 'postgres'
})

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

// Create table if not exists executed at start of app
Blog.sync()

module.exports = Blog
