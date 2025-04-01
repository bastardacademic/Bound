"use strict";
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // e.g., "like", "comment", "mention", "event"
    content_id: { type: DataTypes.INTEGER, allowNull: false },
    content_type: { type: DataTypes.STRING, allowNull: false }, // e.g., "post", "comment", "event"
    message: { type: DataTypes.STRING, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Notification;
};
