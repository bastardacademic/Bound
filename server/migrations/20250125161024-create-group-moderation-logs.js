"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GroupModerationLogs", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      group_id: { type: Sequelize.INTEGER, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      moderator_id: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("GroupModerationLogs");
  },
};
