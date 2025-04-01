'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reports', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      content_id: { type: Sequelize.INTEGER, allowNull: false },
      content_type: { type: Sequelize.ENUM('post', 'comment', 'group'), allowNull: false },
      reported_by: { type: Sequelize.INTEGER, allowNull: false },
      reason: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'resolved', 'dismissed'), defaultValue: 'pending' },
      moderated_by: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Reports');
  },
};
