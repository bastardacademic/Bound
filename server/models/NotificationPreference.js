"use strict";
module.exports = (sequelize, DataTypes) => {
  const NotificationPreference = sequelize.define("NotificationPreference", {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("like", "comment", "mention", "event", "group"), allowNull: false },
    in_app: { type: DataTypes.BOOLEAN, defaultValue: true },
    email: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  NotificationPreference.associate = (models) => {
    NotificationPreference.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return NotificationPreference;
};
