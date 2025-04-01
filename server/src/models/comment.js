﻿'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
      Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
    }
  }
  Comment.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      post_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
