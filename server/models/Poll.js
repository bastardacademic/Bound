"use strict";
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define("Poll", {
    question: { type: DataTypes.STRING, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false }, // Array of options
    is_multiple: { type: DataTypes.BOOLEAN, defaultValue: false },
    visibility: { type: DataTypes.ENUM("public", "group", "private"), defaultValue: "public" },
  });
  Poll.associate = (models) => {
    Poll.belongsTo(models.User, { foreignKey: "created_by" });
  };
  return Poll;
};
