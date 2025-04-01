'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate(models) {
      Reaction.belongsTo(models.User, { foreignKey: 'user_id' });
      Reaction.belongsTo(models.Post, { foreignKey: 'post_id' });
    }
  }
  Reaction.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      post_id: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Reaction',
    }
  );
  return Reaction;
};
