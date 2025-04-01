"use strict";
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define("Feedback", {
    user_id: { type: DataTypes.INTEGER, allowNull: true }, // Null for anonymous
    category: { type: DataTypes.ENUM("bug", "feature", "general"), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  });
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, { foreignKey: "user_id", allowNull: true });
  };
  return Feedback;
};
