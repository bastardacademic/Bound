// Migration for User Preferences table
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserPreferences", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      language: { type: Sequelize.STRING, allowNull: false, defaultValue: "en" },
      contrast_mode: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      font_size: { type: Sequelize.STRING, allowNull: false, defaultValue: "medium" },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("UserPreferences");
  },
};
