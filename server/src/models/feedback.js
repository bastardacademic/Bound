"use strict";
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define("Feedback", {
    user_id: { type: DataTypes.INTEGER, allowNull: true }, // null for anonymous
    type: { type: DataTypes.ENUM("bug", "feature", "general"), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    anonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.ENUM("New", "In Progress", "Resolved"), defaultValue: "New" },
  }, {
    tableName: "Feedback",
  });
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Feedback;
};
