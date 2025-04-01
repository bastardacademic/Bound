"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserPreferences", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
      language: { type: Sequelize.STRING, defaultValue: "en" },
      high_contrast_mode: { type: Sequelize.BOOLEAN, defaultValue: false },
      font_size: { type: Sequelize.ENUM("small", "medium", "large"), defaultValue: "medium" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("UserPreferences");
  },
};
