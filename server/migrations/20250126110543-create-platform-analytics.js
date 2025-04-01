"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PlatformAnalytics", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      total_users: { type: Sequelize.INTEGER, defaultValue: 0 },
      active_users: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_posts: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_comments: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_events: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_reports: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("PlatformAnalytics");
  },
};
