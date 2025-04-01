"use strict";
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: true },
    visibility: { type: DataTypes.ENUM("public", "private", "group"), defaultValue: "public" },
  });
  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: "created_by" });
    Event.belongsTo(models.Group, { foreignKey: "group_id", allowNull: true });
  };
  return Event;
};
