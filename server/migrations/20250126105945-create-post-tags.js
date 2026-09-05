"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PostTags", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      post_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Posts", key: "id" } },
      tag_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Tags", key: "id" } },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("PostTags");
  },
};
