'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true },
      start_time: { type: Sequelize.DATE, allowNull: false },
      end_time: { type: Sequelize.DATE, allowNull: false },
      visibility: { type: Sequelize.ENUM('public', 'private', 'group_only'), allowNull: false },
      recurrence: { type: Sequelize.ENUM('none', 'daily', 'weekly', 'monthly'), allowNull: false },
      created_by: { type: Sequelize.INTEGER, allowNull: false },
      group_id: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Events');
  },
};
