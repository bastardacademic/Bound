"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reports", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      reported_by: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
      content_id: { type: Sequelize.INTEGER, allowNull: false },
      content_type: { type: Sequelize.STRING, allowNull: false },
      reason: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: "pending" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Reports");
  },
};
