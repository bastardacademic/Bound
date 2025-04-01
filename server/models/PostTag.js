"use strict";
module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define("PostTag", {
    post_id: { type: DataTypes.INTEGER, allowNull: false },
    tag_id: { type: DataTypes.INTEGER, allowNull: false },
  });
  return PostTag;
};
