"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserPreference = sequelize.define("UserPreference", {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    language: { type: DataTypes.STRING, defaultValue: "en" },
    high_contrast_mode: { type: DataTypes.BOOLEAN, defaultValue: false },
    font_size: { type: DataTypes.ENUM("small", "medium", "large"), defaultValue: "medium" },
  });
  UserPreference.associate = (models) => {
    UserPreference.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return UserPreference;
};
