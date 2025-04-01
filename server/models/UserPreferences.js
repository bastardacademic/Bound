"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserPreferences = sequelize.define("UserPreferences", {
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    color_theme: { type: DataTypes.STRING, defaultValue: "default" },
  });
  return UserPreferences;
};
