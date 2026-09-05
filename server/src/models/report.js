"use strict";
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    content_id: { type: DataTypes.INTEGER, allowNull: false },
    content_type: { type: DataTypes.ENUM("post", "comment", "group"), allowNull: false },
    reported_by: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "resolved", "dismissed"), defaultValue: "pending" },
    moderated_by: { type: DataTypes.INTEGER, allowNull: true },
  });
  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: "reported_by", as: "reporter" });
    Report.belongsTo(models.User, { foreignKey: "moderated_by", as: "moderator" });
  };
  return Report;
};
