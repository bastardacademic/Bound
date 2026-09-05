"use strict";
module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define("Poll", {
    question: { type: DataTypes.STRING, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false }, // array of options
    is_multiple: { type: DataTypes.BOOLEAN, defaultValue: false },
    visibility: { type: DataTypes.ENUM("public", "group", "private"), defaultValue: "public" },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
  });
  Poll.associate = (models) => {
    Poll.belongsTo(models.User, { foreignKey: "created_by" });
  };
  return Poll;
};
