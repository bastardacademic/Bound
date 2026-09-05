'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Profile.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    kinks: { type: DataTypes.JSONB, allowNull: true },
    relationship_status: { type: DataTypes.STRING, allowNull: true },
    looking_for: { type: DataTypes.TEXT, allowNull: true },
    tags: { type: DataTypes.JSONB, allowNull: true },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};
