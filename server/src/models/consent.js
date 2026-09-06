'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Consent extends Model {
    static associate(models) {
      Consent.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Consent.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.ENUM('media-tag', 'post-share', 'group-invite'),
        allowNull: false,
      },
      target_id: { type: DataTypes.STRING, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Consent',
    }
  );
  return Consent;
};
