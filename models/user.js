const sequelize = require('../database')
const {Model, DataTypes} = require('sequelize')
const Blog = require('./blog')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

User.hasMany(Blog, {
  foreignKey: {
    name: 'user_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
})

module.exports = User
