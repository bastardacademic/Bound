'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'about_me', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'kinks_and_fetishes', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'privacy_settings', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'relationship_preferences', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'about_me');
    await queryInterface.removeColumn('Users', 'kinks_and_fetishes');
    await queryInterface.removeColumn('Users', 'privacy_settings');
    await queryInterface.removeColumn('Users', 'relationship_preferences');
  },
};
