'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'author_id' });
    }
  }
  Post.init(
    {
      author_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      media_url: { type: DataTypes.STRING, allowNull: true },
      tags: { type: DataTypes.JSONB, allowNull: true },
      visibility: {
        type: DataTypes.ENUM('public', 'friends', 'private'),
        allowNull: false,
        defaultValue: 'public',
      },
      likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
