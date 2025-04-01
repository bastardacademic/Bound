'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.Group, { foreignKey: 'group_id' });
      GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  GroupMember.init(
    {
      group_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      role: {
        type: DataTypes.ENUM('member', 'moderator', 'admin'),
        allowNull: false,
        defaultValue: 'member',
      },
    },
    {
      sequelize,
      modelName: 'GroupMember',
    }
  );
  return GroupMember;
};
