"use strict";
module.exports = (sequelize, DataTypes) => {
  const KarmaPoints = sequelize.define("KarmaPoints", {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    reason: { type: DataTypes.STRING, allowNull: true },
  });
  KarmaPoints.associate = (models) => {
    KarmaPoints.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return KarmaPoints;
};
