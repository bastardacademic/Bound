'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'created_by' });
      Group.hasMany(models.GroupMember, { foreignKey: 'group_id' });
    }
  }
  Group.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      visibility: {
        type: DataTypes.ENUM('public', 'private', 'secret'),
        allowNull: false,
        defaultValue: 'public',
      },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );
  return Group;
};
