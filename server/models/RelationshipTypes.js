"use strict";
module.exports = (sequelize, DataTypes) => {
  const RelationshipTypes = sequelize.define("RelationshipTypes", {
    name: { type: DataTypes.STRING, allowNull: false },
  });
  return RelationshipTypes;
};
