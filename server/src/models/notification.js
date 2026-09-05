'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Notification.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.ENUM('like', 'comment', 'mention', 'event', 'group'),
        allowNull: false,
      },
      content_id: { type: DataTypes.INTEGER, allowNull: false },
      content_type: { type: DataTypes.STRING, allowNull: false },
      message: { type: DataTypes.STRING, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Notification',
    }
  );

  return Notification;
};
