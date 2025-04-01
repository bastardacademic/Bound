'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventRsvps', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.ENUM('going', 'interested', 'not_going'), allowNull: false },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('EventRsvps');
  },
};
