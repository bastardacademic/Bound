'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMembership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupMembership.init({
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    role: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'GroupMembership',
  });
  return GroupMembership;
};