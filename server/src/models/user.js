'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
      User.hasOne(models.Profile, { foreignKey: 'user_id' });
      User.hasMany(models.Post, { foreignKey: 'author_id' });
      User.hasMany(models.Comment, { foreignKey: 'user_id' });
      User.hasMany(models.Reaction, { foreignKey: 'user_id' });
      User.hasMany(models.GroupMember, { foreignKey: 'user_id' });
      User.belongsToMany(models.Group, { through: models.GroupMember, foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('user', 'moderator', 'admin'), allowNull: false, defaultValue: 'user' },
      visibility: { type: DataTypes.ENUM('public', 'members_only', 'private'), allowNull: false, defaultValue: 'public' },
      profile_picture: { type: DataTypes.STRING, allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      about_me: { type: DataTypes.TEXT, allowNull: true },
      kinks_and_fetishes: { type: DataTypes.JSONB, allowNull: true },
      privacy_settings: { type: DataTypes.JSONB, allowNull: true },
      relationship_preferences: { type: DataTypes.JSONB, allowNull: true },
      totp_secret: { type: DataTypes.STRING, allowNull: true },
      totp_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
