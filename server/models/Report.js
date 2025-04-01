"use strict";
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    reported_by: { type: DataTypes.INTEGER, allowNull: false },
    content_id: { type: DataTypes.INTEGER, allowNull: false },
    content_type: { type: DataTypes.STRING, allowNull: false }, // e.g., "post", "comment", "user"
    reason: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" }, // e.g., "pending", "resolved", "rejected"
  });
  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: "reported_by" });
  };
  return Report;
};
