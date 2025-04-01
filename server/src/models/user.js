'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      about_me: { type: DataTypes.TEXT, allowNull: true },
      kinks_and_fetishes: { type: DataTypes.JSONB, allowNull: true },
      privacy_settings: { type: DataTypes.JSONB, allowNull: true },
      relationship_preferences: { type: DataTypes.JSONB, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
