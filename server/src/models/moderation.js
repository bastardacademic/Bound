'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Moderation extends Model {
    static associate(models) {
      Moderation.belongsTo(models.User, { foreignKey: 'reporter_id', as: 'reporter' });
      Moderation.belongsTo(models.User, { foreignKey: 'reported_id', as: 'reported' });
    }
  }
  Moderation.init({
    reporter_id: { type: DataTypes.INTEGER, allowNull: false },
    reported_id: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Moderation',
  });
  return Moderation;
};
