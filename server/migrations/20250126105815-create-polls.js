"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Polls", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      question: { type: Sequelize.STRING, allowNull: false },
      options: { type: Sequelize.JSON, allowNull: false },
      is_multiple: { type: Sequelize.BOOLEAN, defaultValue: false },
      visibility: { type: Sequelize.ENUM("public", "group", "private"), defaultValue: "public" },
      created_by: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Polls");
  },
};
