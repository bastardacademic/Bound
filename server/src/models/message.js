'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
    }
  }
  Message.init(
    {
      sender_id: { type: DataTypes.INTEGER, allowNull: false },
      receiver_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_ephemeral: { type: DataTypes.BOOLEAN, defaultValue: false },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      reaction: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );
  return Message;
};
