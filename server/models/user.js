'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'user_id' });
      User.hasMany(models.Post, { foreignKey: 'author_id' });
      User.belongsToMany(models.Group, { through: 'GroupMembership', foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('user', 'business', 'org', 'commercial'), allowNull: false, defaultValue: 'user' },
      profile_picture: { type: DataTypes.STRING, allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      visibility: { type: DataTypes.ENUM('public', 'friends', 'private'), allowNull: false, defaultValue: 'public' },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
