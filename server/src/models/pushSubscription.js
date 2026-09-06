'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {
      PushSubscription.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PushSubscription.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      endpoint: { type: DataTypes.TEXT, allowNull: false, unique: true },
      p256dh: { type: DataTypes.STRING, allowNull: false },
      auth: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'PushSubscription',
    }
  );
  return PushSubscription;
};
