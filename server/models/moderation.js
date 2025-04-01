'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Moderation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Moderation.init({
    reporter_id: DataTypes.INTEGER,
    reported_id: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Moderation',
  });
  return Moderation;
};