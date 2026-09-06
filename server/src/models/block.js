'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    static associate(models) {
      Block.belongsTo(models.User, { foreignKey: 'blocker_id', as: 'blocker' });
      Block.belongsTo(models.User, { foreignKey: 'blocked_id', as: 'blocked' });
    }
  }
  Block.init(
    {
      blocker_id: { type: DataTypes.INTEGER, allowNull: false },
      blocked_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Block',
    }
  );
  return Block;
};
